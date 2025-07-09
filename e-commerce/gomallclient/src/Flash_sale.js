"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { RenderProduct } from "./Component/ProductCard/ProductCard.jsx"; // Import RenderProduct
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
    let retries = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/products/flash-sale", {
          timeout: 5000,
        });
        console.log("Flash Sale API response:", response.data);
        const products = response.data?.data?.products || [];
        if (products.length === 0) {
          console.warn("No flash sale products from API");
          return;
        }
        setFlashSaleProducts(
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
            flashSale: product.isFlashSale || false,
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
            <p className="page-subtitle">Giảm giá sốc - Số lượng có hạn!</p>

            {/* Countdown Timer */}
            <div className="countdown-container">
              <div className="countdown-timer">
                <div className="timer-label">
                  <i className="fas fa-clock"></i>
                  <span>Kết thúc trong:</span>
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
              <p>Đang tải sản phẩm...</p>
            ) : flashSaleProducts.length > 0 ? (
              flashSaleProducts.map((product, index) => (
                <RenderProduct key={product.id || index} product={product} />
              ))
            ) : (
              <p>Không có sản phẩm flash sale.</p>
            )}
          </div>

          {/* Load More */}
          <div className="load-more-section">
            <button className="load-more-btn">
              <i className="fas fa-plus"></i>
              Xem Thêm Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;