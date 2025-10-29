"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddProductModalProps {
  onClose: () => void
}

export function AddProductModal({ onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate product creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onClose()
    alert("Product added successfully!")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add New Product</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-foreground">Product Name</label>
            <Input
              placeholder="e.g., Fresh Tomatoes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Meat">Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Condiments">Condiments</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-foreground">Price (₱)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-sm font-medium text-foreground">Stock Quantity</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="Describe your product..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
