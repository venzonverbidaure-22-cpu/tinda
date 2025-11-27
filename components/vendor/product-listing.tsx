"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { API_BASE_URL } from "@/lib/utils"

// Define Product interface
interface Product {
  item_id: number
  item_name: string
  price: number
  item_description: string
  item_stocks: number
  in_stock: boolean
  image_url?: string
  category?: string
}

// Category options
const CATEGORY_OPTIONS = [
  "Vegetables",
  "Meat",
  "Seafood",
  "Condiments",
  "Fruits",
]

// === Exported trigger to refresh product listings externally ===
let externalRefresh: (() => void) | null = null
export function triggerProductListingsRefresh() {
  externalRefresh?.()
}

export function ProductListings() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleting, setDeleting] = useState<number | null>(null)

  // === New states for editing ===
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [refreshKey])

  // Expose refresh function externally
  useEffect(() => {
    externalRefresh = () => setRefreshKey((prev) => prev + 1)
    return () => {
      externalRefresh = null
    }
  }, [])

  // ==== DELETE PRODUCT ====
  const handleDelete = async (item_id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    setDeleting(item_id)
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${item_id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      console.log("Delete response:", res.status, data)
      if (!res.ok) throw new Error(data?.error || "Failed to delete product")
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error("Error deleting product:", err)
    } finally {
      setDeleting(null)
    }
  }

  // ==== EDIT PRODUCT ====
  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setEditForm(product)
  }

  const handleEditChange = (field: keyof Product, value: string | number) => {
    // Restrict price to 2 decimal places
    if (field === "price") {
      const val = value.toString()
      if (!/^\d*\.?\d{0,2}$/.test(val)) return
    }
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const saveEdits = async () => {
    if (!editingProduct) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      console.log("Edit response:", res.status, data)
      if (!res.ok) throw new Error(data?.error || "Failed to update product")
      setEditingProduct(null)
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error("Error updating product:", err)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">My Products</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add one to get started!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Card key={product.item_id} className="p-4 hover:shadow-lg transition-all relative">
              {/* Edit + Delete Buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.item_id)}
                  disabled={deleting === product.item_id}
                >
                  {deleting === product.item_id ? "Deleting..." : "Delete"}
                </Button>
              </div>

              {/* Image */}
              <img
                src={
                  product.image_url && product.image_url.trim() !== ""
                    ? product.image_url
                    : "/placeholder-product.jpg"
                }
                alt={product.item_name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />

              {/* Product Info */}
              <h3 className="text-lg font-semibold text-foreground truncate">
                {product.item_name || "Unnamed Product"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.item_description || "No description available."}
              </p>
              <p className="font-medium text-primary text-base">
                ₱{Number(product.price).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                Stock: {product.item_stocks} | {product.in_stock ? "Available" : "Out of stock"}
              </p>
              {product.category && <Badge className="mt-1 inline-block">{product.category}</Badge>}
            </Card>
          ))}
        </div>
      )}

      {/* ==== EDIT MODAL ==== */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={editForm.item_name || ""}
                  onChange={(e) => handleEditChange("item_name", e.target.value)}
                  placeholder="Product name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={editForm.item_description || ""}
                  onChange={(e) => handleEditChange("item_description", e.target.value)}
                  placeholder="Description"
                />
              </div>

              <div>
                <Label>Price (₱)</Label>
                <Input
                  type="text"
                  value={editForm.price || ""}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={editForm.item_stocks || ""}
                  onChange={(e) => handleEditChange("item_stocks", Number(e.target.value))}
                  placeholder="Stock quantity"
                />
              </div>

              <div>
                <Label>Category</Label>
                <select
                  className="w-full border border-input bg-background rounded-md p-2"
                  value={editForm.category || ""}
                  onChange={(e) => handleEditChange("category", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button onClick={saveEdits}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
