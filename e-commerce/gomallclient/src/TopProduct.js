import React, { useState, useEffect } from 'react';
import './TopProduct.css';

const TopProduct = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTopProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 1199,
          image: '/images/iphone-15-pro-max.jpg',
          rating: 4.8,
          sold: 1234,
          category: 'Smartphones'
        },
        {
          id: 2,
          name: 'MacBook Pro 16-inch M3 Max',
          price: 3499,
          image: '/images/macbook-pro-16-m3.jpg',
          rating: 4.9,
          sold: 567,
          category: 'Laptops'
        },
        {
          id: 3,
          name: 'Samsung Galaxy S24 Ultra',
          price: 1299,
          image: '/images/samsung-s24-ultra.jpg',
          rating: 4.7,
          sold: 890,
          category: 'Smartphones'
        },
        {
          id: 4,
          name: 'Sony WH-1000XM5',
          price: 399,
          image: '/images/sony-wh-1000xm5.jpg',
          rating: 4.6,
          sold: 2345,
          category: 'Audio'
        }
      ];
      setTopProducts(mockTopProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatSold = (sold) => {
    if (sold >= 1000000) {
      return (sold / 1000000).toFixed(1) + 'M';
    } else if (sold >= 1000) {
      return (sold / 1000).toFixed(1) + 'K';
    }
    return sold;
  };

  if (loading) {
    return (
      <div className="top-product-loading">
        <div className="loading-spinner"></div>
        <span>Loading top products...</span>
      </div>
    );
  }

  return (
    <div className="top-product">
      <div className="top-product-header">
        <h2>Top Selling Products</h2>
        <p>Most popular products this month</p>
      </div>
      
      <div className="top-product-grid">
        {topProducts.map((product, index) => (
          <div key={product.id} className={`top-product-card rank-${index + 1}`}>
            <div className="rank-badge">
              #{index + 1}
            </div>
            
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            
            <div className="product-info">
              <div className="category-tag">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, starIndex) => (
                    <span 
                      key={starIndex} 
                      className={`star ${starIndex < Math.floor(product.rating) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">{product.rating}</span>
              </div>
              
              <div className="stats-section">
                <span className="sold-count">Sold: {formatSold(product.sold)}</span>
                <span className="price">{formatPrice(product.price)}</span>
              </div>
              
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProduct;
