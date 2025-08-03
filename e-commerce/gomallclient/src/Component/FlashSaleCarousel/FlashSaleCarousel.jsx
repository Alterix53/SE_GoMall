"use client"

import { useState, useEffect, memo } from "react"
import "./FlashSaleCarousel.css"

const FlashSaleCarousel = memo(({ products }) => {
  console.log("FlashSaleCarousel received:", products)

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 29,
    seconds: 19,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const productsPerPage = 4
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Format sold function
  const formatSold = (sold) => (sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        else if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 12, minutes: 29, seconds: 19 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Render single product
  const renderProduct = (product) => {
    console.log("Rendering product:", product.name)
    return (
      <div key={product.id} className="product-item">
        {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
        {product.isFlashSale && <span className="flash-sale-badge">Flash Sale</span>}

        <div className="product-image">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=200&width=200&text=No+Image"
            }}
          />
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="price-section">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="product-stats">
            <span className="rating">★ {product.rating || "N/A"} ({product.ratingCount || 0} đánh giá)</span>
            <span className="sold">Đã bán {formatSold(product.sold)}</span>
          </div>
        </div>
      </div>
    )
  }

  const currentProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  )

  return (
    <div className="flash-sale-carousel">
      <div className="flash-sale-main">
        {/* Timer */}
        <div className="countdown-timer">
          <div className="timer-content">
            <span className="timer-label">Kết thúc trong:</span>
            <div className="timer-digits">
              <div className="timer-digit">{String(timeLeft.hours).padStart(2, "0")}</div>
              <span className="timer-separator">:</span>
              <div className="timer-digit">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <span className="timer-separator">:</span>
              <div className="timer-digit">{String(timeLeft.seconds).padStart(2, "0")}</div>
            </div>
          </div>
        </div>

        {/* Products Container with Arrows */}
        <div className="products-container">
          {totalPages > 1 && (
            <button className="carousel-arrow left" onClick={handlePrev} disabled={currentIndex === 0}>
              ←
            </button>
          )}
          {products && products.length > 0 ? (
            <div className="products-grid">
              {currentProducts.map((product) => renderProduct(product))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
              <p>Không có sản phẩm Flash Sale hiện tại.</p>
            </div>
          )}
          {totalPages > 1 && (
            <button className="carousel-arrow right" onClick={handleNext} disabled={currentIndex === totalPages - 1}>
              →
            </button>
          )}
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
})

FlashSaleCarousel.displayName = "FlashSaleCarousel"

export default FlashSaleCarousel