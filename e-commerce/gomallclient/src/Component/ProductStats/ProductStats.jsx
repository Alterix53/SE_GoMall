import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductStats.css';

const ProductStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/products/stats');
        setStats(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="product-stats">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-stats">
        <div className="error-message">
          <p>❌ Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="product-stats">
        <div className="no-data">
          <p>No statistics data available</p>
        </div>
      </div>
    );
  }

  const { overview, byCategory } = stats;

  return (
    <div className="product-stats">
      <div className="stats-header">
        <h3>📊 Product Statistics</h3>
        <p>Overview of product system information</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h4>Total Products</h4>
            <span className="stat-number">{overview.totalProducts}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h4>Categories</h4>
            <span className="stat-number">{overview.totalCategories?.length || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4>Average Price</h4>
            <span className="stat-number">
                              {overview.avgPrice ? `${Math.round(overview.avgPrice).toLocaleString()} VND` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h4>Average Rating</h4>
            <span className="stat-number">
              {overview.avgRating ? overview.avgRating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h4>Total Sold</h4>
            <span className="stat-number">{overview.totalSold?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h4>Total Views</h4>
            <span className="stat-number">{overview.totalViews?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h4>Flash Sale</h4>
            <span className="stat-number">{overview.flashSaleCount || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h4>Featured</h4>
            <span className="stat-number">{overview.featuredCount || 0}</span>
          </div>
        </div>
      </div>

      {byCategory && byCategory.length > 0 && (
        <div className="category-stats">
          <h4>📈 Statistics by Category</h4>
          <div className="category-list">
            {byCategory.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-name">{category._id}</div>
                <div className="category-details">
                  <span className="category-count">{category.count} products</span>
                  <span className="category-price">
                    Avg Price: {category.avgPrice ? `${Math.round(category.avgPrice).toLocaleString()} VND` : 'N/A'}
                  </span>
                  <span className="category-sold">
                    Sold: {category.totalSold?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStats; 