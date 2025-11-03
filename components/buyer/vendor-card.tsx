"use client"

import type { Vendor } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"
import Link from "next/link"

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendor/${vendor.stall_id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
        {/* Banner */}
        <div className="relative h-32 w-full bg-muted">
          <img src={vendor.banner_photo || "/placeholder.svg"} alt={vendor.stall_name} className="h-full w-full object-cover" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <img
              src={vendor.stall_icon || "/placeholder.svg"}
              alt={vendor.stall_name}
              className="h-12 w-12 rounded-full border-2 border-primary"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{vendor.stall_name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span>{vendor.rating}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{vendor.location}</span>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{vendor.stall_description}</p>

          {/* CTA */}
          <Button className="mt-4 w-full" size="sm">
            View Stall
          </Button>
        </div>
      </Card>
    </Link>
  )
}
