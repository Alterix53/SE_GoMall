"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../ProductDetail/ProductDetail.css";
import ShopeeBanner from "../Banner/ShopeeBanner";
import { Heart, Truck, Minus, Plus, Clock, Star, StarHalf } from "lucide-react";

/* ---------- helpers ---------- */
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

/* ----- sample fallback (preview) ----- */
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
  rating: { average: 4.9, count: 97 },
  sold: 338,
  specifications: [
    { name: "color", value: "Đen/Hồng" },
    { name: "size", value: "M112, L96, XL84, XXL76" },
  ],
  description:
    "Gối cao su Contour LIÊN Á được làm từ 100% cao su thiên nhiên với thiết kế công thái học ôm sát vùng cổ vai gáy...",
  reviews: [
    {
      id: "r1",
      user: { name: "hientran2812", avatar: "" },
      rating: 5,
      createdAt: "2023-11-14T11:15:00Z",
      variantText: "Phân loại hàng: 44x63cm > 1m7",
      tags: ["Chất lượng tốt", "Đúng mô tả", "Chất liệu cao su non, mềm"],
      content:
        "Gối siêu mềm, êm, đúng với mô tả và ít mùi cao su nha. Mua cho anh xã mà 2 bé thích lắm, sẽ mua thêm nè. Săn deal được giá tốt. Giao hàng nhanh, có nhân viên CSKH gọi hỏi thăm nữa, best services luôn nè.",
      media: [
        "https://images.unsplash.com/photo-1604335399105-a0b8c19c6091?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop",
      ],
      helpful: 8,
    },
  ],
};

