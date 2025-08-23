import React from 'react';
import { Link } from 'react-router-dom';
import './TopProductCard.css';

const TopProductCard = ({ product }) => {
  const formatPrice = (price) => {
    if (!price) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatRating = (rating) => {
    if (!rating || !rating.average) return "0.0";
    return rating.average.toFixed(1);
  };

  const formatSold = (sold) => {
    if (!sold) return "0";
    if (sold >= 1000000) {
      return `${(sold / 1000000).toFixed(1)}M`;
    } else if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k`;
    }
    return sold.toString();
  };

  return (
    <Link to={`/product/${product._id}`} className="top-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      {/* Product Image */}
      <div className="product-image">
        <img
          src={product.image || "/images/placeholder-product.svg"}
          alt={product.name}
          onError={(e) => {
            if (e.target.src !== "/images/placeholder-product.svg") {
              e.target.src = "/images/placeholder-product.svg";
            }
          }}
          style={{
            backgroundColor: '#f8f9fa',
            objectFit: 'cover',
            width: '100%',
            height: '200px'
          }}
        />
        
        {/* Rating Badge */}
        <div className="rating-badge">
          ★ {formatRating(product.rating)}
        </div>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        {/* Product Name */}
        <div className="product-name">
          {product.name || "Sản phẩm"}
        </div>
        
        {/* Price Section */}
        <div className="price-section">
          <div className="current-price">{formatPrice(product.price)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="original-price">{formatPrice(product.originalPrice)}</div>
          )}
        </div>
        
        {/* Rating and Sold */}
        <div className="product-stats">
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{formatRating(product.rating)}</span>
          </div>
          <div className="sold-count">
            Đã bán {formatSold(product.sold)}
          </div>
        </div>
        
        {/* Action Button */}
        <button className="selling-fast-btn">ĐANG BÁN CHẠY</button>
      </div>
    </Link>
  );
};

export default TopProductCard; 