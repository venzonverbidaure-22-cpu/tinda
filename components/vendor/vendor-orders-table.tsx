"use client"

import { mockOrders } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { updateOrderStatus } from "@/lib/services/orderService"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

export function VendorOrdersTable({ orders: initialOrders }: { orders?: any[] }) {
  const [orders, setOrders] = useState(initialOrders || mockOrders)

  useEffect(() => {
    setOrders(initialOrders || [])
  }, [initialOrders])

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(currentOrders =>
        currentOrders.map(order => {
          const isApiOrder = !!order.orders;
          const orderData = isApiOrder ? order.orders : order;
          if ((orderData.order_id || orderData.id) === orderId) {
            if (isApiOrder) {
              return { ...order, orders: { ...order.orders, status: newStatus } };
            }
            return { ...order, status: newStatus };
          }
          return order;
        })
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Optionally, revert the UI change or show an error message
    }
  };

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
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Created Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isApiOrder = !!order.orders;
            const orderData = isApiOrder ? order.orders : order;
            const orderId = orderData.order_id || orderData.id;
            const createdDate = orderData.created_at || orderData.createdAt;

            return (
              <tr key={orderId} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 text-sm text-foreground font-medium">{orderId}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{orderData.buyer_id || orderData.buyerId}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">₱{orderData.total_amount || orderData.totalAmount}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(createdDate), "MMMM d, yyyy")}</td>
                <td className="px-4 py-3">
                  <Select
                    value={orderData.status}
                    onValueChange={(newStatus) => handleStatusChange(orderId, newStatus)}
                  >
                    <SelectTrigger className={`w-36 ${getStatusColor(orderData.status)}`}>
                      <SelectValue placeholder="Set Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}