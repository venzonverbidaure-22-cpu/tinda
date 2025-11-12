"use client"

import { mockOrders } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function VendorOrdersTable() {
  const [orders, setOrders] = useState(mockOrders)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
  }

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Items</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border hover:bg-muted/50">
              <td className="px-4 py-3 text-sm text-foreground font-medium">{order.id}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">Maria Santos</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{order.items.length} items</td>
              <td className="px-4 py-3 text-sm font-semibold text-primary">₱{order.totalAmount}</td>
              <td className="px-4 py-3">
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}