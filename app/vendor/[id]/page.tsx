"use client"

import { use, useEffect, useState } from "react"
import { Vendor, Product } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/buyer/product-card"

interface VendorPageProps {
  params: Promise<{ id: number }>
}

export default function VendorPage({ params }: VendorPageProps) {
  const { id } = use(params)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])

   const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    
    // Convert backslashes to forward slashes (Windows to URL format)
    const cleanPath = imagePath.replace(/\\/g, '/');
    
    // Remove 'uploads/' prefix if it exists
    const filename = cleanPath.replace(/^uploads\//, '');
    
    // Create proper URL for static file serving
    const finalUrl = `http://localhost:3001/uploads/${filename}`;
    
    console.log("Generated image URL:", finalUrl);
    return finalUrl;
  };
  
  useEffect(() => {
    const fetchVendorAndProducts = async () => {
      try {
        // Fetch vendor data
        const vendorResponse = await fetch(`http://localhost:3001/api/stalls/${id}`)
        const vendorData = await vendorResponse.json()
        setVendor(vendorData)
          console.log(vendorData)
          console.log(vendorData.banner_photo)
          console.log(vendorData.stall_icon)

        // Fetch products for the vendor
        const productsResponse = await fetch(`http://localhost:3001/api/products?stall_id=${id}`)
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (id) {
      fetchVendorAndProducts()
    }
  }, [id])
  
  if (!vendor) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center px-6 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
          </div>
        </div>
      </main>
    )
  }

  const bannerUrl = getImageUrl(vendor.banner_url); // Note: it's banner_url not banner_photo
  const iconUrl = getImageUrl(vendor.icon_url); // Note: it's icon_url not stall_icon

  console.log("Final image URLs:", { bannerUrl, iconUrl })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Link>

        {/* Vendor Banner */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
          <img src={bannerUrl || "/placeholder.svg"} alt={vendor.stall_name} className="h-full w-full object-cover" />
        </div>

        {/* Vendor Info */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-4">
              <img
                src={iconUrl || "/placeholder.svg"}
                alt={vendor.stall_name}
                className="h-20 w-20 rounded-full border-4 border-primary"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{vendor.stall_name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">{vendor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground">{vendor.stall_description}</p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground">Contact Information</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{vendor.vendor_contact}</span>
              </div>
              <Button className="w-full" size="sm">
                Message Vendor
              </Button>
            </div>
          </Card>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Available Products</h2>
          {products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No products available at this time</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
