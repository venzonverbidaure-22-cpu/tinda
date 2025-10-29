"use client"

import { Navbar } from "@/components/navbar"
import { mockLoyaltyPoints } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gift, Zap } from "lucide-react"
import Link from "next/link"

const rewards = [
  {
    id: 1,
    name: "₱100 Discount",
    points: 500,
    description: "Get ₱100 off your next purchase",
  },
  {
    id: 2,
    name: "Free Delivery",
    points: 300,
    description: "Free delivery on your next order",
  },
  {
    id: 3,
    name: "₱500 Voucher",
    points: 1000,
    description: "₱500 voucher for any vendor",
  },
  {
    id: 4,
    name: "Priority Support",
    points: 750,
    description: "Priority customer support for 1 month",
  },
]

export default function RewardsPage() {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-900"
      case "silver":
        return "bg-slate-100 text-slate-900"
      case "gold":
        return "bg-yellow-100 text-yellow-900"
      default:
        return "bg-gray-100 text-gray-900"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Suki Rewards Program</h1>
          <p className="text-muted-foreground">Earn points with every purchase and redeem amazing rewards</p>
        </div>

        {/* Current Status */}
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Points */}
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Current Points</p>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{mockLoyaltyPoints.points}</p>
            </div>

            {/* Tier */}
            <div>
              <p className="text-sm text-muted-foreground">Current Tier</p>
              <div
                className={`mt-2 inline-block rounded-full px-4 py-2 font-bold ${getTierColor(mockLoyaltyPoints.tier)}`}
              >
                {mockLoyaltyPoints.tier.charAt(0).toUpperCase() + mockLoyaltyPoints.tier.slice(1)}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Rewards Available</p>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {rewards.filter((r) => r.points <= mockLoyaltyPoints.points).length}
              </p>
            </div>
          </div>
        </Card>

        {/* Tier Benefits */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Tier Benefits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-600" />
                <h3 className="font-bold text-foreground">Bronze</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">0-500 points</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>1 point per ₱1 spent</li>
                <li>Birthday bonus</li>
              </ul>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-400" />
                <h3 className="font-bold text-foreground">Silver</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">500-1000 points</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>1.5 points per ₱1 spent</li>
                <li>Birthday bonus + gift</li>
                <li>Exclusive deals</li>
              </ul>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <h3 className="font-bold text-foreground">Gold</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">1000+ points</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>2 points per ₱1 spent</li>
                <li>VIP birthday gift</li>
                <li>Priority support</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Available Rewards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => {
              const canRedeem = mockLoyaltyPoints.points >= reward.points
              return (
                <Card key={reward.id} className={`p-6 ${!canRedeem ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{reward.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{reward.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{reward.points} points</span>
                      </div>
                    </div>
                  </div>
                  <Button disabled={!canRedeem} className="mt-4 w-full">
                    {canRedeem ? "Redeem" : "Not Enough Points"}
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-foreground">How It Works</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <p>Earn 1 point for every ₱1 you spend (more points for higher tiers)</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <p>Accumulate points to unlock higher tiers and exclusive benefits</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <p>Redeem your points for discounts, vouchers, and special perks</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
