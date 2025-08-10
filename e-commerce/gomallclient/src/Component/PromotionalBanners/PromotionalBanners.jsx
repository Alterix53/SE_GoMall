import React, { useState, useEffect } from 'react';
import './PromotionalBanners.css';

const PromotionalBanners = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      background: '#ff4444', // Màu đỏ riêng
      title: 'FREE SHIP MỌI ĐƠN',
      subtitle: 'Giảm giá lên đến 50%',
      image: '🛍️',
      badge: '0Đ'
    },
    {
      id: 2,
      background: '#2196F3', // Màu xanh riêng
      title: 'FLASH SALE',
      subtitle: 'Ưu đãi trong 24h',
      image: '⚡',
      badge: '50%'
    },
    {
      id: 3,
      background: '#ff4444', // Màu đỏ riêng
      title: 'MỚI VỀ',
      subtitle: 'Sản phẩm hot nhất',
      image: '🔥',
      badge: 'NEW'
    },
    {
      id: 4,
      background: '#2196F3', // Màu xanh riêng
      title: 'TECH SALE',
      subtitle: 'Điện tử giảm sốc',
      image: '💻',
      badge: '30%'
    },
    {
      id: 5,
      background: '#ff4444', // Màu đỏ riêng
      title: 'FASHION WEEK',
      subtitle: 'Thời trang mới nhất',
      image: '👗',
      badge: '40%'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="promotional-section">
      <div className="promotional-container">
        {/* Main Carousel */}
        <div className="main-carousel">
          <div className="carousel-container">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ background: slide.background }}
              >
                <div className="slide-content">
                  <div className="slide-left">
                    <div className="slide-image">{slide.image}</div>
                  </div>
                  <div className="slide-center">
                    <div className="slide-title">{slide.title}</div>
                    <div className="slide-subtitle">{slide.subtitle}</div>
                  </div>
                  <div className="slide-right">
                    <div className="slide-badge">{slide.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Side Banners */}
        <div className="right-banners">
          {/* Top Banner */}
          <div className="top-banner">
            <div className="banner-content">
              <div className="banner-left">
                <div className="banner-title">8.8</div>
                <div className="banner-subtitle">GOMALL FOOD</div>
                <div className="banner-text">VẠN DEAL NGON RẺ</div>
                <div className="banner-offer">
                  <span>GIẢM 50%</span>
                  <span>MÓN NGON 15.000</span>
                </div>
              </div>
              <div className="banner-right">
                <div className="banner-image">🍕🍗🥤</div>
              </div>
            </div>
            <div className="banner-dates">29.7 - 8.8</div>
          </div>

          {/* Bottom Banner */}
          <div className="bottom-banner">
            <div className="banner-content">
              <div className="banner-left">
                <div className="banner-title">ASEAN</div>
                <div className="banner-subtitle">8.8 ONLINE SALE DAY</div>
                <div className="banner-text">A CLICK TO PROSPERITY</div>
                <div className="banner-dates">8-10 THÁNG 8 2025</div>
              </div>
              <div className="banner-right">
                <div className="banner-number">88</div>
                <div className="banner-percent">%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners; 