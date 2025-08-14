
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, getCurrentUser } = useAuth();
  const { cartItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    // Could redirect to home page after logout
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img src="/images/logo.png" alt="GoMall Logo" height="30" />
          GoMall
        </a>

        {/* Search Bar */}
        <div className="search-container">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav ms-auto">
          {/* Home */}
          <a className="nav-link" href="/">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>

          {/* Categories */}
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i className="fas fa-th-large"></i>
              <span>Categories</span>
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="/category/electronics">Electronics</a></li>
              <li><a className="dropdown-item" href="/category/clothing">Clothing</a></li>
              <li><a className="dropdown-item" href="/category/books">Books</a></li>
              <li><a className="dropdown-item" href="/category/home">Home & Garden</a></li>
            </ul>
          </div>

          {/* Cart */}
          <a className="nav-link" href="/cart">
            <div className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </div>
            <span>Cart</span>
          </a>

          {/* User Account */}
          {isAuthenticated() ? (
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="fas fa-user"></i>
                <span>{getCurrentUser()?.username || 'Account'}</span>
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/profile">Profile</a></li>
                <li><a className="dropdown-item" href="/orders">My Orders</a></li>
                <li><a className="dropdown-item" href="/wishlist">Wishlist</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          ) : (
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="fas fa-user"></i>
                <span>Account</span>
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/login">Login</a></li>
                <li><a className="dropdown-item" href="/signup">Sign Up</a></li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Mobile Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/categories">
                <i className="fas fa-th-large"></i>
                <span>Categories</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cart">
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/account">
                <i className="fas fa-user"></i>
                <span>Account</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
