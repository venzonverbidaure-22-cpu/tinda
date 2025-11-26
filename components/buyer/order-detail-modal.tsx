"use client"

import { mockOrders, mockProducts } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { useState } from "react"
import { ReviewModal } from "./review-modal"

interface OrderDetailModalProps {
  orderId: string
  onClose: () => void
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const order = mockOrders.find((o) => o.id === orderId)
  const [showReview, setShowReview] = useState(false)

  if (!order) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case "out-for-delivery":
        return <Truck className="h-5 w-5 text-purple-600" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  const statusSteps = ["pending", "confirmed", "out-for-delivery", "completed"]
  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Order Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Order Status Timeline */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-foreground">Order Status</h3>
            <div className="space-y-3">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      index <= currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {getStatusIcon(step)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1).replace("-", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground">Items</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((item) => {
                const product = mockProducts.find((p) => p.id === item.productId)
                return (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {product?.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">₱{item.price * item.quantity}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground">Delivery Information</h3>
            <div className="mt-3 flex gap-2 rounded-lg bg-muted p-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t border-border pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₱{order.totalAmount - 50}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">₱50</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-lg text-primary">₱{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Payment Method:{" "}
              <span className="font-medium text-foreground capitalize">{order.paymentMethod.replace("-", " ")}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {order.status === "completed" && (
              <Button className="flex-1" onClick={() => setShowReview(true)}>
                Leave Review
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
          </div>
        </Card>
      </div>

      {showReview && (
        <ReviewModal orderId={order.id} vendorName="Lola's Fresh Produce" onClose={() => setShowReview(false)} />
      )}
    </>
  )
}
