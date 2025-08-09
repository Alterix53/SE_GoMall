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
      <div className="container center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="product-detail" style={{ display: 'flex', gap: 40, alignItems: 'flex-start', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', width: '100%', maxWidth: 1100 }}>
          {/* Left: Main image + thumbnails */}
          <div style={{ flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 16, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', width: '100%' }}>
              <img src={mainImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {(product.images || []).slice(0, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`thumb-${idx}`}
                  style={{ width: 60, height: 60, objectFit: 'cover', border: mainImage === (img.url || img) ? '2px solid #333' : '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
                  onClick={() => setMainImage(img.url || img)}
                />
              ))}
            </div>
          </div>
          {/* Right: Info */}
          <div style={{ flex: 1, minWidth: 320, maxWidth: 500 }}>
            <h2 style={{ fontWeight: 600 }}>{product.name}</h2>
            <div style={{ margin: '8px 0' }}>
              {(product.tags || []).map((tag, idx) => (
                <span key={idx} style={{ background: '#e6f4ea', color: '#1a7f37', borderRadius: 4, padding: '2px 8px', fontSize: 14, marginRight: 8 }}>{tag}</span>
              ))}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0', color: '#222' }}>
              {formatVND(product.price?.sale || product.price?.original || 0)}
            </div>
            {product.price?.original && product.price?.sale && product.price.original > product.price.sale && (
              <div style={{ fontSize: 18, color: '#888', textDecoration: 'line-through', marginBottom: 8 }}>
                {formatVND(product.price.original)}
              </div>
            )}
            <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
              <div>
                <label style={{ fontWeight: 500 }}>Size</label>
                <select className="form-select" style={{ width: 120, marginTop: 4 }} value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                  {(product.sizes || ["default"]).map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Quantity</label>
                <select className="form-select" style={{ width: 80, marginTop: 4 }} value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                  {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <button
              className="btn btn-dark w-100"
              style={{ margin: '0 0 16px 0', fontWeight: 600, maxWidth: 300 }}
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? "Đang thêm..." : "Add to Cart"}
            </button>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Other info</div>
              <div style={{ border: '1px solid #eee', borderRadius: 8, background: '#fafafa', padding: 12 }}>
                <ul style={{ marginTop: 8 }}>
                  {(product.specifications || []).map((spec, idx) => (
                    <li key={idx}>{spec.name}: {spec.value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: 1100, marginTop: 24, background: '#fafafa', borderRadius: 8, padding: 24, color: '#444', fontSize: 16, boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Description</div>
          {product.description || 'Không có mô tả sản phẩm.'}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;