/* ================== PRESENTATIONAL ================== */
export function ProductOverview({ product: p }) {
  const product = p || sampleProduct;

  // Guards
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

  const color =
    getSpec("color")?.value ??
    product.color ??
    product.colour ??
    (product.colors && product.colors[0]) ??
    "Default";

  /* ----- Description ----- */
  const descHtml = product?.descriptionHtml || null;
  const descText = product?.description || "";
  const [expandedDesc, setExpandedDesc] = useState(false);
  const shouldToggle =
    (descHtml && /(<p|<br|<li|<ul|<ol)/i.test(descHtml)) ||
    (descText && String(descText).length > 400);

  /* ----- Reviews data & filters ----- */
  const allReviews = Array.isArray(product.reviews) ? product.reviews : [];
  const countsByStar = allReviews.reduce(
    (acc, r) => {
      const s = Math.max(1, Math.min(5, Math.floor(Number(r.rating) || 0)));
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );
  const countHasText = allReviews.filter((r) => r.content && r.content.trim()).length;
  const countHasMedia = allReviews.filter((r) => Array.isArray(r.media) && r.media.length).length;

  const [filter, setFilter] = useState("all"); // 'all' | '5'...'1' | 'text' | 'media'
  const filteredReviews = allReviews.filter((r) => {
    if (filter === "all") return true;
    if (filter === "text") return Boolean(r.content && r.content.trim());
    if (filter === "media") return Array.isArray(r.media) && r.media.length > 0;
    if (/^[1-5]$/.test(filter)) return Math.floor(Number(r.rating) || 0) === Number(filter);
    return true;
  });

  return (
    <>
      <ShopeeBanner />

      {/* ========== CARD OVERVIEW (giống Shopee) ========== */}
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
                      e.currentTarget.src =
                        "/placeholder.svg?height=600&width=600&text=No+Image";
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

                {/* Thumbs */}
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

                {/* flash sale line */}
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

                {/* vouchers */}
                <div className="pd-vouchers">
                  <span className="pd-v-label">Voucher Của Shop</span>
                  <div className="pd-v-tags">
                    <span className="pd-tag">Giảm ₫15k</span>
                    <span className="pd-tag">Giảm 8%</span>
                    <span className="pd-tag">Giảm 9%</span>
                  </div>
                </div>

                {/* shipping */}
                <div className="pd-vouchers">
                  <span className="pd-v-label">Vận Chuyển</span>
                  <div className="pd-v-tags" style={{ color: "#166534" }}>
                    <Truck size={16} />
                    <span>Nhận từ 13 Th08 - 15 Th08, phí giao ₫0</span>
                  </div>
                </div>

                {/* guarantees */}
                <div className="pd-promises">
                  <span>🛡️ Xử lý đơn hàng bởi Shopee</span>
                  <span>Trả hàng miễn phí 15 ngày</span>
                  <span>Chính hãng 100%</span>
                </div>

                {/* color */}
                <div className="pd-row" style={{ marginTop: 6 }}>
                  <span className="pd-row-label">Màu sắc</span>
                  <div className="pd-size-list">
                    <button className="pd-size is-selected">{String(color)}</button>
                  </div>
                </div>

                {/* size */}
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
                    <button
                      className="pd-step"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
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

          {/* ========== DESCRIPTION ========== */}
          <div className="pd-desc-wrap">
            <div className="pd-desc-card">
              <h3 className="pd-desc-title">MÔ TẢ SẢN PHẨM</h3>
              <div className={`pd-desc-content ${expandedDesc ? "is-open" : ""}`}>
                {descHtml ? (
                  <div
                    className="pd-desc-html"
                    dangerouslySetInnerHTML={{ __html: descHtml }}
                  />
                ) : (
                  <pre className="pd-desc-pre">{descText}</pre>
                )}
              </div>
              {shouldToggle && (
                <button className="pd-desc-toggle" onClick={() => setExpandedDesc((v) => !v)}>
                  {expandedDesc ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
          </div>

          {/* ========== REVIEWS ========== */}
          {allReviews.length > 0 && (
            <div className="pd-rev-wrap">
              <div className="pd-rev-card">
                <h3 className="pd-rev-title">ĐÁNH GIÁ SẢN PHẨM</h3>

                {/* Summary + Filters */}
                <div className="pd-rev-summary">
                  <div className="pd-rev-score">
                    <div className="pd-rev-score-num">
                      {ratingAvg.toFixed(1)} <span>trên 5</span>
                    </div>
                    <div className="pd-rev-stars">
                      <StarRating rating={ratingAvg} size={18} />
                    </div>
                  </div>

                  <div className="pd-rev-filters">
                    <button
                      className={`pd-chip ${filter === "all" ? "is-active" : ""}`}
                      onClick={() => setFilter("all")}
                    >
                      Tất Cả
                    </button>
                    <button
                      className={`pd-chip ${filter === "5" ? "is-active" : ""}`}
                      onClick={() => setFilter("5")}
                    >
                      5 Sao ({countsByStar[5]})
                    </button>
                    <button
                      className={`pd-chip ${filter === "4" ? "is-active" : ""}`}
                      onClick={() => setFilter("4")}
                    >
                      4 Sao ({countsByStar[4]})
                    </button>
                    <button
                      className={`pd-chip ${filter === "3" ? "is-active" : ""}`}
                      onClick={() => setFilter("3")}
                    >
                      3 Sao ({countsByStar[3]})
                    </button>
                    <button
                      className={`pd-chip ${filter === "2" ? "is-active" : ""}`}
                      onClick={() => setFilter("2")}
                    >
                      2 Sao ({countsByStar[2]})
                    </button>
                    <button
                      className={`pd-chip ${filter === "1" ? "is-active" : ""}`}
                      onClick={() => setFilter("1")}
                    >
                      1 Sao ({countsByStar[1]})
                    </button>
                    <button
                      className={`pd-chip ${filter === "text" ? "is-active" : ""}`}
                      onClick={() => setFilter("text")}
                    >
                      Có Bình Luận ({countHasText})
                    </button>
                    <button
                      className={`pd-chip ${filter === "media" ? "is-active" : ""}`}
                      onClick={() => setFilter("media")}
                    >
                      Có Hình Ảnh / Video ({countHasMedia})
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="pd-rev-list">
                  {filteredReviews.map((r) => (
                    <div key={r.id} className="pd-rev-item">
                      <div className="pd-rev-avatar">{(r.user?.name || "?")[0]}</div>
                      <div className="pd-rev-body">
                        <div className="pd-rev-head">
                          <div className="pd-rev-user">{r.user?.name || "Người dùng"}</div>
                          <StarRating rating={Number(r.rating || 0)} size={14} />
                        </div>

                        <div className="pd-rev-meta">
                          {r.createdAt && (
                            <span>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                          )}
                          {r.variantText && <span> | {r.variantText}</span>}
                        </div>

                        {/* Optional tags row */}
                        {Array.isArray(r.tags) && r.tags.length > 0 && (
                          <div className="pd-rev-tags">
                            {r.tags.map((t, i) => (
                              <span className="pd-rev-tag" key={i}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {r.content && <div className="pd-rev-text">{r.content}</div>}

                        {/* Media grid */}
                        {Array.isArray(r.media) && r.media.length > 0 && (
                          <div className="pd-rev-media">
                            {r.media.slice(0, 6).map((m, i) => (
                              <div className="pd-rev-thumb" key={i}>
                                <img
                                  src={m}
                                  alt={`media-${i}`}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder.svg?height=120&width=120&text=No+Img";
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pd-rev-actions">
                          <button className="pd-rev-helpful">👍 {r.helpful || 0}</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredReviews.length === 0 && (
                    <div className="pd-rev-empty">Chưa có đánh giá phù hợp bộ lọc.</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* /REVIEWS */}
        </div>
      </div>
    </>
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

  if (loading) return <div className="pd-loading">Đang tải sản phẩm…</div>;
  if (error)
    return (
      <div className="pd-error">
        <div className="pd-error-title">Lỗi</div>
        <div className="pd-error-desc">{error}</div>
      </div>
    );

  return <ProductOverview product={product || undefined} />;
}

export default ProductDetailPage;
