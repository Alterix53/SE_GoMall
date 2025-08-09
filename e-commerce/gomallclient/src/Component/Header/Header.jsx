import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CartTooltip from '../CartTooltip/CartTooltip';
import './Header.css';

function Header() {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const closeAccountDropdown = () => {
    setShowAccountDropdown(false);
  };

  const handleLogout = () => {
    logout();
    closeAccountDropdown();
  };

  const handleCartMouseEnter = () => {
    setShowCartTooltip(true);
  };

  const handleCartMouseLeave = () => {
    setShowCartTooltip(false);
  };

  const closeCartTooltip = () => {
    setShowCartTooltip(false);
  };

  return (
    <div className="gomall-header">
      {/* Top Orange Banner */}
      <div className="header-top-banner">
        <div className="banner-content">
          <div className="banner-item">
            <span className="banner-text">Free shipping for orders over 150k</span>
            <span className="banner-illustrative-image">🚚</span>
          </div>
          <div className="banner-item">
            <span className="banner-text">24/7 Support</span>
            <span className="banner-illustrative-image">🎧</span>
          </div>
          <div className="banner-item">
            <span className="banner-text">Download app</span>
            <span className="banner-illustrative-image">📱</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-container">
          {/* Logo and Brand */}
          <div className="logo-section">
            <Link to="/" className="logo">
              <div className="logo-icon">G</div>
              <span className="logo-text">GoMall</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search products, ..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                <i className="search-icon">🔍</i>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="nav-section">
            <Link to="/notifications" className="nav-item">
              <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f514.svg" alt="Notifications" />
              <span className="nav-text">Notifications</span>
            </Link>
            <Link to="/seller" className="nav-item">
              <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2753.svg" alt="Become a Seller" />
              <span className="nav-text">Become a Seller</span>
            </Link>
            <div 
              className="nav-item cart-dropdown"
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <Link to="/cart" className="cart-link">
                <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Cart" />
                <span className="nav-text">Cart</span>
              </Link>
              <CartTooltip 
                isVisible={showCartTooltip}
                onClose={closeCartTooltip}
              />
            </div>
            <div className="nav-item account-dropdown">
              <button 
                className="account-button"
                onClick={toggleAccountDropdown}
                type="button"
              >
                <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg" alt="Account" />
                <span className="nav-text">
                  {isAuthenticated() && user ? user.username : 'Account'}
                </span>
              </button>
              <div className={`dropdown-menu ${showAccountDropdown ? 'show' : 'hide'}`}>
                {isAuthenticated() && user ? (
                  // Đã đăng nhập - hiển thị menu user
                  <>
                    <div className="dropdown-item user-info">
                      <i className="dropdown-icon">👤</i>
                      <div className="user-details">
                        <span className="username">{user.username}</span>
                        <span className="user-role">{user.role}</span>
                      </div>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="dropdown-icon">⚙️</i>
                      <span>Tài khoản của tôi</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="dropdown-icon">📦</i>
                      <span>Đơn mua</span>
                    </Link>
                    {user.role === 'seller' && (
                      <Link to="/seller-dashboard" className="dropdown-item" onClick={closeAccountDropdown}>
                        <i className="dropdown-icon">🏪</i>
                        <span>Kênh Người Bán</span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={closeAccountDropdown}>
                        <i className="dropdown-icon">🛠️</i>
                        <span>Quản trị</span>
                      </Link>
                    )}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <i className="dropdown-icon">🚪</i>
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  // Chưa đăng nhập - hiển thị login/signup
                  <>
                    <Link to="/login" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="dropdown-icon">🔑</i>
                      <span>Đăng nhập</span>
                    </Link>
                    <Link to="/signup" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="dropdown-icon">📝</i>
                      <span>Đăng ký</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;