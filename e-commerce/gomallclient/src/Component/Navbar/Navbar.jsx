
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
    // Can redirect to home page after logout
    window.location.href = '/';
  };

  return (
      <header className="navbar">
        {/* Top Bar */}
        
        <div className="navbar-top">
          <div className="container">
            <div className="top-left">
              <span>Free shipping for orders over 150k</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
            <div className="top-right">
              <span>Download App</span>
              <span>•</span>
              <span>Connect</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="navbar-main">
          <div className="container">
            <div className="navbar-content d-flex align-items-center justify-content-between">
              {/* Logo */}
              <Link to="/" className="logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">GoMall</span>
              </Link>
              
              {/* Shipping Info - moved to right of logo */}
              <div className="shipping-info">
                <span>Free shipping for orders over 150k</span>
                <span>•</span>
                <span>24/7 Support</span>
              </div>
              
              {/* Search Bar - centered and longer */}
              <div className="search-container">
                <SearchBar /> {/* Minh bổ sung */}
              </div>
              
              {/* Navigation Icons */}
              <div className="nav-icons justify-content-end">
                <div className="nav-icon">
                  <img
                      src="/images/bell.png"
                      alt="Notifications"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Notifications</span>
                </div>

                <div className="nav-icon">
                  <img
                      src="/images/setting.png"
                      alt="Support"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Become a Seller</span>
                </div>
                <Link to={isAuthenticated() ? "/cart" : "/signin" }>
                <div className="nav-icon justify-content-end">
                  <img
                      src="/images/cart.png"
                      alt="Cart"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Cart</span>
                </div>
                </Link>
              
                <div 
                  className="nav-icon justify-content-end" 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setModalPosition({
                      top: rect.bottom + 5,
                      right: window.innerWidth - rect.right
                    });
                    setIsAccountModalOpen(true);
                  }}
                >
                  <img
                      src="/images/user.png"
                      alt="Account"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>{isAuthenticated() ? getCurrentUser()?.username || 'Account' : 'Account'}</span>
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <div className="mobile-menu-item">
                  <img
                      src="/images/user.png"
                      alt="Tài khoản"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Tài khoản</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/cart.png"
                      alt="Giỏ hàng"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Giỏ hàng</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/help.png"
                      alt="Hỗ trợ"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Hỗ trợ</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/bell.png"
                      alt="Thông báo"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => {
                        if (e.target.src !== "/images/default-product.jpg") {
                          e.target.src = "/images/default-product.jpg"
                        }
                      }}
                  />
                  <span>Thông báo</span>
                </div>
              </div>
            </div>
        )}
        
        {/* User Account Modal */}
        <UserAccountModal 
          isOpen={isAccountModalOpen} 
          onClose={() => setIsAccountModalOpen(false)}
          position={modalPosition}
        />
      </header>
  );
};

export default Navbar;
