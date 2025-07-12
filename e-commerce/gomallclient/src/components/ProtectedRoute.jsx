import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, getCurrentUser, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!isAuthenticated()) {
    // Redirect đến trang login với returnUrl
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role !== requiredRole) {
      // Redirect đến trang không có quyền truy cập
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Nếu đã đăng nhập và có quyền truy cập, render children
  return children;
};

export default ProtectedRoute; 