import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';

// (Optional) Header/Footer nếu bạn dùng
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function formatVND(n) {
  if (n == null) return "₫0";
  return `₫${new Intl.NumberFormat("vi-VN").format(Math.round(Number(n)))}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [shippingTo, setShippingTo] = useState("TP. Hồ Chí Minh");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Build đúng URL cho cả CRA & Vite (chạy dev/prod)
        const base =
          (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) ||
          process.env.PUBLIC_URL ||
          "/";
        const url = (base.replace(/\/+$/, "") || "") + "/data/products.json";

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Không tìm thấy JSON tại ${url} (HTTP ${res.status})`);

        const text = await res.text();
        if (text.trim().startsWith("<!DOCTYPE")) {
          throw new Error(`Phản hồi không phải JSON. Kiểm tra lại đường dẫn: ${url}`);
        }
        const list = JSON.parse(text);

        const pid = Number(id);
        const found = Number.isFinite(pid)
          ? list.find((p) => Number(p.id) === pid)
          : list.find((p) => String(p.id) === String(id));

        if (!alive) return;

        if (!found) {
          setError("Sản phẩm không tồn tại");
          setProduct(null);
          return;
        }

        // Chuẩn hóa dữ liệu cho UI này
        const normalized = {
          id: found.id,
          name: found.name,
          price: {
            original: found.price_original,
            sale: found.price_sale ?? found.price_original,
          },
          description: found.description,
          images: [found.images_url].filter(Boolean),
          rating: {
            average: 0, // file không có average -> hiển thị 0.0
            count: found.rating_count ?? 0,
          },
          sold: found.sold ?? 0,
          inventory: { quantity: found.inventory_quantity ?? 0 },
          sizes: found.sizes || [], // nếu có sizes -> hiện size; nếu không -> hiện vận chuyển
        };

        setProduct(normalized);
        if (normalized.sizes.length > 0) setSelectedSize(normalized.sizes[0]);
      } catch (e) {
        if (alive) setError(e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    return product.price?.sale || product.price?.original || 0;
  }, [product]);

  const hasSize = Boolean(product?.sizes?.length);

  const addToCart = () => {
    alert("Đã thêm vào giỏ!");
  };

  const buyNow = () => {
    if (!product) return;
    navigate(`/checkout?product=${product.id}&quantity=${quantity}`);
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <>
        {/* <Header /> */}
        <main className="pd-main">
          <div className="pd-loading">Đang tải thông tin sản phẩm...</div>
        </main>
        {/* <Footer /> */}
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        {/* <Header /> */}
        <main className="pd-main">
          <div className="pd-error">
            <div className="pd-error-title">Không thể tải sản phẩm</div>
            <div className="pd-error-desc">{error || "Sản phẩm không tồn tại"}</div>
            <button className="pd-btn" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
          </div>
        </main>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <main className="pd-main">
        <div className="pd-container">
          <div className="pd-card">
            <div className="pd-grid">
              {/* LEFT: Ảnh */}
              <section className="pd-left">
                <div className="pd-main-img">
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="pd-main-img__img"
                  />
                  <button
                    className={`pd-like ${liked ? "is-liked" : ""}`}
                    onClick={() => setLiked((v) => !v)}
                    aria-label="like"
                  >
                    ♥
                  </button>
                </div>

                <div className="pd-thumbs">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`pd-thumb ${idx === activeImage ? "is-active" : ""}`}
                      onClick={() => setActiveImage(idx)}
                    >
                      <img src={img} alt={`thumb-${idx}`} />
                    </button>
                  ))}
                </div>

                <div className="pd-share-row">
                  <span className="pd-share-label">Chia sẻ:</span>
                  <button className="pd-share-dot" aria-label="share-fb" />
                  <button className="pd-share-dot" aria-label="share-mes" />
                  <button className="pd-share-dot" aria-label="share-pin" />
                  <button className="pd-share-dot" aria-label="share-x" />
                  <div className="pd-liked">
                    <span className="pd-heart">♡</span> Đã thích
                  </div>
                </div>
              </section>

              {/* RIGHT: Thông tin */}
              <section className="pd-right">
                <span className="pd-mall-chip">MALL</span>
                <h1 className="pd-title">{product.name}</h1>

                {/* điểm | đánh giá | đã bán */}
                <div className="pd-meta">
                  <span className="pd-rating">{(product.rating.average || 0).toFixed(1)}</span>
                  <span className="pd-dot">|</span>
                  <span className="pd-reviews">{product.rating.count} Đánh giá</span>
                  <span className="pd-dot">|</span>
                  <span className="pd-sold">{product.sold}+ Đã bán</span>
                </div>

                {/* Giá */}
                <div className="pd-price-box">
                  <div className="pd-price">
                    <span className="pd-price__sale">{formatVND(finalPrice)}</span>
                    {product.price?.original && product.price.original !== finalPrice && (
                      <span className="pd-price__orig">{formatVND(product.price.original)}</span>
                    )}
                  </div>
                </div>

                {/* Voucher demo */}
                <div className="pd-vouchers">
                  <span className="pd-v-label">Voucher của shop</span>
                  <div className="pd-v-tags">
                    <span className="pd-tag">Giảm 5k</span>
                    <span className="pd-tag">Giảm 10%</span>
                  </div>
                </div>

                {/* Size hoặc Vận chuyển */}
                {hasSize ? (
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

                {/* Số lượng */}
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
                        setQuantity(Number.isNaN(v) ? 1 : Math.max(1, v));
                      }}
                    />
                    <button className="pd-step" onClick={() => setQuantity((q) => q + 1)}>
                      +
                    </button>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="pd-actions">
                  <button className="pd-btn-outline" onClick={addToCart}>
                    Thêm vào giỏ hàng
                  </button>
                  <button className="pd-btn" onClick={buyNow}>
                    Buy now
                  </button>
                </div>

                {/* Cam kết (demo) */}
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
      {/* <Footer /> */}
    </>
  );
}
