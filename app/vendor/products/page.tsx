"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Plus, Edit, Trash2, ArrowLeft, Search } from "lucide-react"
import { AddProductModal } from "@/components/vendor/add-product-modal"
import Link from "next/link"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 45,
    stock: 120,
    status: "active" as const,
    image: "/fresh-tomatoes.png",
  },
  {
    id: "2",
    name: "Organic Carrots",
    category: "Vegetables",
    price: 35,
    stock: 5,
    status: "active" as const,
    image: "/organic-carrots.png",
  },
  {
    id: "3",
    name: "Fresh Mangoes",
    category: "Fruits",
    price: 120,
    stock: 0,
    status: "inactive" as const,
    image: "/fresh-mangoes.jpg",
  },
]

export default function VendorProductsPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(mockProducts)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-6 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Product Listings</h1>
              <p className="text-muted-foreground">Manage all your products (SCRUM-22)</p>
            </div>
            <Button onClick={() => setShowAddProduct(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <Card>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <Button onClick={() => setShowAddProduct(true)} className="mt-4">
                Create your first product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                      <td className="px-6 py-4 font-medium text-foreground">₱{product.price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.stock} {product.stock < 10 && product.stock > 0 && "⚠️"}
                          {product.stock === 0 && "❌"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
    </main>
  )
}
