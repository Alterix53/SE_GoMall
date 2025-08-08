import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FlashSaleCarousel from "./Component/FlashSaleCarousel/FlashSaleCarousel";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
import { useProductCache } from "./hooks/useProductCache";
import ProductAnimation from "./Component/ProductAnimation/ProductAnimation.jsx";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]); // State riêng cho flash sale

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      console.log("All products API response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch flash sale products
  const fetchFlashSaleProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/flash-sale');
      const data = await response.json();
      console.log("Flash sale API response:", data);
      
      if (data.success && data.data?.products) {
        const flashProducts = data.data.products.map(product => ({
          id: product._id,
          name: product.name || "Unknown Product",
          price: product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/default-product.jpg",
          rating: product.rating?.average || 0,
          ratingCount: product.rating?.count || 0,
          sold: product.sold || 0,
          discount: product.price?.original && product.flashSalePrice
            ? Math.round(((product.price.original - product.flashSalePrice) / product.price.original) * 100)
            : 0,
          isFlashSale: product.isFlashSale || false,
          flashSalePrice: product.flashSalePrice || 0,
        }));
        console.log("Flash sale products:", flashProducts);
        setFlashSaleProducts(flashProducts);
      } else {
        console.warn("No flash sale products from API");
        setFlashSaleProducts([]);
      }
    } catch (error) {
      console.error("Error fetching flash sale products:", error);
      setFlashSaleProducts([]);
    }
  };

  const categories = [
    { name: "Phones", image: "/images/Phone.png" },
    { name: "Laptops", image: "/images/Laptop.png" },
    { name: "Fashion", image: "/images/Clothes.png" },
    { name: "Cosmetics", image: "/images/MyPham.png" },
    { name: "Home & Garden", image: "/images/DoGiaDung.png" },
    { name: "Books", image: "/images/Book.png" },
    { name: "Sports", image: "/images/TheThao.png" },
    { name: "Vehicles", image: "/images/Xe.png" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use direct API call instead of cache service
        const response = await fetchAllProducts();
        console.log("API response:", response);
        const products = response?.data?.products || [];
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
              image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/default-product.jpg",
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
              image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/default-product.jpg",
              rating: product.rating?.average || 0,
              sold: product.sold || 0,
              discount: product.price?.original && product.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
            }))
        );
        // Fetch flash sale products separately
        await fetchFlashSaleProducts();
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setCategoryProducts({});
        setFeaturedProducts([]);
        setFlashSaleProducts([]);
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
            <h1 className="hero-title">Smart Shopping</h1>
            <p className="hero-subtitle">Millions of authentic products at the best prices</p>
            <button 
              className="hero-cta" 
              onClick={() => {
                const flashSaleSection = document.querySelector('.flash-sale-section');
                if (flashSaleSection) {
                  flashSaleSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Shop Now
            </button>
          </div>
          <div className="hero-image">
            <ProductAnimation />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-truck"></i>
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-alt"></i>
              <span>Authentic Warranty</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-star"></i>
              <span>5-Star Rating</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-headphones"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Categories */}
        <section className="categories-section">
          <div className="section-card">
            <h2 className="section-title">Featured Categories</h2>
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
                Back
              </Link>
            </div>
            <div className="products-grid">
              {categoryProducts[selectedCategory] && categoryProducts[selectedCategory].length > 0 ? (
                categoryProducts[selectedCategory].map((product, index) => (
                  <RenderProduct key={product.id || product._id || index} product={product} />
                ))
              ) : (
                <p>No products for this category.</p>
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
            <Link to="/flash-sale" className="view-all-btn animated-link">
              View All
            </Link>
          </div>
          <FlashSaleCarousel products={flashSaleProducts} />
        </section>

        {/* Featured Products */}
        <section className="featured-products-section">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/top-products" className="view-all-btn">
              View All
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <RenderProduct key={product.id || product._id || index} product={product} />
              ))
            ) : (
              <p>No featured products.</p>
            )}
          </div>
        </section>

        {/* Top Products Preview */}
        <section className="top-products-section">
          <div className="section-header">
            <h2 className="section-title">Top Selling Products</h2>
            <Link to="/top-products" className="view-all-btn">
              View All
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 6).map((product, index) => (
                <RenderProduct key={product.id || product._id || index} product={product} />
              ))
            ) : (
              <p>No top selling products.</p>
            )}
          </div>
        </section>
      </div>
      </div>
    ); 
  }
  
  export default Home;
