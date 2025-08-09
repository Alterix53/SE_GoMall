import React from 'react';
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

  return (
    <div className="flash-sale-card">
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
      
      {/* Promotional Labels */}
      <div className="promo-labels">
        <div className="promo-label left">8.8</div>
        <div className="promo-label right">
          {product.discount ? formatDiscount(product.discount) : ''}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <div className="product-price">{formatPrice(product.price)}</div>
        <button className="selling-fast-btn">ĐANG BÁN CHẠY</button>
      </div>
    </div>
  );
};

export default FlashSaleCard; 