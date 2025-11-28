import type { Vendor, Product, Order, Review, LoyaltyPoints } from "./types"

export const mockUsers = {
  buyer: {
    id: "buyer-1",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "buyer" as const,
    avatar: "/diverse-user-avatars.png",
  },
  vendor: {
    id: "vendor-user-1",
    name: "Lola Rosa",
    email: "lola@example.com",
    role: "vendor" as const,
    avatar: "/placeholder-user.jpg",
  },
}

export const mockLocations: Location[] = [
  { id: "loc-1", name: "Quiapo", region: "Manila" },
  { id: "loc-2", name: "Divisoria", region: "Manila" },
  { id: "loc-3", name: "Binondo", region: "Manila" },
  { id: "loc-4", name: "Salcedo", region: "Makati" },
  { id: "loc-5", name: "Greenbelt", region: "Makati" },
  { id: "loc-6", name: "Alabang", region: "Muntinlupa" },
  { id: "loc-7", name: "Paseo de Santa Rosa", region: "Laguna" },
  { id: "loc-8", name: "Robinsons Cavite", region: "Cavite" },
]

export const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Lola's Fresh Produce",
    logo: "/fresh-produce-vendor-logo.jpg",
    banner: "/fresh-vegetables-market-stall.jpg",
    rating: 4.8,
    location: "Quiapo Market",
    description: "Fresh vegetables and fruits sourced daily from local farms",
    contactInfo: "09123456789",
    totalSales: 1250,
    revenue: 45000,
  },
  {
    id: "vendor-2",
    name: "Manang's Meat & Poultry",
    logo: "/meat-vendor-logo.jpg",
    banner: "/meat-market-stall.jpg",
    rating: 4.6,
    location: "Divisoria Market",
    description: "Premium quality meat and poultry products",
    contactInfo: "09234567890",
    totalSales: 980,
    revenue: 52000,
  },
  {
    id: "vendor-3",
    name: "Tita's Seafood Paradise",
    logo: "/seafood-vendor-logo.jpg",
    banner: "/seafood-market-stall.jpg",
    rating: 4.9,
    location: "Binondo Market",
    description: "Fresh catch daily - fish, shrimp, and shellfish",
    contactInfo: "09345678901",
    totalSales: 1450,
    revenue: 68000,
  },
  {
    id: "vendor-4",
    name: "Ate's Dry Goods & Spices",
    logo: "/spices-vendor-logo.jpg",
    banner: "/spices-market-stall.jpg",
    rating: 4.7,
    location: "Salcedo Market",
    description: "Premium spices, grains, and pantry essentials",
    contactInfo: "09456789012",
    totalSales: 890,
    revenue: 38000,
  },
]

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    vendorId: "vendor-1",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 45,
    image: "/fresh-red-tomatoes.jpg",
    description: "Ripe, juicy tomatoes perfect for cooking",
    stock: 50,
  },
  {
    id: "prod-2",
    vendorId: "vendor-1",
    name: "Organic Lettuce",
    category: "Vegetables",
    price: 35,
    image: "/fresh-green-lettuce.png",
    description: "Crisp organic lettuce leaves",
    stock: 30,
  },
  {
    id: "prod-3",
    vendorId: "vendor-2",
    name: "Premium Pork Belly",
    category: "Meat",
    price: 280,
    image: "/pork-belly-meat.jpg",
    description: "High-quality pork belly for lechon or cooking",
    stock: 15,
  },
  {
    id: "prod-4",
    vendorId: "vendor-3",
    name: "Fresh Bangus",
    category: "Seafood",
    price: 320,
    image: "/fresh-bangus-fish.jpg",
    description: "Fresh milkfish caught this morning",
    stock: 20,
  },
  {
    id: "prod-5",
    vendorId: "vendor-4",
    name: "Premium Bagoong",
    category: "Condiments",
    price: 120,
    image: "/bagoong-shrimp-paste.jpg",
    description: "Traditional Filipino shrimp paste",
    stock: 40,
  },
]

export const mockOrders: Order[] = [
  {
    id: "order-1",
    buyerId: "buyer-1",
    vendorId: "vendor-1",
    items: [
      { productId: "prod-1", vendorId: "vendor-1", quantity: 2, price: 45 },
      { productId: "prod-2", vendorId: "vendor-1", quantity: 1, price: 35 },
    ],
    totalAmount: 125,
    status: "completed",
    deliveryAddress: "123 Main St, Manila",
    paymentMethod: "cod",
    createdAt: new Date("2025-10-20"),
    completedAt: new Date("2025-10-21"),
  },
]

export const mockReviews: Review[] = [
  {
    id: "review-1",
    orderId: "order-1",
    buyerId: "buyer-1",
    vendorId: "vendor-1",
    rating: 5,
    comment: "Very fresh vegetables! Will order again.",
    createdAt: new Date("2025-10-21"),
  },
]

export const mockLoyaltyPoints: LoyaltyPoints = {
  buyerId: "buyer-1",
  points: 450,
  tier: "silver",
}