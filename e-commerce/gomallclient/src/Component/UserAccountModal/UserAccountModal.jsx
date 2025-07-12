import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserAccountModal.css';

const UserAccountModal = ({ isOpen, onClose, position }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="user-account-modal-overlay" onClick={onClose}>
      <div 
        className="user-account-dropdown" 
        onClick={(e) => e.stopPropagation()}
        style={{
          top: position?.top || '60px',
          right: position?.right || '20px'
        }}
      >
        {!isAuthenticated() ? (
          // Chưa đăng nhập
          <div className="dropdown-actions">
            <button 
              className="dropdown-btn"
              onClick={() => handleNavigate('/signin')}
            >
              <i className="fas fa-sign-in-alt"></i>
              Đăng nhập
            </button>
            <button 
              className="dropdown-btn"
              onClick={() => handleNavigate('/signup')}
            >
              <i className="fas fa-user-plus"></i>
              Đăng ký
            </button>
          </div>
        ) : (
          // Đã đăng nhập
          <div className="dropdown-actions">
            <div className="user-info">
              <div className="user-avatar-small">
                <img src="/images/user.png" alt="User Avatar" />
              </div>
              <div className="user-details-small">
                <span className="user-name">{user?.fullName || user?.username}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            </div>
            
            <button 
              className="dropdown-btn"
              onClick={() => handleNavigate('/user')}
            >
              <i className="fas fa-user"></i>
              Tài khoản
            </button>
            
            <button className="dropdown-btn">
              <i className="fas fa-shopping-cart"></i>
              Giỏ hàng
            </button>
            
            <button className="dropdown-btn">
              <i className="fas fa-heart"></i>
              Yêu thích
            </button>
            
            <button className="dropdown-btn">
              <i className="fas fa-box"></i>
              Đơn hàng
            </button>
            
            <button className="dropdown-btn">
              <i className="fas fa-cog"></i>
              Cài đặt
            </button>
            
            <button className="dropdown-btn">
              <i className="fas fa-question-circle"></i>
              Trợ giúp
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button 
              className="dropdown-btn logout"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountModal; 