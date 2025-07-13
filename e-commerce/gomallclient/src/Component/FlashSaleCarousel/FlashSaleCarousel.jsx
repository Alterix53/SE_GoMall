import React, { useState, useEffect, useCallback } from "react";
import { RenderProduct } from "../ProductCard/ProductCard.jsx"; // Điều chỉnh đường dẫn nếu cần
import "./FlashSaleCarousel.css";

const FlashSaleCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  });

  // Định nghĩa hàm với useCallback
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerView >= (products?.length || 0) ? 0 : prevIndex + 1
    );
  }, [itemsPerView, products?.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, (products?.length || 0) - itemsPerView) : prevIndex - 1
    );
  }, [itemsPerView, products?.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index * itemsPerView);
  }, [itemsPerView]);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else if (window.innerWidth < 1280) setItemsPerView(5);
      else setItemsPerView(6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const totalSlides = products ? Math.ceil(products.length / itemsPerView) : 0;

  return (
    <div className="flash-sale-carousel">
      {/* Main Container for Centered Layout */}
      <div className="flash-sale-main">
        {/* Countdown Timer */}
        <div className="countdown-timer">
          <div className="timer-content">
            <span className="timer-label">Kết thúc trong:</span>
            <div className="timer-digits">
              <div className="timer-digit">{String(timeLeft.hours).padStart(2, "0")}</div>
              <span className="timer-separator">:</span>
              <div className="timer-digit">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <span className="timer-separator">:</span>
              <div className="timer-digit">{String(timeLeft.seconds).padStart(2, "0")}</div>
            </div>
          </div>
        </div>

        {/* Carousel or No Products Message */}
        <div className="carousel-wrapper">
          <div
            className="carousel-container"
            style={{ display: products?.length > 0 ? "block" : "none" }}
          >
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(products?.length || 0) / itemsPerView * 100}%`,
              }}
            >
              {products?.length > 0 &&
                products.map((product, index) => (
                  <div
                    key={product.id || product._id || index}
                    className="carousel-item"
                    style={{ width: `${100 / (products.length || 1)}%` }}
                  >
                    <RenderProduct product={product} />
                  </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={prevSlide}
              disabled={currentIndex === 0 || !products?.length}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="carousel-btn carousel-btn-next"
              onClick={nextSlide}
              disabled={currentIndex + itemsPerView >= (products?.length || 0)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* No Products Message */}
          {!products?.length > 0 && (
            <div className="no-products-message centered-message">
              <p>Không có sản phẩm flash sale</p>
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${Math.floor(currentIndex / itemsPerView) === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              disabled={!products?.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleCarousel;