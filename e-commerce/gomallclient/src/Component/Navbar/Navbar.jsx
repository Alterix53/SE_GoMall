import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserAccountModal from "../UserAccountModal/UserAccountModal";
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
    // Có thể redirect về trang chủ sau khi đăng xuất
    window.location.href = '/';
  };

  return (
      <header className="navbar">
        {/* Top Bar */}
        <div className="navbar-top">
          <div className="container">
            <div className="top-left">
              <span>Miễn phí vận chuyển đơn từ 150k</span>
              <span>•</span>
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="top-right">
              <span>Tải ứng dụng</span>
              <span>•</span>
              <span>Kết nối</span>
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

              {/* Navigation Icons */}
              <div className="nav-icons">
                <div className="nav-icon">
                  <img
                      src="/images/bell.png"
                      alt="Thông báo"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Thông báo</span>
                </div>
                <div className="nav-icon">
                  <img
                      src="/images/setting.png"
                      alt="Hỗ trợ"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Hỗ trợ</span>
                </div>
                <div className="nav-icon">
                  <img
                      src="/images/cart.png"
                      alt="Giỏ hàng"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Giỏ hàng</span>
                </div>
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
                  <img
                      src="/images/user.png"
                      alt="Tài khoản"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>{isAuthenticated() ? getCurrentUser()?.username || 'Tài khoản' : 'Tài khoản'}</span>
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

        {/* Navigation Links */}
        <div className="navbar-links">
          <div className="container">
            <nav className="nav-menu">
              <Link
                  to="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Trang chủ
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
              <Link
                  to="/category/dien-thoai"
                  className={`nav-link ${isActive("/category/dien-thoai") ? "active" : ""}`}
              >
                Deal hot
              </Link>
              <Link
                  to="/category/laptop"
                  className={`nav-link ${isActive("/category/laptop") ? "active" : ""}`}
              >
                Săn xu đổi quà
              </Link>
              <Link
                  to="/category/thoi-trang"
                  className={`nav-link ${isActive("/category/thoi-trang") ? "active" : ""}`}
              >
                Khách hàng thân thiết
              </Link>
              <Link
                  to="/category/gia-dung"
                  className={`nav-link ${isActive("/category/gia-dung") ? "active" : ""}`}
              >
                Mã giảm giá
              </Link>
            </nav>
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
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Tài khoản</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/cart.png"
                      alt="Giỏ hàng"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Giỏ hàng</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/help.png"
                      alt="Hỗ trợ"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
                  />
                  <span>Hỗ trợ</span>
                </div>
                <div className="mobile-menu-item">
                  <img
                      src="/images/bell.png"
                      alt="Thông báo"
                      style={{ width: "20px", height: "20px" }}
                      onError={(e) => (e.target.src = "/placeholder.svg?height=20&width=20")}
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