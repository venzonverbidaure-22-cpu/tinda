"use client"

import { Navbar } from "@/components/navbar"
import { mockOrders } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { OrderDetailModal } from "@/components/buyer/order-detail-modal"

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {mockOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No orders yet</p>
            <Link href="/">
              <Button className="mt-4">Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-foreground">Order #{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium text-foreground">Order Date</p>
                        <p>{order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Items</p>
                        <p>{order.items.length} item(s)</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Total</p>
                        <p className="font-semibold text-primary">₱{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button variant="outline" onClick={() => setSelectedOrder(order.id)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetailModal orderId={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </main>
  )
}
