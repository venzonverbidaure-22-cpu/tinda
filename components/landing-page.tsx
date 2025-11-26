"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag, Store, TrendingUp, MapPin } from "lucide-react"
import { mockVendors } from "@/lib/mock-data"
import Image from "next/image"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center md:py-32">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to <span className="text-primary">Tinda</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            The Digital Palengke Experience — Connecting buyers and vendors through the spirit of Filipino local markets
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                icon: ShoppingBag,
                title: "Browse",
                description: "Explore local vendors and fresh products in your area",
              },
              {
                icon: MapPin,
                title: "Select Location",
                description: "Choose your barangay to see nearby tindahans",
              },
              {
                icon: TrendingUp,
                title: "Order",
                description: "Add items to cart and checkout securely",
              },
              {
                icon: Store,
                title: "Receive",
                description: "Get your order delivered or pick up at the stall",
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {/* <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold">Featured Vendors</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockVendors.map((vendor) => (
              <Card key={vendor.id} className="overflow-hidden">
                <div className="relative h-32 w-full bg-muted">
                  <Image src={vendor.banner_photo || "/placeholder.svg"} alt={vendor.full_name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 rounded-full bg-muted">
                      <Image
                        src={vendor.stall_icon|| "/placeholder.svg"}
                        alt={vendor.full_name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{vendor.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{vendor.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-500">★ {vendor.rating}</span>
                    <span className="text-muted-foreground">{vendor.totalSales} sales</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div> */}
      {/* </section> */}

      {/* CTA Section */}
      <section className="px-6 py-20 text-center md:py-32">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of buyers supporting local vendors in your community
          </p>
          <Link href="/signup">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 px-6 py-8 text-center text-sm text-muted-foreground">
        <p>Tinda © 2025 — Supporting Local, Empowering Communities</p>
      </footer>
    </div>
  )
}
