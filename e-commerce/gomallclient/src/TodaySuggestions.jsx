import React, { useState, useEffect } from 'react';
import './TodaySuggestions.css';

const TodaySuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 1199,
          originalPrice: 1399,
          image: '/images/iphone-15-pro-max.jpg',
          rating: 4.8,
          sold: 234
        },
        {
          id: 2,
          name: 'MacBook Pro 16-inch M3 Max',
          price: 3499,
          originalPrice: 3999,
          image: '/images/macbook-pro-16-m3.jpg',
          rating: 4.9,
          sold: 156
        },
        {
          id: 3,
          name: 'Samsung Galaxy S24 Ultra',
          price: 1299,
          originalPrice: 1499,
          image: '/images/samsung-s24-ultra.jpg',
          rating: 4.7,
          sold: 189
        },
        {
          id: 4,
          name: 'Sony WH-1000XM5',
          price: 399,
          originalPrice: 499,
          image: '/images/sony-wh-1000xm5.jpg',
          rating: 4.6,
          sold: 445
        }
      ];
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscount = (original, sale) => {
    return Math.round(((original - sale) / original) * 100);
  };

  if (loading) {
    return (
      <div className="suggestions-loading">
        <div className="loading-spinner"></div>
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="today-suggestions">
      <div className="suggestions-header">
        <h2>Today's Suggestions</h2>
        <p>Handpicked products just for you</p>
      </div>
      
      <div className="suggestions-grid">
        {suggestions.map(product => (
          <div key={product.id} className="suggestion-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="discount-badge">
                -{calculateDiscount(product.originalPrice, product.price)}%
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <span 
                      key={index} 
                      className={`star ${index < Math.floor(product.rating) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">{product.rating}</span>
                <span className="sold-text">({product.sold} sold)</span>
              </div>
              
              <div className="price-section">
                <span className="current-price">{formatPrice(product.price)}</span>
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              </div>
              
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySuggestions;
