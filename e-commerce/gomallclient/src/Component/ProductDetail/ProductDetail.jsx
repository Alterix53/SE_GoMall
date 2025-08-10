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
    <span className="flex items-center gap-1" style={{ lineHeight: 1 }}>
      {[...Array(Math.max(0, full))].map((_, i) => (
        <Star key={"f-" + i} size={size} className="text-yellow-500 fill-yellow-500" />
      ))}
      {half && <StarHalf size={size} className="text-yellow-500 fill-yellow-500" />}
      {[...Array(Math.max(0, empty))].map((_, i) => (
        <Star key={"e-" + i} size={size} className="text-muted-foreground" />
      ))}
    </span>
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

/* ---------- PRESENTATIONAL (đổi class sang pd-*) ---------- */
export function ProductOverview({ product: p }) {
  const product = p || sampleProduct;

  // Guards cho nhiều dạng backend
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

  // Images
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

  // Sizes
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
    <div className="pd-main">
      <div className="pd-container">
        <div className="pd-card">
          <div className="pd-grid">
            {/* LEFT */}
            <div className="pd-left">
              <div className="pd-main-img">
                <img
                  src={images[activeImage] || images[0]}
                  alt={product.name || "product"}
                  className="pd-main-img__img"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=600&width=600&text=No+Image";
                  }}
                />
                <button
                  className={`pd-like ${liked ? "is-liked" : ""}`}
                  onClick={() => setLiked((v) => !v)}
                  aria-label="Thích sản phẩm"
                  title={liked ? "Đã thích" : "Thích"}
                >
                  ♥
                </button>
              </div>

              {/* Thumbnails */}
              <div className="pd-thumbs">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb ${activeImage === idx ? "is-active" : ""}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=120&width=120&text=No+Img";
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Share row */}
              <div className="pd-share-row">
                <span className="pd-share-label">Chia sẻ:</span>
                <span className="pd-share-dot" />
                <span className="pd-share-dot" />
                <span className="pd-share-dot" />
                <span className="pd-share-dot" />
                <div className="pd-liked">
                  <span className="pd-heart">♥</span>
                  <span>Đã thích (4,9k)</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="pd-right">
              <span className="pd-mall-chip">Mall</span>
              <h1 className="pd-title">{product.name || "Tên sản phẩm"}</h1>

              {/* meta: rating | reviews | sold */}
              <div className="pd-meta">
                <span className="pd-rating">{ratingAvg.toFixed(1)}</span>
                <StarRating rating={ratingAvg} size={14} />
                <span className="pd-dot">|</span>
                <span>{ratingCount} Đánh Giá</span>
                <span className="pd-dot">|</span>
                <span>{product.sold ? `${product.sold}+` : "0"} Đã bán</span>
                <span className="pd-dot">|</span>
                <span style={{ cursor: "pointer" }}>Tố cáo</span>
              </div>

              {/* flash sale bar (chỉ hiển thị dải màu & timer) */}
              <div className="pd-vouchers" style={{ marginTop: 4 }}>
                <span className="pd-v-label" style={{ minWidth: 100 }}>
                  <b>FLASH SALE</b>
                </span>
                <div className="pd-v-tags" style={{ alignItems: "center" }}>
                  <Clock size={14} />
                  <span>KẾT THÚC TRONG</span>
                  <span className="pd-tag">00</span>
                  <span className="pd-tag">00</span>
                  <span className="pd-tag">00</span>
                </div>
              </div>

              {/* price */}
              <div className="pd-price-box">
                <div className="pd-price">
                  <span className="pd-price__sale">
                    ₫{new Intl.NumberFormat("vi-VN").format(finalPrice)}
                  </span>
                  {priceObj?.original && priceObj.original !== finalPrice && (
                    <span className="pd-price__orig">
                      ₫{new Intl.NumberFormat("vi-VN").format(priceObj.original)}
                    </span>
                  )}
                </div>
              </div>

              {/* vouchers line */}
              <div className="pd-vouchers">
                <span className="pd-v-label">Voucher Của Shop</span>
                <div className="pd-v-tags">
                  <span className="pd-tag">Giảm ₫15k</span>
                  <span className="pd-tag">Giảm 8%</span>
                  <span className="pd-tag">Giảm 9%</span>
                </div>
              </div>

              {/* shipping block (giống ảnh – một dòng) */}
              <div className="pd-vouchers">
                <span className="pd-v-label">Vận Chuyển</span>
                <div className="pd-v-tags" style={{ color: "#166534" }}>
                  <Truck size={16} />
                  <span>Nhận từ 13 Th08 - 15 Th08, phí giao ₫0</span>
                </div>
              </div>

              {/* guarantees (an tâm mua sắm) */}
              <div className="pd-promises">
                <span>🛡️ Xử lý đơn hàng bởi Shopee</span>
                <span>Trả hàng miễn phí 15 ngày</span>
                <span>Chính hãng 100%</span>
              </div>

              {/* màu sắc */}
              <div className="pd-row" style={{ marginTop: 6 }}>
                <span className="pd-row-label">Màu sắc</span>
                <div className="pd-size-list">
                  <button className="pd-size is-selected">{String(color)}</button>
                </div>
              </div>

              {/* phân loại/size */}
              {sizes.length > 0 && (
                <div className="pd-row" style={{ marginTop: 6 }}>
                  <span className="pd-row-label">Phân Loại</span>
                  <div className="pd-size-list">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        className={`pd-size ${selectedSize === sz ? "is-selected" : ""}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* quantity */}
              <div className="pd-qty-row" style={{ marginTop: 6 }}>
                <span className="pd-row-label">Số Lượng</span>
                <div className="pd-stepper">
                  <button className="pd-step" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    -
                  </button>
                  <input
                    id="pd-qty-input"
                    value={String(quantity)}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "1", 10);
                      isNaN(n) ? setQuantity(1) : setQuantity(Math.max(1, n));
                    }}
                  />
                  <button className="pd-step" onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </button>
                </div>
              </div>

              {/* actions */}
              <div className="pd-actions" style={{ marginTop: 8 }}>
                <button className="pd-btn-outline" onClick={() => alert("Đã thêm vào giỏ!")}>
                  Thêm Vào Giỏ Hàng
                </button>
                <button className="pd-btn" onClick={() => alert("Mua ngay!")}>
                  Mua Với Voucher
                  <div style={{ fontWeight: 800 }}>
                    ₫{new Intl.NumberFormat("vi-VN").format(finalPrice)}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGE WRAPPER: /product/:id (giữ nguyên cấu trúc lấy data) ---------- */
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

  if (loading) return <div className="pd-loading">Đang tải sản phẩm…</div>;
  if (error) return (
    <div className="pd-error">
      <div className="pd-error-title">Lỗi</div>
      <div className="pd-error-desc">{error}</div>
    </div>
  );

  return <ProductOverview product={product || undefined} />;
}

export default ProductDetailPage;
