"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeft, TrendingUp, Users, ShoppingCart } from "lucide-react"
import Link from "next/link"

const salesData = [
  { date: "Oct 1", sales: 2400, orders: 24 },
  { date: "Oct 5", sales: 1398, orders: 22 },
  { date: "Oct 10", sales: 9800, orders: 29 },
  { date: "Oct 15", sales: 3908, orders: 40 },
  { date: "Oct 20", sales: 4800, orders: 36 },
  { date: "Oct 25", sales: 3800, orders: 35 },
]

const topProducts = [
  { name: "Fresh Tomatoes", sales: 4200, quantity: 120 },
  { name: "Organic Lettuce", sales: 3100, quantity: 95 },
  { name: "Premium Pork Belly", sales: 5600, quantity: 18 },
  { name: "Fresh Bangus", sales: 6400, quantity: 20 },
]

export default function VendorAnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your store performance and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">₱52,000</p>
                <p className="mt-1 text-xs text-green-600">+15% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">245</p>
                <p className="mt-1 text-xs text-green-600">+12 this week</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Customers</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="mt-1 text-xs text-green-600">+8% growth</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </Card>
        </div>

        {/* Sales Trend */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="var(--color-primary)" name="Sales (₱)" />
              <Line type="monotone" dataKey="orders" stroke="var(--color-accent)" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="var(--color-primary)" name="Sales (₱)" />
              <Bar dataKey="quantity" fill="var(--color-accent)" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Product Performance Table */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Product Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Sales</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold">₱{product.sales}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.quantity}</td>
                    <td className="px-4 py-3 text-sm text-foreground">4.8/5.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}