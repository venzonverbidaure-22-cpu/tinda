"use client"

import { useApp } from "@/lib/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

// Match the exact same structure from CreateStallModal
const ILOILO_MARKETS = [
  "Iloilo Central Market, J.M. Basa St, Iloilo City Proper",
  "Jaro Plaza Market, Jaro, Iloilo City", 
  "La Paz Public Market, Rizal St, La Paz, Iloilo City",
  "Mandurriao Public Market, Benigno Aquino Ave, Mandurriao",
  "Arevalo Public Market, Arevalo, Iloilo City"
];

// Helper function to extract display name (first part before comma)
const getDisplayName = (fullAddress: string) => {
  return fullAddress.split(',')[0];
}

// Helper function to extract region (second part after comma)
const getRegion = (fullAddress: string) => {
  const parts = fullAddress.split(',');
  return parts.length > 1 ? parts[1].trim() : 'Iloilo';
}

export function LocationSelector() {
  const { selectedLocation, setSelectedLocation } = useApp()

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-5 w-5 text-primary" />
      <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value === "all" ? "" : value)}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select market location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Markets</SelectItem>
          {ILOILO_MARKETS.map((marketAddress, index) => (
            <SelectItem key={index} value={marketAddress}>
              {getDisplayName(marketAddress)}, {getRegion(marketAddress)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}