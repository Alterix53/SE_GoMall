import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import "./ProductDetail.css";
import { useCart } from "../../contexts/CartContext";

const ProductDetail = () => {
  // const { id } = useParams(); // Lấy ID từ URL
  // const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let retries = 0;
  //   const maxRetries = 3;

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`http://localhost:8080/api/products/${id}`, {
  //         timeout: 5000,
  //       });
  //       console.log("Product Detail API response:", response.data);
  //       const productData = response.data?.data?.product;
  //       if (!productData) {
  //         console.warn("No product found for ID:", id);
  //         return;
  //       }
  //       setProduct({
  //         id: productData._id,
  //         name: productData.name || "Unknown Product",
  //         price: productData.price?.sale || productData.price?.original || 0,
  //         originalPrice: productData.price?.original || 0,
  //         image: productData.images?.[0]?.url || "/images/default-product.jpg",
  //         rating: productData.rating?.average || 0,
  //         sold: productData.sold || 0,
  //         discount: productData.price?.original && productData.price?.sale
  //           ? Math.round(((productData.price.original - productData.price.sale) / productData.price.original) * 100)
  //           : 0,
  //         description: productData.description || "Không có mô tả",
  //         specifications: productData.specifications || [],
  //       });
  //     } catch (err) {
  //       retries++;
  //       console.error(`Fetch error (attempt ${retries}/${maxRetries}):`, err.message, err.response?.status, err.response?.statusText);
  //       if (retries < maxRetries) {
  //         await new Promise(resolve => setTimeout(resolve, 2000 * retries));
  //         await fetchData();
  //       } else {
  //         console.error("Max retries reached, no data available");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  // if (loading) return <p>Đang tải thông tin sản phẩm...</p>;
  // if (!product) return <p>Sản phẩm không tồn tại.</p>;

  // Hardcoded product data from seedData.js
  const product = {
    id: "seeded-id-1",
    name: "iPhone 15 Pro Max 256GB",
    price: 29990000,
    originalPrice: 34990000,
    image: "/images/iphone-15.jpg",
    images: [
      "/images/iphone-15.jpg",
      "/images/iphone-15.jpg",
      "/images/iphone-15.jpg",
      "/images/iphone-15.jpg",
      "/images/iphone-15.jpg",
    ],
    rating: 4.8,
    sold: 5234,
    discount: Math.round(((34990000 - 29990000) / 34990000) * 100),
    description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch. Đây là dòng sản phẩm cao cấp nhất của Apple năm 2023, mang lại trải nghiệm tuyệt vời cho người dùng với hiệu năng mạnh mẽ, camera chất lượng và thời lượng pin ấn tượng.",
    specifications: [
      { name: "Màn hình", value: "6.7 inch Super Retina XDR" },
      { name: "Chip", value: "A17 Pro" },
      { name: "Camera", value: "48MP + 12MP + 12MP" },
      { name: "Pin", value: "4441 mAh" },
    ],
    tags: ["Tag"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    faqs: [
      {
        title: "Bảo hành thế nào?",
        content: "Sản phẩm được bảo hành chính hãng 12 tháng tại tất cả các trung tâm bảo hành Apple Việt Nam."
      }
    ]
  };

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showFAQ, setShowFAQ] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="container center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="product-detail" style={{ display: 'flex', gap: 40, alignItems: 'flex-start', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', width: '100%', maxWidth: 1100 }}>
        {/* Left: Main image + thumbnails */}
        <div style={{ flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 16, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', width: '100%' }}>
            <img src={mainImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {product.images.slice(0, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                style={{ width: 60, height: 60, objectFit: 'cover', border: mainImage === img ? '2px solid #333' : '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
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
                {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
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
          >
            Add to Cart
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