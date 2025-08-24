import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Suggestions.css';
import OptimizedImage from '../../utils/OptimizedImage';
import { createPlaceholderUrl } from '../../utils/imageUtils';

const Suggestions = () => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedProducts();
  }, []);

  const fetchSuggestedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/products?limit=24');
      const data = await response.json();
      
      if (data.success && data.data && data.data.products) {
        const products = data.data.products.map(product => ({
          id: product._id,
          name: product.name,
          image: (() => {
            const raw = product.images?.[0]?.url || '';
            if (!raw) return '/images/placeholder-product.jpg';
            return raw.startsWith('http') ? raw : `http://localhost:8080${raw}`;
          })(),
          price: product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          discount: product.discount || 0,
          rating: product.rating?.average || 0,
          sold: product.sold || 0,
          isFlashSale: product.isFlashSale || false,
          brand: product.brand || '',
          category: product.categoryID?.categoryName || ''
        }));
        setSuggestedProducts(products);
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
      setSuggestedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const searchSuggestions = [
    'Tai Nghe Chụp Tai',
    'Tai Nghe Sony WH Ch520', 
    'iPhone 15plus',
    'IP 13 Thường 256gb',
    'Tai Nghe Sony Wh-ch520',
    'Tai Nghe Sony WH Ch720',
    'Tai Nghe Bluetooth'
  ];

  return (
    <div className="suggestions-page">
      
      {/* Search Suggestions Bar */}
      <div className="search-suggestions-bar">
        <div className="suggestions-container">
          {searchSuggestions.map((suggestion, index) => (
            <Link key={index} to={`/search?q=${encodeURIComponent(suggestion)}`} className="search-suggestion-item">
              {suggestion}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="suggestions-content">
        <div className="suggestions-header">
          <h1 className="suggestions-title">Có Thể Bạn Cũng Thích</h1>
        </div>

        {loading ? (
          <div className="suggestions-loading">
            <div className="loading-spinner"></div>
            <span>Loading products...</span>
          </div>
        ) : (
          <div className="suggestions-grid">
            {suggestedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="suggestion-card">
                <div className="suggestion-image-container">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="suggestion-image"
                    fallbackUrl={createPlaceholderUrl(200,200,'')}
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  {product.discount > 0 && (
                    <div className="suggestion-discount">-{product.discount}%</div>
                  )}
                  <div className="suggestion-badges">
                    <div className="badge-88">8.8</div>
                    <div className="badge-voucher">VOUCHER XTRA</div>
                  </div>
                  {product.isFlashSale && (
                    <div className="badge-flash">FLASH SALE</div>
                  )}
                </div>
                <div className="suggestion-info">
                  <div className="suggestion-brand">{product.brand || 'GoMall Store'}</div>
                  <h3 className="suggestion-name">{product.name}</h3>
                  <div className="suggestion-price">
                    <span className="current-price">{formatVND(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatVND(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="suggestion-stats">
                    <div className="rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="sold-count">Đã bán {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
                  </div>
                  {product.discount > 0 && (
                    <div className="discount-amount">Giảm {product.discount}%</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions; 