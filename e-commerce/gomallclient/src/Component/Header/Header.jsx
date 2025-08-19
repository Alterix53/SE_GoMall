import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CartTooltip from '../CartTooltip/CartTooltip';
import Notifications from '../Notifications/Notifications';
import './Header.css';

function Header() {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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

  const handleAccountMouseEnter = () => {
    setShowAccountDropdown(true);
  };

  const handleAccountMouseLeave = () => {
    setShowAccountDropdown(false);
  };

  // Load unread count when user logged in
  useEffect(() => {
    if (isAuthenticated()) {
      loadUnreadCount();
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.data.unreadCount);
        }
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
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
            <div 
              className="nav-item notifications-dropdown"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="nav-icon-img">🔔</div>
              <span className="nav-text">Notifications</span>
                             {/* Unread badge */}
               {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </div>
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
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
              />
            </div>
            <div 
              className="nav-item account-dropdown"
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <button 
                className="account-button"
                type="button"
              >
                <img className="nav-icon-img" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg" alt="Account" />
                <span className="nav-text">
                  {isAuthenticated() && user ? user.username : 'Account'}
                </span>
              </button>
              <div 
                className={`dropdown-menu ${showAccountDropdown ? 'show' : 'hide'}`}
                onMouseEnter={handleAccountMouseEnter}
                onMouseLeave={handleAccountMouseLeave}
              >
                {isAuthenticated() && user ? (
                  // Logged in - show user menu
                  <>
                    <div className="dropdown-item user-info">
                      <i className="dropdown-icon">👤</i>
                      <div className="user-details">
                        <span className="username">{user.username}</span>
                        <span className="user-role">{user.role}</span>
                      </div>
                    </div>
                    <Link to="/profile" className="dropdown-item">
                      <i className="dropdown-icon">⚙️</i>
                      <span>My Account</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <i className="dropdown-icon">📦</i>
                      <span>My Orders</span>
                    </Link>
                    {user.role === 'seller' && (
                      <Link to="/seller-dashboard" className="dropdown-item">
                        <i className="dropdown-icon">🏪</i>
                        <span>Seller Center</span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        <i className="dropdown-icon">🛠️</i>
                        <span>Admin</span>
                      </Link>
                    )}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <i className="dropdown-icon">🚪</i>
                      <span>Log out</span>
                    </button>
                  </>
                ) : (
                  // Not logged in - show login/signup
                  <>
                    <Link to="/login" className="dropdown-item">
                      <i className="dropdown-icon">🔑</i>
                      <span>Login</span>
                    </Link>
                    <Link to="/signup" className="dropdown-item">
                      <i className="dropdown-icon">📝</i>
                      <span>Sign up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
       {/* Notifications Panel */}
      <Notifications 
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />         
      
    </div>
  );
}

export default Header;