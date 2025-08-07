"use client";

import { useState, useEffect } from "react";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
import "./Flash_sale.css";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  });
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else {
          return { hours: 12, minutes: 34, seconds: 56 }; // Reset timer
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/products/flash-sale");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Flash Sale API response:", data);
        const products = data?.data?.products || [];
        if (products.length === 0) {
          console.warn("No flash sale products from API");
          setFlashSaleProducts([]);
          return;
        }
        const mappedProducts = products.map((product, index) => ({
          id: product._id || `fallback-${index}`,
          name: product.name || "Unknown Product",
          price: product.flashSalePrice || product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          image: product.images?.[0]?.url || "/images/default-product.jpg",
          rating: product.rating?.average || 0,
          sold: product.sold || 0,
          discount: product.price?.original && product.flashSalePrice
            ? Math.round(((product.price.original - product.flashSalePrice) / product.price.original) * 100)
            : 0,
          flashSale: product.isFlashSale || false,
        }));
        console.log("Mapped flash sale products:", mappedProducts);
        setFlashSaleProducts(mappedProducts);
      } catch (err) {
        console.error("Error fetching flash sale products:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flash-sale-page">
      {/* Flash Sale Header */}
      <div className="flash-sale-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              ⚡ FLASH SALE
              <span className="hot-badge">HOT</span>
            </h1>
            <p className="page-subtitle">Shocking discounts - Limited quantity!</p>

            {/* Countdown Timer */}
            <div className="countdown-container">
              <div className="countdown-timer">
                <div className="timer-label">
                  <i className="fas fa-clock"></i>
                  <span>Ends in:</span>
                </div>
                <div className="timer-digits">
                  <div className="timer-digit">{String(timeLeft.hours).padStart(2, "0")}</div>
                  <span className="timer-separator">:</span>
                  <div className="timer-digit">{String(timeLeft.minutes).padStart(2, "0")}</div>
                  <span className="timer-separator">:</span>
                  <div className="timer-digit">{String(timeLeft.seconds).padStart(2, "0")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Flash Sale Products */}
        <div className="products-section">
          <div className="products-grid">
            {loading ? (
              <p>Loading products...</p>
            ) : flashSaleProducts.length > 0 ? (
              flashSaleProducts.map((product, index) => (
                <RenderProduct key={product.id || index} product={product} />
              ))
            ) : (
              <p>No flash sale products available.</p>
            )}
          </div>

          {/* Load More */}
          <div className="load-more-section">
            <button className="load-more-btn">
              <i className="fas fa-plus"></i>
              View More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
