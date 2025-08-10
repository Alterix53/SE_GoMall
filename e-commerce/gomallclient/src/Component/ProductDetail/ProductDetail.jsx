"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { Heart, Truck, Minus, Plus, Clock, Star, StarHalf } from "lucide-react";

/* ---------- Small helpers ---------- */
function StarRating({ rating = 0, size = 16 }) {
  const r = Number.isFinite(rating) ? rating : 0;
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(Math.max(0, full))].map((_, i) => (
        <Star key={"f-" + i} size={size} className="text-yellow-500 fill-yellow-500" />
      ))}
      {half && <StarHalf size={size} className="text-yellow-500 fill-yellow-500" />}
      {[...Array(Math.max(0, empty))].map((_, i) => (
        <Star key={"e-" + i} size={size} className="text-muted-foreground" />
      ))}
    </div>
  );
}

/* ---------- Fallback sample (preview when no API) ---------- */
const sampleProduct = {
  _id: "sample123",
  name: "KAPPA giày sneakers bé gái 361c44w",
  images: [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
  ],
  price: { original: 1199000, sale: 194000 },
  rating: { average: 5.0, count: 87 },
  sold: 338,
  specifications: [
    { name: "color", value: "Đen/Hồng" },
    { name: "size", value: "32, 33, 34, 35" },
  ],
};

