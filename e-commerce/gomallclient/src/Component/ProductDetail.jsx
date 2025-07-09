import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let retries = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`, {
          timeout: 5000,
        });
        console.log("Product Detail API response:", response.data);
        const productData = response.data?.data?.product;
        if (!productData) {
          console.warn("No product found for ID:", id);
          return;
        }
        setProduct({
          id: productData._id,
          name: productData.name || "Unknown Product",
          price: productData.price?.sale || productData.price?.original || 0,
          originalPrice: productData.price?.original || 0,
          image: productData.images?.[0]?.url || "/images/default-product.jpg",
          rating: productData.rating?.average || 0,
          sold: productData.sold || 0,
          discount: productData.price?.original && productData.price?.sale
            ? Math.round(((productData.price.original - productData.price.sale) / productData.price.original) * 100)
            : 0,
          description: productData.description || "Không có mô tả",
          specifications: productData.specifications || [],
        });
      } catch (err) {
        retries++;
        console.error(`Fetch error (attempt ${retries}/${maxRetries}):`, err.message, err.response?.status, err.response?.statusText);
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
          await fetchData();
        } else {
          console.error("Max retries reached, no data available");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Đang tải thông tin sản phẩm...</p>;
  if (!product) return <p>Sản phẩm không tồn tại.</p>;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-price">
            <span className="current-price">{product.price}</span>
            {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
          </div>
          <div className="product-detail-stats">
            <span className="rating">★ {product.rating}</span>
            <span className="sold">Đã bán {product.sold}</span>
          </div>
          <p className="product-detail-description">{product.description}</p>
          <h3>Thông số kỹ thuật</h3>
          <ul className="product-detail-specifications">
            {product.specifications.map((spec, index) => (
              <li key={index}>{`${spec.name}: ${spec.value}`}</li>
            ))}
          </ul>
          <button className="add-to-cart-btn">
            <i className="fas fa-shopping-cart"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;