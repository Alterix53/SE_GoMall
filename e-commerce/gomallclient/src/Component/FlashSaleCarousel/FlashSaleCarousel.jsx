"use client"

import { useState, useEffect } from "react"
import ProductCard from "../ProductCard/ProductCard"
import "./FlashSaleCarousel.css"

const FlashSaleCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(6)
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  })

  const flashSaleProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      price: 25990000,
      originalPrice: 34990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      sold: 1234,
      discount: 26,
      flashSale: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 22990000,
      originalPrice: 31990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sold: 856,
      discount: 28,
      flashSale: true,
    },
    {
      id: 3,
      name: "MacBook Air M3 13 inch",
      price: 23990000,
      originalPrice: 32990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      sold: 432,
      discount: 27,
      flashSale: true,
    },
    {
      id: 4,
      name: "iPad Pro 11 inch M4",
      price: 19990000,
      originalPrice: 28990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      sold: 678,
      discount: 31,
      flashSale: true,
    },
    {
      id: 5,
      name: "AirPods Pro 2nd Gen",
      price: 4490000,
      originalPrice: 6990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sold: 2341,
      discount: 36,
      flashSale: true,
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      price: 6990000,
      originalPrice: 10990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sold: 1567,
      discount: 36,
      flashSale: true,
    },
  ]

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2)
      } else if (window.innerWidth < 768) {
        setItemsPerView(3)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4)
      } else if (window.innerWidth < 1280) {
        setItemsPerView(5)
      } else {
        setItemsPerView(6)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, itemsPerView])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView >= flashSaleProducts.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, flashSaleProducts.length - itemsPerView) : prevIndex - 1,
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index * itemsPerView)
  }

  const totalSlides = Math.ceil(flashSaleProducts.length / itemsPerView)

  return (
    <div className="flash-sale-carousel">
      {/* Countdown Timer */}
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

      {/* Carousel */}
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(flashSaleProducts.length / itemsPerView) * 100}%`,
          }}
        >
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="carousel-item" style={{ width: `${100 / flashSaleProducts.length}%` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} disabled={currentIndex === 0}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          className="carousel-btn carousel-btn-next"
          onClick={nextSlide}
          disabled={currentIndex + itemsPerView >= flashSaleProducts.length}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${Math.floor(currentIndex / itemsPerView) === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default FlashSaleCarousel
