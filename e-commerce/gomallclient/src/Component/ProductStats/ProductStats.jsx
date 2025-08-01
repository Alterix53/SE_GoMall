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
          <p>Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-stats">
        <div className="error-message">
          <p>❌ Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="product-stats">
        <div className="no-data">
          <p>Không có dữ liệu thống kê</p>
        </div>
      </div>
    );
  }

  const { overview, byCategory } = stats;

  return (
    <div className="product-stats">
      <div className="stats-header">
        <h3>📊 Thống Kê Sản Phẩm</h3>
        <p>Thông tin tổng quan về hệ thống sản phẩm</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h4>Tổng Sản Phẩm</h4>
            <span className="stat-number">{overview.totalProducts}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h4>Danh Mục</h4>
            <span className="stat-number">{overview.totalCategories?.length || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4>Giá Trung Bình</h4>
            <span className="stat-number">
              {overview.avgPrice ? `${Math.round(overview.avgPrice).toLocaleString()}đ` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h4>Đánh Giá TB</h4>
            <span className="stat-number">
              {overview.avgRating ? overview.avgRating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h4>Đã Bán</h4>
            <span className="stat-number">{overview.totalSold?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h4>Lượt Xem</h4>
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
            <h4>Nổi Bật</h4>
            <span className="stat-number">{overview.featuredCount || 0}</span>
          </div>
        </div>
      </div>

      {byCategory && byCategory.length > 0 && (
        <div className="category-stats">
          <h4>📈 Thống Kê Theo Danh Mục</h4>
          <div className="category-list">
            {byCategory.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-name">{category._id}</div>
                <div className="category-details">
                  <span className="category-count">{category.count} sản phẩm</span>
                  <span className="category-price">
                    Giá TB: {category.avgPrice ? `${Math.round(category.avgPrice).toLocaleString()}đ` : 'N/A'}
                  </span>
                  <span className="category-sold">
                    Đã bán: {category.totalSold?.toLocaleString() || 0}
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