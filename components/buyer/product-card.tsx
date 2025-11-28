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

  // Debug: Log the entire product object to see its structure
  console.log("Full product object for debugging:", product)

  // ✅ FIXED: Match the actual API response structure
  const getImageUrl = (imagePath: string | null | undefined) => {
    console.log("Product image data:", {
      rawImagePath: imagePath,
      itemId: product.item_id
    })
    
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      console.log("No valid product image path provided")
      return "/placeholder.svg"
    }
    
    // If it's already a full URL (starts with http), return it directly
    if (imagePath.startsWith('http')) {
      console.log("Already a full URL, returning directly:", imagePath)
      return imagePath
    }
    
    // Handle local file paths
    const cleanPath = imagePath.replace(/\\/g, '/')
    const filename = cleanPath.replace(/^uploads\//, '')
    const finalUrl = `${API_BASE_URL}/uploads/${filename}`
    
    console.log("Processed image URL:", finalUrl)
    
    return finalUrl
  }

  // ✅ FIXED: Use the correct properties from your ACTUAL API response
  const productImageUrl = getImageUrl(
    product.image_url || // This is the actual property from your API
    product.product_image || 
    product.item_image || 
    product.image || 
    null
  )

  // ✅ FIXED: Get product name with correct property names
  const productName = 
    product.item_name || // This is the actual property from your API
    product.product_name || 
    product.name || 
    "Unnamed Product"

  // ✅ FIXED: Get description with correct property names
  const productDescription = 
    product.item_description || // This is the actual property from your API
    product.description || 
    product.product_description || 
    ""

  // ✅ FIXED: Get stock with correct property names
  const stockQuantity = 
    product.item_stocks || // This is the actual property from your API
    product.stock || 
    product.stock_quantity || 
    product.quantity || 
    0

  // ✅ FIXED: Proper out of stock detection
  const isOutOfStock = product.in_stock === false || stockQuantity <= 0

  // ✅ FIXED: Get correct ID - using item_id from your API response
  const itemId = product.item_id || parseInt(product.product_id || product.id || "0")

  const isInCart = cart.some((item) => item.item_id === itemId)

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart({
        item_id: itemId,
        quantity: quantity,
      })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  // Convert price to number for display
  const displayPrice = parseFloat(product.price?.toString() || "0")

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-40 w-full bg-muted">
        {/* ✅ FIXED: Use the processed image URL */}
        <img 
          src={productImageUrl} 
          alt={productName} 
          className="h-full w-full object-cover"
          onError={(e) => {
            console.log("Product image failed to load, falling back to placeholder:", productImageUrl)
            e.currentTarget.src = "/placeholder.svg"
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
        {/* ✅ FIXED: Use the processed product name */}
        <h3 className="font-bold text-foreground">{productName}</h3>
        
        {/* ✅ FIXED: Use the processed description */}
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {productDescription || "No description available"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              ₱{displayPrice.toFixed(2)}
            </p>
            
            {/* ✅ FIXED: Proper stock display */}
            <p className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isOutOfStock ? 'Out of stock' : `${stockQuantity} in stock`}
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
              onClick={() => setQuantity(q => Math.min(stockQuantity, q + 1))}
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