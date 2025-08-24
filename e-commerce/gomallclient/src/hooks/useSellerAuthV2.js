import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSellerAuthV2 = () => {
  const { isAuthenticated, loading: authLoading, token } = useAuth();
  const [sellerStatus, setSellerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const checkSellerStatus = async () => {
    if (!isAuthenticated()) {
      setSellerStatus(null);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
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
        } else {
          setError(data.message || 'Failed to check seller status');
        }
      } else {
        setError('Failed to check seller status');
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      setError('Error checking seller status');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (authLoading) return;
    checkSellerStatus();
  }, [authLoading, token]);

  // LOGIC MỚI: Chỉ dựa trên bảng Seller, không phụ thuộc vào user.role
  const hasSellerApplication = () => {
    return sellerStatus?.hasApplication || false;
  };

  const isApprovedSeller = () => {
    return hasSellerApplication() && sellerStatus?.status === 'approved';
  };

  const isPendingSeller = () => {
    return hasSellerApplication() && sellerStatus?.status === 'pending';
  };

  const isRejectedSeller = () => {
    return hasSellerApplication() && sellerStatus?.status === 'rejected';
  };

  const isSuspendedSeller = () => {
    return hasSellerApplication() && sellerStatus?.status === 'suspended';
  };

  const getSellerBusinessName = () => {
    return sellerStatus?.businessName || null;
  };

  return {
    sellerStatus,
    loading,
    error,
    // Chỉ dựa trên bảng Seller
    hasSellerApplication: hasSellerApplication(),
    isApprovedSeller: isApprovedSeller(),
    isPendingSeller: isPendingSeller(),
    isRejectedSeller: isRejectedSeller(),
    isSuspendedSeller: isSuspendedSeller(),
    getSellerBusinessName,
    checkSellerStatus
  };
};
