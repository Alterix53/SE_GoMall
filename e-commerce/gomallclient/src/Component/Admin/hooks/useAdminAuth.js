import { useState, useEffect, useCallback } from 'react';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const adminInfo = localStorage.getItem('adminInfo');
      
      if (token && adminInfo) {
        const parsedAdminInfo = JSON.parse(adminInfo);
        setIsAuthenticated(true);
        setAdminData(parsedAdminInfo);
      } else {
        setIsAuthenticated(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual admin login API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      
      setIsAuthenticated(true);
      setAdminData(data.admin);
      
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setIsAuthenticated(false);
    setAdminData(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  }, []);

  return {
    isAuthenticated,
    adminData,
    loading,
    login,
    logout,
    getToken,
    checkAuthStatus,
  };
};
