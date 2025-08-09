import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const closeAccountDropdown = () => {
    setShowAccountDropdown(false);
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
            <Link to="/cart" className="nav-item">
              <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Cart" />
              <span className="nav-text">Cart</span>
            </Link>
            <div className="nav-item account-dropdown">
              <button 
                className="account-button"
                onClick={toggleAccountDropdown}
                type="button"
              >
                <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg" alt="Account" />
                <span className="nav-text">Account</span>
              </button>
              <div className={`dropdown-menu ${showAccountDropdown ? 'show' : 'hide'}`}>
                <Link to="/login" className="dropdown-item" onClick={closeAccountDropdown}>
                  <i className="dropdown-icon">🔑</i>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="dropdown-item" onClick={closeAccountDropdown}>
                  <i className="dropdown-icon">📝</i>
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;