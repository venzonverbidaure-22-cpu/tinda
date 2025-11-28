"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ArrowLeft, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { AddProductModal } from "@/components/vendor/add-product-modal"
import { EditProductModal } from "@/components/vendor/edit-product-modal"
import Link from "next/link"
import { setExternalRefresh } from "@/components/vendor/product-refresh"
import { API_BASE_URL } from "@/lib/utils"

const BACKEND_URL = API_BASE_URL

interface Product {
  item_id: number
  item_name: string
  price: number
  item_stocks: number
  image_url?: string
  category?: string
  item_description?: string
}

export default function VendorProductsPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleting, setDeleting] = useState<number | null>(null)

  // ==== Fetch products from backend ====
  const fetchProducts = async () => {
  try {
    const stallId = 14 // Replace with actual logged-in vendor's stall ID
    const res = await fetch(`${BACKEND_URL}/api/products?stall_id=${stallId}`)
    if (!res.ok) throw new Error("Failed to fetch products")
    const data = await res.json()

    const mapped = data.map((p: any) => ({
      item_id: p.item_id,
      item_name: p.item_name || "",           // <- FIXED
      price: Number(p.price) || 0,
      item_stocks: p.item_stocks ?? 0,       // <- FIXED
      image_url: p.image_url || undefined,   // <- FIXED
      category: p.category || "",
      item_description: p.item_description || "",
    }))

    setProducts(mapped)
  } catch (err) {
    console.error("Error fetching products:", err)
  }
  }

  useEffect(() => {
    fetchProducts()
  }, [refreshKey])

  useEffect(() => {
    setExternalRefresh(() => setRefreshKey((prev) => prev + 1))
  }, [])

  const filteredProducts = products.filter((product) =>
    product.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ==== DELETE PRODUCT ====
  const handleDelete = async (item_id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    setDeleting(item_id)
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${item_id}`, {
        method: "DELETE",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to delete product")
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error("Error deleting product:", err)
    } finally {
      setDeleting(null)
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
              <p className="text-muted-foreground">Manage all your products</p>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.item_id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4">{product.item_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                      <td className="px-6 py-4 font-medium text-foreground">₱{(+product.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.item_stocks === 0
                              ? "text-red-600"
                              : product.item_stocks < 10
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.item_stocks}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingProduct(product)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.item_id)}
                            disabled={deleting === product.item_id}
                          >
                            {deleting === product.item_id ? "Deleting..." : <Trash2 className="h-4 w-4 text-red-600" />}
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

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </main>
  )
}
