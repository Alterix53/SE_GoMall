import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopProductCard.css';
import OptimizedImage from '../../utils/OptimizedImage';

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

  const navigate = useNavigate();
  const productId = product?.id || product?._id;

  const goToDetail = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (!productId) return;
    navigate(`/product/${productId}`);
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
    <div className="top-product-card" onClick={goToDetail}>
      {/* Product Image */}
      <div className="product-image">
        <OptimizedImage
          src={product.image || "/images/placeholder-product.svg"}
          alt={product.name}
          lazy
          fallbackUrl={"/images/placeholder-product.svg"}
          onLoad={() => {}}
          onError={() => {}}
          style={{ backgroundColor: '#f8f9fa', objectFit: 'cover', width: '100%', height: '200px' }}
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
        <div className="product-name" title={product.name}>
          {product.name || "Product"}
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
            Sold {formatSold(product.sold)}
          </div>
        </div>
        
        {/* Action Button */}
        <button className="selling-fast-btn">SELLING FAST</button>
      </div>
    </div>
  );
};

export default TopProductCard; 