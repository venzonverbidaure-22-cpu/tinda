"use client"

import { useApp } from "@/lib/context"
import { mockVendors } from "@/lib/mock-data"
import { VendorCard } from "./vendor-card"
import { LoyaltyWidget } from "./loyalty-widget"
import { LocationSelector } from "@/components/location-selector"
import Link from "next/link"

export function BuyerDashboard() {
  const { currentUser, selectedLocation } = useApp()

  return (
    <div className="space-y-8 px-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentUser?.name?.split(" ")[0]}!</h1>
          <p className="mt-1 text-muted-foreground">
            {selectedLocation ? `Shopping in ${selectedLocation}` : "Select a location to get started"}
          </p>
        </div>
        <LocationSelector />
      </div>

      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-8">
        <h2 className="text-2xl font-bold text-foreground">Discover Fresh Products</h2>
        <p className="mt-2 text-muted-foreground">Browse fresh products from local vendors in your area</p>
        <Link href="/products">
          <button className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
            Browse All Products
          </button>
        </Link>
      </div>

      {/* Loyalty Widget */}
      <LoyaltyWidget />

      {/* Vendors Grid */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-foreground">Featured Vendors</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  )
}
