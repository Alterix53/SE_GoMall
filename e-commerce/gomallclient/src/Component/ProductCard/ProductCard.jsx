import "./ProductCard.css"

export const RenderProduct = ({ product }) => {
  if (!product || !product.name) {
    console.warn("Invalid product data:", product)
    return (
      <div className="product-card" style={{ minHeight: "300px", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#ff4444" }}>Sản phẩm không hợp lệ</p>
      </div>
    )
  }

  const formatPrice = (price) => {
    if (!price) return "0 ₫"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  const formatSold = (sold) => (sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold || 0)

  console.log("Rendering product:", product.name, product)

  return (
    <div className="product-card" style={{ minHeight: "300px" }}>
      {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
      {product.isFlashSale && <span className="flash-sale-badge">Flash Sale</span>}

      <div className="product-image">
        <img
          src={product.image || "/placeholder.svg?height=200&width=200&text=Product"}
          alt={product.name}
          onError={(e) => {
            console.error("Image load error for:", product.name)
            e.target.src = "/placeholder.svg?height=200&width=200&text=No+Image"
          }}
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
          <span className="rating">★ {product.rating || "N/A"}</span>
          <span className="sold">Đã bán {formatSold(product.sold)}</span>
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({ product }) => <RenderProduct product={product} />
export default ProductCard
