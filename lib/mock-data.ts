import type { Vendor, Product, Order, Review, LoyaltyPoints, Location } from "./types"

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
    stall_id: "vendor-1",
    stall_name: "Lola's Fresh Produce",
    vendor_name: "Lola's Fresh Produce", // Placeholder
    stall_description: "Fresh vegetables and fruits sourced daily from local farms",
    category: "Produce", // Placeholder
    location: "Quiapo Market",
    stall_address: "Quiapo Market", // Placeholder
    stall_icon: "/fresh-produce-vendor-logo.jpg",
    icon_url: "/fresh-produce-vendor-logo.jpg",
    banner_url: "/fresh-vegetables-market-stall.jpg",
    banner_photo: "/fresh-vegetables-market-stall.jpg",
    rating: 4.8,
    vendor_contact: "09123456789",
    full_name: "Lola's Fresh Produce", // Placeholder
    totalSales: 1250,
    revenue: 45000,
  },
  {
    id: "vendor-2",
    stall_id: "vendor-2",
    stall_name: "Manang's Meat & Poultry",
    vendor_name: "Manang's Meat & Poultry", // Placeholder
    stall_description: "Premium quality meat and poultry products",
    category: "Meat", // Placeholder
    location: "Divisoria Market",
    stall_address: "Divisoria Market", // Placeholder
    stall_icon: "/meat-vendor-logo.jpg",
    icon_url: "/meat-vendor-logo.jpg",
    banner_url: "/meat-market-stall.jpg",
    banner_photo: "/meat-market-stall.jpg",
    rating: 4.6,
    vendor_contact: "09234567890",
    full_name: "Manang's Meat & Poultry", // Placeholder
    totalSales: 980,
    revenue: 52000,
  },
  {
    id: "vendor-3",
    stall_id: "vendor-3",
    stall_name: "Tita's Seafood Paradise",
    vendor_name: "Tita's Seafood Paradise", // Placeholder
    stall_description: "Fresh catch daily - fish, shrimp, and shellfish",
    category: "Seafood", // Placeholder
    location: "Binondo Market",
    stall_address: "Binondo Market", // Placeholder
    stall_icon: "/seafood-vendor-logo.jpg",
    icon_url: "/seafood-vendor-logo.jpg",
    banner_url: "/seafood-market-stall.jpg",
    banner_photo: "/seafood-market-stall.jpg",
    rating: 4.9,
    vendor_contact: "09345678901",
    full_name: "Tita's Seafood Paradise", // Placeholder
    totalSales: 1450,
    revenue: 68000,
  },
  {
    id: "vendor-4",
    stall_id: "vendor-4",
    stall_name: "Ate's Dry Goods & Spices",
    vendor_name: "Ate's Dry Goods & Spices", // Placeholder
    stall_description: "Premium spices, grains, and pantry essentials",
    category: "Spices", // Placeholder
    location: "Salcedo Market",
    stall_address: "Salcedo Market", // Placeholder
    stall_icon: "/spices-vendor-logo.jpg",
    icon_url: "/spices-vendor-logo.jpg",
    banner_url: "/spices-market-stall.jpg",
    banner_photo: "/spices-market-stall.jpg",
    rating: 4.7,
    vendor_contact: "09456789012",
    full_name: "Ate's Dry Goods & Spices", // Placeholder
    totalSales: 890,
    revenue: 38000,
  },
]

export const mockProducts: Product[] = [
  {
    product_id: "prod-1",
    stall_id: "vendor-1",
    product_name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 45,
    product_image: "/fresh-red-tomatoes.jpg",
    description: "Ripe, juicy tomatoes perfect for cooking",
    stock: 50,
    item_id: 1, // Placeholder
    item_name: "Fresh Tomatoes", // Placeholder
    // in_stock: true, // Placeholder
    // image: "/fresh-red-tomatoes.jpg", // Placeholder
  },
  {
    product_id: "prod-2",
    stall_id: "vendor-1",
    product_name: "Organic Lettuce",
    category: "Vegetables",
    price: 35,
    product_image: "/fresh-green-lettuce.png",
    description: "Crisp organic lettuce leaves",
    stock: 30,
    item_id: 2, // Placeholder
    item_name: "Organic Lettuce", // Placeholder
    // in_stock: true, // Placeholder
    // image: "/fresh-green-lettuce.png", // Placeholder
  },
  {
    product_id: "prod-3",
    stall_id: "vendor-2",
    product_name: "Premium Pork Belly",
    category: "Meat",
    price: 280,
    product_image: "/pork-belly-meat.jpg",
    description: "High-quality pork belly for lechon or cooking",
    stock: 15,
    item_id: 3, // Placeholder
    item_name: "Premium Pork Belly", // Placeholder
    // in_stock: true, // Placeholder
    // image: "/pork-belly-meat.jpg", // Placeholder
  },
  {
    product_id: "prod-4",
    stall_id: "vendor-3",
    product_name: "Fresh Bangus",
    category: "Seafood",
    price: 320,
    product_image: "/fresh-bangus-fish.jpg",
    description: "Fresh milkfish caught this morning",
    stock: 20,
    item_id: 4, // Placeholder
    item_name: "Fresh Bangus", // Placeholder
    // in_stock: true, // Placeholder
    // image: "/fresh-bangus-fish.jpg", // Placeholder
  },
  {
    product_id: "prod-5",
    stall_id: "vendor-4",
    product_name: "Premium Bagoong",
    category: "Condiments",
    price: 120,
    product_image: "/bagoong-shrimp-paste.jpg",
    description: "Traditional Filipino shrimp paste",
    stock: 40,
    item_id: 5, // Placeholder
    item_name: "Premium Bagoong", // Placeholder
    // in_stock: true, // Placeholder
    // image: "/bagoong-shrimp-paste.jpg", // Placeholder
  },
]

export const mockOrders: Order[] = [
  {
    order_id: "order-1",
    buyer_id: "buyer-1",
    vendor_id: "vendor-1",
    items: [
      { line_item_id: 1, item_id: 1, productId: "prod-1", vendorId: "vendor-1", quantity: 2, price: 45, unit_price: "45" },
      { line_item_id: 2, item_id: 2, productId: "prod-2", vendorId: "vendor-1", quantity: 1, price: 35, unit_price: "35" },
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
