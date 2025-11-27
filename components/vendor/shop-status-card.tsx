"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShopStatusCardProps {
  shopStatus?: "active" | "inactive" | "pending"
  userId?: number
  openCreateStallModal: () => void
  onStatusChange: (status: "active" | "inactive") => void
}

function ShopStatusDropdown({
  status,
  onStatusChange,
}: {
  status: "active" | "inactive" | "pending"
  onStatusChange: (status: "active" | "inactive") => void
}) {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-auto">
        <SelectValue>
          {status === "pending" ? "Pending" : status === "active" ? "Active" : "Inactive"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function ShopStatusCard({
  shopStatus = "inactive",
  userId,
  openCreateStallModal,
  onStatusChange,
}: ShopStatusCardProps) {
  const [isOpening, setIsOpening] = useState(false)

  const statusConfig = {
    active: {
      icon: CheckCircle,
      color: "text-green-600",
      badge: "Active",
      badgeVariant: "default" as const,
      message: "Your shop is visible to buyers",
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
      message: "Your shop is under review and not visible to buyers",
    },
  }

  const config = statusConfig[shopStatus]
  const Icon = config.icon

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
              <ShopStatusDropdown
                status={shopStatus}
                onStatusChange={onStatusChange}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={openCreateStallModal} className="w-full">
          Create Stall
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          You can create and manage multiple stalls.
        </p>
      </div>
    </Card>
  )
}
