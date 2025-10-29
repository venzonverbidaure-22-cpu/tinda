"use client"

import { useApp } from "@/lib/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockLocations } from "@/lib/mock-data"
import { MapPin } from "lucide-react"

export function LocationSelector() {
  const { selectedLocation, setSelectedLocation } = useApp()

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-5 w-5 text-primary" />
      <Select value={selectedLocation || ""} onValueChange={setSelectedLocation}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {mockLocations.map((location) => (
            <SelectItem key={location.id} value={location.name}>
              {location.name}, {location.region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
