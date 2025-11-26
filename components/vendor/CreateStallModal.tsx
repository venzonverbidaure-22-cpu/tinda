"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CurrentUser } from "@/lib/utils"

interface CreateStallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStallModal({ isOpen, onClose }: CreateStallModalProps) {
  const [stallData, setStallData] = useState({
    stall_name: "",
    stall_description: "",
    category: "",
    stall_address: "",
    stall_city: "",
    stall_state: "", // Fixed: matches backend field name
    stall_zipcode: "",
    stall_country: "Philippines",
  })
  const [stallImages, setStallImages] = useState({
    icon: null as File | null,
    banner: null as File | null,
  })
  const [preview, setPreview] = useState({
    icon: "",
    banner: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview.icon) URL.revokeObjectURL(preview.icon);
      if (preview.banner) URL.revokeObjectURL(preview.banner);
    };
  }, [preview.icon, preview.banner]);

  const handleChange = (field: string, value: string) => {
    setStallData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "icon" | "banner", file: File | null) => {
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert("❌ Please upload only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ Image size should be less than 5MB");
        return;
      }
      
      setStallImages((prev) => ({ ...prev, [field]: file }))
      setPreview((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }))
    }
  }

  const handleSubmit = async () => {
  const currentUser = CurrentUser();
  console.log("Current user:", currentUser);
  

  const userId = currentUser?.id;
  console.log("Current user ID:", userId);
   
  if (!userId) {
    alert("Please login to create a stall");
    return;
  }

  // Validate required fields
  if (!stallData.stall_name || !stallData.category || 
      !stallData.stall_description || !stallData.stall_address) {
    alert("❌ Please fill in all required fields (Name, Category, Description, Address)");
    return;
  }

  setIsSubmitting(true);
  try {
    // Get the JWT token from storage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("JWT Token:", token); // Debug: check if token exists
      console.log("=== TOKEN ANALYSIS ===");
      console.log("Full token:", token);
    if (!token) {
      alert("❌ Authentication token not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    
    // Append all stall data
    Object.entries(stallData).forEach(([key, value]) => formData.append(key, value));
    
    // Append user_id
    formData.append("user_id", userId.toString());

    // Append images with correct field names
    if (stallImages.icon) formData.append("icon_image", stallImages.icon);
    if (stallImages.banner) formData.append("banner_image", stallImages.banner);

    // Debug: log what's being sent
    console.log("FormData contents:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // ✅ CRITICAL: Add Authorization header with Bearer token
    const res = await axios.post("http://localhost:3001/api/stalls", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}` // This is what fixes the 401 error
      },
    });

    alert("✅ Stall created successfully!");
    console.log(res.data);
    onClose();
    window.location.href = "/vendor/dashboard";

    // Reset form
    setStallData({
      stall_name: "",
      stall_description: "",
      // vendor_contact: "", // Add this if missing.
      category: "",
      stall_address: "",
      stall_city: "",
      stall_state: "",
      stall_zipcode: "",
      stall_country: "Philippines",
    });
    setStallImages({ icon: null, banner: null });
    setPreview({ icon: "", banner: "" });
  } catch (error: any) {
    console.error("Error creating stall:", error);
    
    // Better error handling
    if (error.response?.status === 401) {
      alert("❌ Authentication failed. Please log in again.");
    } else if (error.response?.data?.error) {
      alert(`❌ ${error.response.data.error}`);
    } else {
      alert("❌ Error creating stall. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            🏪 Create Your Stall
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Image Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon Image</Label>
              {preview.icon && (
                <img
                  src={preview.icon}
                  alt="Icon Preview"
                  className="rounded-lg w-full h-32 object-cover border"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("icon", e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Banner Image</Label>
              {preview.banner && (
                <img
                  src={preview.banner}
                  alt="Banner Preview"
                  className="rounded-lg w-full h-32 object-cover border"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("banner", e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* Stall Info */}
          <div className="space-y-2">
            <Label>Stall Name *</Label>
            <Input
              value={stallData.stall_name}
              onChange={(e) => handleChange("stall_name", e.target.value)}
              placeholder="e.g. Lola's BBQ & Grill"
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={stallData.stall_description}
              onChange={(e) => handleChange("stall_description", e.target.value)}
              placeholder="Describe your stall and what makes it special"
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Address *</Label>
            <Input
              value={stallData.stall_address}
              onChange={(e) => handleChange("stall_address", e.target.value)}
              placeholder="Enter full street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={stallData.stall_city}
                onChange={(e) => handleChange("stall_city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label>State/Province</Label>
              <Input
                value={stallData.stall_state}
                onChange={(e) => handleChange("stall_state", e.target.value)}
                placeholder="State or Province"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Zip Code</Label>
            <Input
              value={stallData.stall_zipcode}
              onChange={(e) => handleChange("stall_zipcode", e.target.value)}
              placeholder="Zip code"
            />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={stallData.stall_country} disabled />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-lg font-semibold"
          >
            {isSubmitting ? "Creating..." : "Create Stall"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}