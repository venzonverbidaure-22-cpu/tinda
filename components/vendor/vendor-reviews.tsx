"use client"

import { mockReviews } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageCircle } from "lucide-react"
import { useState } from "react"
import { ReplyModal } from "./reply-modal"

export function VendorReviews() {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {mockReviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">{review.rating}.0</span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                By: Maria Santos • {review.createdAt.toLocaleDateString()}
              </p>
            </div>

            {/* Reply Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedReviewId(review.id)}
              className="flex-shrink-0"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </div>
        </Card>
      ))}

      {selectedReviewId && <ReplyModal reviewId={selectedReviewId} onClose={() => setSelectedReviewId(null)} />}
    </div>
  )
}
