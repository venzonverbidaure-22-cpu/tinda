"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { mockProducts } from "@/lib/mock-data"
import { ProductFilter } from "@/components/buyer/product-filter"
import { ProductCard } from "@/components/buyer/product-card"
import { Card } from "@/components/ui/card"

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: [0, 1000] as [number, number],
  })

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = !filters.category || product.category === filters.category
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [filters])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
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
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
