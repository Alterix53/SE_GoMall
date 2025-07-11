import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FlashSaleCarousel from "./Component/FlashSaleCarousel/FlashSaleCarousel";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]); // State riêng cho flash sale

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

  useEffect(() => {
    let retries = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          timeout: 5000,
        });
        console.log("API response:", response.data);
        const products = response.data?.data?.products || [];
        if (products.length === 0) {
          console.warn("No products from API");
          return;
        }
        const uniqueProducts = Array.from(new Map(products.map(p => [p._id, p])).values());
        console.log("Unique products:", uniqueProducts.map(p => ({
          _id: p._id,
          category: p.categoryID?.categoryName,
          image: p.images?.[0]?.url,
        })));
        const groupedProducts = uniqueProducts.reduce((acc, product) => {
          const categoryName = product.categoryID?.categoryName || "Chưa phân loại";
          if (categories.some(cat => cat.name === categoryName) || categoryName === "Chưa phân loại") {
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push({
              id: product._id,
              name: product.name || "Unknown Product",
              price: product.price?.sale || product.price?.original || 0,
              originalPrice: product.price?.original || 0,
              image: product.images?.[0]?.url || "/images/default-product.jpg",
              rating: product.rating?.average || 0,
              sold: product.sold || 0,
              discount: product.price?.original && product.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
            });
          } else {
            console.warn(`Category ${categoryName} not found in predefined categories, skipping`);
          }
          return acc;
        }, {});
        console.log("Grouped products:", groupedProducts);
        setCategoryProducts(groupedProducts);
        setFeaturedProducts(
          uniqueProducts
            .sort((a, b) => (b.sold || 0) - (a.sold || 0))
            .slice(0, 6)
            .map(product => ({
              id: product._id,
              name: product.name || "Unknown Product",
              price: product.price?.sale || product.price?.original || 0,
              originalPrice: product.price?.original || 0,
              image: product.images?.[0]?.url || "/images/default-product.jpg",
              rating: product.rating?.average || 0,
              sold: product.sold || 0,
              discount: product.price?.original && product.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
            }))
        );
        // Giả sử flash sale là sản phẩm có discount lớn nhất (có thể thay bằng endpoint riêng)
        setFlashSaleProducts(
          uniqueProducts
            .filter(product => product.discount && product.discount > 20) // Ví dụ: discount > 20%
            .sort((a, b) => (b.discount || 0) - (a.discount || 0))
            .slice(0, 6)
            .map(product => ({
              id: product._id,
              name: product.name || "Unknown Product",
              price: product.price?.sale || product.price?.original || 0,
              originalPrice: product.price?.original || 0,
              image: product.images?.[0]?.url || "/images/default-product.jpg",
              rating: product.rating?.average || 0,
              sold: product.sold || 0,
              discount: product.discount || 0,
            }))
        );
      } catch (err) {
        retries++;
        console.error(`Fetch error (attempt ${retries}/${maxRetries}):`, err.message, err.response?.status, err.response?.statusText);
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
          await fetchData();
        } else {
          console.error("Max retries reached, no data available");
          setCategoryProducts({});
          setFeaturedProducts([]);
          setFlashSaleProducts([]);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Mua Sắm Thông Minh</h1>
            <p className="hero-subtitle">Hàng triệu sản phẩm chính hãng, giá tốt nhất</p>
            <Link to="/shop" className="hero-cta">Khám Phá Ngay</Link>
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
                      onError={(e) => (e.target.src = "/images/default-product.jpg")}
                    />
                  </div>
                  <span className="category-name">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Products */}
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
                  <RenderProduct key={product.id || product._id || index} product={product} />
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
          <FlashSaleCarousel products={flashSaleProducts} />
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
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <RenderProduct key={product.id || product._id || index} product={product} />
              ))
            ) : (
              <p>Không có sản phẩm nổi bật.</p>
            )}
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
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 6).map((product, index) => (
                <RenderProduct key={product.id || product._id || index} product={product} />
              ))
            ) : (
              <p>Không có sản phẩm bán chạy.</p>
            )}
          </div>
        </section>
      </div>
      </div>
    );
  }
  
  export default Home;