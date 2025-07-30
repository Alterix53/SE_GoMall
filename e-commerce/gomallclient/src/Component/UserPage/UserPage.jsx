import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserPage.css';
import { Link } from 'react-router-dom';
const UserPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="user-page">
        <div className="unauthorized">
          <h2>Bạn cần đăng nhập để xem trang này</h2>
          <p>Vui lòng đăng nhập để tiếp tục.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-header">
          <div className="user-avatar">
            <img src="/images/user.png" alt="User Avatar" />
          </div>
          <div className="user-info">
            <h1>Xin chào, {user?.fullName || user?.username}!</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="user-content">
          <div className="user-section">
            <h2>Thông tin tài khoản</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Tên đăng nhập:</label>
                <span>{user?.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Họ và tên:</label>
                <span>{user?.fullName || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{user?.phoneNumber || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div className="user-section">
            <h2>Quản lý đơn hàng</h2>
            <div className="order-stats">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Đơn hàng mới</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Đang xử lý</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Đã giao</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Đã hủy</div>
              </div>
            </div>
          </div>

          <div className="user-section">
            <h2>Hành động nhanh</h2>
            <div className="quick-actions">
              <Link to="/cart">
                <div className="action-btn">
                  <i className="fas fa-shopping-cart"></i>
                  Xem giỏ hàng
                </div>
              </Link>

              <button className="action-btn">
                <i className="fas fa-heart"></i>
                Sản phẩm yêu thích
              </button>
              <button className="action-btn">
                <i className="fas fa-box"></i>
                Lịch sử đơn hàng
              </button>
              <Link to="/user/settings">
                <button className="action-btn" >
                  <i className="fas fa-cog"></i>
                  Cài đặt tài khoản
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage; 