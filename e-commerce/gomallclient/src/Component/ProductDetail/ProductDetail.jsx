import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../../contexts/CartContext";
import ApiService from "../../utils/apiService";
import Header from "../Header/Header";

const ABSOLUTE = (url) => {
  if (!url) return "/images/default-product.jpg";
  if (url.startsWith("http")) return url;
  return `http://localhost:8080${url}`;
};

const formatVND = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fallback product data
  const fallbackProduct = {
    _id: "fallback-id",
    name: "[MỚI] Dầu Gội Sạch Gàu/Tắm Gội/Sữa Tắm Xmen Amazon Hunt/Vegas Delight 610g/630g/850g - Hương Nước Hoa Phong Trần",
    price: { sale: 128000, original: 193000 },
    images: [
      { url: "/images/xmen-product.jpg" },
      { url: "/images/xmen-product.jpg" },
      { url: "/images/xmen-product.jpg" },
    ],
    rating: { average: 4.8, count: 2200 },
    sold: 10000,
    description:
      "Dầu gội X-Men với hương thơm phong trần, giúp tóc sạch gàu và thơm mát suốt ngày dài.",
    specifications: [
      { name: "Thương hiệu", value: "X-Men" },
      { name: "Xuất xứ", value: "Việt Nam" },
      { name: "Dung lượng", value: "610g/630g/850g" },
      { name: "Loại sản phẩm", value: "Dầu gội/Tắm gội" },
      { name: "Hương thơm", value: "Phong Trần" },
      { name: "Tình trạng", value: "Còn hàng" },
      { name: "Loại bảo hành", value: "Chính hãng" },
      { name: "Thời gian bảo hành", value: "12 tháng" },
      { name: "Gửi từ", value: "Hồ Chí Minh" },
    ],
    tags: ["Personal Care", "Hair Care"],
    sizes: ["DG Amz sạch gàu 610g", "Dầu Gội Amazon 630g", "Tắm Gội Vegas 630g", "Sữa Tắm Vegas 850g"],
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        const absImages = fallbackProduct.images.map((i) => ({ url: ABSOLUTE(i.url) }));
        const normalized = { ...fallbackProduct, images: absImages };
        setProduct(normalized);
        setMainImage(normalized.images[0].url);
        setSelectedSize(normalized.sizes?.[0] || "default");
        return;
      }

      const response = await ApiService.getProductById(id);
      const productData = response?.data?.product;
      if (productData && productData._id) {
        const normalized = {
          ...productData,
          images: (productData.images || []).map((img) => ({ url: ABSOLUTE(img.url || img) })),
          price: productData.price || { original: 0, sale: 0 },
          sizes: productData.sizes || ["default"],
        };
        setProduct(normalized);
        setMainImage(normalized.images?.[0]?.url || ABSOLUTE("/images/default-product.jpg"));
        setSelectedSize(normalized.sizes?.[0] || "default");
      } else {
        const absImages = fallbackProduct.images.map((i) => ({ url: ABSOLUTE(i.url) }));
        const normalized = { ...fallbackProduct, images: absImages };
        setProduct(normalized);
        setMainImage(normalized.images[0].url);
        setSelectedSize(normalized.sizes?.[0] || "default");
      }
    } catch (err) {
      console.error("Error fetching product detail:", err);
      const absImages = fallbackProduct.images.map((i) => ({ url: ABSOLUTE(i.url) }));
      const normalized = { ...fallbackProduct, images: absImages };
      setError("Failed to load product");
      setProduct(normalized);
      setMainImage(normalized.images[0].url);
      setSelectedSize(normalized.sizes?.[0] || "default");
    } finally {
      setLoading(false);
    }
  };

  const { addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price?.sale || product.price?.original || 0,
        image: product.images?.[0]?.url || ABSOLUTE("/images/default-product.jpg"),
        size: selectedSize || "default",
        quantity,
      });
      navigate('/cart');
    } catch (err) {
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  if (loading) return (<><Header /><p style={{ padding: 16 }}>Đang tải thông tin sản phẩm...</p></>);
  if (error && !product) return (<><Header /><p style={{ padding: 16 }}>Không thể tải thông tin sản phẩm.</p></>);

  return (
    <>
      <Header />
      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Shopee</span>
          <span className="breadcrumb-separator">></span>
          <span>Chăm Sóc Cá Nhân</span>
          <span className="breadcrumb-separator">></span>
          <span>Chăm Sóc Tóc</span>
          <span className="breadcrumb-separator">></span>
          <span>Dầu Gội</span>
          <span className="breadcrumb-separator">></span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-container">
          {/* Left: Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              <button className="thumbnail-nav prev">‹</button>
              {(product.images || []).slice(0, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`thumb-${idx}`}
                  className={mainImage === (img.url || img) ? 'active' : ''}
                  onClick={() => setMainImage(img.url || img)}
                />
              ))}
              <button className="thumbnail-nav next">›</button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info">
            {/* Product Header */}
            <div className="product-header">
              <div className="product-title-section">
                <span className="mall-badge">Mall</span>
                <h1 className="product-title">{product.name}</h1>
              </div>
              <span className="report-link">Tố cáo</span>
            </div>
            
            {/* Rating Section */}
            <div className="product-rating">
              <span className="rating-score">{product.rating?.average || 4.8}</span>
              <div className="stars">★★★★★</div>
              <span className="rating-sep">|</span>
              <span className="rating-count">{(product.rating?.count || 2200).toLocaleString()} Đánh Giá</span>
              <span className="rating-sep">|</span>
              <span className="sold-count">Đã Bán {(product.sold || 10000).toLocaleString()}+</span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <span className="current-price">₫{(product.price?.sale || 128000).toLocaleString()} - ₫{(product.price?.sale * 1.3 || 166000).toLocaleString()}</span>
              {product.price?.original && product.price?.sale && product.price.original > product.price.sale && (
                <>
                  <span className="original-price">₫{(product.price.original).toLocaleString()} - ₫{(product.price.original * 1.3).toLocaleString()}</span>
                  <span className="discount-percent">
                    -{Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Shipping Information */}
            <div className="shipping-info">
              <div className="shipping-item">
                <span className="label">Vận Chuyển</span>
                <div className="shipping-details">
                  <div className="shipping-icon">🚚</div>
                  <div className="shipping-content">
                    <div className="delivery-date">Cam kết nhận hàng trong 9 Th08 - 11 Th08</div>
                    <div className="shipping-fee">Phí ship 0₫</div>
                    <div className="shipping-note">Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shopee Guarantee */}
            <div className="guarantee-section">
              <span className="guarantee-label">An Tâm Mua Sắm Cùng Shopee</span>
              <div className="guarantee-details">
                <div className="guarantee-icon">✓</div>
                <div className="guarantee-content">
                  <div className="guarantee-text">Trả hàng miễn phí 15 ngày - Chính hãng 100% - Miễn phí vận chuyển</div>
                  <div className="guarantee-dropdown">›</div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="variant-section">
              <span className="variant-label">Phân Loại</span>
              <div className="variant-options">
                {(product.sizes || ["DG Amz sạch gàu 610g", "Dầu Gội Amazon 630g", "Tắm Gội Vegas 630g", "Sữa Tắm Vegas 850g"]).map(size => (
                  <button
                    key={size}
                    className={`variant-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <span className="quantity-label">Số Lượng</span>
              <div className="quantity-control">
                <button 
                  className="qty-btn" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="qty-input"
                />
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <span className="stock-info">CÒN HÀNG</span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                <span className="cart-icon">🛒</span>
                {cartLoading ? "Đang thêm..." : "Thêm Vào Giỏ Hàng"}
              </button>
              <button className="buy-now-btn">
                Mua Ngay
              </button>
            </div>

            {/* Share and Like */}
            <div className="share-section">
              <span className="share-label">Chia sẻ:</span>
              <div className="share-icons">
                <span className="share-icon facebook">f</span>
                <span className="share-icon pinterest">p</span>
                <span className="share-icon twitter">t</span>
              </div>
              <div className="like-section">
                <span className="like-icon">❤</span>
                <span className="like-text">Đã thích (614)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h3>CHI TIẾT SẢN PHẨM</h3>
          <div className="description-content">
            <div className="specs-grid">
              {(product.specifications || []).map((spec, idx) => (
                <div key={idx} className="spec-item">
                  <span className="spec-label">{spec.name}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
            <div className="description-text">
              <h4>MÔ TẢ SẢN PHẨM</h4>
              <p>{product.description || 'Không có mô tả sản phẩm.'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;