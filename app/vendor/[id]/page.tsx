"use client"

import { mockVendors, mockProducts } from "@/lib/mock-data"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/buyer/product-card"

interface VendorPageProps {
  params: Promise<{ id: string }>
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params
  const vendor = mockVendors.find((v) => v.id === id)
  const vendorProducts = mockProducts.filter((p) => p.vendorId === id)

  if (!vendor) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center px-6 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Vendor not found</h1>
            <Link href="/">
              <Button className="mt-4">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

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
          <img src={vendor.banner || "/placeholder.svg"} alt={vendor.name} className="h-full w-full object-cover" />
        </div>

        {/* Vendor Info */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-4">
              <img
                src={vendor.logo || "/placeholder.svg"}
                alt={vendor.name}
                className="h-20 w-20 rounded-full border-4 border-primary"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{vendor.name}</h1>
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
                <p className="mt-3 text-muted-foreground">{vendor.description}</p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground">Contact Information</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{vendor.contactInfo}</span>
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
          {vendorProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendorProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
