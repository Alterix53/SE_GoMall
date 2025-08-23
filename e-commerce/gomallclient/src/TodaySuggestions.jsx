import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Header is globally rendered in App.js
import ProductCard from './Component/ProductCard/ProductCard';
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
              { text: 'March Promotion', color: '#e74c3c' },
              { text: 'VOUCHER UP TO 40% OFF', color: '#9b59b6' },
    ];
    return vouchers[Math.floor(Math.random() * vouchers.length)];
  };

  const getRandomBadge = () => {
    const badges = [
              'PROCESSED BY SHOPEE',
        'SHOPEE SUPER CHEAP',
        'EXPRESS 1H',
        'AUTHENTIC 100%',
        'WARRANTY',
      'Mall',
      'Ad',
    ];
    return badges[Math.floor(Math.random() * badges.length)];
  };

  if (loading) {
    return (
      <div className="today-suggestions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-suggestions-page">
      
      <div className="suggestions-container">
        {/* Shopee-style Header */}
        <div className="shopee-header">
          <div className="header-content">
            <h1>TODAY'S SUGGESTIONS</h1>
            <div className="header-stats">
                              <span>{suggestions.length} products</span>
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
                <Link key={product._id} to={`/product/${product._id}`} className="fs-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {hasDiscount && <span className="fs-discount">-{product.discount}%</span>}
                  <div className="fs-image">
                    <img 
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        if (e.target && e.target['src']) {
                          e.target['src'] = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                  </div>
                  <div className="fs-info">
                    <h3 className="fs-name">{product.name}</h3>
                    <div className="fs-prices">
                      <span className="fs-price">{formatPrice(product.price)}</span>
                      {hasDiscount && (
                        <span className="fs-original">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="fs-stats">
                      <span className="fs-rating">★ {typeof product.rating === 'object' ? (product.rating?.average || 0).toFixed(1) : (product.rating || 0).toFixed(1)}</span>
                      <span className="fs-sold">Sold {formatSold(product.sold)}</span>
                    </div>
                    <button className="fs-btn">SELLING FAST</button>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="no-suggestions">
              <div className="no-suggestions-icon">🔍</div>
                      <h3>No products found</h3>
        <p>Try searching for other products</p>
        <Link to="/" className="back-home-btn">Back to home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodaySuggestions; 