"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Check, Circle } from "lucide-react"
import Link from "next/link"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  link?: string
  icon?: React.ReactNode
}

interface SetupChecklistProps {
  items?: ChecklistItem[]
}

export function SetupChecklist({
  items = [
    {
      id: "shop",
      title: "Open Your Shop",
      description: "SCRUM-21: Make your shop visible to local buyers",
      completed: false,
      icon: "🏪",
    },
    {
      id: "stall",
      title: "Create Virtual Stall Profile",
      description: "SCRUM-9: Set up your stall so customers can recognize you",
      completed: false,
      link: "/vendor/store",
      icon: "👤",
    },
    {
      id: "products",
      title: "Add Product Listings",
      description: "SCRUM-22: Create your first products",
      completed: false,
      icon: "📦",
    },
    {
      id: "checkout",
      title: "Setup Payment & Delivery",
      description: "Configure how customers will pay and receive items",
      completed: false,
      icon: "💳",
    },
  ],
}: SetupChecklistProps) {
  const completedCount = items.filter((item) => item.completed).length
  const completionPercentage = Math.round((completedCount / items.length) * 100)

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Seller Onboarding Checklist</h3>
        <p className="mt-1 text-sm text-muted-foreground">Complete these steps to get the most out of Tinda</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1 shrink-0">
              {item.completed ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <h4
                className={`font-semibold ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.title}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>

            {item.link && !item.completed && (
              <Link href={item.link}>
                <button className="ml-2 text-xs font-medium text-primary hover:underline whitespace-nowrap">
                  Go →
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
