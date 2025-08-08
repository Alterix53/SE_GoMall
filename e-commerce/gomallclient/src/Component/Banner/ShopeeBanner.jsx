import React from 'react';
import './ShopeeBanner.css';

const ShopeeBanner = () => {
  return (
    <div className="shopee-banner-section">
      <div className="banner-container">
        <div className="banner-grid">
          {/* Main Banner */}
          <div className="main-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h2 className="banner-title">FREE SHIP MỌI ĐƠN</h2>
                <div className="banner-price">0 Đ</div>
                <p className="banner-subtitle">Indy Lab • ilso</p>
              </div>
              <div className="banner-image">
                <img src="/images/banner-main.jpg" alt="Main Banner" />
              </div>
            </div>
            <div className="banner-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          {/* Side Banners */}
          <div className="side-banners">
            {/* Top Banner */}
            <div className="side-banner top-banner">
              <div className="banner-content">
                <div className="banner-text">
                  <h3 className="banner-title">8.8 SHOPEE + FOOD B.O.F. VAN DEAL NGON RẺ</h3>
                  <div className="banner-discount">GIẢM 50% 15.000 ĐỒNG MUA NHIỀU GIẢM NHIỀU</div>
                  <div className="banner-shipping">BAO SHIP</div>
                  <div className="banner-date">29.7 - 8.8</div>
                </div>
                <div className="banner-image">
                  <img src="/images/banner-food.jpg" alt="Food Banner" />
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="side-banner bottom-banner">
              <div className="banner-content">
                <div className="banner-text">
                  <h3 className="banner-title">ASEAN ONLINE SALE DAY</h3>
                  <div className="banner-date">8-10 THÁNG 8 2025</div>
                  <div className="banner-number">88</div>
                </div>
                <div className="banner-image">
                  <img src="/images/banner-sale.jpg" alt="Sale Banner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopeeBanner; 