import { Link } from "react-router-dom";
import "./ProductCard.css"
import OptimizedImage from "../../utils/OptimizedImage";

export const RenderProduct = ({ product }) => {
  if (!product || !product.name) {
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

  const productId = product.id || product._id
  const priceValue = product?.price?.sale ?? product?.price?.original ?? product?.price ?? 0
  const originalValue = product?.price?.original ?? product?.originalPrice ?? 0
  const discountPercent = (originalValue && priceValue && originalValue > priceValue)
    ? Math.round(((originalValue - priceValue) / originalValue) * 100)
    : (product.discount || 0)

  // Get main image from images array or fallback to single image
  const getMainImage = () => {
    if (product.images && product.images.length > 0) {
      // Find the primary image
      const primaryImage = product.images.find(img => img.isPrimary);
      if (primaryImage) {
        return primaryImage.url;
      }
      // Fallback to first image if no primary is set
      return product.images[0].url;
    }
    // Fallback to single image field
    return product.image;
  };

  const mainImageUrl = getMainImage();

  return (
    <Link to={`/product/${productId}`} className="product-card" style={{ minHeight: "300px", display: "block", color: "inherit", textDecoration: "none" }}>
      {discountPercent > 0 && <span className="discount-badge">-{discountPercent}%</span>}
      {product.isFlashSale && <span className="flash-sale-badge">Flash Sale</span>}

      <div className="product-image">
        <OptimizedImage
          src={mainImageUrl}
          alt={product.name}
          className="product-image"
          lazy={true}
          fallbackUrl="/images/placeholder-product.svg"
          onLoad={() => {}}
          onError={() => {}}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-section">
          <span className="current-price">{formatPrice(priceValue)}</span>
          {originalValue && originalValue > priceValue && (
            <span className="original-price">{formatPrice(originalValue)}</span>
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
