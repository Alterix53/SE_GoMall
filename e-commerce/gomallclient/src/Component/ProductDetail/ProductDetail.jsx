"use client"

import React, { useState, useEffect, useMemo, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ProductDetail.css"
import { useCart } from "../../contexts/CartContext"
import {
  Star,
  StarHalf,
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  MessageCircle,
  Check,
  Minus,
  Plus,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  Clock,
  Package,
  Award,
} from "lucide-react"

import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Progress } from "../../components/ui/progress"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { useToast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { apiService } from "../../utils/api"
import OptimizedImage from "../../utils/OptimizedImage"
import { createPlaceholderUrl } from "../../utils/imageUtils"
import Footer from "../Footer/Footer"
import CartSuccessModal from "../CartSuccessModal/CartSuccessModal"

// Star Rating Component
function StarRating({
  rating = 0,
  size = 18,
  showValue = false,
}) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(full)].map((_, i) => (
        <Star key={"full-" + i} size={size} className="text-yellow-500 fill-yellow-500" />
      ))}
      {half && <StarHalf size={size} className="text-yellow-500 fill-yellow-500" />}
      {[...Array(empty)].map((_, i) => (
        <Star key={"empty-" + i} size={size} className="text-muted-foreground" />
      ))}
      {showValue && <span className="ml-2 text-sm">{rating.toFixed(1)}</span>}
    </div>
  )
}

