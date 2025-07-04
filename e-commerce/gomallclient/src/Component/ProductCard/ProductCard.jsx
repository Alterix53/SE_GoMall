import React, { memo } from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatSold = (sold) => {
    if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k`;
    }
    return sold.toString();
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.id);
  };

  // Kiểm tra dữ liệu và tránh render lỗi
  if (!product || !product.name) return null;

  return (
      <div className="product-card" key={product.id}> {/* Đảm bảo key duy nhất từ cấp cha */}
        {/* Discount Badge */}
        {product.discount && <div className="discount-badge">-{product.discount}%</div>}

        {/* Flash Sale Badge */}
        {product.flashSale && <div className="flash-sale-badge">⚡ FLASH</div>}

        {/* Rank Badge */}
        {product.rank && product.rank <= 3 && (
            <div className={`rank-badge rank-${product.rank}`}>#{product.rank}</div>
        )}

        <div className="product-link">
          {/* Product Image */}
          <div className="product-image">
            <img
                src={product.image || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=200&width=200"; // Đảm bảo chỉ gán một lần
                  e.target.onerror = null; // Ngăn chặn lặp onError
                }}
            />
            <div className="image-overlay"></div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h3 className="product-name" key={product.id + "-name"}>{product.name}</h3> {/* Key duy nhất */}
            {/* Price */}
            <div className="price-section">
              <div className="current-price">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                  <div className="original-price">{formatPrice(product.originalPrice)}</div>
              )}
            </div>

            {/* Rating and Sold */}
            <div className="product-stats">
              <div className="rating">
                <i className="fas fa-star"></i>
                <span>{product.rating}</span>
              </div>
              <div className="sold">Đã bán {formatSold(product.sold)}</div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <i className="fas fa-shopping-cart"></i>
          Thêm vào giỏ
        </button>
      </div>
  );
};

export default memo(ProductCard);