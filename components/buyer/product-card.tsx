"use client"

import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context"
import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useApp()
  const [isAdded, setIsAdded] = useState(false)

  const isInCart = cart.some((item) => item.productId === product.id)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      vendorId: product.vendorId,
      quantity: 1,
      price: product.price,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Product Image */}
      <div className="relative h-40 w-full bg-muted">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        {/* Price and Stock */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">₱{product.price}</p>
            <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="mt-4 w-full"
          size="sm"
          onClick={handleAddToCart}
          variant={isInCart || isAdded ? "secondary" : "default"}
        >
          {isInCart || isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
