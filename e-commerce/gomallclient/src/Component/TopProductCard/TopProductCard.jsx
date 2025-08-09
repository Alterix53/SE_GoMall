import React from 'react';
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

  return (
    <div className="top-product-card">
      {/* Product Image */}
      <div className="product-image">
        <img
          src={product.image || "/placeholder.svg?height=200&width=200&text=Product"}
          alt={product.name}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=200&text=No+Image";
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-stats">
          <span className="rating">★{product.rating?.average || 0}</span>
          <span className="sold">Sold {product.sold || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default TopProductCard; 