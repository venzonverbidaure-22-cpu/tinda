"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { triggerProductListingsRefresh } from "./product-refresh"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_BASE_URL } from "@/lib/utils"

const BACKEND_URL = "http://localhost:3001"

interface Stall {
  stall_id: number
  stall_name: string
  stall_description?: string
}

interface AddProductModalProps {
  onClose: () => void
}

export function AddProductModal({ onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: undefined as number | undefined,
    stock: undefined as number | undefined,
    description: "",
    image_url: "",
  })
  const [stalls, setStalls] = useState<Stall[]>([])
  const [selectedStallId, setSelectedStallId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStalls, setIsLoadingStalls] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setIsLoadingStalls(true)
        setError("")
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userId = payload.id

        const res = await fetch(`${BACKEND_URL}/api/stalls/vendor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch stalls")
        const data = await res.json()
        setStalls(data)
        if (data.length > 0) setSelectedStallId(data[0].stall_id)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Error loading stalls")
      } finally {
        setIsLoadingStalls(false)
      }
    }

    fetchStalls()
  }, [])

  const handleStallChange = (value: string) => setSelectedStallId(Number(value))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStallId) return alert("Please select a stall")
    if (!formData.name.trim() || formData.price === undefined || !formData.category) {
      return alert("Please fill in required fields")
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) return alert("Authentication token missing")

      const body = {
        stall_id: selectedStallId,
        item_name: formData.name.trim(),
        category: formData.category,
        price: formData.price,
        item_stocks: formData.stock ?? 0,
        item_description: formData.description.trim(),
        image_url: formData.image_url.trim() || undefined,
      }

      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to add product")
      }

      await res.json().catch(() => null)
      triggerProductListingsRefresh()
      alert("Product added successfully")
      onClose()
    } catch (err: any) {
      console.error(err)
      alert(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add New Product</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Stall Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">Select Stall *</label>
            {isLoadingStalls ? (
              <div className="mt-2 text-sm text-muted-foreground">Loading stalls...</div>
            ) : error ? (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            ) : stalls.length > 0 ? (
              <Select onValueChange={handleStallChange} value={selectedStallId?.toString() || ""}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select a stall">
                    {stalls.find((s) => s.stall_id === selectedStallId)?.stall_name || "Select a stall"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stalls.map((stall) => (
                    <SelectItem key={stall.stall_id} value={stall.stall_id.toString()}>
                      {stall.stall_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-2 text-sm text-red-600">No stalls found. Please create a stall first.</div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-foreground">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Fresh Tomatoes"
              required
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">Category *</label>
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
            <label className="text-sm font-medium text-foreground">Price (₱) *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price ?? ""}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
              required
              className="mt-2"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-sm font-medium text-foreground">Stock Quantity</label>
            <Input
              type="number"
              step="1"
              min="0"
              value={formData.stock ?? ""}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || undefined })}
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          {/* Optional Image */}
          <div>
            <label className="text-sm font-medium text-foreground">Image URL (optional)</label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !selectedStallId || stalls.length === 0} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}