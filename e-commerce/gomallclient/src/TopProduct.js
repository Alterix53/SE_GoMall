"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx"; // Import RenderProduct
import "./TopProduct.css";

const TopProduct = () => {
  const [activeTab, setActiveTab] = useState("bestseller");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "bestseller", label: "Bán Chạy Nhất", icon: "fas fa-crown" },
    { id: "trending", label: "Xu Hướng", icon: "fas fa-trending-up" },
    { id: "hot", label: "Sản Phẩm Hot", icon: "fas fa-fire" },
  ];

  // Fetch data effect
  useEffect(() => {
    let retries = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/products/top-products?type=${activeTab}`, {
          timeout: 5000,
        });
        console.log("Top Products API response:", response.data);
        const products = response.data?.data?.products || [];
        if (products.length === 0) {
          console.warn("No top products from API");
          return;
        }
        setProducts(
          products.map((product, index) => ({
            id: product._id || `fallback-${index}`,
            name: product.name || "Unknown Product",
            price: product.price?.sale || product.price?.original || 0,
            originalPrice: product.price?.original || 0,
            image: product.images?.[0]?.url || "/images/default-product.jpg",
            rating: product.rating?.average || 0,
            sold: product.sold || 0,
            discount: product.price?.original && product.price?.sale
              ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
              : 0,
            rank: index + 1,
            trending: product.trending || false,
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
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const getProductsByTab = () => {
    switch (activeTab) {
      case "bestseller":
        return products;
      case "trending":
        return products.filter((p) => p.trending === true || p.sold > 2000);
      case "hot":
        return products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return products;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "bestseller":
        return { title: "Top Sản Phẩm Bán Chạy", badge: "TOP", color: "#ffc107" };
      case "trending":
        return { title: "Sản Phẩm Xu Hướng", badge: "TRENDING", color: "#28a745" };
      case "hot":
        return { title: "Sản Phẩm Hot", badge: "HOT", color: "#dc3545" };
      default:
        return { title: "Top Sản Phẩm Bán Chạy", badge: "TOP", color: "#ffc107" };
    }
  };

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
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : products.length > 0 ? (
              getProductsByTab().map((product, index) => (
                <div key={product.id || index} className="product-wrapper">
                  {activeTab === "bestseller" && product.rank && product.rank <= 3 && (
                    <div className={`rank-badge rank-${product.rank}`}>#{product.rank}</div>
                  )}
                  <RenderProduct product={product} />
                </div>
              ))
            ) : (
              <p>Không có sản phẩm để hiển thị.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProduct;