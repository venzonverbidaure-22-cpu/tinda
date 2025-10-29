"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ProductFilterProps {
  onFilterChange: (filters: { search: string; category: string; priceRange: [number, number] }) => void
}

const categories = ["All", "Vegetables", "Meat", "Seafood", "Condiments", "Fruits"]

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  const handleFilterChange = () => {
    onFilterChange({
      search,
      category: category === "All" ? "" : category,
      priceRange,
    })
  }

  const handleReset = () => {
    setSearch("")
    setCategory("All")
    setPriceRange([0, 1000])
    onFilterChange({ search: "", category: "", priceRange: [0, 1000] })
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-foreground">Search Products</label>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-foreground">Price Range</label>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 1000])}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleFilterChange} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
