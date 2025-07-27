"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import FlashSaleCarousel from "./Component/FlashSaleCarousel/FlashSaleCarousel"
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx"
import axios from "axios"
import "./Home.css"

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { name: "Điện thoại", image: "/images/Phone.png" },
    { name: "Laptop", image: "/images/Laptop.png" },
    { name: "Thời trang", image: "/images/Clothes.png" },
    { name: "Mỹ phẩm", image: "/images/MyPham.png" },
    { name: "Gia dụng", image: "/images/DoGiaDung.png" },
    { name: "Sách", image: "/images/Book.png" },
    { name: "Thể thao", image: "/images/TheThao.png" },
    { name: "Xe cộ", image: "/images/Xe.png" },
    { name: "Phụ kiện", image: "/images/Gucci.jpg" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("Fetching products from API...")
        const response = await axios.get("http://localhost:8080/api/products", {
          timeout: 10000,
        })

        console.log("API Response:", response.data)
        const allProducts = response.data?.data?.products || []

        if (allProducts.length === 0) {
          console.warn("No products received from API, using fallback data")
          // Sử dụng fallback data ngay lập tức
          const fallbackFlashSale = [
            {
              id: "fallback-1",
              name: "Samsung Galaxy S24",
              price: 22000000,
              originalPrice: 25000000,
              image: "/placeholder.svg?height=200&width=200&text=Samsung+Galaxy+S24",
              rating: 4.5,
              sold: 300,
              discount: 12,
              isFlashSale: true,
            },
            {
              id: "fallback-2",
              name: "Laptop Dell XPS 13",
              price: 27000000,
              originalPrice: 30000000,
              image: "/placeholder.svg?height=200&width=200&text=Dell+XPS+13",
              rating: 4.2,
              sold: 150,
              discount: 10,
              isFlashSale: true,
            },
          ]
          setFlashSaleProducts(fallbackFlashSale)
          setLoading(false)
          return
        }

        // Remove duplicates based on _id
        const uniqueProducts = Array.from(new Map(allProducts.map((p) => [p._id, p])).values())

        console.log("Unique products count:", uniqueProducts.length)
        console.log("All products from API:", uniqueProducts.length)
        console.log(
          "Products with isFlashSale property:",
          uniqueProducts.filter((p) => p.hasOwnProperty("isFlashSale")),
        )
        console.log(
          "Products where isFlashSale = true:",
          uniqueProducts.filter((p) => p.isFlashSale === true),
        )

        // Transform products to consistent format
        const transformProduct = (product) => ({
          id: product._id || `fallback-${product.name || "unknown"}-${Math.random()}`,
          name: product.name || "Unknown Product",
          price: product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          image: product.images?.[0]?.url || "/images/default-product.jpg",
          rating: product.rating?.average || 0,
          sold: product.sold || 0,
          discount:
            product.price?.original && product.price?.sale
              ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
              : 0,
          isFlashSale: Boolean(product.isFlashSale),
        })

        // Group products by category
        const groupedProducts = uniqueProducts.reduce((acc, product) => {
          const categoryName = product.categoryID?.categoryName || "Chưa phân loại"
          if (categories.some((cat) => cat.name === categoryName) || categoryName === "Chưa phân loại") {
            if (!acc[categoryName]) acc[categoryName] = []
            acc[categoryName].push(transformProduct(product))
          }
          return acc
        }, {})

        setCategoryProducts(groupedProducts)

        // Set featured products
        const featuredProductsData = uniqueProducts
          .filter((p) => p.isFeatured)
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 6)
          .map(transformProduct)

        setFeaturedProducts(featuredProductsData)

        // Filter and set flash sale products - ONLY products with isFlashSale = true
        const flashSaleProductsData = uniqueProducts.filter((product) => {
          const hasProperty = product.hasOwnProperty("isFlashSale")
          const isTrue = product.isFlashSale === true
          console.log(
            `Product: ${product.name}, hasIsFlashSale: ${hasProperty}, isFlashSale: ${product.isFlashSale}, filtered: ${isTrue}`,
          )
          return isTrue
        })

        console.log("Flash sale products found:", flashSaleProductsData.length)
        console.log(
          "Flash sale products details:",
          flashSaleProductsData.map((p) => ({
            name: p.name,
            isFlashSale: p.isFlashSale,
          })),
        )

        const transformedFlashSaleProducts = flashSaleProductsData.map(transformProduct)

        console.log("Transformed flash sale products:", transformedFlashSaleProducts.length)

        if (transformedFlashSaleProducts.length === 0) {
          console.warn("No flash sale products from API, using fallback data")
          const fallbackFlashSale = [
            {
              id: "fallback-1",
              name: "Samsung Galaxy S24",
              price: 22000000,
              originalPrice: 25000000,
              image: "/placeholder.svg?height=200&width=200&text=Samsung+Galaxy+S24",
              rating: 4.5,
              sold: 300,
              discount: 12,
              isFlashSale: true,
            },
            {
              id: "fallback-2",
              name: "Laptop Dell XPS 13",
              price: 27000000,
              originalPrice: 30000000,
              image: "/placeholder.svg?height=200&width=200&text=Dell+XPS+13",
              rating: 4.2,
              sold: 150,
              discount: 10,
              isFlashSale: true,
            },
          ]
          setFlashSaleProducts(fallbackFlashSale)
        } else {
          setFlashSaleProducts(transformedFlashSaleProducts)
        }
      } catch (err) {
        const errorMsg = `API Error: ${err.message}`
        console.error(errorMsg, err)
        setError(errorMsg)

        // Sử dụng fallback data khi có lỗi
        const fallbackFlashSale = [
          {
            id: "fallback-1",
            name: "Samsung Galaxy S24",
            price: 22000000,
            originalPrice: 25000000,
            image: "/placeholder.svg?height=200&width=200&text=Samsung+Galaxy+S24",
            rating: 4.5,
            sold: 300,
            discount: 12,
            isFlashSale: true,
          },
          {
            id: "fallback-2",
            name: "Laptop Dell XPS 13",
            price: 27000000,
            originalPrice: 30000000,
            image: "/placeholder.svg?height=200&width=200&text=Dell+XPS+13",
            rating: 4.2,
            sold: 150,
            discount: 10,
            isFlashSale: true,
          },
        ]
        setFlashSaleProducts(fallbackFlashSale)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Debug log for flash sale products state changes
  useEffect(() => {
    console.log("Flash sale products state updated:", {
      count: flashSaleProducts.length,
      products: flashSaleProducts.map((p) => ({ id: p.id, name: p.name, isFlashSale: p.isFlashSale })),
    })
  }, [flashSaleProducts])

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Mua Sắm Thông Minh</h1>
            <p className="hero-subtitle">Hàng triệu sản phẩm chính hãng, giá tốt nhất</p>
            <Link to="/shop" className="hero-cta">
              Khám Phá Ngay
            </Link>
          </div>
          <div className="hero-image">
            <img
              src="/images/hero-shopping.png"
              alt="Shopping"
              onError={(e) => (e.target.src = "/images/default-product.jpg")}
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-truck"></i>
              <span>Miễn phí vận chuyển</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-alt"></i>
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-star"></i>
              <span>Đánh giá 5 sao</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-headphones"></i>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="categories-section">
          <div className="section-card">
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="category-item"
                  onClick={() => setSelectedCategory(category.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="category-icon">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      onError={(e) => (e.target.src = "/images/default-product.jpg")}
                    />
                  </div>
                  <span className="category-name">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedCategory && (
          <section className="category-products-section">
            <div className="section-header">
              <h2 className="section-title">{selectedCategory}</h2>
              <Link to="/" className="view-all-btn" onClick={() => setSelectedCategory(null)}>
                Quay lại
              </Link>
            </div>
            <div className="products-grid">
              {categoryProducts[selectedCategory] && categoryProducts[selectedCategory].length > 0 ? (
                categoryProducts[selectedCategory].map((product, index) => (
                  <RenderProduct key={product.id || index} product={product} />
                ))
              ) : (
                <p>Không có sản phẩm cho danh mục này.</p>
              )}
            </div>
          </section>
        )}

        <section className="flash-sale-section">
          <div className="section-header">
            <div className="section-title-group">
              <h2 className="section-title flash-sale-title">⚡ FLASH SALE</h2>
              <span className="hot-badge">HOT</span>
            </div>
            <Link to="/flash-sale" className="view-all-btn animated-link">
              Xem Tất Cả
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Đang tải Flash Sale...</p>
            </div>
          ) : (
            <FlashSaleCarousel products={flashSaleProducts} />
          )}
        </section>

        <section className="featured-products-section">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <Link to="/top-products" className="view-all-btn">
              Xem Tất Cả
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => <RenderProduct key={product.id || index} product={product} />)
            ) : (
              <p>Không có sản phẩm nổi bật.</p>
            )}
          </div>
        </section>

        <section className="top-products-section">
          <div className="section-header">
            <h2 className="section-title">Top Sản Phẩm Bán Chạy</h2>
            <Link to="/top-products" className="view-all-btn">
              Xem Tất Cả
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts
                .slice(0, 6)
                .map((product, index) => <RenderProduct key={product.id || index} product={product} />)
            ) : (
              <p>Không có sản phẩm bán chạy.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
