"use client"

import { Navbar } from "@/components/navbar"
import * as mockData from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReviewsPage() {
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
          <h1 className="mt-4 text-3xl font-bold text-foreground">My Reviews</h1>
          <p className="text-muted-foreground">Manage and view your vendor reviews</p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {mockData.mockReviews.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Complete an order to leave a review.</p>
            </Card>
          ) : (
            mockData.mockReviews.map((review) => {
              const vendor = mockData.mockVendors.find((v) => v.id.toString() === review.vendorId)
              return (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Review Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{vendor?.name}</h3>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-2">
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
                        <span className="text-sm font-medium text-foreground">{review.rating}.0</span>
                      </div>

                      {/* Comment */}
                      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>

                      {/* Date */}
                      <p className="mt-2 text-xs text-muted-foreground">{review.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
