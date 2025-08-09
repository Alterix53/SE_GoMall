import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fallback product data
  const fallbackProduct = {
    _id: "fallback-id",
    name: "iPhone 15 Pro Max 256GB",
    price: { sale: 29990000, original: 34990000 },
    images: [
      { url: "/images/iphone-15.jpg" },
      { url: "/images/iphone-15.jpg" },
      { url: "/images/iphone-15.jpg" },
    ],
    rating: { average: 4.8 },
    sold: 5234,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch.",
    specifications: [
      { name: "Màn hình", value: "6.7 inch Super Retina XDR" },
      { name: "Chip", value: "A17 Pro" },
      { name: "Camera", value: "48MP + 12MP + 12MP" },
      { name: "Pin", value: "4441 mAh" },
    ],
    tags: ["Technology", "Mobile"],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
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
      // Response shape: { success, data: { product } }
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
      alert("Đã thêm vào giỏ hàng!");
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
        <div className="product-detail-container">
          {/* Left: Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {(product.images || []).slice(0, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`thumb-${idx}`}
                  className={mainImage === (img.url || img) ? 'active' : ''}
                  onClick={() => setMainImage(img.url || img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="rating-stars">
                <span className="rating-score">{product.rating?.average || 4.8}</span>
                <div className="stars">★★★★★</div>
              </div>
              <div className="rating-count">({product.rating?.count || 123})</div>
              <div className="sold-count">{product.sold || 0} Đã bán</div>
            </div>

            <div className="price-section">
              {product.price?.original && product.price?.sale && product.price.original > product.price.sale && (
                <span className="original-price">{formatVND(product.price.original)}</span>
              )}
              <span className="current-price">{formatVND(product.price?.sale || product.price?.original || 0)}</span>
              {product.price?.original && product.price?.sale && product.price.original > product.price.sale && (
                <span className="discount-percent">
                  {Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)}% GIẢM
                </span>
              )}
            </div>

            <div className="voucher-section">
              <span className="voucher-label">Mã Giảm Giá Của Shop</span>
              <div className="voucher-item">Giảm ₫20k</div>
              <div className="voucher-item">Giảm ₫50k</div>
            </div>

            <div className="shipping-info">
              <div className="shipping-item">
                <span className="label">Vận Chuyển</span>
                <div className="shipping-details">
                  <div className="free-shipping">Miễn Phí Vận Chuyển</div>
                  <div className="shipping-location">Vận chuyển tới Quận 1, Hồ Chí Minh</div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="variant-section">
              <span className="variant-label">Phân Loại Hàng</span>
              <div className="variant-options">
                {(product.sizes || ["default"]).map(size => (
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
              <span className="stock-info">999 sản phẩm có sẵn</span>
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