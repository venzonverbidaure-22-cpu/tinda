"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getVendorOrders } from "@/lib/services/orderService"
import { getStallsByVendor } from "@/lib/services/stallService"
import { CurrentUser } from "@/lib/utils"
import { VendorOrdersTable } from "./vendor-orders-table"

export function AllOrders() {
  const [sort, setSort] = useState("newest")
  const [limit, setLimit] = useState("10")
  const [stall, setStall] = useState("")
  const [filters, setFilters] = useState<string[]>([])
  const [orders, setOrders] = useState([])
  const [stalls, setStalls] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)

  const currentUser = CurrentUser()

  useEffect(() => {
    if (currentUser) {
      getStallsByVendor(currentUser.id).then(setStalls)
    }
  }, [currentUser])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return

      const params: any = {
        sortBy: sort,
        limit: limit,
        page: page,
        category: filters,
      }
      if (stall) {
        params.stallId = stall
      }

      const data = await getVendorOrders(params)
      setOrders(data.orders)
      setTotalOrders(data.totalCount) 
    }

    fetchOrders()
  }, [sort, limit, stall, filters, page, currentUser])

  const handleAddFilter = (filter: string) => {
    if (filter && !filters.includes(filter)) {
      setFilters([...filters, filter])
    }
  }

  const handleRemoveFilter = (filterToRemove: string) => {
    setFilters(filters.filter((filter) => filter !== filterToRemove))
  }

  const handleClearFilters = () => {
    setFilters([])
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/vendor/dashboard">
            &larr; Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="date-updated">Date Updated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger>
              <SelectValue placeholder="Orders to display" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stall} onValueChange={setStall}>
            <SelectTrigger>
              <SelectValue placeholder="Select Stall" />
            </SelectTrigger>
            <SelectContent>
              {stalls.map((s) => (
                <SelectItem key={s.stall_id} value={s.stall_id.toString()}>
                  {s.stall_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleAddFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filters.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            {filters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => handleRemoveFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {filter}
              </Badge>
            ))}
          </div>
        )}

        <VendorOrdersTable orders={orders} />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page {page} of {Math.ceil(totalOrders / Number(limit))}</span>
          <Button
            disabled={page * Number(limit) >= totalOrders}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
