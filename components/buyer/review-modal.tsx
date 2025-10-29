"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Star } from "lucide-react"

interface ReviewModalProps {
  orderId: string
  vendorName: string
  onClose: () => void
}

export function ReviewModal({ orderId, vendorName, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate review submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onClose()
    alert("Review submitted successfully!")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Leave a Review</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Vendor Name */}
        <p className="mt-2 text-sm text-muted-foreground">Reviewing: {vendorName}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-foreground">Rating</label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`h-8 w-8 ${star <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-foreground">Your Review</label>
            <textarea
              placeholder="Share your experience with this vendor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
