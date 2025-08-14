"use client";

import { useState, useEffect } from "react";
import FlashSaleCard from "./Component/FlashSaleCard/FlashSaleCard.jsx";
import Header from "./Component/Header/Header.jsx";
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
        const products = data?.data?.products || data?.data?.data?.products || [];
        if (products.length === 0) {
          setFlashSaleProducts([]);
          return;
        }
        const mappedProducts = products.map((product, index) => ({
          _id: product._id || `fallback-${index}`,
          name: product.name || "Unknown Product",
          price: product.flashSalePrice || product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/placeholder-product.svg",
          rating: product.rating || { average: 0, count: 0 },
          sold: product.sold || 0,
          discount: product.price?.original && product.flashSalePrice
            ? Math.round(((product.price.original - product.flashSalePrice) / product.price.original) * 100)
            : 0,
          isFlashSale: product.isFlashSale || false,
        }));
        setFlashSaleProducts(mappedProducts);
      } catch (err) {
        setFlashSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flash-sale-page">
      {/* GoMall Header */}
      <Header />

      {/* Flash Sale Content */}
      <div className="flash-sale-content">
        <div className="container">
          {/* Flash Sale Header */}
          <div className="flash-sale-header">
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
                  <div className="timer-display">
                    <div className="time-unit">
                      <span className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="time-label">Hours</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-unit">
                      <span className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="time-label">Minutes</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-unit">
                      <span className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                      <span className="time-label">Seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale Products */}
          <div className="flash-sale-products">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading flash sale products...</p>
              </div>
            ) : flashSaleProducts.length > 0 ? (
              <div className="products-grid">
                {flashSaleProducts.map((product) => (
                  <FlashSaleCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No flash sale products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
