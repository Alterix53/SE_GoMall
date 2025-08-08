import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../../contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        const json = await response.json();
        const p = json?.data?.product;
        if (!cancelled && p) {
          const images = (p.images || []).map(img =>
            img?.url?.startsWith("/uploads") ? `http://localhost:8080${img.url}` : (img?.url || "/images/default-product.jpg")
          );
          const built = {
            id: p._id,
            name: p.name || "Unknown Product",
            price: p.price?.sale || p.price?.original || 0,
            originalPrice: p.price?.original || 0,
            image: images[0] || "/images/default-product.jpg",
            images,
            rating: p.rating?.average || 0,
            sold: p.sold || 0,
            discount: p.price?.original && p.price?.sale
              ? Math.round(((p.price.original - p.price.sale) / p.price.original) * 100)
              : 0,
            description: p.description || "",
            specifications: p.specifications || [],
            tags: p.tags || []
          };
          setProduct(built);
          setMainImage(built.images[0] || "/images/default-product.jpg");
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  const { addToCart, loading: addingToCart, error } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity,
      });
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  if (loading) return <p>Đang tải thông tin sản phẩm...</p>;
  if (!product) return <p>Sản phẩm không tồn tại.</p>;

  return (
    <div className="container center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="product-detail" style={{ display: 'flex', gap: 40, alignItems: 'flex-start', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', width: '100%', maxWidth: 1100 }}>
        {/* Left: Main image + thumbnails */}
        <div style={{ flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 16, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', width: '100%' }}>
            <img src={mainImage || product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {product.images.slice(0, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                style={{ width: 60, height: 60, objectFit: 'cover', border: (mainImage || product.image) === img ? '2px solid #333' : '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        {/* Right: Info */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500 }}>
          <h2 style={{ fontWeight: 600 }}>{product.name}</h2>
          <div style={{ margin: '8px 0' }}>
            {product.tags.map((tag, idx) => (
              <span key={idx} style={{ background: '#e6f4ea', color: '#1a7f37', borderRadius: 4, padding: '2px 8px', fontSize: 14, marginRight: 8 }}>{tag}</span>
            ))}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0', color: '#222' }}>
            ${Math.round(product.price / 1000)}
          </div>
          <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
            <div>
              <label style={{ fontWeight: 500 }}>Size</label>
              <select className="form-select" style={{ width: 120, marginTop: 4 }} value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                {sizes.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 500 }}>Quantity</label>
              <select className="form-select" style={{ width: 80, marginTop: 4 }} value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          {/* Add to Cart button directly below size/quantity */}
          <button
            className="btn btn-dark w-100"
            style={{ margin: '0 0 16px 0', fontWeight: 600, maxWidth: 300 }}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? "Đang thêm..." : "Add to Cart"}
          </button>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Other info</div>
            <div style={{ border: '1px solid #eee', borderRadius: 8, background: '#fafafa', padding: 12 }}>
              <ul style={{ marginTop: 8 }}>
                {product.specifications.map((spec, idx) => (
                  <li key={idx}>{spec.name}: {spec.value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Description full width below both columns */}
      <div style={{ width: '100%', maxWidth: 1100, marginTop: 24, background: '#fafafa', borderRadius: 8, padding: 24, color: '#444', fontSize: 16, boxSizing: 'border-box' }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Description</div>
        {product.description}
      </div>
    </div>
  );
};

export default ProductDetail;