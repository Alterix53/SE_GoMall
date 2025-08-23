import React from 'react';
import { Link } from 'react-router-dom';
import './FlashSaleCard.css';

const FlashSaleCard = ({ product }) => {
  const formatPrice = (price) => {
    if (!price) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDiscount = (discount) => {
    return discount ? `-${discount}%` : '';
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

  const formatRating = (rating) => {
    if (!rating || !rating.average) return "0.0";
    return rating.average.toFixed(1);
  };

  const sale = product?.price?.sale ?? product?.price ?? 0;
  const original = product?.price?.original ?? product?.originalPrice ?? 0;
  const discount = original && original > sale ? Math.round(((original - sale) / original) * 100) : (product.discount || 0);
  const imageSrc = product?.image || (product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/placeholder-product.svg");

  return (
    <Link to={`/product/${product._id}`} className="flash-sale-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      {/* Product Image */}
      <div className="product-image">
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => {
            if (e.target && e.target['src'] !== "/images/placeholder-product.svg") {
              e.target['src'] = "/images/placeholder-product.svg";
            }
          }}
          style={{
            backgroundColor: '#f8f9fa',
            objectFit: 'cover',
            width: '100%',
            height: '200px'
          }}
        />
        
        {/* Flash Sale Badge */}
        <div className="flash-sale-badge">
          🔥 Flash Sale
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="discount-badge">
            {formatDiscount(discount)}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        {/* Product Name */}
        <div className="product-name">
          {product.name || "Product"}
        </div>
        
        {/* Price Section */}
        <div className="price-section">
          <div className="current-price">{formatPrice(sale)}</div>
          {original && original > sale && (
            <div className="original-price">{formatPrice(original)}</div>
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
    </Link>
  );
};

export default FlashSaleCard; 