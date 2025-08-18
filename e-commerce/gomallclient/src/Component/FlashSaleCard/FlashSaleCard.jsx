import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlashSaleCard.css';
import OptimizedImage from '../../utils/OptimizedImage';

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

  const navigate = useNavigate();

  const productId = product?.id || product?._id;

  const goToDetail = () => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  return (
    <div className="flash-sale-card">
      {/* Product Image */}
      <div className="product-image">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          lazy={true}
          fallbackUrl={
            'data:image/svg+xml;base64,' + btoa(
              `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">No Image</text>
              </svg>`
            )
          }
          onLoad={() => {}}
          onError={() => {}}
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
        <div className="product-name" title={product.name}>
          {product.name}
        </div>
        <div className="product-price">{formatPrice(product.price)}</div>
        <button
          type="button"
          className="selling-fast-btn"
          onClick={goToDetail}
          disabled={!productId}
          aria-label="Xem chi tiết sản phẩm"
        >
          ĐANG BÁN CHẠY
        </button>
      </div>
    </div>
  );
};

export default FlashSaleCard; 