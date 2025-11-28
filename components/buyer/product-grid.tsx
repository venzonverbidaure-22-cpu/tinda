"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      console.log("fetchProducts running...") // check if useEffect triggers

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        console.log("Raw response from backend:", res)

        const data = await res.json().catch(() => [])
        console.log("Raw data from backend:", data)

        if (!res.ok) {
          console.error("Backend returned error:", data)
          throw new Error(data.error || "Failed to fetch products")
        }

        const productsArray = Array.isArray(data) ? data : [data]

        // Map backend fields to Product type
        const mappedProducts: Product[] = productsArray.map((p: any) => ({
          item_id: p.item_id,
          item_name: p.item_name,
          item_description: p.item_description,
          price: p.price,
          item_stocks: p.item_stocks,
          in_stock: !!p.in_stock,
          imagets: p.image_url || null,
          stall_id: p.stall_id,
          category: p.category || "uncategorized",
        }))

        console.log("Mapped products from backend:", mappedProducts)

        setProducts(mappedProducts)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Loading products...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (products.length === 0) return <p>No products found.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.item_id} product={product} />
      ))}
    </div>
  )
}
