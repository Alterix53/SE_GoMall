"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import SearchBar from "../SearchBar/SearchBar"    // Minh bổ sung

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm)
    }
  }

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

            {/* Search Bar */} 
            {/* <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form> */}
            {/* Minh comment */}
            <SearchBar />  
            {/* Minh bổ sung */}

            {/* Navigation Icons */}
            <div className="nav-icons">
              <div className="nav-icon">
                <i className="fas fa-bell"></i>
                <span>Thông báo</span>
              </div>
              <div className="nav-icon">
                <i className="fas fa-heart"></i>
                <span>Yêu thích</span>
              </div>
              <div className="nav-icon">
                <i className="fas fa-shopping-cart"></i>
                <span>Giỏ hàng</span>
                <span className="cart-count">3</span>
              </div>
              <div className="nav-icon dropdown">
                <i className="fas fa-user"></i>
                <span>Tài khoản</span>
                <div className="dropdown-menu">
                  <a href="#">Đăng nhập</a>
                  <a href="#">Đăng ký</a>
                  <a href="#">Tài khoản của tôi</a>
                  <a href="#">Đơn hàng</a>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <div className="container">
          <nav className="nav-menu">
            <Link to="/" className="nav-link active">
              Trang chủ
            </Link>
            <Link to="/flash-sale" className="nav-link">
              Flash Sale
            </Link>
            <Link to="/top-products" className="nav-link">
              Top Products
            </Link>
            <a href="#" className="nav-link">
              Điện thoại
            </a>
            <a href="#" className="nav-link">
              Laptop
            </a>
            <a href="#" className="nav-link">
              Thời trang
            </a>
            <a href="#" className="nav-link">
              Gia dụng
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-menu-item">
              <i className="fas fa-user"></i>
              <span>Tài khoản</span>
            </div>
            <div className="mobile-menu-item">
              <i className="fas fa-shopping-cart"></i>
              <span>Giỏ hàng</span>
              <span className="cart-count">3</span>
            </div>
            <div className="mobile-menu-item">
              <i className="fas fa-heart"></i>
              <span>Yêu thích</span>
            </div>
            <div className="mobile-menu-item">
              <i className="fas fa-bell"></i>
              <span>Thông báo</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
