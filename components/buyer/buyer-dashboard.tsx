"use client"

import { useApp } from "@/lib/context"
import { Vendor } from "@/lib/types"
import { VendorCard } from "./vendor-card"
import { LoyaltyWidget } from "./loyalty-widget"
import { LocationSelector } from "@/components/location-selector"
import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/utils"

// Market data that matches what you used in CreateStallModal
const ILOILO_MARKETS = [
  "Iloilo Central Market, J.M. Basa St, Iloilo City Proper",
  "Jaro Plaza Market, Jaro, Iloilo City", 
  "La Paz Public Market, Rizal St, La Paz, Iloilo City",
  "Mandurriao Public Market, Benigno Aquino Ave, Mandurriao",
  "Arevalo Public Market, Arevalo, Iloilo City"
];

export function BuyerDashboard() {
  const { currentUser, selectedLocation } = useApp()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  
  console.log("this is the current", currentUser) 
  console.log("Selected location:", selectedLocation)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stalls`)
        const data = await response.json()
        setVendors(data)
        setFilteredVendors(data) // Initially show all vendors
      } catch (error) {
        console.error("Error fetching vendors:", error)
      }
    }

    fetchVendors()
  }, [])

  // Filter vendors when selectedLocation changes
  useEffect(() => {
    if (!selectedLocation) {
      // If no location selected, show all vendors
      setFilteredVendors(vendors)
    } else {
      // Find the full market address that matches the selected location
      const selectedMarket = ILOILO_MARKETS.find(market => 
        market.toLowerCase().includes(selectedLocation.toLowerCase())
      )
      
      if (selectedMarket) {
        // Filter vendors by the full market address
        const filtered = vendors.filter(vendor => 
          vendor.location?.toLowerCase().includes(selectedMarket.toLowerCase())
        )
        setFilteredVendors(filtered)
      } else {
        // Fallback: try partial matching
        const filtered = vendors.filter(vendor => 
          vendor.location?.toLowerCase().includes(selectedLocation.toLowerCase())
        )
        setFilteredVendors(filtered)
      }
    }
  }, [selectedLocation, vendors])

  console.log("All vendors:", vendors)
  console.log("Filtered vendors:", filteredVendors)

  return (
    <div className="space-y-8 px-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentUser?.full_name}!</h1>
          <p className="mt-1 text-muted-foreground">
            {selectedLocation ? `Shopping in ${selectedLocation}` : "Select a location to get started"}
            {selectedLocation && ` (${filteredVendors.length} vendors found)`}
          </p>
        </div>
        <LocationSelector />
      </div>

      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-r from-primary/10 to-accent/10 p-8">
        <h2 className="text-2xl font-bold text-foreground">Discover Fresh Products</h2>
        <p className="mt-2 text-muted-foreground">
          {selectedLocation 
            ? `Browse fresh products from local vendors in ${selectedLocation}`
            : "Browse fresh products from local vendors in your area"
          }
        </p>
        <Link href="/products">
          <button className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
            Browse All Products
          </button>
        </Link>
      </div>

      {/* Loyalty Widget */}
      

      {/* Vendors Grid */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          {selectedLocation ? `Vendors in ${selectedLocation}` : "Featured Vendors"}
        </h2>
        
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {selectedLocation 
                ? `No vendors found in ${selectedLocation}. Try selecting a different location.`
                : "No vendors available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.stall_id} vendor={vendor}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}