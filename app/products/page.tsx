"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProductFilter } from "@/components/buyer/product-filter"
import { ProductCard } from "@/components/buyer/product-card"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { useApp } from "@/lib/context" // ✅ use your App context

export default function ProductsPage() {
  const { currentUser } = useApp() // ✅ reactive currentUser

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: [0, 1000] as [number, number],
  })
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filters.category) params.category = filters.category
      if (filters.search) params.search = filters.search

      const res = await axios.get(`http://localhost:3001/api/products`, {
        params,
        headers: currentUser?.token
          ? { Authorization: `Bearer ${currentUser.token}` } // ✅ token from context
          : undefined,
      })

      setProducts(res.data)
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, currentUser]) // ✅ re-fetch if filters or user changes

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Products</h1>
          <p className="text-muted-foreground">Discover fresh products from all vendors</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <ProductFilter onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading products...</p>
              </Card>
            ) : products.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No products found matching your filters</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
