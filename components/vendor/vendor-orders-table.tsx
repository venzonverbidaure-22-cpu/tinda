"use client"

import { mockOrders } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function VendorOrdersTable({ orders: initialOrders }: { orders?: any[] }) {
  const [orders, setOrders] = useState(initialOrders || mockOrders)

  useEffect(() => {
    setOrders(initialOrders || mockOrders)
  }, [initialOrders])

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // setOrders(
    //   orders.map((order) =>
    //     order.id === orderId ? { ...order, status: newStatus as any } : order
    //   )
    // )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
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
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isApiOrder = !!order.orders;
            const orderData = isApiOrder ? order.orders : order;

            return (
              <tr key={orderData.order_id || orderData.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 text-sm text-foreground font-medium">{orderData.order_id || orderData.id}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{orderData.buyer_id || orderData.buyerId}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">₱{orderData.total_amount || orderData.totalAmount}</td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1).replace("-", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={orderData.status}
                    onChange={(e) => handleStatusChange(orderData.order_id || orderData.id, e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    disabled
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}