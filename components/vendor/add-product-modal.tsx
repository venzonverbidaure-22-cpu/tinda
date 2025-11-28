"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { triggerProductListingsRefresh } from "./product-listing"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_BASE_URL } from "@/lib/utils"

const BACKEND_URL = API_BASE_URL

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
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [stalls, setStalls] = useState<Stall[]>([])
  const [selectedStallId, setSelectedStallId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStalls, setIsLoadingStalls] = useState(true)
  const [error, setError] = useState<string>("")

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Fetch user's stalls when component mounts
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setIsLoadingStalls(true)
        setError("")
        
        const token = localStorage.getItem("token")
        
        if (!token) {
          setError("No authentication token found")
          return
        }

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id;

          if (!userId) {
            setError("User not authenticated")
            return
          }

          const response = await fetch(`${BACKEND_URL}/api/stalls/vendor/${userId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to fetch stalls: ${response.status}`)
          }

          const userStalls = await response.json()
          setStalls(userStalls)

          if (userStalls.length > 0) {
            const firstStallId = String(userStalls[0].stall_id)
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
    setSelectedStallId(value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert("❌ Please upload only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ Image size should be less than 5MB");
        return;
      }
      
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

      // ✅ Use FormData instead of JSON to support file upload
      const formDataToSend = new FormData();
      formDataToSend.append("stall_id", selectedStallId);
      formDataToSend.append("item_name", formData.name.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("item_stocks", formData.stock || "0");
      formDataToSend.append("item_description", formData.description.trim());

      // ✅ Append image file if selected
      if (productImage) {
        formDataToSend.append("product_image", productImage);
      }

      console.log("Sending FormData with image:", !!productImage);

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formDataToSend,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
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

          {/* ✅ NEW: Product Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground">Product Image</label>
            <div className="mt-2 space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => {
                      setProductImage(null);
                      setImagePreview("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload product image</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="product-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('product-image')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
          </div>

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

