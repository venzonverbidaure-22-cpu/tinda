"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface ReplyModalProps {
  reviewId: string
  onClose: () => void
}

export function ReplyModal({ reviewId, onClose }: ReplyModalProps) {
  const [reply, setReply] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate reply submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onClose()
    alert("Reply submitted successfully!")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Reply to Review</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Reply Text */}
          <div>
            <label className="text-sm font-medium text-foreground">Your Reply</label>
            <textarea
              placeholder="Thank you for your review! Share your response..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
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
              {isSubmitting ? "Submitting..." : "Submit Reply"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}