import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedSellerRouteV2 = ({ children }) => {
  const { isAuthenticated, getCurrentUser, loading } = useAuth();
  const location = useLocation();
  const [sellerStatus, setSellerStatus] = useState(null);
  const [checkingSellerStatus, setCheckingSellerStatus] = useState(false);

  // Kiểm tra trạng thái seller
  useEffect(() => {
    const checkSellerStatus = async () => {
      if (!isAuthenticated()) return;
      
      setCheckingSellerStatus(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/sellers/my-status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSellerStatus(data.data);
          }
        }
      } catch (error) {
        console.error('Error checking seller status:', error);
      } finally {
        setCheckingSellerStatus(false);
      }
    };

    checkSellerStatus();
  }, [isAuthenticated]);

  // Hiển thị loading khi đang kiểm tra authentication hoặc seller status
  if (loading || checkingSellerStatus) {
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

  // LOGIC MỚI: Chỉ kiểm tra bảng Seller, không phụ thuộc vào user.role
  if (sellerStatus) {
    if (!sellerStatus.hasApplication) {
      // Chưa có hồ sơ seller
      return <Navigate to="/register-seller" replace />;
    }
    
    if (sellerStatus.status !== 'approved') {
      // Chưa được approve hoặc bị reject/suspended
      return <Navigate to="/register-seller" replace />;
    }
  } else {
    // Chưa load được seller status, có thể chưa có hồ sơ
    return <Navigate to="/register-seller" replace />;
  }

  // Nếu đã đăng nhập và seller được approve, render children
  return children;
};

export default ProtectedSellerRouteV2;
