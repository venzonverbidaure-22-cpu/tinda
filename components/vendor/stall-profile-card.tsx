"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Edit, CheckCircle } from "lucide-react"
import Link from "next/link"

interface StallProfileCardProps {
  stallData?: {
    stall_name: string;
    stall_description: string;
  } | null;
}

export function StallProfileCard({ stallData }: StallProfileCardProps) {
  const completionPercentage = stallData ? 100 : 60

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">Virtual Stall Profile</h3>
            {stallData && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Customers recognize and visit your shop through your stall profile
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Current Profile Preview */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{stallData?.stall_name}</h4>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{stallData?.stall_description}</p>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Profile Completion</span>
            <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Missing Items */}
        {stallData && (!stallData.stall_name || !stallData.stall_description) && (
          <div className="space-y-2 rounded-lg bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-900">Complete these to boost visibility:</p>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• Add store logo/avatar</li>
              <li>• Add operating hours</li>
              <li>• Add delivery information</li>
            </ul>
          </div>
        )}

        <Link href="/vendor/store" className="w-full">
          <Button variant="outline" className="w-full bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            {stallData ? "Update Profile" : "Complete Profile"}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
