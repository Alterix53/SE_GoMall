import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShopeeHeader.css';

const ShopeeHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="shopee-header">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="top-nav-left">
          <Link to="/seller" className="nav-link">Kênh Người Bán</Link>
          <Link to="/app" className="nav-link">Tải ứng dụng</Link>
          <div className="social-links">
            <a href="#" className="social-link">Kết nối</a>
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
          </div>
        </div>
        <div className="top-nav-right">
          <Link to="/notifications" className="nav-link">Thông Báo</Link>
          <Link to="/support" className="nav-link">Hỗ Trợ</Link>
          <div className="language-selector">
            <span>Tiếng Việt</span>
            <i className="arrow-down">▼</i>
          </div>
          <div className="user-profile">
            <img src="/images/default-avatar.png" alt="User" className="avatar" />
            <span>oe_ro2mk3n</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-section">
            <Link to="/" className="logo">
              <img src="/images/shopee-logo.png" alt="Shopee" className="logo-img" />
              <span className="logo-text">S Shopee</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="HANNAH OLALA VOUCHER ĐẾN 25%"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <i className="search-icon">🔍</i>
                </button>
              </div>
            </form>
            
            {/* Search Keywords */}
            <div className="search-keywords">
              <span className="keyword">Tai Nghe Sony Wh-ch520</span>
              <span className="keyword">Tai Nghe Bluetooth Chụp Tai</span>
              <span className="keyword">Tai Nghe Sony WH Ch520</span>
              <span className="keyword">Máy Nghe Nhạc Mini</span>
              <span className="keyword">Tai Nghe Lenovo Thinkplus</span>
              <span className="keyword">Case Tai Nghe</span>
            </div>
          </div>

          {/* Cart */}
          <div className="cart-section">
            <Link to="/cart" className="cart-icon">
              <i className="cart-icon-svg">🛒</i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopeeHeader; 