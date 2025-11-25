"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { triggerProductListingsRefresh } from "./product-listing"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BACKEND_URL = "http://localhost:3001";

interface Stall {
  stall_id: string;
  stall_name: string;
  stall_description: string;
  icon_url?: string;
}

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
  const [stalls, setStalls] = useState<Stall[]>([])
  const [selectedStallId, setSelectedStallId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStalls, setIsLoadingStalls] = useState(true)
  const [error, setError] = useState<string>("")

  // Fetch user's stalls when component mounts
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setIsLoadingStalls(true)
        setError("")
        
        const token = localStorage.getItem("token")
        console.log("Token found:", !!token)
        
        if (!token) {
          setError("No authentication token found")
          return
        }

        // Get current user ID from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id;
          console.log("User ID from token:", userId)

          if (!userId) {
            setError("User not authenticated")
            return
          }

          console.log("Fetching stalls for user:", userId)
          const response = await fetch(`${BACKEND_URL}/api/stalls/vendor/${userId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })

          console.log("Response status:", response.status)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error("API error:", errorText)
            throw new Error(`Failed to fetch stalls: ${response.status}`)
          }

          const userStalls = await response.json()
          console.log("Stalls received:", userStalls)
          if (!Array.isArray(userStalls)) {
            console.error("Invalid stalls data:", userStalls)
            throw new Error("Invalid stalls data received")
          }

          setStalls(userStalls)

          // Auto-select the first stall if available
          if (userStalls.length > 0) {
            const firstStallId = String(userStalls[0].stall_id)
            console.log("Auto-selecting stall:", firstStallId)
            setSelectedStallId(firstStallId)
          } else {
            setError("No stalls found. Please create a stall first.")
          }

        } catch (parseError) {
          console.error("Error parsing token:", parseError)
          setError("Authentication error")
        }

      } catch (error: any) {
        console.error("Error fetching stalls:", error)
        setError(`Error loading stalls: ${error.message}`)
      } finally {
        setIsLoadingStalls(false)
      }
    }

    fetchStalls()
  }, [])

  const handleStallChange = (value: string) => {
    console.log("Stall changed to:", value)
    setSelectedStallId(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!selectedStallId) {
      alert("Please select a stall first")
      return
    }

    if (!formData.name.trim() || !formData.price || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert("No authentication token found. Please log in again.")
        return
      }

      const requestBody = {
        stall_id: Number(selectedStallId),
        item_name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        item_stocks: parseInt(formData.stock) || 0,
        item_description: formData.description.trim(),
      }

      console.log("Sending request with:", requestBody)

      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add product")
      }

      const newProduct = await res.json()
      console.log("Product created:", newProduct)

      triggerProductListingsRefresh()
      alert("Product added successfully!")
      onClose()
    } catch (err: any) {
      console.error("Error details:", err)
      alert(`Error adding product: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug info
  console.log("Current state:", {
    stallsCount: stalls.length,
    selectedStallId,
    isLoadingStalls,
    error,
  })

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
          {/* Stall Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">Select Stall *</label>
            {isLoadingStalls ? (
              <div className="mt-2 text-sm text-muted-foreground">Loading stalls...</div>
            ) : error ? (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            ) : stalls.length > 0 ? (
              <Select onValueChange={handleStallChange} value={selectedStallId}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select a stall">
                    {stalls.find(s => `${s.stall_id}` === selectedStallId)?.stall_name || "Select a stall"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stalls.map((stall) => (
                    <SelectItem key={stall.stall_id} value={stall.stall_id}>
                      {stall.stall_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-2 text-sm text-red-600">
                No stalls found. Please create a stall first.
              </div>
            )}
          </div>

          {/* Show selected stall info for debugging */}
          {selectedStallId && (
            <div className="text-xs text-muted-foreground">
              Selected: {stalls.find(s => `${s.stall_id} === selectedStallId`)?.stall_name}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-foreground">Product Name *</label>
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
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedStallId || stalls.length === 0} 
              className="flex-1"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}