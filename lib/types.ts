export type UserRole = "buyer" | "vendor"
export type UserStatus = "visitor" | "authenticated"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  location?: string
}

export interface AuthSession {
  user: User | null
  status: UserStatus
}

export interface Location {
  id: string
  name: string
  region: string
}

export interface Vendor {
  id: string
  name: string
  logo: string
  banner: string
  rating: number
  location: string
  description: string
  contactInfo: string
  totalSales: number
  revenue: number
}

export interface Product {
  id: string
  vendorId: string
  name: string
  category: string
  price: number
  image: string
  description: string
  stock: number
}

export interface CartItem {
  productId: string
  vendorId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  buyerId: string
  vendorId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "out-for-delivery" | "completed"
  deliveryAddress: string
  paymentMethod: "cod" | "gcash" | "bank-transfer"
  createdAt: Date
  completedAt?: Date
}

export interface Review {
  id: string
  orderId: string
  buyerId: string
  vendorId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface LoyaltyPoints {
  buyerId: string
  points: number
  tier: "bronze" | "silver" | "gold"
}
