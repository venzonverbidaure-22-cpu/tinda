"use client"

import { useApp } from "@/lib/context"
import { Navbar } from "@/components/navbar"
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard"
import { VendorDashboard } from "@/components/vendor/vendor-dashboard"
import { LandingPage } from "@/components/landing-page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { userStatus, userRole } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (userStatus === "visitor") {
      // Show landing page for visitors
    }
  }, [userStatus, router])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {userStatus === "visitor" ? <LandingPage /> : userRole === "buyer" ? <BuyerDashboard /> : <VendorDashboard />}
    </main>
  )
}
