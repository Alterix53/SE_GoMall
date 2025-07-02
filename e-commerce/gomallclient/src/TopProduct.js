"use client"

import { useState } from "react"
import ProductCard from './Component/ProductCard/ProductCard';
import "./TopProduct.css"

const TopProduct = () => {
  const [activeTab, setActiveTab] = useState("bestseller")

  const topProducts = [
    {
      id: 1,
      name: "Áo sơ mi nam cao cấp Uniqlo",
      price: 399000,
      originalPrice: 650000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sold: 3456,
      discount: 39,
      rank: 1,
    },
    {
      id: 2,
      name: "Giày thể thao nữ Adidas",
      price: 899000,
      originalPrice: 1290000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      sold: 2789,
      discount: 30,
      rank: 2,
    },
    {
      id: 3,
      name: "Nồi cơm điện tử 1.8L Panasonic",
      price: 1290000,
      originalPrice: 1790000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sold: 1567,
      discount: 28,
      rank: 3,
    },
    {
      id: 4,
      name: "Son kem lì Maybelline",
      price: 180000,
      originalPrice: 300000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      sold: 4567,
      discount: 40,
      rank: 4,
    },
    {
      id: 5,
      name: "Quần jeans nam ống suông",
      price: 349000,
      originalPrice: 550000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sold: 2341,
      discount: 36,
      rank: 5,
    },
    {
      id: 6,
      name: "Máy hút bụi cầm tay Xiaomi",
      price: 990000,
      originalPrice: 1390000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      sold: 1890,
      discount: 29,
      rank: 6,
    },
  ]

  const trendingProducts = [
    {
      id: 7,
      name: "Túi xách thời trang Gucci",
      price: 1290000,
      originalPrice: 1790000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      sold: 1234,
      discount: 28,
      trending: true,
    },
    {
      id: 8,
      name: "Kem chống nắng Anessa 50ml",
      price: 350000,
      originalPrice: 500000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sold: 2678,
      discount: 30,
      trending: true,
    },
  ]

  const tabs = [
    { id: "bestseller", label: "Bán Chạy Nhất", icon: "fas fa-crown" },
    { id: "trending", label: "Xu Hướng", icon: "fas fa-trending-up" },
    { id: "hot", label: "Sản Phẩm Hot", icon: "fas fa-fire" },
  ]

  const getProductsByTab = () => {
    switch (activeTab) {
      case "bestseller":
        return topProducts
      case "trending":
        return [...trendingProducts, ...topProducts.slice(0, 4)]
      case "hot":
        return topProducts.slice().reverse()
      default:
        return topProducts
    }
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case "bestseller":
        return { title: "Top Sản Phẩm Bán Chạy", badge: "TOP", color: "#ffc107" }
      case "trending":
        return { title: "Sản Phẩm Xu Hướng", badge: "TRENDING", color: "#28a745" }
      case "hot":
        return { title: "Sản Phẩm Hot", badge: "HOT", color: "#dc3545" }
      default:
        return { title: "Top Sản Phẩm Bán Chạy", badge: "TOP", color: "#ffc107" }
    }
  }

  return (
    <div className="top-product-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-crown"></i>
              TOP SẢN PHẨM
            </h1>
            <p className="page-subtitle">Những sản phẩm bán chạy và được yêu thích nhất</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <div className="section-header">
            <h2 className="section-title">
              <i className={tabs.find((t) => t.id === activeTab)?.icon}></i>
              {getTabTitle().title}
              <span className="section-badge" style={{ backgroundColor: getTabTitle().color }}>
                {getTabTitle().badge}
              </span>
            </h2>
          </div>

          <div className="products-grid">
            {getProductsByTab().map((product, index) => (
              <div key={product.id} className="product-wrapper">
                {activeTab === "bestseller" && product.rank && product.rank <= 3 && (
                  <div className={`rank-badge rank-${product.rank}`}>#{product.rank}</div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopProduct