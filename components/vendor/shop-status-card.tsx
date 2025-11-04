"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

interface ShopStatusCardProps {
  shopStatus?: "active" | "inactive" | "pending"
}

export function ShopStatusCard({ shopStatus = "inactive" }: ShopStatusCardProps) {
  const [isOpening, setIsOpening] = useState(false)

  const statusConfig = {
    active: {
      icon: CheckCircle,
      color: "text-green-600",
      badge: "Active",
      badgeVariant: "default" as const,
      message: "Your shop is live and accepting orders",
    },
    inactive: {
      icon: AlertCircle,
      color: "text-amber-600",
      badge: "Inactive",
      badgeVariant: "secondary" as const,
      message: "Your shop is not visible to buyers",
    },
    pending: {
      icon: AlertCircle,
      color: "text-blue-600",
      badge: "Pending",
      badgeVariant: "secondary" as const,
      message: "Your shop is under review",
    },
  }

  const config = statusConfig[shopStatus]
  const Icon = config.icon

  const handleOpenShop = async () => {
    setIsOpening(true)
    // Frontend state only - backend integration will go here
    console.log("[v0] Opening shop...")
    setTimeout(() => {
      setIsOpening(false)
      alert("Shop opened successfully!")
    }, 1000)
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-background p-3">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">Shop Status</h3>
              <Badge variant={config.badgeVariant}>{config.badge}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>
      </div>

      {shopStatus === "inactive" && (
        <div className="mt-6">
          <Button onClick={handleOpenShop} disabled={isOpening} className="w-full">
            {isOpening ? "Opening Shop..." : "Open Shop"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Your shop will be visible to local buyers once opened. You can start listing products immediately.
          </p>
        </div>
      )}

      {shopStatus === "active" && (
        <div className="mt-4 space-y-2 rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">Ready to start selling!</p>
          <p className="text-xs text-green-700">Complete your stall profile and add products to boost visibility.</p>
        </div>
      )}
    </Card>
  )
}
