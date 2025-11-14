"use client"

import { useEffect, useState } from "react"
import { Vendor } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/buyer/product-card"
import { Card } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"
import { useParams } from "next/navigation"

export default function VendorPage() {
  const params = useParams()
  const id = params.id
  const [vendor, setVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        try {
          const response = await fetch(`/api/stalls/${id}`)
          const data = await response.json()
          setVendor(data)
          console.log("Vendor data:", data);
        } catch (error) {
          console.error("Error fetching vendor:", error)
        }
      }

      fetchVendor()
    }
  }, [id])

  if (!vendor) {
    return <div>Loading...</div>
  }

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    const cleanPath = imagePath.replace(/\\/g, '/');
    const filename = cleanPath.replace(/^uploads\//, '');
    const finalUrl = `http://localhost:3001/uploads/${filename}`;
    console.log("Generated image URL:", finalUrl);
    return finalUrl;
  };

  const bannerUrl = getImageUrl(vendor.banner_photo);
  const iconUrl = getImageUrl(vendor.stall_icon);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="space-y-8 px-6 py-8">
        <Card className="overflow-hidden">
          <div className="relative h-48 w-full bg-muted">
            <img 
              src={bannerUrl} 
              alt={vendor.stall_name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <img
                src={iconUrl}
                alt={vendor.stall_name}
                className="h-24 w-24 rounded-full border-4 border-primary object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{vendor.stall_name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span>{vendor.rating || "No ratings"}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{vendor.location}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">{vendor.stall_description}</p>
          </div>
        </Card>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Products</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* {vendor.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))} */}
          </div>
        </div>
      </div>
    </main>
  )
}