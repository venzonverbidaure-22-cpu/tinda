"use client"

import { mockLoyaltyPoints } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, Zap } from "lucide-react"

export function LoyaltyWidget() {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "from-amber-600 to-amber-700"
      case "silver":
        return "from-slate-400 to-slate-500"
      case "gold":
        return "from-yellow-400 to-yellow-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getTierThreshold = (tier: string) => {
    switch (tier) {
      case "bronze":
        return 500
      case "silver":
        return 1000
      case "gold":
        return 2000
      default:
        return 500
    }
  }

  const nextTier = mockLoyaltyPoints.tier === "gold" ? "gold" : mockLoyaltyPoints.tier === "silver" ? "gold" : "silver"
  const nextThreshold = getTierThreshold(nextTier)
  const progressPercent = (mockLoyaltyPoints.points / nextThreshold) * 100

  return (
    <Card className={`bg-gradient-to-r ${getTierColor(mockLoyaltyPoints.tier)} p-6 text-white`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-bold">Suki Rewards</h3>
          </div>
          <p className="mt-1 text-sm opacity-90">
            {mockLoyaltyPoints.tier.charAt(0).toUpperCase() + mockLoyaltyPoints.tier.slice(1)} Member
          </p>
        </div>
        <Gift className="h-6 w-6" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span>Points</span>
          <span className="font-bold">{mockLoyaltyPoints.points}</span>
        </div>
        <Progress value={progressPercent} className="mt-2" />
        <p className="mt-1 text-xs opacity-90">
          {nextThreshold - mockLoyaltyPoints.points} points to {nextTier} tier
        </p>
      </div>
    </Card>
  )
}
