"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const BACKEND_URL = "http://localhost:3001"

interface Product {
  item_id: number
  item_name?: string
  price?: number
  item_stocks?: number
  category?: string
  item_description?: string
}

interface EditProductModalProps {
  product: Product
  onClose: () => void
  onSave: () => void
}

const CATEGORY_OPTIONS = ["Vegetables", "Meat", "Seafood", "Condiments", "Fruits"]

export function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [form, setForm] = useState<Product>({
    item_name: "",
    item_description: "",
    price: undefined,
    item_stocks: undefined,
    category: "",
    ...product,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({
      item_name: "",
      item_description: "",
      price: undefined,
      item_stocks: undefined,
      category: "",
      ...product,
    })
  }, [product])

  const handleChange = (field: keyof Product, value: string | number) => {
    if (field === "price") {
      const num = parseFloat(String(value))
      setForm((prev) => ({ ...prev, price: isNaN(num) ? undefined : num }))
    } else if (field === "item_stocks") {
      const num = parseInt(String(value))
      setForm((prev) => ({ ...prev, item_stocks: isNaN(num) ? undefined : num }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    if (!form.item_id) {
      alert("Invalid product ID")
      return
    }

    setSaving(true)
    try {
      const body = {
        item_name: form.item_name || "",
        item_description: form.item_description || null,
        price: form.price ?? 0,
        item_stocks: form.item_stocks ?? 0,
        category: form.category || null,
      }

      const res = await fetch(`${BACKEND_URL}/api/products/${form.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      let data: any = null
      try { data = await res.json() } catch {}

      if (!res.ok) throw new Error(data?.error || "Failed to update product")

      onSave()
      onClose()
    } catch (err: any) {
      console.error("Error saving product:", err)
      alert(`Error saving product: ${err.message || err}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Product Name</Label>
            <Input
              value={form.item_name || ""}
              onChange={(e) => handleChange("item_name", e.target.value)}
              placeholder="Product name"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={form.item_description || ""}
              onChange={(e) => handleChange("item_description", e.target.value)}
              placeholder="Description"
            />
          </div>

          <div>
            <Label>Price (₱)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.price ?? ""}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              step="1"
              min="0"
              value={form.item_stocks ?? ""}
              onChange={(e) => handleChange("item_stocks", e.target.value)}
              placeholder="Stock quantity"
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              className="w-full border border-input bg-background rounded-md p-2"
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
