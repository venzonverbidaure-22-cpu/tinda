"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap } from "lucide-react"
import { useState } from "react"
import { AddProductModal } from "./add-product-modal"
import Link from "next/link"

interface ProductStats {
  total: number
  active: number
  inactive: number
  low_stock: number
}

interface ProductManagementCardProps {
  stats?: ProductStats
}

export function ProductManagementCard({
  stats = {
    total: 18,
    active: 16,
    inactive: 2,
    low_stock: 3,
  },
}: ProductManagementCardProps) {
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">Product Listings</h3>
              {/* <Badge variant="default">{stats.total}</Badge> */}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Display your items to potential buyers</p>
          </div>
          <Button onClick={() => setShowAddProduct(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>



        {/* Quick Actions */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/vendor/products" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Manage All Products
            </Button>
          </Link>
          <Button onClick={() => setShowAddProduct(true)} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </Card>

      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
    </>
  )
}
