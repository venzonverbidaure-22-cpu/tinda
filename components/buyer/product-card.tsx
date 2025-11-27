"use client"

import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context"
import { ShoppingCart, Check, X } from "lucide-react"
import { useState } from "react"
import { API_BASE_URL } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useApp()
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // ✅ ADD THIS FUNCTION (same as VendorCard)
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    
    // Convert backslashes to forward slashes (Windows to URL format)
    const cleanPath = imagePath.replace(/\\/g, '/');
    
    // Remove 'uploads/' prefix if it exists
    const filename = cleanPath.replace(/^uploads\//, '');
    
    // Create proper URL for static file serving
    const finalUrl = `${API_BASE_URL}/uploads/${filename}`;
    
    console.log("Generated product image URL:", finalUrl);
    return finalUrl;
  };

  // ✅ USE THE FUNCTION HERE
  const productImageUrl = getImageUrl(product.product_image);

  // Correct ID (stall_items.item_id)
  const itemId = parseInt(product.product_id)
  const isInCart = cart.some((item) => item.item_id === itemId)
  const isOutOfStock = !product.in_stock || product.stock === 0

  const handleAddToCart = () => {
    if (product.in_stock) {
      addToCart({
        item_id: itemId,
        quantity: quantity   
      })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-40 w-full bg-muted">
        {/* ✅ USE productImageUrl INSTEAD OF product.product_image */}
        <img 
          src={productImageUrl} 
          alt={product.product_name} 
          className="h-full w-full object-cover"
          onError={(e) => {
            console.log("Product image failed to load:", productImageUrl);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground">{product.product_name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">₱{product.price}</p>
            <p className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </p>
          </div>
        </div>

        {/* Quantity Selector - Only show if in stock */}
        {!isOutOfStock && (
          <div className="mt-3 flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={isOutOfStock}
            >
              -
            </Button>

            <span className="text-sm font-semibold w-6 text-center">{quantity}</span>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              disabled={isOutOfStock}
            >
              +
            </Button>
          </div>
        )}

        <Button
          className="mt-4 w-full"
          size="sm"
          onClick={handleAddToCart}
          variant={isOutOfStock ? "secondary" : (isInCart || isAdded ? "secondary" : "default")}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Unavailable
            </>
          ) : isInCart || isAdded ? (
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