import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Component/Header/Header';
import './TodaySuggestions.css';

function TodaySuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8080/api/products?limit=20');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data && Array.isArray(data.data.products)) {
            const mappedSuggestions = data.data.products.map(product => ({
              _id: product._id,
              name: product.name,
              price: product?.price?.sale || product?.price?.original || 0,
              originalPrice: product?.price?.original || 0,
              discount: product?.price?.original && product?.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
              image: product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : '/images/placeholder-product.svg',
              rating: product?.rating || { average: 0, count: 0 },
              sold: product?.sold || 0,
              category: product.categoryID,
              isFlashSale: product.isFlashSale || false,
              isFeatured: product.isFeatured || false,
              brand: product.brand || 'GoMall',
            }));
            setSuggestions(mappedSuggestions);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSold = (sold) => {
    if (sold >= 1000000) {
      return `${(sold / 1000000).toFixed(1)}M+`;
    } else if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k+`;
    }
    return `${sold}+`;
  };

  const getRandomVoucher = () => {
    const vouchers = [
      { text: '15.8 VOUCHER XTRA', color: '#ffd700' },
      { text: '15.8 VOUCHER 520', color: '#ff6b35' },
      { text: 'Ưu đãi tháng 3', color: '#e74c3c' },
      { text: 'VOUCHER GIẢM TỚI 40%', color: '#9b59b6' },
    ];
    return vouchers[Math.floor(Math.random() * vouchers.length)];
  };

  const getRandomBadge = () => {
    const badges = [
      'XỬ LÝ BỞI SHOPEE',
      'SHOPEE SIÊU RẺ',
      'HOÁ TỐC 1H',
      'CHÍNH HÃNG 100%',
      'BẢO HÀNH',
      'Mall',
      'Ad',
    ];
    return badges[Math.floor(Math.random() * badges.length)];
  };

  if (loading) {
    return (
      <div className="today-suggestions-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải gợi ý...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-suggestions-page">
      <Header />
      
      <div className="suggestions-container">
        {/* Shopee-style Header */}
        <div className="shopee-header">
          <div className="header-content">
            <h1>GỢI Ý HÔM NAY</h1>
            <div className="header-stats">
              <span>{suggestions.length} sản phẩm</span>
              <span>•</span>
              <span>{suggestions.filter(p => p.isFlashSale).length} Flash Sale</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="shopee-grid">
          {suggestions.length > 0 ? (
            suggestions.map((product, index) => {
              const voucher = getRandomVoucher();
              const badge = getRandomBadge();
              const hasDiscount = product.discount > 0;
              
              return (
                <div key={product._id} className="shopee-card">
                  {/* Product Image Container */}
                  <div className="product-image-container">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        if (e.target && e.target['src']) {
                          e.target['src'] = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Flash Sale Badge */}
                    {product.isFlashSale && (
                      <div className="flash-sale-badge">
                        🔥 Flash Sale
                      </div>
                    )}

                    {/* Voucher Badge */}
                    <div className="voucher-badge" style={{ backgroundColor: voucher.color }}>
                      <span className="voucher-number">15.8</span>
                      <span className="voucher-text">VOUCHER XTRA</span>
                    </div>

                    {/* Play Button */}
                    <div className="play-button">
                      ▶
                    </div>

                    {/* Brand Badge */}
                    <div className="brand-badge">
                      {product.brand}
                    </div>

                    {/* Feature Badges */}
                    <div className="feature-badges">
                      <span className="feature-badge">HOÁ TỐC 1H</span>
                      <span className="feature-badge">CHÍNH HÃNG 100%</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-name">
                      {product.name}
                    </div>
                    
                    {/* Price Section */}
                    <div className="price-section">
                      <div className="current-price">
                        {formatPrice(product.price)}
                      </div>
                      {hasDiscount && (
                        <div className="original-price">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    {/* Sold Count */}
                    <div className="sold-count">
                      Đã bán {formatSold(product.sold)}
                    </div>

                    {/* Action Badges */}
                    <div className="action-badges">
                      <span className="action-badge favorite">❤ Yêu thích+</span>
                      <span className="action-badge">{badge}</span>
                    </div>

                    {/* Additional Info */}
                    <div className="additional-info">
                      <span className="info-text">Thiết kế thời trang</span>
                      <span className="info-text">Âm thanh hay, trung thực</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-suggestions">
              <div className="no-suggestions-icon">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử tìm kiếm sản phẩm khác</p>
              <Link to="/" className="back-home-btn">Về trang chủ</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodaySuggestions; 