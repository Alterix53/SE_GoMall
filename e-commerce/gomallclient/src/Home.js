import { Link } from "react-router-dom"
import FlashSaleCarousel from './Component/FlashSaleCarousel/FlashSaleCarousel';
import ProductCard from './Component/ProductCard/ProductCard';
import "./Home.css"

const Home = () => {
  const categories = [
    { name: "Điện thoại", image: "/placeholder.svg?height=80&width=80" },
    { name: "Laptop", image: "/placeholder.svg?height=80&width=80" },
    { name: "Thời trang", image: "/placeholder.svg?height=80&width=80" },
    { name: "Mỹ phẩm", image: "/placeholder.svg?height=80&width=80" },
    { name: "Gia dụng", image: "/placeholder.svg?height=80&width=80" },
    { name: "Sách", image: "/placeholder.svg?height=80&width=80" },
    { name: "Thể thao", image: "/placeholder.svg?height=80&width=80" },
    { name: "Xe cộ", image: "/placeholder.svg?height=80&width=80" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Áo hoodie nữ phong cách Hàn Quốc",
      price: 299000,
      originalPrice: 450000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sold: 2345,
      discount: 34,
    },
    {
      id: 2,
      name: "Giày thể thao nam Nike",
      price: 799000,
      originalPrice: 1190000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      sold: 1678,
      discount: 33,
    },
    {
      id: 3,
      name: "Nồi áp suất điện 6L Philips",
      price: 1490000,
      originalPrice: 1990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sold: 890,
      discount: 25,
    },
    {
      id: 4,
      name: "Kem dưỡng ẩm Cetaphil 100ml",
      price: 250000,
      originalPrice: 350000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      sold: 3456,
      discount: 29,
    },
    {
      id: 5,
      name: "Quần short nam thể thao",
      price: 199000,
      originalPrice: 350000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sold: 2789,
      discount: 43,
    },
    {
      id: 6,
      name: "Máy ép chậm Hurom 500ml",
      price: 3990000,
      originalPrice: 4990000,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      sold: 1234,
      discount: 20,
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Mua Sắm Thông Minh</h1>
            <p className="hero-subtitle">Hàng triệu sản phẩm chính hãng, giá tốt nhất</p>
            <button className="hero-cta">Khám Phá Ngay</button>
          </div>
          <div className="hero-image">
            <img src="/placeholder.svg?height=400&width=600" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Features */}
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
        {/* Categories */}
        <section className="categories-section">
          <div className="section-card">
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-icon">
                    <img src={category.image || "/placeholder.svg"} alt={category.name} />
                  </div>
                  <span className="category-name">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="flash-sale-section">
          <div className="section-header">
            <div className="section-title-group">
              <h2 className="section-title flash-sale-title">⚡ FLASH SALE</h2>
              <span className="hot-badge">HOT</span>
            </div>
            <Link to="/flash-sale" className="view-all-btn">
              Xem Tất Cả
            </Link>
          </div>
          <FlashSaleCarousel />
        </section>

        {/* Featured Products */}
        <section className="featured-products-section">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <Link to="/top-products" className="view-all-btn">
              Xem Tất Cả
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Top Products Preview */}
        <section className="top-products-section">
          <div className="section-header">
            <h2 className="section-title">Top Sản Phẩm Bán Chạy</h2>
            <Link to="/top-products" className="view-all-btn">
              Xem Tất Cả
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home