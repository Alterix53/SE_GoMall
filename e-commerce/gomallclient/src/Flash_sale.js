"use client"

import { useState, useEffect } from "react"
import ProductCard from './Component/ProductCard/ProductCard';
import './Flash_sale.css'; 

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  })

  const flashSaleProducts = [
    {
      id: 1,
      name: "Áo thun nam Uniqlo cotton cao cấp",
      price: 199000,
      originalPrice: 350000,
      image: "/images/uniqlo.jpg",
      rating: 4.6,
      sold: 2345,
      discount: 43,
      flashSale: true,
    },
    {
      id: 2,
      name: "Giày sneaker nữ thời trang 2025",
      price: 450000,
      originalPrice: 750000,
      image: "/images/sneaker.jpg",
      rating: 4.7,
      sold: 1567,
      discount: 40,
      flashSale: true,
    },
    {
      id: 3,
      name: "Nồi chiên không dầu 5L Xiaomi",
      price: 1290000,
      originalPrice: 1990000,
      image: "/images/ChienKhongDau.jpg",
      rating: 4.8,
      sold: 890,
      discount: 35,
      flashSale: true,
    },
    {
      id: 4,
      name: "Son môi L'Oréal Paris Matte",
      price: 150000,
      originalPrice: 250000,
      image: "/images/SonMoi.jpg",
      rating: 4.5,
      sold: 3456,
      discount: 40,
      flashSale: true,
    },
    {
      id: 5,
      name: "Quần jeans nữ ống suông",
      price: 299000,
      originalPrice: 500000,
      image: "/images/jeannu.jpg",
      rating: 4.6,
      sold: 1789,
      discount: 40,
      flashSale: true,
    },
    {
      id: 6,
      name: "Máy xay sinh tố Philips 2L",
      price: 890000,
      originalPrice: 1290000,
      image: "/images/xaysinhto.jpg",
      rating: 4.7,
      sold: 1234,
      discount: 31,
      flashSale: true,
    },
    {
      id: 7,
      name: "Túi xách thời trang da cao cấp",
      price: 599000,
      originalPrice: 999000,
      image: "/images/da.jpg",
      rating: 4.8,
      sold: 987,
      discount: 40,
      flashSale: true,
    },
    {
      id: 8,
      name: "Kem dưỡng da Innisfree 50ml",
      price: 250000,
      originalPrice: 400000,
      image: "/images/kem.jpg",
      rating: 4.6,
      sold: 2341,
      discount: 37,
      flashSale: true,
    },
  ]

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

  return (
    <div className="flash-sale-page">
      {/* Flash Sale Header */}
      <div className="flash-sale-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              ⚡ FLASH SALE
              <span className="hot-badge">HOT</span>
            </h1>
            <p className="page-subtitle">Giảm giá sốc - Số lượng có hạn!</p>

            {/* Countdown Timer */}
            <div className="countdown-container">
              <div className="countdown-timer">
                <div className="timer-label">
                  <i className="fas fa-clock"></i>
                  <span>Kết thúc trong:</span>
                </div>
                <div className="timer-digits">
                  <div className="timer-digit">{String(timeLeft.hours).padStart(2, "0")}</div>
                  <span className="timer-separator">:</span>
                  <div className="timer-digit">{String(timeLeft.minutes).padStart(2, "0")}</div>
                  <span className="timer-separator">:</span>
                  <div className="timer-digit">{String(timeLeft.seconds).padStart(2, "0")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Flash Sale Products */}
        <div className="products-section">
          <div className="products-grid">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          <div className="load-more-section">
            <button className="load-more-btn">
              <i className="fas fa-plus"></i>
              Xem Thêm Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashSale