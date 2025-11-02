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
  const savedSession = localStorage.getItem("tinda_session");
  const savedLocation = localStorage.getItem("tinda_location");

  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      const token = session.token;

      if (token) {
        fetch("http://localhost:3001/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((data) => {
            setCurrentUser(data.user);
            setUserStatus("authenticated");
            setUserRole(data.user.role);
          })
          .catch(() => {
            console.warn("Session expired — logging out");
            localStorage.removeItem("tinda_session");
          });
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  }

  if (savedLocation) {
    setSelectedLocation(savedLocation);
  }
}, []);


  const login = async (email: string, password: string, role: UserRole) => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    const { user, token } = data;

    setCurrentUser(user);
    setUserStatus("authenticated");
    setUserRole(user.role);

    // Store session
    localStorage.setItem("tinda_session", JSON.stringify({ user, token }));
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


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
