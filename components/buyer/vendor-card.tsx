"use client"

import type { Vendor } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/utils"

interface VendorCardProps {
  vendor: Vendor
}
 
export function VendorCard({ vendor }: VendorCardProps) {
  const router = useRouter()

  console.log("Vendor data:", vendor)
  console.log("Banner photo:", vendor.banner_photo)
  console.log("Stall icon:", vendor.stall_icon)

  // FIXED: Proper image URL handling for Cloudinary URLs
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      console.log("No image path provided")
      return "/placeholder.svg"
    }
    
    console.log("Original image path:", imagePath)
    
    // If it's already a full URL (starts with http), return it directly
    if (imagePath.startsWith('http')) {
      console.log("Already a full URL, returning directly:", imagePath)
      return imagePath
    }
    
    // Only process local file paths (for backward compatibility)
    const cleanPath = imagePath.replace(/\\/g, '/')
    const filename = cleanPath.replace(/^uploads\//, '')
    const finalUrl = `${API_BASE_URL}/uploads/${filename}`
    
    console.log("Cleaned path:", cleanPath)
    console.log("Filename:", filename)
    console.log("Final URL:", finalUrl)
    
    return finalUrl
  }

  const bannerUrl = getImageUrl(vendor.banner_photo)
  const iconUrl = getImageUrl(vendor.stall_icon)
  console.log("Vendor data:", vendor)
  console.log("Vendor stall_id:", vendor.stall_id, "Type:", typeof vendor.stall_id)

  const handleRedirect = () => {
    console.log("Redirecting to:", `/vendor/${vendor.stall_id}`)
    router.push(`/vendor/${vendor.stall_id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
      {/* Banner */}
      <div className="relative h-32 w-full bg-muted">
        <img 
          src={bannerUrl} 
          alt={vendor.stall_name} 
          className="h-full w-full object-cover"
          onError={(e) => {
            console.log("Banner image failed to load:", bannerUrl)
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <img
            src={iconUrl}
            alt={vendor.stall_name}
            className="h-12 w-12 rounded-full border-2 border-primary object-cover"
            onError={(e) => {
              console.log("Icon image failed to load:", iconUrl)
              e.currentTarget.src = "/placeholder.svg"
            }}
          />

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{vendor.stall_name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{vendor.rating || "No ratings"}</span>
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
        <Button className="mt-4 w-full" size="sm" onClick={handleRedirect}>
          View Stall
        </Button>
      </div>
    </Card>
  )
}