"use client"

import { Navbar } from "@/components/navbar"
import { useApp } from "@/lib/context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CheckoutModal } from "@/components/buyer/checkout-modal"
import type { LineItem } from "@/lib/types"

// ✅ TEMPORARY FIX: Add this interface
interface CartItemWithStall extends LineItem {
  stall?: {
    stall_id: number
    stall_name: string
    user_id: number
  }
}

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useApp()
  const [showCheckout, setShowCheckout] = useState(false)

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.unit_price) || item.price || 0
    return sum + (price * item.quantity)
  }, 0)

  const deliveryFee = 50
  const totalAmount = subtotal + deliveryFee

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link href="/">
              <Button className="mt-4">Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* ✅ USE THE TEMPORARY FIX HERE */}
              {cart.map((item) => {
                const cartItem = item as CartItemWithStall // Type assertion
                return (
                  <Card key={cartItem.line_item_id} className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={cartItem.product?.product_image || "/placeholder.svg"}
                        alt={cartItem.product?.item_name || "Product"}
                        className="h-24 w-24 rounded object-cover"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{cartItem.product?.item_name || "Product"}</h3>
                        <p className="text-sm text-muted-foreground">{cartItem.product?.item_description || ""}</p>
                        <p className="mt-2 font-semibold text-primary">
                          ₱{parseFloat(cartItem.unit_price) || cartItem.price}
                        </p>
                        {/* ✅ NOW THIS WORKS WITHOUT TYPESCRIPT ERROR */}
                        {cartItem.stall && (
                          <p className="text-xs text-muted-foreground">From: {cartItem.stall.stall_name}</p>
                        )}
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(cartItem.item_id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(cartItem.item_id, cartItem.quantity - 1)}
                            disabled={cartItem.quantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={cartItem.quantity}
                            onChange={(e) => updateCartQuantity(cartItem.item_id, Math.max(1, Number.parseInt(e.target.value) || 1))}
                            className="w-12 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(cartItem.item_id, cartItem.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 p-6">
                <h2 className="font-bold text-foreground">Order Summary</h2>

                <div className="mt-4 space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">₱{deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-lg text-primary">₱{totalAmount.toFixed(2)}</span>
                </div>

                <Button 
                  className="mt-6 w-full" 
                  onClick={() => setShowCheckout(true)}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)} 
          totalAmount={totalAmount} // Now passing the correct total including delivery
        />
      )}
    </main>
  )
}