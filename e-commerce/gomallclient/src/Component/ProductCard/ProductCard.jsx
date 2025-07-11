import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./ProductCard.css";

export const RenderProduct = ({ product }) => {
  if (!product || !product.name) {
    console.warn("Invalid product data:", product);
    return <p style={{ color: "#ff4444", textAlign: "center" }}>Sản phẩm không hợp lệ</p>;
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  const formatSold = (sold) => (sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold);

  return (
    <Link to={`/product/${product.id || product._id}`} className="product-card-link">
      <div className="product-card">
        <img
          src={product.image || "/images/default-product.jpg"}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            console.error("Image load error for:", product.name);
            e.target.src = "/images/default-product.jpg";
          }}
        />
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="product-stats">
          <span className="rating">★ {product.rating || "N/A"}</span>
          <span className="sold">Đã bán {formatSold(product.sold || 0)}</span>
        </div>
      </div>
    </Link>
  );
};

const ProductCard = ({ product }) => <RenderProduct product={product} />;
export default ProductCard;