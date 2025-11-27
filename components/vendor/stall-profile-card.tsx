"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Edit, CheckCircle, ChevronsUpDown } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import axios from "axios"
import { API_BASE_URL, CurrentUser } from "@/lib/utils"

const BACKEND_URL = API_BASE_URL

interface Stall {
  stall_id: string;
  stall_name: string;
  stall_description: string;
  icon_url?: string;
}

export function StallProfileCard() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const currentUser = CurrentUser()
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

         if (!currentUser?.id || !token) {
          console.error("User not authenticated");
          setStalls([]);
          return;
        }

         const response = await axios.get(`${BACKEND_URL}/api/stalls/vendor/${currentUser.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log("Stalls response:", response.data);

        const sortedStalls = response.data.sort((a: Stall, b: Stall) => a.stall_name.localeCompare(b.stall_name));
        setStalls(sortedStalls);

       
        let stallToSelect: Stall | null = null;

        // 1. Try to get from localStorage
        const savedStallId = localStorage.getItem("selectedStallId");
        if (savedStallId) {
          stallToSelect = sortedStalls.find((s: Stall) => String(s.stall_id) === savedStallId) || null;
        }

        // 2. If not found in localStorage, use the first stall
        if (!stallToSelect && sortedStalls.length > 0) {
          stallToSelect = sortedStalls[0];
          // Save it to localStorage for next time
          localStorage.setItem("selectedStallId", stallToSelect!.stall_id);
        }

        setSelectedStall(stallToSelect);

      } catch (error: any) {
        console.error("Error fetching stalls:", error);
        console.error("Error details:", error.response?.data);
        setStalls([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStalls();
  }, []);

  const handleStallChange = (stallId: string) => {
    const stall = stalls.find((s) => String(s.stall_id) === stallId);
    setSelectedStall(stall || null);
    if (stall) {
      localStorage.setItem("selectedStallId", stall.stall_id);
    }
  };



  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">Virtual Stall Profile</h3>
            {selectedStall && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Customers recognize and visit your shop through your stall profile
          </p>
        </div>
        <div className="w-48">
          <Select onValueChange={handleStallChange} value={String(selectedStall?.stall_id)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a stall" />
            </SelectTrigger>
            <SelectContent>
              {stalls.map((stall) => (
                <SelectItem key={stall.stall_id} value={String(stall.stall_id)}>
                  {stall.stall_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 w-20 h-20 flex items-center justify-center">
              {selectedStall?.icon_url ? (
                <img
                  src={`${BACKEND_URL}/${selectedStall.icon_url}`}
                  alt="Stall Icon"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <User className="h-12 w-12 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{selectedStall?.stall_name}</h4>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{selectedStall?.stall_description}</p>
            </div>
          </div>
        </div>



        {/* Missing Items */}
        {selectedStall && (!selectedStall.stall_name || !selectedStall.stall_description) && (
          <div className="space-y-2 rounded-lg bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-900">Complete these to boost visibility:</p>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• Add store logo/avatar</li>
              <li>• Add operating hours</li>
              <li>• Add delivery information</li>
            </ul>
          </div>
        )}

        <Link href={`/vendor/store/${selectedStall?.stall_id}`} className="w-full">
          <Button variant="outline" className="w-full bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            {selectedStall ? "Update Profile" : "Complete Profile"}
          </Button>
        </Link>
      </div>
    </Card>
  )
}