// Format currency VND
function formatCurrencyVND(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0 
  }).format(value)
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addToCart, checkProductInventory } = useCart()

  // State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [selectedVariations, setSelectedVariations] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [shippingTo, setShippingTo] = useState("Hanoi")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedProduct, setAddedProduct] = useState(null)
  const [maxQuantity, setMaxQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Resolve image URL to absolute path (prefix server origin for relative paths)
  const resolveImageUrl = (image) => {
    try {
      if (!image) return "/images/placeholder-product.svg"
      const raw = typeof image === "string" ? image : image.url || ""
      if (!raw) return "/images/placeholder-product.svg"
      if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
      const base = "http://localhost:8080"
      return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`
    } catch {
      return "/images/placeholder-product.svg"
    }
  }

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("🔍 Fetching product with ID:", id)
        setLoading(true)
        setError(null)
        
        const response = await apiService.getProductById(id)
        console.log("📦 Product response:", response)
        
        if (response.success && response.data && response.data.product) {
          console.log("✅ Setting product data:", response.data.product)
          setProduct(response.data.product)
          
          // Set initial active image to main image
          if (response.data.product.images && response.data.product.images.length > 0) {
            const mainImageIndex = response.data.product.images.findIndex(img => img.isPrimary);
            setActiveImage(mainImageIndex >= 0 ? mainImageIndex : 0);
          }
          
          // Set default variations if available
          if (response.data.product.specifications) {
            const defaults = {}
            response.data.product.specifications.forEach(spec => {
              if (spec.name === 'color' || spec.name === 'storage' || spec.name === 'size') {
                const values = spec.value.split(',').map(v => v.trim())
                defaults[spec.name] = values[0]
              }
            })
            setSelectedVariations(defaults)
          }
        } else {
          console.log("❌ Invalid response format:", response)
          setError("Cannot load product information")
        }
      } catch (err) {
        console.error("💥 Error fetching product:", err)
        setError("An error occurred while loading product information")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      console.log("🚀 Starting fetch for product ID:", id)
      fetchProduct()
    } else {
      console.log("⚠️ No product ID provided")
    }
  }, [id])

  // Debug: Log current state
  useEffect(() => {
    console.log("🔄 Current state - loading:", loading, "error:", error, "product:", product);
    if (product) {
      console.log("🏪 Seller data:", product.sellerID);
      console.log("⭐ Rating data:", product.rating);
    }
  }, [loading, error, product]);

  // Check inventory when product is loaded
  useEffect(() => {
    const checkInventory = async () => {
      if (product && product._id) {
        try {
          const inventoryData = await checkProductInventory(product._id);
          if (inventoryData) {
            setMaxQuantity(inventoryData.availableQuantity);
            // Reset quantity if it exceeds available inventory
            if (quantity > inventoryData.availableQuantity) {
              setQuantity(Math.max(1, inventoryData.availableQuantity));
            }
          }
        } catch (error) {
          console.error("Error checking inventory:", error);
        }
      }
    };

    checkInventory();
  }, [product, checkProductInventory]);

  // Calculate final price and discount
  const finalPrice = useMemo(() => {
    if (!product) return 0
    return product.price?.sale || product.price?.original || 0
  }, [product])

  const discountPercent = useMemo(() => {
    if (!product?.price?.sale || !product?.price?.original) return 0
    return Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
  }, [product])

  // Rating distribution (fallback to design sample if not provided)
  const ratingDistribution = useMemo(() => {
    const defaultDist = { 5: 82, 4: 12, 3: 3, 2: 2, 1: 1 }
    const fromProduct = product?.rating?.distribution
    if (!fromProduct || !product?.rating?.count || product.rating.count === 0) {
      // Nếu không có review, hiển thị tất cả 0%
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
    // normalize keys as numbers and ensure percentages
    return {
      5: Number(fromProduct[5]) || 0,
      4: Number(fromProduct[4]) || 0,
      3: Number(fromProduct[3]) || 0,
      2: Number(fromProduct[2]) || 0,
      1: Number(fromProduct[1]) || 0,
    }
  }, [product])

  const onAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true);
    
    try {
      // Check inventory again before adding to cart
      const inventoryData = await checkProductInventory(product._id);
      if (!inventoryData || inventoryData.availableQuantity <= 0) {
        toast({
          title: "Out of stock!",
          description: "This product is no longer available",
          variant: "destructive",
        });
        return;
      }

      if (quantity > inventoryData.availableQuantity) {
        toast({
          title: "Insufficient stock!",
          description: `Only ${inventoryData.availableQuantity} items available`,
          variant: "destructive",
        });
        setQuantity(inventoryData.availableQuantity);
        return;
      }

      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price?.sale || product.price?.original || 0,
        image: resolveImageUrl(product.images?.[0]),
        quantity: quantity,
        size: 'default'
      }
      
      const result = await addToCart(cartItem);
      
      if (result.success) {
        // Show success modal instead of toast
        setAddedProduct(cartItem)
        setShowSuccessModal(true)
        
        // Update max quantity after successful add
        if (inventoryData) {
          setMaxQuantity(inventoryData.availableQuantity - quantity);
        }
      } else {
        // Handle specific inventory errors
        if (result.data?.availableQuantity !== undefined) {
          toast({
            title: "Stock updated!",
            description: `Only ${result.data.availableQuantity} items available now`,
            variant: "destructive",
          });
          setMaxQuantity(result.data.availableQuantity);
          if (quantity > result.data.availableQuantity) {
            setQuantity(result.data.availableQuantity);
          }
        } else {
          toast({
            title: "Error!",
            description: result.error || "An error occurred while adding to cart",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error!",
        description: "An error occurred while adding to cart",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false);
    }
  }

  const onBuyNow = async () => {
    if (!product) return
    
    setIsAddingToCart(true);
    
    try {
      // Check inventory again before buying
      const inventoryData = await checkProductInventory(product._id);
      if (!inventoryData || inventoryData.availableQuantity <= 0) {
        toast({
          title: "Out of stock!",
          description: "This product is no longer available",
          variant: "destructive",
        });
        return;
      }

      if (quantity > inventoryData.availableQuantity) {
        toast({
          title: "Insufficient stock!",
          description: `Only ${inventoryData.availableQuantity} items available`,
          variant: "destructive",
        });
        setQuantity(inventoryData.availableQuantity);
        return;
      }

      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price?.sale || product.price?.original || 0,
        image: resolveImageUrl(product.images?.[0]),
        quantity: quantity,
        size: 'default'
      }
      
      const result = await addToCart(cartItem);
      
      if (result.success) {
        // Navigate to checkout
        navigate(`/checkout?product=${product._id}&quantity=${quantity}`)
      } else {
        // Handle specific inventory errors
        if (result.data?.availableQuantity !== undefined) {
          toast({
            title: "Stock updated!",
            description: `Only ${result.data.availableQuantity} items available now`,
            variant: "destructive",
          });
          setMaxQuantity(result.data.availableQuantity);
          if (quantity > result.data.availableQuantity) {
            setQuantity(result.data.availableQuantity);
          }
        } else {
          toast({
            title: "Error!",
            description: result.error || "An error occurred while processing order",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error buying now:", error)
      toast({
        title: "Error!",
        description: "An error occurred while processing order",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false);
    }
  }

  const handleVariationChange = (type, value) => {
    setSelectedVariations(prev => ({
      ...prev,
      [type]: value
    }))
  }

  if (loading) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading product information...</span>
          </div>
        </main>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Cannot load product</h2>
        <p className="text-muted-foreground mb-4">{error || "Product does not exist"}</p>
        <Button onClick={() => navigate("/")}>Back to home</Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <main className="bg-gray-50 min-h-screen">

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Product Images */}
            <section>
              {/* Main Image */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <OptimizedImage
                      src={resolveImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      fallbackUrl={createPlaceholderUrl(600,600,'')}
                      onLoad={() => {}}
                      onError={() => {}}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Like Button */}
                  <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5",
                        liked ? "text-red-500 fill-red-500" : "text-gray-600"
                      )} 
                    />
                  </button>
          </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="mt-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={cn(
                            "flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 relative",
                            activeImage === index 
                              ? "border-primary ring-2 ring-primary/20" 
                              : "border-gray-200 hover:border-gray-300 hover:scale-105"
                          )}
                        >
                          <OptimizedImage
                            src={resolveImageUrl(image)}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                            fallbackUrl={createPlaceholderUrl(80,80,'')}
                            onLoad={() => {}}
                            onError={() => {}}
                          />
                          {/* Main image badge */}
                          {image.isPrimary && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                              Main
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Navigation arrows for mobile */}
                    {product.images.length > 4 && (
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                          disabled={activeImage === 0}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ←
                        </button>
                        <span className="text-sm text-gray-500 self-center">
                          {activeImage + 1} / {product.images.length}
                        </span>
                        <button
                          onClick={() => setActiveImage(Math.min(product.images.length - 1, activeImage + 1))}
                          disabled={activeImage === product.images.length - 1}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Right: Product Info & Actions */}
            <section>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                {/* Product Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & Sales */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.rating?.average || 0} size={20} />
                    <span className="font-semibold text-lg">
                      {product.rating?.average?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {product.rating?.count?.toLocaleString() || 0} Reviews
                  </div>
                  <div className="text-gray-600">
                    Sold {product.sold?.toLocaleString() || 0}+
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl lg:text-5xl font-bold text-red-600">
                      {formatCurrencyVND(finalPrice)}
                    </span>
                    {product.price?.sale && product.price?.original && product.price.sale < product.price.original && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatCurrencyVND(product.price.original)}
                        </span>
                        <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full">
                          -{discountPercent}%
                        </Badge>
                    </>
                  )}
                </div>

                  {/* Promotions */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Tag className="w-3 h-3 mr-1" />
                      Save 50k for orders from 5M
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Voucher 10% up to 500k
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Cashback 5%
                    </Badge>
                  </div>

                  {/* Flash Sale */}
                  {product.isFlashSale && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Flash Sale - Ends: {product.flashSaleEndDate ? 
                          new Date(product.flashSaleEndDate).toLocaleDateString('vi-VN') : 
                          '10/8/2025'
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Variations */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {product.specifications.map((spec, index) => {
                      if (spec.name === 'color' || spec.name === 'storage' || spec.name === 'size') {
                        const values = spec.value.split(',').map(v => v.trim())
                        const currentValue = selectedVariations[spec.name] || values[0]
                        
                        return (
                          <div key={index}>
                                                         <Label htmlFor={`${spec.name}-label`} className="text-base font-medium text-gray-900 mb-3 block">
                                               {spec.name === 'color' ? 'Color' :
                spec.name === 'storage' ? 'Storage' :
                spec.name === 'size' ? 'Size' : spec.name}
                             </Label>
                            <RadioGroup 
                              value={currentValue} 
                              onValueChange={(value) => handleVariationChange(spec.name, value)}
                              className="flex flex-wrap gap-2"
                            >
                              {values.map((value) => (
                                <Label
                                  key={value}
                                  htmlFor={`${spec.name}-${value}`}
                                  className={cn(
                                    "cursor-pointer border rounded-lg px-4 py-2 text-sm font-medium transition-all min-w-[80px] text-center",
                                    currentValue === value 
                                      ? "border-black bg-black text-white" 
                                      : "border-gray-300 hover:border-gray-400 bg-white text-gray-900"
                                  )}
                                >
                                  <RadioGroupItem id={`${spec.name}-${value}`} value={value} className="sr-only" />
                                  {value}
                                </Label>
                              ))}
                            </RadioGroup>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                                     <Label htmlFor="quantity-input" className="text-base font-medium text-gray-900 mb-3 block">
                     Quantity
                   </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-r-none border-0 hover:bg-gray-100 px-3 py-2"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                                             <Input
                         id="quantity-input"
                         inputMode="numeric"
                         value={quantity}
                         onChange={(e) => {
                           const n = Number.parseInt(e.target.value || "1", 10)
                           if (!Number.isNaN(n)) {
                             const clampedValue = Math.max(1, Math.min(n, maxQuantity));
                             setQuantity(clampedValue);
                           }
                         }}
                         className="w-20 text-center border-0 rounded-none focus:ring-0 font-medium"
                         min="1"
                         max={maxQuantity}
                         aria-live="polite"
                       />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-l-none border-0 hover:bg-gray-100 px-3 py-2"
                        onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                        disabled={quantity >= maxQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {maxQuantity > 0 ? `${maxQuantity} items available` : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="mb-6">
                                     <Label htmlFor="shipping-select" className="text-base font-medium text-gray-900 mb-3 block">
                     Shipping
                   </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gray-600" />
                                              <span className="text-sm text-gray-900 font-medium">Free shipping</span>
        </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                                              <span className="text-sm text-gray-900">Deliver to</span>
                      <select 
                        value={shippingTo} 
                        onChange={(e) => setShippingTo(e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                      >
                        {[
                          "Hanoi",
                          "Ho Chi Minh City", 
                          "Da Nang",
                          "Hai Phong",
                          "Can Tho",
                        ].map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={onAddToCart}
                    disabled={maxQuantity <= 0 || isAddingToCart}
                    className="w-full h-14 text-base font-medium border-gray-400 text-gray-900 hover:bg-gray-50"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Adding to cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {maxQuantity <= 0 ? "Out of stock" : "Add to cart"}
                      </>
                    )}
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={onBuyNow}
                    disabled={maxQuantity <= 0 || isAddingToCart}
                    className="w-full h-14 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {maxQuantity <= 0 ? "Out of stock" : "Buy now"}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => console.log('Chat ngay clicked')}
                    className="w-full h-14 text-base font-medium border-gray-400 text-gray-900 hover:bg-gray-50"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat ngay
                  </Button>
                </div>

                {/* Guarantees */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                                            <span className="text-gray-900 font-medium">100% Authentic products</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-600" />
                                            <span className="text-gray-900 font-medium">12 months warranty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                                            <span className="text-gray-900 font-medium">7 days free return</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-900 font-medium">Free shipping</span>
                  </div>
                </div>
          </div>
            </section>
          </div>

          {/* Shop Info Section */}
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                      {product.sellerID?.businessName?.charAt(0) || product.sellerID?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
            <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {product.sellerID?.businessName || product.sellerID?.name || "Cửa hàng"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Active 1 hour ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => console.log('Xem shop')} className="px-6">
                  <Store className="w-4 h-4 mr-2" />
                  Xem shop
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Shop rating</div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {product.sellerID?.rating?.average?.toFixed(1) || "4.9"}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Followers</div>
                  <div className="font-semibold text-gray-900">
                    {product.sellerID?.followers || "1.2M"}
                  </div>
                </div>
                </div>
              </div>
            </div>

          {/* Rating Summary Section */}
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Product Reviews</h3>
              <div className="flex items-start gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {(product.rating?.average || 0).toFixed(1)}
                  </div>
                  <StarRating rating={product.rating?.average || 0} size={24} />
                  <div className="text-sm text-gray-600 mt-2">
                    {product.rating?.count ? `${product.rating.count.toLocaleString()} reviews` : "Chưa có đánh giá"}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {product.rating?.count && product.rating.count > 0 ? (
                    [5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="w-8 text-sm text-gray-600">{star} sao</div>
                      <Progress value={ratingDistribution[star]} className="flex-1 h-3" />
                      <div className="w-12 text-right text-sm font-medium text-gray-900">
                        {ratingDistribution[star]}%
            </div>
          </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Chưa có đánh giá nào cho sản phẩm này
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

          {/* Product Details Section */}
          <div className="max-w-6xl mx-auto px-4 mt-12">
                        {/* Product Description */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="text-gray-500">No detailed description available for this product.</p>
                  )}
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
      </main>

      {/* Cart Success Modal */}
      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        product={addedProduct}
      />
    </>
  )
}