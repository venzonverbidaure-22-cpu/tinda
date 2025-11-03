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
  stall_id: string
  stall_name: string
  vendor_name: string
  stall_description: string
  category: string
  location: string
  banner_photo: string
  stall_icon: string
  rating: number
  vendor_contact: string
  
  //? Original interface
  // id: string
  // name: string
  // logo: string
  // banner: string
  // rating: number
  // location: string
  // description: string
  // contactInfo: string
  // totalSales: number
  // revenue: number
}

export interface Product {
  product_id: string
  stall_id: string
  product_name: string
  price: number
  product_image: string
  description: string
  stock: number

  //? original interface
  // id: string
  // vendorId: string
  // name: string
  // category: string
  // image: string
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
