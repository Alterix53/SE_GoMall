"use client";

import { useState, useEffect } from "react";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx";
// Header is globally rendered in App.js
import "./Flash_sale.css";
import { productAPI } from './utils/api';

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
        const res = await productAPI.getFlashSaleProducts();
        const products = res?.products || [];
        const mapped = products.map((p, i) => ({
          id: p._id || `fallback-${i}`,
          name: p.name || 'Unknown Product',
          price: p.price?.sale ?? p.price?.original ?? 0,
          originalPrice: p.price?.original ?? 0,
          image: p.images?.[0]?.url ? `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}`.replace('/api','') + p.images[0].url : '/images/default-product.jpg',
          rating: p.rating?.average || 0,
          sold: p.sold || 0,
          discount: p.price?.original && (p.price?.sale ?? 0)
            ? Math.round(((p.price.original - (p.price.sale ?? 0)) / p.price.original) * 100)
            : 0,
          isFlashSale: !!p.isFlashSale,
        }));
        setFlashSaleProducts(mapped);
      } catch (err) {
        console.error('Error fetching flash sale products:', err.message);
        setFlashSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flash-sale-page">
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
                  <RenderProduct key={product.id} product={product} />
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
