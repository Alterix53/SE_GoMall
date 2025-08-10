import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../server/api';

export const useProduct = (id) => {
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
  });

  const fetchProduct = useCallback(async (productId, forceRefresh = false) => {
    if (!productId) {
      setState({ product: null, loading: false, error: 'ID sản phẩm không hợp lệ' });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      if (forceRefresh) {
        apiService.clearCache();
      }
      
      const product = await apiService.getProduct(productId);
      
      setState({
        product,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        product: null,
        loading: false,
        error: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  const refetch = useCallback(() => {
    fetchProduct(id, true);
  }, [id, fetchProduct]);

  return { 
    ...state, 
    refetch,
  };
};