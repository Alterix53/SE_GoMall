"use client";

import { useState, useEffect } from "react";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
import Header from "./Component/Header/Header.jsx";
import "./TopProduct.css";

const TopProduct = () => {
  const [activeTab, setActiveTab] = useState("bestseller");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "bestseller", label: "Best Selling", icon: "fas fa-crown" },
    { id: "trending", label: "Trending", icon: "fas fa-trending-up" },
    { id: "hot", label: "Hot Products", icon: "fas fa-fire" },
  ];

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products based on active tab
        const apiUrl = `http://localhost:8080/api/products/top-products?type=${activeTab}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Top Products API response:", data);
        const products = data?.data?.products || [];
        if (products.length === 0) {
          console.warn("No top products from API");
          return;
        }
        const mappedProducts = products.map((product, index) => ({
          id: product._id || `fallback-${index}`,
          name: product.name || "Unknown Product",
          price: product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/default-product.jpg",
          rating: product.rating?.average || 0,
          sold: product.sold || 0,
          discount: product.price?.original && product.price?.sale
            ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
            : 0,
          rank: index + 1,
          trending: product.trending || false,
        }));
        console.log("Mapped products:", mappedProducts);
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Error fetching top products:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const getProductsByTab = () => {
    // For now, return all products since we're fetching specific data for each tab
    return products;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "bestseller":
        return { title: "Top Best Selling Products", badge: "TOP", color: "#ffc107" };
      case "trending":
        return { title: "Trending Products", badge: "TRENDING", color: "#28a745" };
      case "hot":
        return { title: "Hot Products", badge: "HOT", color: "#dc3545" };
      default:
        return { title: "Top Best Selling Products", badge: "TOP", color: "#ffc107" };
    }
  };

  return (
    <div className="top-product-page">
      {/* GoMall Header */}
      <Header />

      {/* Top Products Content */}
      <div className="top-product-content">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">
                <i className="fas fa-crown"></i>
                TOP PRODUCTS
              </h1>
              <p className="page-subtitle">The best-selling and most loved products</p>
            </div>
          </div>

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
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="products-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading top products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {getProductsByTab().map((product) => (
                  <div key={product.id} className="product-wrapper">
                    {product.rank <= 3 && (
                      <div className="rank-badge" style={{ backgroundColor: getTabTitle().color }}>
                        #{product.rank}
                      </div>
                    )}
                    <RenderProduct product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No top products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
