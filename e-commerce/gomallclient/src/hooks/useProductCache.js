import { useState, useEffect, useCallback } from 'react';
import productCacheService from '../utils/productCache';

export const useProductCache = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all products with cache
  const getAllProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productCacheService.getAllProducts(params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get flash sale products with cache
  const getFlashSaleProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productCacheService.getFlashSaleProducts(params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch flash sale products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get top products with cache
  const getTopProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productCacheService.getTopProducts(params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch top products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by ID with cache
  const getProductById = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productCacheService.getProductById(productId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products with cache
  const searchProducts = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productCacheService.searchProducts(searchParams);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to search products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    productCacheService.clearCache();
  }, []);

  // Invalidate specific cache
  const invalidateCache = useCallback((productId = null) => {
    productCacheService.invalidateProductCache(productId);
  }, []);

  return {
    loading,
    error,
    getAllProducts,
    getFlashSaleProducts,
    getTopProducts,
    getProductById,
    searchProducts,
    clearCache,
    invalidateCache,
  };
}; 