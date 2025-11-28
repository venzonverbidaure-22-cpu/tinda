"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useApp } from "@/lib/context"
import { X } from "lucide-react"
import { API_BASE_URL } from "@/lib/utils"

interface CheckoutModalProps {
  onClose: () => void
  totalAmount: number
}

export function CheckoutModal({ onClose, totalAmount }: CheckoutModalProps) {
  const { clearCart, cart } = useApp()
  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "cod",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      // CHANGE: Use the main checkout endpoint instead of /simple
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          delivery_address: formData.address,
          payment_method: formData.paymentMethod
        })
      })

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server response:', errorText)
        throw new Error(`Checkout failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Clear frontend cart on success
      clearCart()
      
      // CHANGE: Handle multiple orders response
      if (result.orders && result.orders.length > 0) {
        const orderIds = result.orders.map((order: any) => order.order_id).join(", ")
        alert(`Order${result.orders.length > 1 ? 's' : ''} placed successfully! Order ID${result.orders.length > 1 ? 's' : ''}: ${orderIds}`)
      } else {
        alert("Order placed successfully!")
      }
      
      onClose()

    } catch (error) {
      console.error("Checkout error:", error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Failed to place order. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Checkout</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Delivery Address */}
          <div>
            <label className="text-sm font-medium text-foreground">Delivery Address</label>
            <Input
              placeholder="Enter your delivery address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-foreground">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">GCash</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="border-t border-border pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₱{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">₱50.00</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2">
                <span className="text-foreground">Total Amount</span>
                <span className="text-lg text-primary">₱{(totalAmount + 50).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.address} 
              className="flex-1"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}