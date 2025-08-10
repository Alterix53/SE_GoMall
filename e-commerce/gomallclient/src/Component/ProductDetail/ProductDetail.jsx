import React, { useMemo, useState } from "react";
import "./ProductDetail.css";

function formatVND(n) {
  if (n == null) return "₫0";
  return `₫${new Intl.NumberFormat("vi-VN").format(Math.round(Number(n)))}`;
}

export default function ProductDetail() {
  // ====== dữ liệu tĩnh (giống mock / ảnh) ======
  const product = {
    id: 1,
    name: "iPhone 15 Pro Max",
    images: [
      "/images/iphone-15-pro-max.jpg",
      "/images/iphone-15-pro-max.jpg",
      "/images/iphone-15-pro-max.jpg",
      "/images/iphone-15-pro-max.jpg",
      "/images/iphone-15-pro-max.jpg",
    ],
    price: {
      original: 35000000,
      sale: 4500000,
    },
    rating: { average: 0.0, count: 365 },
    sold: 338,
    sizes: ["128GB", "256GB", "512GB", "1TB"],
  };

  // ====== state UI ======
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [shippingTo, setShippingTo] = useState("TP. Hồ Chí Minh");

  const finalPrice = useMemo(() => {
    return product.price?.sale || product.price?.original || 0;
  }, []);

  const addToCart = () => alert("Đã thêm vào giỏ!");
  const buyNow = () => alert("Đi đến thanh toán…");

  return (
    <main className="pd-main">
      <div className="pd-container">
        <div className="pd-card">
          <div className="pd-grid">
            {/* LEFT: ẢNH */}
            <section className="pd-left">
              <div className="pd-main-img">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="pd-main-img__img"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder.svg?height=400&width=400&text=No+Image";
                  }}
                />

                <button
                  className={`pd-like ${liked ? "is-liked" : ""}`}
                  onClick={() => setLiked((v) => !v)}
                  aria-label="like"
                  title={liked ? "Đã thích" : "Thích"}
                >
                  ♥
                </button>
              </div>

              {/* thumbnails */}
              <div className="pd-thumbs">
                {product.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb ${idx === activeImage ? "is-active" : ""}`}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Ảnh ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=80&width=80&text=No+Img";
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* chia sẻ */}
              <div className="pd-share-row">
                <span className="pd-share-label">Chia sẻ:</span>
                <button className="pd-share-dot" aria-label="facebook" />
                <button className="pd-share-dot" aria-label="messenger" />
                <button className="pd-share-dot" aria-label="pinterest" />
                <button className="pd-share-dot" aria-label="x" />
                <div className="pd-liked">
                  <span className="pd-heart">♡</span> Đã thích
                </div>
              </div>
            </section>

            {/* RIGHT: THÔNG TIN */}
            <section className="pd-right">
              <span className="pd-mall-chip">MALL</span>
              <h1 className="pd-title">{product.name}</h1>

              {/* meta: rating | reviews | sold */}
              <div className="pd-meta">
                <span className="pd-rating">{product.rating.average.toFixed(1)}</span>
                <span className="pd-dot">|</span>
                <span className="pd-reviews">{product.rating.count} Đánh giá</span>
                <span className="pd-dot">|</span>
                <span className="pd-sold">{product.sold}+ Đã bán</span>
              </div>

              {/* giá */}
              <div className="pd-price-box">
                <div className="pd-price">
                  <span className="pd-price__sale">{formatVND(finalPrice)}</span>
                  {product.price?.original &&
                    product.price.original !== finalPrice && (
                      <span className="pd-price__orig">
                        {formatVND(product.price.original)}
                      </span>
                    )}
                </div>
              </div>

              {/* vouchers demo */}
              <div className="pd-vouchers">
                <span className="pd-v-label">Voucher của shop</span>
                <div className="pd-v-tags">
                  <span className="pd-tag">Giảm 5k</span>
                  <span className="pd-tag">Giảm 10%</span>
                </div>
              </div>

              {/* size */}
              {product.sizes?.length ? (
                <div className="pd-row">
                  <span className="pd-row-label">Size</span>
                  <div className="pd-size-list">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        className={`pd-size ${selectedSize === s ? "is-selected" : ""}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pd-ship">
                  <div className="pd-ship-top">Miễn phí vận chuyển</div>
                  <div className="pd-ship-row">
                    <span>Giao đến</span>
                    <select
                      value={shippingTo}
                      onChange={(e) => setShippingTo(e.target.value)}
                    >
                      {[
                        "TP. Hồ Chí Minh",
                        "Hà Nội",
                        "Đà Nẵng",
                        "Hải Phòng",
                        "Cần Thơ",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* số lượng */}
              <div className="pd-qty-row">
                <span className="pd-row-label">Số lượng</span>
                <div className="pd-stepper">
                  <button
                    className="pd-step"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    id="pd-qty-input"
                    type="text"
                    inputMode="numeric"
                    value={String(quantity)}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || "1", 10);
                      isNaN(v) ? setQuantity(1) : setQuantity(Math.max(1, v));
                    }}
                  />
                  <button
                    className="pd-step"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* nút hành động */}
              <div className="pd-actions">
                <button className="pd-btn-outline" onClick={addToCart}>
                  Thêm vào giỏ hàng
                </button>
                <button className="pd-btn" onClick={buyNow}>
                  Buy now
                </button>
              </div>

              {/* cam kết */}
              <div className="pd-promises">
                <span>Chính hãng 100%</span>
                <span>7 ngày miễn phí trả hàng</span>
                <span>Miễn phí vận chuyển</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
