import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isTokenValid, getUserFromToken } from '../utils/api';

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
    // Fallback: nếu localStorage có admin token hợp lệ, cho phép tiếp tục
    let storedUser = null;
    let storedToken = null;
    let adminToken = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('user'));
    } catch {}
    storedToken = localStorage.getItem('token');
    adminToken = localStorage.getItem('adminToken');

    // Chấp nhận token admin nếu hợp lệ
    if (storedUser?.role === 'admin' && isTokenValid(adminToken)) {
      return children;
    }

    // Redirect đúng trang login theo ngữ cảnh
    const isAdminPath = location.pathname.toLowerCase().startsWith('/admin');
    const redirectPath = (storedUser?.role === 'admin' || isAdminPath) ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole) {
    // Ưu tiên state; fallback localStorage; cuối cùng dùng token payload
    let currentUser = getCurrentUser();
    let storedUser = null;
    try { storedUser = JSON.parse(localStorage.getItem('user')); } catch {}
    const token = localStorage.getItem('token');
    const tokenPayload = getUserFromToken(token);

    const effectiveRole = currentUser?.role || storedUser?.role || tokenPayload?.role || null;

    if (effectiveRole !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Nếu đã đăng nhập và có quyền truy cập, render children
  return children;
};

export default ProtectedRoute; 