export type UserRole = "buyer" | "vendor"
export type UserStatus = "visitor" | "authenticated"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"
export type PaymentMethod = "cod" | "gcash" | "bank-transfer"
export interface User {
  id: string
  user_id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
  token: string
}



export interface AuthSession {
  user: User | null
  status: UserStatus
  token?: string
}

export interface Buyer {
  user_id: number
  buyer_description?: string
  buyer_latitude?: string
  buyer_longitude?: string
  buyer_address?: string
  buyer_city?: string
  buyer_state?: string
  buyer_zip_code?: string
  buyer_country: string
  suki_count: number
  suki_rank: string
  created_at: string
  updated_at: string
}

export interface AddToCartRequest {
  item_id: number
  quantity: number
}


export interface Location {
  id: string
  name: string
  region: string
}
// Added this comment to force a re-evaluation of types


export interface Vendor {
  stall_id: string
  stall_name: string
  vendor_name: string
  stall_description: string
  category: string
  location: string
  stall_city?: string
  stall_address: string
  stall_state?: string
  stall_icon: string
  icon_url: string
  banner_url:string
  banner_photo:string
  rating: number
  vendor_contact: string
  id: string
  full_name: string
  totalSales: number
  revenue: number
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


export interface Stall{
  stall_id: number
  stall_name: string
  vendor_name: string
  stall_description: string
  location: string
  category: string
  banner_photo: string
  stall_icon: string
  rating: null
}
export interface Product {
  product_id: string
  item_id: number
  stall_id: string
  product_name: string
  price: number
  item_name: string
  product_image: string
  description: string
  stock: number
  category: string
  //? original interface
  // id: string
  // vendorId: string
  // name: string
  // category: string
  
  // in_stock: boolean // Removed redundant property
  // image: string // Removed redundant property
}

export interface Image {
  image_id: number
  image_url: string
  entity_type: string
  image_type: string
  user_id?: number
  stall_id?: number
  item_id?: number
  message_id?: number
  created_at: string
}


export interface ShoppingCart {
  cart_id: number
  buyer_id: number
  created_at: string
  updated_at: string
}

// export interface CartItem {
//   productId: string
//   vendorId: string
//   quantity: number
//   price: number
// }

export interface Order {
  order_id: string
  buyer_id: string
  vendor_id: string
  items: LineItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "out-for-delivery" | "completed"
  deliveryAddress: string
  paymentMethod: "cod" | "gcash" | "bank-transfer"
  createdAt: Date
  completedAt?: Date
}

export interface LineItem {
  line_item_id: number
  item_id: number

  
  productId: string  // string representation for frontend compatibility
  vendorId: string   // stall_id as string
  quantity: number
  price: number
  unit_price: string
  stall_id?: any
  product?: {
    item_id: number
    item_name: string
    item_description?: string
    price: string
    item_stocks: number
    in_stock: boolean
    product_image?: string
  }
  stall?: {
    stall_id: number
    stall_name: string
    user_id: number
  }

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


export interface Payment {
  payment_id: number
  order_id?: number
  payer_buyer_id?: number
  stall_id?: number
  amount: string
  method: string
  status: PaymentStatus
  created_at: string
  external_ref?: string
}


interface CartItemWithStall extends LineItem {
  stall?: {
    stall_id: number
    stall_name: string
    user_id: number
  }
}