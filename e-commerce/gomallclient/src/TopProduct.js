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
        // Thêm dữ liệu mẫu khi API không hoạt động
        const sampleProducts = {
          bestseller: [
            {
              id: "1",
              name: "iPhone 15 Pro Max",
              price: 28794591,
              originalPrice: 35000000,
              image: "/images/phone1.jpg",
              rating: 4.5,
              sold: 338,
              rank: 1
            },
            {
              id: "2",
              name: "MacBook Pro 16-inch M3 Max",
              price: 49607734,
              originalPrice: 65000000,
              image: "/images/laptop1.jpg",
              rating: 4.8,
              sold: 1029,
              rank: 2
            },
            {
              id: "3",
              name: "Samsung Galaxy S24 Ultra",
              price: 26270130,
              originalPrice: 32000000,
              image: "/images/phone2.jpg",
              rating: 4.6,
              sold: 836,
              rank: 3
            }
          ],
          trending: [
            {
              id: "4",
              name: "Nike Air Jordan 1 Retro High OG",
              price: 3307175,
              originalPrice: 4500000,
              image: "/images/shoes1.jpg",
              rating: 4.7,
              sold: 485,
              rank: 1
            },
            {
              id: "5",
              name: "Gucci Marmont Small Shoulder Bag",
              price: 23896051,
              originalPrice: 28000000,
              image: "/images/bag1.jpg",
              rating: 4.9,
              sold: 623,
              rank: 2
            },
            {
              id: "6",
              name: "Adidas Ultraboost 22",
              price: 3249106,
              originalPrice: 3800000,
              image: "/images/shoes2.jpg",
              rating: 4.4,
              sold: 705,
              rank: 3
            }
          ],
          hot: [
            {
              id: "7",
              name: "Dell XPS 15 9530",
              price: 36419576,
              originalPrice: 42000000,
              image: "/images/laptop2.jpg",
              rating: 4.6,
              sold: 181,
              rank: 1
            },
            {
              id: "8",
              name: "Nike Air Max 270",
              price: 2477106,
              originalPrice: 3200000,
              image: "/images/shoes3.jpg",
              rating: 4.3,
              sold: 144,
              rank: 2
            },
            {
              id: "9",
              name: "Philips Air Fryer HD9654/90",
              price: 4014673,
              originalPrice: 4500000,
              image: "/images/appliance1.jpg",
              rating: 4.5,
              sold: 505,
              rank: 3
            }
          ]
        };
        
        const currentTabProducts = sampleProducts[activeTab] || sampleProducts.bestseller;
        setProducts(currentTabProducts);
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
