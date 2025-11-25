"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { UserRole, User, UserStatus, LineItem } from "./types"

interface AppContextType {
  currentUser: User | null
  userStatus: UserStatus
  userRole: UserRole | null
  selectedLocation: string | null

  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  setSelectedLocation: (location: string) => void

  cart: LineItem[]
  addToCart: (item: { item_id: number; quantity: number }) => Promise<void>
  removeFromCart: (item_id: number) => Promise<void>
  updateCartQuantity: (item_id: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>

  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus>("visitor")
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [cart, setCart] = useState<LineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ------------------------
  // Token helper
  // ------------------------
  const getToken = () => {
    try {
      return JSON.parse(localStorage.getItem("tinda_session") || "{}").token || null
    } catch {
      return null
    }
  }

  // ------------------------
  // Fetch cart from backend
  // ------------------------
  const fetchCart = async () => {
    const token = getToken()
    if (!token || userRole !== "buyer") return setCart([])

    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:3001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return setCart([])

      const data = await res.json()
      const adapted: LineItem[] = data.items.map((item: any) => ({
        line_item_id: item.line_item_id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        stall: item.stall,
        product: item.product,
      }))

      setCart(adapted)
      localStorage.setItem("tinda_cart", JSON.stringify(adapted)) // persist cart
    } catch (e) {
      console.error("Fetch cart error:", e)
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }

  // ------------------------
  // Load session on mount
  // ------------------------
  useEffect(() => {
    const session = localStorage.getItem("tinda_session")
    const loc = localStorage.getItem("tinda_location")

    if (loc) setSelectedLocation(loc)
    if (!session) return

    try {
      const { token } = JSON.parse(session)
      if (!token) return

      fetch("http://localhost:3001/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setCurrentUser(data.user)
          setUserStatus("authenticated")
          setUserRole(data.user.role)
        })
        .catch(() => {
          localStorage.removeItem("tinda_session")
          setCurrentUser(null)
          setUserRole(null)
          setUserStatus("visitor")
          setCart([])
        })
    } catch {
      localStorage.removeItem("tinda_session")
      setCurrentUser(null)
      setUserRole(null)
      setUserStatus("visitor")
    }
  }, [])

  // ------------------------
  // Fetch cart whenever userRole or currentUser changes
  // ------------------------
  useEffect(() => {
    if (userRole === "buyer" && currentUser) {
      const savedCart = localStorage.getItem("tinda_cart")
      if (savedCart) setCart(JSON.parse(savedCart)) // show cached cart instantly
      fetchCart() // sync with backend
    } else {
      setCart([])
    }
  }, [userRole, currentUser])

  // ------------------------
  // Login
  // ------------------------
  const login = async (email: string, password: string, role: UserRole) => {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Login failed")

    setCurrentUser(data.user)
    setUserStatus("authenticated")
    setUserRole(data.user.role)
    localStorage.setItem("tinda_session", JSON.stringify({ user: data.user, token: data.token }))
    if (data.user.role === "buyer") fetchCart()
  }

  // ------------------------
  // Logout
  // ------------------------
  const logout = () => {
    localStorage.removeItem("tinda_session")
    localStorage.removeItem("tinda_cart")
    setCurrentUser(null)
    setUserRole(null)
    setUserStatus("visitor")
    setCart([])
  }

  const handleSetLocation = (loc: string) => {
    setSelectedLocation(loc)
    localStorage.setItem("tinda_location", loc)
  }

  // ------------------------
  // Cart actions
  // ------------------------
  const addToCart = async (item: { item_id: number; quantity: number }) => {
    if (userRole !== "buyer") return
    const token = getToken()
    if (!token) return

    setCart((prev) => {
      const found = prev.find((i) => i.item_id === item.item_id)
      return found
        ? prev.map((i) => ({ ...i, quantity: i.quantity + item.quantity }))
        : [...prev, { ...item, line_item_id: 0, unit_price: 0, stall: null, product: null }]
    })

    try {
      const res = await fetch("http://localhost:3001/api/cart/items", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: item.item_id, quantity: item.quantity }),
      })
      if (!res.ok) return fetchCart()
      fetchCart() // always refresh
    } catch {
      fetchCart()
    }
  }

  const removeFromCart = async (item_id: number) => {
    if (userRole !== "buyer") return
    const token = getToken()
    if (!token) return
    const found = cart.find((c) => c.item_id === item_id)
    if (!found) return

    setCart((prev) => prev.filter((c) => c.item_id !== item_id))

    try {
      const res = await fetch(`http://localhost:3001/api/cart/items/${found.line_item_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) fetchCart()
    } catch {
      fetchCart()
    }
  }

  const updateCartQuantity = async (item_id: number, quantity: number) => {
    if (userRole !== "buyer") return
    const token = getToken()
    if (!token) return
    if (quantity <= 0) return removeFromCart(item_id)
    const found = cart.find((c) => c.item_id === item_id)
    if (!found) return

    setCart((prev) => prev.map((c) => (c.item_id === item_id ? { ...c, quantity } : c)))

    try {
      const res = await fetch(`http://localhost:3001/api/cart/items/${found.line_item_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) fetchCart()
    } catch {
      fetchCart()
    }
  }

  const clearCart = async () => {
    if (userRole !== "buyer") return
    const token = getToken()
    if (!token) return
    setCart([])
    try {
      const res = await fetch("http://localhost:3001/api/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) fetchCart()
    } catch {
      fetchCart()
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userStatus,
        userRole,
        selectedLocation,
        login,
        logout,
        setSelectedLocation: handleSetLocation,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
