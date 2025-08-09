import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './CartTooltip.css';

const CartTooltip = ({ isVisible, onClose }) => {
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
      <div className="cart-tooltip">
        <div className="cart-tooltip-content">
          <div className="cart-empty-state">
            <div className="empty-cart-icon">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Empty Cart" />
            </div>
            <h3>Chưa Có Sản Phẩm</h3>
            <p>Đăng nhập để xem giỏ hàng của bạn</p>
            <div className="cart-auth-buttons">
              <Link to="/login" className="btn-login" onClick={onClose}>
                Đăng Nhập
              </Link>
              <Link to="/signup" className="btn-signup" onClick={onClose}>
                Đăng Ký
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
      <div className="cart-tooltip">
        <div className="cart-tooltip-content">
          <div className="cart-empty-state">
            <div className="empty-cart-icon">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg" alt="Empty Cart" />
            </div>
            <h3>Chưa Có Sản Phẩm</h3>
            <p>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <Link to="/" className="btn-continue-shopping" onClick={onClose}>
              Tiếp Tục Mua Sắm
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
    <div className="cart-tooltip">
      <div className="cart-tooltip-content">
        <div className="cart-header">
          <h3>Sản Phẩm Mới Thêm</h3>
          <span className="cart-count">{cartItems.length} sản phẩm</span>
        </div>
        
        <div className="cart-items-list">
          {displayItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="cart-tooltip-item">
              <div className="item-image">
                <img 
                  src={item.image || '/images/placeholder-product.jpg'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
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
            <span>Và {remainingItems} sản phẩm khác...</span>
          </div>
        )}

        <div className="cart-footer">
          <div className="cart-total">
            <span className="total-label">Tổng cộng:</span>
            <span className="total-price">{formatPrice(getTotalPrice())}</span>
          </div>
          <div className="cart-actions">
            <Link to="/cart" className="btn-view-cart" onClick={onClose}>
              Xem Giỏ Hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTooltip;