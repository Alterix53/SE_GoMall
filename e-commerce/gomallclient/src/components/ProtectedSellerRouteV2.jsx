import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedSellerRouteV2 = ({ children }) => {
  const { isAuthenticated, getCurrentUser, loading } = useAuth();
  const location = useLocation();
  const [sellerStatus, setSellerStatus] = useState(null);
  const [checkingSellerStatus, setCheckingSellerStatus] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [checkError, setCheckError] = useState(null);

  // Kiểm tra trạng thái seller (chỉ gọi 1 lần)
  useEffect(() => {
    const checkSellerStatus = async () => {
      if (!isAuthenticated()) return;
      
      // Kiểm tra xem đã có sellerStatus chưa để tránh gọi API liên tục
      if (sellerStatus) return;
      
      setCheckingSellerStatus(true);
      try {
        const token = localStorage.getItem('token');
        console.log('ProtectedSellerRouteV2 - Making API call to /sellers/my-status');
        const response = await fetch('http://localhost:8080/api/sellers/my-status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('ProtectedSellerRouteV2 - API response:', data);
          if (data.success) {
            console.log('ProtectedSellerRouteV2 - Setting seller status:', data.data);
            setSellerStatus(data.data);
            setCheckError(null);
          } else {
            setCheckError(data.message || 'Failed to check seller status');
          }
        } else {
          console.log('ProtectedSellerRouteV2 - API response not ok:', response.status);
          setCheckError(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Error checking seller status:', error);
        setCheckError(error?.message || 'Unknown error');
      } finally {
        setCheckingSellerStatus(false);
        setHasChecked(true);
      }
    };

    checkSellerStatus();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Hiển thị loading khi đang kiểm tra authentication hoặc seller status
  if (loading || checkingSellerStatus || !hasChecked) {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // LOGIC: Ưu tiên bảng Seller; nếu API lỗi/không có dữ liệu, fallback vào role trong token/localStorage
  console.log('ProtectedSellerRouteV2 - sellerStatus:', sellerStatus);
  if (sellerStatus) {
    console.log('ProtectedSellerRouteV2 - hasApplication:', sellerStatus.hasApplication);
    console.log('ProtectedSellerRouteV2 - status:', sellerStatus.status);
    
    if (!sellerStatus.hasApplication) {
      // Chưa có hồ sơ seller
      console.log('ProtectedSellerRouteV2 - Redirecting to /register-seller (no application)');
      return <Navigate to="/register-seller" replace />;
    }
    
    if (sellerStatus.status !== 'approved') {
      // Chưa được approve hoặc bị reject/suspended
      console.log('ProtectedSellerRouteV2 - Redirecting to /register-seller (not approved)');
      return <Navigate to="/register-seller" replace />;
    }
  } else {
    // Không lấy được sellerStatus (API lỗi/timeout/401...). Thử fallback theo role.
    const currentUser = getCurrentUser();
    let storedUser = null;
    try { storedUser = JSON.parse(localStorage.getItem('user')); } catch {}
    const effectiveRole = currentUser?.role || storedUser?.role || null;
    const hasSellerRole = effectiveRole === 'seller' || (Array.isArray(effectiveRole) && effectiveRole.includes('seller'));

    if (hasSellerRole) {
      console.log('ProtectedSellerRouteV2 - Fallback by role: seller. Allowing access. Error:', checkError);
      return children;
    }

    console.log('ProtectedSellerRouteV2 - Redirecting to /register-seller (no sellerStatus and no seller role)');
    return <Navigate to="/register-seller" replace />;
  }

  // Nếu đã đăng nhập và seller được approve, render children
  return children;
};

export default ProtectedSellerRouteV2;
