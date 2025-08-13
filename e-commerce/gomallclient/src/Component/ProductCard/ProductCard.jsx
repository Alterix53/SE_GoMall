import { Link } from "react-router-dom";
import "./ProductCard.css"
import OptimizedImage from "../../utils/OptimizedImage";

export const RenderProduct = ({ product }) => {
  if (!product || !product.name) {
    console.warn("Invalid product data:", product)
    return (
      <div className="product-card" style={{ minHeight: "300px", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#ff4444" }}>Invalid product</p>
      </div>
    )
  }

  const formatPrice = (price) => {
    if (!price) return "0 ₫"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  const formatSold = (sold) => (sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold || 0)

  console.log("Rendering product:", product.name, product)
  const productId = product.id || product._id

  return (
    <Link to={`/product/${productId}`} className="product-card" style={{ minHeight: "300px", display: "block", color: "inherit", textDecoration: "none" }}>
      {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
      {product.isFlashSale && <span className="flash-sale-badge">Flash Sale</span>}

      <div className="product-image">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="product-image"
          lazy={true}
          fallbackUrl="/images/default-product.jpg"
          onLoad={() => {}}
          onError={() => {}}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-section">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="product-stats">
          <span className="rating">★ {typeof product.rating === 'object' ? product.rating?.average || 0 : product.rating || "N/A"}</span>
          <span className="sold">Sold {formatSold(product.sold)}</span>
        </div>
      </div>
    </Link>
  )
}

const ProductCard = ({ product }) => <RenderProduct product={product} />
export default ProductCard
