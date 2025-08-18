"use client";

import { useState, useEffect } from "react";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
// Header is globally rendered in App.js
import "./TopProduct.css";
import { productAPI } from './utils/api';

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
        const res = await productAPI.getTopProducts(activeTab);
        const products = res?.products || [];
        const mapped = products.map((p, index) => ({
          id: p._id || `fallback-${index}`,
          name: p.name || 'Unknown Product',
          price: p.price?.sale ?? p.price?.original ?? 0,
          originalPrice: p.price?.original ?? 0,
          image: p.images?.[0]?.url ? `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}`.replace('/api','') + p.images[0].url : '/images/default-product.jpg',
          rating: p.rating?.average || 0,
          sold: p.sold || 0,
          discount: p.price?.original && (p.price?.sale ?? 0)
            ? Math.round(((p.price.original - (p.price.sale ?? 0)) / p.price.original) * 100)
            : 0,
          rank: index + 1,
          trending: p.trending || false,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error('Error fetching top products:', err.message);
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