/* ---------- PRESENTATIONAL ---------- */
export function ProductOverview({ product: p }) {
  const product = p || sampleProduct;

  // Robust guards for various backend shapes
  const specs =
    (Array.isArray(product.specifications) && product.specifications) ||
    (Array.isArray(product.specs) && product.specs) ||
    [];

  const getSpec = (key) => {
    const lower = String(key).toLowerCase();
    return (
      specs.find((s) => String(s.name ?? s.key ?? s.label).toLowerCase() === lower) || null
    );
  };

  // Images: accept images[] | image | thumbnail
  const images = (() => {
    if (Array.isArray(product.images) && product.images.length) return product.images;
    const fallback = [product.image, product.thumbnail, product.thumbnailUrl].filter(Boolean);
    return fallback.length ? fallback : ["/placeholder.svg?height=600&width=600&text=No+Image"];
  })();

  // Price
  const priceObj = product.price || { sale: product.salePrice, original: product.originalPrice };
  const finalPrice = useMemo(
    () => Number(priceObj?.sale ?? priceObj?.original ?? 0),
    [priceObj]
  );

  // Rating
  const ratingAvg = Number(product?.rating?.average ?? product?.rating ?? 0);
  const ratingCount = Number(product?.rating?.count ?? product?.reviewsCount ?? 0);

  // Sizes (support: specifications.size OR product.sizes[])
  const sizeString = getSpec("size")?.value;
  const sizes = sizeString
    ? String(sizeString)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : Array.isArray(product.sizes)
    ? product.sizes.map(String)
    : [];

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  // Color
  const color =
    getSpec("color")?.value ??
    product.color ??
    product.colour ??
    (product.colors && product.colors[0]) ??
    "Default";

  return (
    <div className="product-overview-section">
      <div className="product-main-grid">
        {/* LEFT: Images */}
        <div className="product-images">
          <div className="main-image-wrapper">
            <img
              src={images[activeImage] || images[0]}
              alt={product.name || "product"}
              className="main-product-image"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=600&width=600&text=No+Image";
              }}
            />
            <button
              className={`like-button ${liked ? "liked" : ""}`}
              onClick={() => setLiked((v) => !v)}
              aria-label="Thích sản phẩm"
              title={liked ? "Đã thích" : "Thích"}
            >
              <Heart size={20} />
            </button>
          </div>

          <div className="thumbnail-grid">
            {images.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                className={`thumbnail-item ${activeImage === idx ? "active" : ""}`}
                onClick={() => setActiveImage(idx)}
              >
                <img
                  src={img}
                  alt={`thumb-${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=120&width=120&text=No+Img";
                  }}
                />
                {idx === 1 && <div className="thumbnail-discount">-50%</div>}
              </button>
            ))}
          </div>

          <div className="social-share-section">
            <span className="share-label">Chia sẻ:</span>
            <div className="social-buttons">
              <button className="social-btn messenger" />
              <button className="social-btn facebook" />
              <button className="social-btn pinterest" />
              <button className="social-btn twitter" />
            </div>
            <div className="like-count">
              <Heart size={16} />
              <span>Đã thích (37)</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="product-info">
          <div className="mall-badge">Mall</div>

          <h1 className="product-title">{product.name || "Tên sản phẩm"}</h1>

          {/* rating | reviews | sold */}
          <div className="rating-sales-row">
            <div className="rating-display">
              <span className="rating-score">{ratingAvg.toFixed(1)}</span>
              <StarRating rating={ratingAvg} size={16} />
            </div>
            <div className="review-count">
              <span className="review-number">{ratingCount}</span>
              <span className="review-label">Đánh Giá</span>
            </div>
            <div className="review-count">
              <span className="review-number">{product.sold ? `${product.sold}+` : "0"}</span>
              <span className="review-label">Đã bán</span>
            </div>
            <div className="report-link">Tố cáo</div>
          </div>

          {/* flash sale */}
          <div className="flash-sale-bar">
            <span className="flash-sale-text">FLASH SALE</span>
            <div className="countdown-section">
              <Clock size={16} />
              <span>KẾT THÚC TRONG</span>
              <div className="countdown-timer">
                <span className="time-digit">00</span>
                <span className="time-digit">00</span>
                <span className="time-digit">00</span>
              </div>
            </div>
          </div>

          {/* price */}
          <div className="price-display">
            <div className="current-price">
              <span className="currency-symbol">₫</span>
              <span className="price-value">
                {new Intl.NumberFormat("vi-VN").format(finalPrice)}
              </span>
              {priceObj?.original && priceObj.original !== finalPrice && (
                <span className="original-price">
                  ₫{new Intl.NumberFormat("vi-VN").format(priceObj.original)}
                </span>
              )}
            </div>
          </div>

          {/* vouchers */}
          <div className="voucher-row">
            <span className="voucher-label">Voucher Của Shop</span>
            <div className="voucher-badges">
              <span className="voucher-badge">Giảm ₫5k</span>
              <span className="voucher-badge">Giảm 10%</span>
            </div>
          </div>

          {/* shipping */}
          <div className="shipping-info">
            <span className="shipping-label">Vận Chuyển</span>
            <div className="shipping-details">
              <Truck size={16} className="shipping-icon" />
              <span className="shipping-text">Nhận từ 11 Th08 - 15 Th08, phí giao ₫0</span>
              <span className="arrow">›</span>
            </div>
            <div className="shipping-bonus">
              Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.
            </div>
          </div>

          {/* guarantees */}
          <div className="service-guarantees">
            <span className="service-label">An Tâm Mua Sắm Cùng Shopee</span>
            <div className="service-list">
              <span className="service-item">🛡️ Trả hàng miễn phí 15 ngày</span>
              <span className="service-item">Chính hãng 100%</span>
              <span className="service-item">Miễn phí vận chuyển</span>
              <span className="service-item">Bảo hành chính hãng</span>
              <span className="arrow">›</span>
            </div>
          </div>

          {/* color */}
          <div className="option-group">
            <label className="option-label">Màu Sắc</label>
            <div className="color-options">
              <button className="color-option selected">
                <span className="color-display">{color}</span>
              </button>
            </div>
          </div>

          {/* size */}
          {sizes.length > 0 && (
            <div className="option-group">
              <label className="option-label">Size</label>
              <div className="size-options">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-option ${selectedSize === sz ? "selected" : ""}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <div className="size-guide-link">Bảng Quy Đổi Kích Cỡ ›</div>
            </div>
          )}

          {/* quantity */}
          <div className="quantity-group">
            <label className="quantity-label">Số Lượng</label>
            <div className="quantity-stepper">
              <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus size={16} />
              </button>
              <input
                type="text"
                className="qty-input"
                value={String(quantity)}
                onChange={(e) => {
                  const n = parseInt(e.target.value || "1", 10);
                  isNaN(n) ? setQuantity(1) : setQuantity(Math.max(1, n));
                }}
              />
              <button className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* actions */}
          <div className="action-buttons">
            <button className="btn-add-cart" onClick={() => alert("Đã thêm vào giỏ!")}>
              Thêm Vào Giỏ Hàng
            </button>
            <button className="btn-buy-now" onClick={() => alert("Mua ngay!")}>
              <span>Mua ngay</span>
              <span className="buy-price">
                ₫{new Intl.NumberFormat("vi-VN").format(finalPrice)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGE WRAPPER: /product/:id ---------- */
function ProductDetailPage({ fetchProductById }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!id || !fetchProductById) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (alive) setProduct(data);
      } catch (e) {
        if (alive) setError(e?.message || "Không tải được sản phẩm");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [id, fetchProductById]);

  if (loading) return <div className="p-6">Đang tải sản phẩm…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return <ProductOverview product={product || undefined} />;
}

export default ProductDetailPage;
