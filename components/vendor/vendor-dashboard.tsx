"use client"

import { useApp } from "@/lib/context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Package, ShoppingCart, Plus } from "lucide-react"
import { useState } from "react"
import { AddProductModal } from "./add-product-modal"
import { VendorOrdersTable } from "./vendor-orders-table"
// ✅ Added import

const salesData = [
  { day: "Mon", sales: 4000 },
  { day: "Tue", sales: 3000 },
  { day: "Wed", sales: 2000 },
  { day: "Thu", sales: 2780 },
  { day: "Fri", sales: 1890 },
  { day: "Sat", sales: 2390 },
  { day: "Sun", sales: 3490 },
]

export function VendorDashboard() {
  const { currentUser } = useApp()
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentUser?.full_name}!</h1>
          <p className="text-muted-foreground">Manage your store and track sales</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold text-foreground">₱52,000</p>
              <p className="mt-1 text-xs text-green-600">+12% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="text-2xl font-bold text-foreground">245</p>
              <p className="mt-1 text-xs text-green-600">+8 this week</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-2xl font-bold text-foreground">18</p>
              <p className="mt-1 text-xs text-muted-foreground">Active listings</p>
            </div>
            <Package className="h-8 w-8 text-secondary" />
          </div>
        </Card>
      </div>

      {/* ✅ Product Listings Section */}
      {/* <ProductListings />  */}

      {/* Sales Chart */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Weekly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Orders */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Recent Orders</h2>
        <VendorOrdersTable />
      </div>

      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
    </div>
  )
}
