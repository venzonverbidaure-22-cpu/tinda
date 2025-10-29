"use client"

import { Navbar } from "@/components/navbar"
import { useApp } from "@/lib/context"
import { mockProducts } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CheckoutModal } from "@/components/buyer/checkout-modal"

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useApp()
  const [showCheckout, setShowCheckout] = useState(false)

  const cartItems = cart.map((item) => ({
    ...item,
    product: mockProducts.find((p) => p.id === item.productId),
  }))

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
              {cartItems.map((item) => (
                <Card key={item.productId} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.product?.image || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="h-24 w-24 rounded object-cover"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                      <p className="mt-2 font-semibold text-primary">₱{item.price}</p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                          className="w-12 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 p-6">
                <h2 className="font-bold text-foreground">Order Summary</h2>

                <div className="mt-4 space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₱{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">₱50</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-lg text-primary">₱{totalAmount + 50}</span>
                </div>

                <Button className="mt-6 w-full" onClick={() => setShowCheckout(true)}>
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} totalAmount={totalAmount + 50} />}
    </main>
  )
}
