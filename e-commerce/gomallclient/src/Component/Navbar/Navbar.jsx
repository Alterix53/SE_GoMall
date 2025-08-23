
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useSellerAuthV2 } from "../../hooks/useSellerAuthV2";
import UserAccountModal from "../UserAccountModal/UserAccountModal";
import SearchBar from "../SearchBar/SearchBar";
import OptimizedImage from "../../utils/OptimizedImage";
import { createPlaceholderUrl } from "../../utils/imageUtils";
import "./Navbar.css";
import Notifications from '../Notifications/Notifications';
import { ShoppingCart, User, Bell, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const { sellerStatus, isApprovedSeller, isPendingSeller, isRejectedSeller, hasSellerApplication } = useSellerAuthV2();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });



  const handleBecomeSellerClick = (e) => {
    e.preventDefault();
    
    if (hasSellerApplication) {
      if (isApprovedSeller) {
        // Nếu đã được approve, chuyển đến Seller Dashboard
        navigate('/seller');
      } else if (isPendingSeller) {
        // Nếu đang pending, chuyển đến register-seller để xem trạng thái
        navigate('/register-seller');
      } else if (isRejectedSeller) {
        // Nếu bị reject, chuyển đến register-seller để nộp lại
        navigate('/register-seller');
      }
    } else {
      // Nếu chưa có hồ sơ, chuyển đến register-seller để đăng ký
      navigate('/register-seller');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
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

      {/* Main Navbar */}
      <div className="navbar-main">
        <div className="container">
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-icon">G</div>
              <span className="logo-text">GoMall</span>
            </Link>
            
            {/* Search Bar */}
            <SearchBar />
            
            {/* Navigation Icons */}
            <div className="nav-icons">
              <div className="nav-icon">
                <OptimizedImage
                  src="/images/bell.png"
                  alt="Notifications"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <span>Notifications</span>
              </div>
              
              <div className="nav-icon" onClick={handleBecomeSellerClick}>
                <OptimizedImage
                  src="/images/setting.png"
                  alt="Support"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <span>Become a Seller</span>
              </div>

              <Link to={isAuthenticated() ? "/cart" : "/signin"}>
                <div className="nav-icon">
                  <OptimizedImage
                    src="/images/cart.png"
                    alt="Cart"
                    style={{ width: "20px", height: "20px" }}
                    lazy={false}
                    fallbackUrl={createPlaceholderUrl(20,20,'')}
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <span>Cart</span>
                </div>
              </Link>
              
              <div 
                className="nav-icon" 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setModalPosition({
                    top: rect.bottom + 5,
                    right: window.innerWidth - rect.right
                  });
                  setIsAccountModalOpen(true);
                }}
              >
                <OptimizedImage
                  src="/images/user.png"
                  alt="Account"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <div className="mobile-menu-item">
                <OptimizedImage
                  src="/images/user.png"
                  alt="Tài khoản"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <span>Tài khoản</span>
              </div>
              <div className="mobile-menu-item">
                <OptimizedImage
                  src="/images/cart.png"
                  alt="Giỏ hàng"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <span>Giỏ hàng</span>
              </div>
              <div className="mobile-menu-item">
                <OptimizedImage
                  src="/images/help.png"
                  alt="Hỗ trợ"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <span>Hỗ trợ</span>
              </div>
              <div className="mobile-menu-item">
                <OptimizedImage
                  src="/images/bell.png"
                  alt="Thông báo"
                  style={{ width: "20px", height: "20px" }}
                  lazy={false}
                  fallbackUrl={createPlaceholderUrl(20,20,'')}
                  onLoad={() => {}}
                  onError={() => {}}
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
      </div>
    </div>
  );
};

export default Navbar;