import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './CartTooltip.css';

// Resolve image URL to absolute path (prefix server origin for relative paths)
const resolveImageUrl = (image) => {
  try {
    if (!image) return "/images/placeholder-product.svg";
    const raw = typeof image === "string" ? image : image.url || "";
    if (!raw) return "/images/placeholder-product.svg";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const base = "http://localhost:8080";
    return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
  } catch {
    return "/images/placeholder-product.svg";
  }
};

const CartTooltip = ({ isVisible, onClose, onMouseEnter, onMouseLeave }) => {
  const { isAuthenticated } = useAuth();
  const { cartItems, getTotalPrice } = useCart();

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isVisible) return null;

  // Chưa đăng nhập
  if (!isAuthenticated()) {
    return (
      <div 
        className="cart-tooltip"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="cart-tooltip-content">
          <div className="cart-empty-state">
            <div className="empty-cart-icon">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Empty Cart" />
            </div>
            <h3>No Products Yet</h3>
            <p>Login to view your cart</p>
            <div className="cart-auth-buttons">
              <Link to="/login" className="btn-login" onClick={onClose}>
                Login
              </Link>
              <Link to="/signup" className="btn-signup" onClick={onClose}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập nhưng giỏ hàng trống
  if (!cartItems || cartItems.length === 0) {
    return (
      <div 
        className="cart-tooltip"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="cart-tooltip-content">
          <div className="cart-empty-state">
            <div className="empty-cart-icon">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Empty Cart" />
            </div>
            <h3>No Products Yet</h3>
            <p>Add products to your cart</p>
            <Link to="/" className="btn-continue-shopping" onClick={onClose}>
                              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Đã có sản phẩm trong giỏ hàng
  const displayItems = cartItems.slice(0, 5); // Chỉ hiển thị 5 sản phẩm đầu tiên
  const remainingItems = cartItems.length - 5;

  return (
    <div 
      className="cart-tooltip"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="cart-tooltip-content">
        <div className="cart-header">
          <h3>Recently Added Products</h3>
          <span className="cart-count">{cartItems.length} products</span>
        </div>
        
        <div className="cart-items-list">
          {displayItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="cart-tooltip-item">
              <div className="item-image">
                <img 
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  onError={(e) => {
                    if (e.target && e.target['src']) {
                      e.target['src'] = '/images/placeholder-product.svg';
                    }
                  }}
                />
              </div>
              <div className="item-info">
                <h4 className="item-name">{item.name}</h4>
                <div className="item-details">
                  <span className="item-price">{formatPrice(item.price)}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {remainingItems > 0 && (
          <div className="more-items">
            <span>And {remainingItems} other products...</span>
          </div>
        )}

        <div className="cart-footer">
          <div className="cart-actions">
            <Link to="/cart" className="btn-view-cart" onClick={onClose}>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTooltip;