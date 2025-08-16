
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserAccountModal from "../UserAccountModal/UserAccountModal";
import SearchBar from "../SearchBar/SearchBar";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({});
  const location = useLocation();
  const { isAuthenticated, getCurrentUser, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
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
            <SearchBar />
          </div>

          {/* Navigation */}
          <div className="nav-section">
            <div className="nav-item">
              <div className="nav-icon-img">🔔</div>
              <span className="nav-text">Notifications</span>
            </div>
            
            <Link to="/seller" className="nav-item seller-nav-item">
              <div className="nav-icon-img">❓</div>
              <span className="nav-text">Become a Seller</span>
            </Link>
            
            <Link to={isAuthenticated() ? "/cart" : "/signin"} className="nav-item">
              <div className="nav-icon-img">🛒</div>
              <span className="nav-text">Cart</span>
            </Link>
            
            <div 
              className="nav-item account-dropdown"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setModalPosition({
                  top: rect.bottom + 5,
                  right: window.innerWidth - rect.right
                });
                setIsAccountModalOpen(true);
              }}
            >
              <div className="nav-icon-img">👤</div>
              <span className="nav-text">
                {isAuthenticated() && getCurrentUser() ? getCurrentUser().username : 'Account'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Navigation Links */}
      <div className="navbar-links">
        <div className="container">
          <nav className="nav-menu">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/flash-sale"
              className={`nav-link ${isActive("/flash-sale") ? "active" : ""}`}
            >
              Flash Sale
            </Link>
            <Link
              to="/top-products"
              className={`nav-link ${isActive("/top-products") ? "active" : ""}`}
            >
              Top Products
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-menu-item">
              <div className="nav-icon-img">👤</div>
              <span>Tài khoản</span>
            </div>
            <div className="mobile-menu-item">
              <div className="nav-icon-img">🛒</div>
              <span>Giỏ hàng</span>
            </div>
            <div className="mobile-menu-item">
              <div className="nav-icon-img">❓</div>
              <span>Hỗ trợ</span>
            </div>
            <div className="mobile-menu-item">
              <div className="nav-icon-img">🔔</div>
              <span>Thông báo</span>
            </div>
            <Link to="/seller" className="mobile-seller-link">
              <div className="mobile-menu-item seller-mobile-item">
                <div className="nav-icon-img">❓</div>
                <span>Become a Seller</span>
              </div>
            </Link>
          </div>
        </div>
      )}
      
      {/* User Account Modal */}
      <UserAccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)}
        position={modalPosition}
      />
    </div>
  );
};

export default Navbar;