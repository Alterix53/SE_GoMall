import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSellerAuth = () => {
  const { isAuthenticated, getCurrentUser, loading: authLoading, token } = useAuth();
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
              const response = await fetch('http://localhost:8080/api/seller/my-status', {
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

  const isSeller = () => {
    const user = getCurrentUser();
    if (!user) return false;
    
    const role = user.role;
    return role === 'seller' || (Array.isArray(role) && role.includes('seller'));
  };

  const isApprovedSeller = () => {
    return isSeller() && sellerStatus?.hasApplication && sellerStatus?.status === 'approved';
  };

  const isPendingSeller = () => {
    return isSeller() && sellerStatus?.hasApplication && sellerStatus?.status === 'pending';
  };

  const isRejectedSeller = () => {
    return isSeller() && sellerStatus?.hasApplication && sellerStatus?.status === 'rejected';
  };

  const hasSellerApplication = () => {
    return sellerStatus?.hasApplication || false;
  };

  return {
    sellerStatus,
    loading,
    error,
    isSeller: isSeller(),
    isApprovedSeller: isApprovedSeller(),
    isPendingSeller: isPendingSeller(),
    isRejectedSeller: isRejectedSeller(),
    hasSellerApplication: hasSellerApplication(),
    checkSellerStatus
  };
};
