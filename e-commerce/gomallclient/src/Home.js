import { Link } from "react-router-dom";
import { useState } from "react";
import FlashSaleCarousel from "./Component/FlashSaleCarousel/FlashSaleCarousel";
import ProductCard from "./Component/ProductCard/ProductCard";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // State để chọn danh mục

  const categories = [
    { name: "Điện thoại", image: "/images/Phone.png" },
    { name: "Laptop", image: "/images/Laptop.png" },
    { name: "Thời trang", image: "/images/Clothes.png" },
    { name: "Mỹ phẩm", image: "/images/MyPham.png" },
    { name: "Gia dụng", image: "/images/DoGiaDung.png" },
    { name: "Sách", image: "/images/Book.png" },
    { name: "Thể thao", image: "/images/TheThao.png" },
    { name: "Xe cộ", image: "/images/Xe.png" },
  ];

  // Dữ liệu sản phẩm cho từng danh mục
  const categoryProducts = {
    "Điện thoại": [
      {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        price: 29990000,
        originalPrice: 34990000,
        image: "/images/iphone-15.jpg",
        rating: 4.8,
        sold: 5234,
        discount: 14,
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 26990000,
        originalPrice: 31990000,
        image: "/images/samsung-s24.jpg",
        rating: 4.7,
        sold: 4856,
        discount: 16,
      },
    ],
    "Laptop": [
      {
        id: 3,
        name: "MacBook Air M3 13 inch",
        price: 27990000,
        originalPrice: 32990000,
        image: "/images/macbook-air.jpg",
        rating: 4.9,
        sold: 3432,
        discount: 15,
      },
      {
        id: 4,
        name: "Dell XPS 13",
        price: 25990000,
        originalPrice: 30990000,
        image: "/images/dell-xps.jpg",
        rating: 4.8,
        sold: 2345,
        discount: 16,
      },
    ],
    "Thời trang": [
      {
        id: 5,
        name: "Áo hoodie nữ phong cách Hàn Quốc",
        price: 299000,
        originalPrice: 450000,
        image: "/images/ao-hoodie.jpg",
        rating: 4.6,
        sold: 2345,
        discount: 34,
      },
      {
        id: 6,
        name: "Giày thể thao nam Nike",
        price: 799000,
        originalPrice: 1190000,
        image: "/images/giay-nike.jpg",
        rating: 4.8,
        sold: 1678,
        discount: 33,
      },
    ],
    "Gia dụng": [
      {
        id: 7,
        name: "Nồi áp suất điện 6L Philips",
        price: 1490000,
        originalPrice: 1990000,
        image: "/images/noi-philips.jpg",
        rating: 4.7,
        sold: 890,
        discount: 25,
      },
      {
        id: 8,
        name: "Máy ép chậm Hurom 500ml",
        price: 3990000,
        originalPrice: 4990000,
        image: "/images/may-ep-hurom.jpg",
        rating: 4.9,
        sold: 1234,
        discount: 20,
      },
    ],
    // Các danh mục khác để tránh lỗi undefined
    "Mỹ phẩm": [],
    "Sách": [],
    "Thể thao": [],
    "Xe cộ": [],
  };

  const featuredProducts = [
    {
      id: 1,
      name: "Áo hoodie nữ phong cách Hàn Quốc",
      price: 299000,
      originalPrice: 450000,
      image: "/images/ao-hoodie.jpg",
      rating: 4.6,
      sold: 2345,
      discount: 34,
    },
    {
      id: 2,
      name: "Giày thể thao nam Nike",
      price: 799000,
      originalPrice: 1190000,
      image: "/images/giay-nike.jpg",
      rating: 4.8,
      sold: 1678,
      discount: 33,
    },
    {
      id: 3,
      name: "Nồi áp suất điện 6L Philips",
      price: 1490000,
      originalPrice: 1990000,
      image: "/images/noi-philips.jpg",
      rating: 4.7,
      sold: 890,
      discount: 25,
    },
    {
      id: 4,
      name: "Kem dưỡng ẩm Cetaphil 100ml",
      price: 250000,
      originalPrice: 350000,
      image: "/images/kem-cetaphil.jpg",
      rating: 4.5,
      sold: 3456,
      discount: 29,
    },
    {
      id: 5,
      name: "Quần short nam thể thao",
      price: 199000,
      originalPrice: 350000,
      image: "/images/quan-short.jpg",
      rating: 4.6,
      sold: 2789,
      discount: 43,
    },
    {
      id: 6,
      name: "Máy ép chậm Hurom 500ml",
      price: 3990000,
      originalPrice: 4990000,
      image: "/images/may-ep-hurom.jpg",
      rating: 4.9,
      sold: 1234,
      discount: 20,
    },
  ];

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
              <img
                  src="/images/hero-shopping.png"
                  alt="Shopping"
                  onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=600")}
              />
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
                    <div
                        key={index}
                        className="category-item"
                        onClick={() => setSelectedCategory(category.name)}
                        style={{ cursor: "pointer" }}
                    >
                      <div className="category-icon">
                        <img
                            src={category.image}
                            alt={category.name}
                            onError={(e) => (e.target.src = "/placeholder.svg?height=80&width=80")}
                        />
                      </div>
                      <span className="category-name">{category.name}</span>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Category Products (hiển thị khi chọn danh mục) */}
          {selectedCategory && (
              <section className="category-products-section">
                <div className="section-header">
                  <h2 className="section-title">{selectedCategory}</h2>
                  <Link
                      to="/"
                      className="view-all-btn"
                      onClick={() => setSelectedCategory(null)}
                  >
                    Quay lại
                  </Link>
                </div>
                <div className="products-grid">
                  {categoryProducts[selectedCategory] && categoryProducts[selectedCategory].length > 0 ? (
                      categoryProducts[selectedCategory].map((product) => (
                          <ProductCard key={product.id} product={product} />
                      ))
                  ) : (
                      <p>Không có sản phẩm cho danh mục này.</p>
                  )}
                </div>
              </section>
          )}

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
  );
};

export default Home;