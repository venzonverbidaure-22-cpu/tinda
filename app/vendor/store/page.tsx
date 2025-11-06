"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function VendorStorePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [storeData, setStoreData] = useState({
    name: "",
    location: "",
    description: "",
    contactInfo: "",
    category: "",
    icon_image: null,
    banner_image: null,
    icon_url: "",
    banner_url: "",
  })

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/stalls/1");
        const { stall_name, stall_address, stall_description, vendor_contact, category, icon_url, banner_url } = response.data;
        setStoreData({
          name: stall_name,
          location: stall_address,
          description: stall_description,
          contactInfo: vendor_contact,
          category: category,
          icon_url: icon_url,
          banner_url: banner_url,
        });
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("stall_name", storeData.name);
      formData.append("stall_address", storeData.location);
      formData.append("stall_description", storeData.description);
      formData.append("vendor_contact", storeData.contactInfo);
      formData.append("category", storeData.category);
      if (storeData.icon_image) {
        formData.append("icon_image", storeData.icon_image);
      }
      if (storeData.banner_image) {
        formData.append("banner_image", storeData.banner_image);
      }

      const response = await axios.patch("http://localhost:3001/api/stalls/1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsEditing(false)
      alert("Store profile updated successfully!")
    } catch (error) {
      console.error("Error updating store data:", error);
      alert("Error updating store data. Please try again.");
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

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={storeData.category}
                onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                disabled={!isEditing}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
              >
                <option value="Food">Food</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Icon Image */}
            <div>
              <label className="text-sm font-medium text-foreground">Icon Image</label>
              <Input
                type="file"
                onChange={(e) => setStoreData({ ...storeData, icon_image: e.target.files?.[0] })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="text-sm font-medium text-foreground">Banner Image</label>
              <Input
                type="file"
                onChange={(e) => setStoreData({ ...storeData, banner_image: e.target.files?.[0] })}
                disabled={!isEditing}
                className="mt-2"
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
