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
  const [quantity, setQuantity] = useState(1)

  // Correct ID (stall_items.item_id)
  const itemId = parseInt(product.product_id)

  const isInCart = cart.some((item) => item.item_id === itemId)

  const handleAddToCart = () => {
    addToCart({
      item_id: itemId,
      quantity: quantity   
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }
  console.log("this is the product here 999999999999999999999999999999999999999999999999999",product)
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-40 w-full bg-muted">
        <img 
          src={product.product_image || "/placeholder.svg"} 
          alt={product.product_name} 
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground">{product.product_name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">₱{product.price}</p>
            <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mt-3 flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            -
          </Button>

          <span className="text-sm font-semibold w-6 text-center">{quantity}</span>

          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
          >
            +
          </Button>
        </div>

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
