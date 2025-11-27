"use client"

import { EnhancedVendorDashboard } from "@/components/vendor/enhanced-vendor-dashboard"
import { Navbar } from "@/components/navbar"

export default function VendorDashboardPage() {
  return (
    <>
      <Navbar />
      <EnhancedVendorDashboard />
    </>
  )
}
