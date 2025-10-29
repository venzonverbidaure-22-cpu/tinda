"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { UserRole, User, CartItem, UserStatus } from "./types"
import { mockUsers } from "./mock-data"

interface AppContextType {
  currentUser: User | null
  userStatus: UserStatus
  userRole: UserRole | null
  selectedLocation: string | null

  // Auth methods
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  setSelectedLocation: (location: string) => void

  // Cart methods
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus>("visitor")
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("tinda_session")
    const savedLocation = localStorage.getItem("tinda_location")

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setCurrentUser(session.user)
        setUserStatus("authenticated")
        setUserRole(session.user.role)
      } catch (error) {
        console.error("Failed to load session:", error)
      }
    }

    if (savedLocation) {
      setSelectedLocation(savedLocation)
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = role === "buyer" ? mockUsers.buyer : mockUsers.vendor

    setCurrentUser(user)
    setUserStatus("authenticated")
    setUserRole(role)

    // Save to localStorage
    localStorage.setItem("tinda_session", JSON.stringify({ user }))
  }

  const logout = () => {
    setCurrentUser(null)
    setUserStatus("visitor")
    setUserRole(null)
    setCart([])
    localStorage.removeItem("tinda_session")
  }

  const handleSetLocation = (location: string) => {
    setSelectedLocation(location)
    localStorage.setItem("tinda_location", location)
  }

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
    }
  }

  const clearCart = () => setCart([])

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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
