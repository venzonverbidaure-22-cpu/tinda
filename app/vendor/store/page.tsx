"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VendorStorePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [storeData, setStoreData] = useState({
    name: "Lola's Fresh Produce",
    location: "Quiapo Market",
    description: "Fresh vegetables and fruits sourced daily from local farms",
    contactInfo: "09123456789",
  })

  const handleSave = () => {
    setIsEditing(false)
    alert("Store profile updated successfully!")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Store Profile</h1>
        </div>

        {/* Store Info Card */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Store Information</h2>
            <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="text-sm font-medium text-foreground">Store Name</label>
              <Input
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                value={storeData.location}
                onChange={(e) => setStoreData({ ...storeData, location: e.target.value })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                disabled={!isEditing}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                rows={4}
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="text-sm font-medium text-foreground">Contact Information</label>
              <Input
                value={storeData.contactInfo}
                onChange={(e) => setStoreData({ ...storeData, contactInfo: e.target.value })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
