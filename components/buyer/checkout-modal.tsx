"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useApp } from "@/lib/context"
import { X } from "lucide-react"

interface CheckoutModalProps {
  onClose: () => void
  totalAmount: number
}

export function CheckoutModal({ onClose, totalAmount }: CheckoutModalProps) {
  const { clearCart } = useApp()
  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "cod",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    clearCart()
    setIsSubmitting(false)
    onClose()

    // Show success message (in real app, would use toast)
    alert("Order placed successfully!")
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

          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total Amount</span>
              <span className="text-lg text-primary">₱{totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
