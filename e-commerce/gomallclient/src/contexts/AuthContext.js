import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Kiểm tra token có hợp lệ không
          if (isTokenValid(storedToken)) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token hết hạn, xóa khỏi localStorage
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Kiểm tra token có hợp lệ không
  const isTokenValid = (token) => {
    try {
      // Nếu token là JWT, decode để kiểm tra expiration
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
      }
      // Nếu không phải JWT, coi như luôn hợp lệ (cho demo)
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // Đăng nhập
  const login = async (identifier, password) => {
    try {
      // Cho phép đăng nhập bằng username hoặc email: dùng regex email thay vì chỉ kiểm tra '@'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = typeof identifier === 'string' && emailRegex.test(identifier);
      const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
      const resp = await apiService.post('/auth/login', payload);
      if (resp?.data?.success) {
        const { token: newToken, user: rawUser } = resp.data.data;
        const userData = {
          id: rawUser._id || rawUser.id,
          username: rawUser.username,
          email: rawUser.email,
          role: Array.isArray(rawUser.role) ? rawUser.role[0] : rawUser.role,
          sellerInfo: rawUser.sellerInfo || null,
        };
        
        // Lưu token và user vào localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        // Giữ tương thích với các chỗ legacy đang kiểm tra khóa này
        localStorage.setItem('isLoggedIn', 'true');
        
        // Cập nhật state
        setToken(newToken);
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        const serverMsg = resp?.data?.message;
        const serverErrors = resp?.data?.errors;
        const combined = Array.isArray(serverErrors) && serverErrors.length
          ? serverErrors.map(e => e.msg || e.message).join('\n')
          : serverMsg || 'Đăng nhập thất bại';
        return { success: false, message: combined, errors: serverErrors || [] };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback: thông báo lỗi rõ ràng
      const serverErrors = error?.response?.data?.errors;
      const message = Array.isArray(serverErrors) && serverErrors.length
        ? serverErrors.map(e => e.msg || e.message).join('\n')
        : (error?.response?.data?.message || 'Đăng nhập thất bại');
      return { success: false, message, errors: serverErrors || [] };
    }
  };

  // Đăng xuất
  const logout = () => {
    // Xóa token và user khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // Reset state
    setToken(null);
    setUser(null);
  };

  // Kiểm tra người dùng đã đăng nhập chưa
  const isAuthenticated = () => {
    return !!token && !!user && isTokenValid(token);
  };

  // Lấy token hiện tại
  const getToken = () => {
    return token;
  };

  // Lấy thông tin user hiện tại
  const getCurrentUser = () => {
    return user;
  };

  // (Giữ sẵn) Tạo mock JWT token – dùng cho môi trường demo khác nếu cần

  // Tạo mock JWT token
  const createMockJWT = (payload) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');
    
    return `${header}.${payloadEncoded}.${signature}`;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    getToken,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 