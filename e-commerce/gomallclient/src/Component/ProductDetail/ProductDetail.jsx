// src/Component/ProductDetail/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ProductDetail.css" // nếu chưa có thì tạo file rỗng để không lỗi import

function vnd(n) {
  if (n == null) return "₫0"
  return `₫${new Intl.NumberFormat("vi-VN").format(Math.round(Number(n)))}`
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [product, setProduct] = useState(null)

  const [activeImage, setActiveImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [shippingTo, setShippingTo] = useState("TP. Hồ Chí Minh")

  // ---- Fetch từ API giống Flash Sale (không dùng file json tĩnh) ----
  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        setError("")

        // Gọi API backend: GET /api/products/:id
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Không tìm thấy sản phẩm (HTTP ${res.status})`)
        }
        const raw = await res.json()

        if (!alive) return

        // ---- Normalize để UI dễ dùng (tùy backend, bạn sửa map cho khớp) ----
        // chấp nhận 2 dạng: _id hoặc id
        const normalized = {
          id: raw._id || raw.id,
          name: raw.name || raw.productName || "Sản phẩm",
          // nếu có flashSalePrice thì dùng; nếu không dùng price_sale hoặc price_original
          price: {
            original:
              raw.price_original ??
              raw.price?.original ??
              raw.priceOriginal ??
              raw.originalPrice ??
              0,
            sale:
              raw.flashSalePrice ??
              raw.price_sale ??
              raw.price?.sale ??
              raw.salePrice ??
              undefined,
          },
          description: raw.description || "",
          // chấp nhận 1 ảnh (images_url) hoặc mảng images
          images:
            (Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images
              : [raw.images_url].filter(Boolean)) || [],
          rating: {
            average:
              raw.rating?.average ??
              raw.rating_avg ??
              raw.ratingAverage ??
              0,
            count:
              raw.rating?.count ??
              raw.rating_count ??
              raw.reviewsCount ??
              0,
          },
          sold: raw.sold ?? raw.totalSold ?? 0,
          inventory: { quantity: raw.inventory_quantity ?? raw.stock ?? 0 },
          sizes: raw.sizes || [],

          isFlashSale: !!raw.isFlashSale,
          flashSaleEndDate: raw.flashSaleEndDate || null,
        }

        setProduct(normalized)
        if (normalized.sizes.length > 0) {
          setSelectedSize(normalized.sizes[0])
        }
      } catch (e) {
        if (alive) setError(e.message || "Lỗi tải dữ liệu")
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [id])

  const finalPrice = useMemo(() => {
    if (!product) return 0
    return product.price?.sale || product.price?.original || 0
  }, [product])

  const hasSize = Boolean(product?.sizes?.length)

  const addToCart = () => {
    // TODO: gọi API giỏ hàng của bạn (POST /api/cart)
    alert("Đã thêm vào giỏ!")
  }

  const buyNow = () => {
    if (!product) return
    navigate(`/checkout?product=${product.id}&quantity=${quantity}`)
  }

  // ---- UI ----
  if (loading) {
    return (
      <main className="pd-main">
        <div className="pd-loading">Đang tải thông tin sản phẩm...</div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="pd-main">
        <div className="pd-error">
          <div className="pd-error-title">Không thể tải sản phẩm</div>
          <div className="pd-error-desc">{error || "Sản phẩm không tồn tại"}</div>
          <button className="pd-btn" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pd-main">
      <div className="pd-container">
        <div className="pd-grid">
          {/* LEFT: Ảnh */}
          <section className="pd-left">
            <div className="pd-main-img">
              <img
                src={product.images[activeImage] || "/placeholder.svg?height=480&width=480"}
                alt={product.name}
                className="pd-main-img__img"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg?height=480&width=480")}
              />
              <button
                className={`pd-like ${liked ? "is-liked" : ""}`}
                onClick={() => setLiked((v) => !v)}
                aria-label="like"
              >
                ♥
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb ${idx === activeImage ? "is-active" : ""}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg?height=96&width=96")}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="pd-share-row">
              <span className="pd-share-label">Chia sẻ: </span>
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
              <span className="pd-rating">
                {(product.rating.average || 0).toFixed(1)}
              </span>
              <span className="pd-dot">|</span>
              <span className="pd-reviews">{product.rating.count} Đánh giá</span>
              <span className="pd-dot">|</span>
              <span className="pd-sold">{product.sold}+ Đã bán</span>
            </div>

            {/* Giá */}
            <div className="pd-price-box">
              <div className="pd-price">
                <span className="pd-price__sale">{vnd(finalPrice)}</span>
                {product.price?.original &&
                  product.price.original !== finalPrice && (
                    <span className="pd-price__orig">{vnd(product.price.original)}</span>
                  )}
              </div>
            </div>

            {/* Voucher minh họa */}
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
                    const v = parseInt(e.target.value || "1", 10)
                    setQuantity(Number.isNaN(v) ? 1 : Math.max(1, v))
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

            {/* Cam kết */}
            <div className="pd-promises">
              <span>Chính hãng 100%</span>
              <span>7 ngày miễn phí trả hàng</span>
              <span>Miễn phí vận chuyển</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
