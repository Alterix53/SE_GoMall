import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, isTokenValid } from '../utils/api/index.js';
import LogoutController from '../utils/logoutController.js';

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

  // Đăng nhập
  const login = async (identifier, password) => {
    try {
      const resp = await authAPI.login(identifier, password);
      if (resp?.data?.success) {
        const { token: newToken, user: rawUser } = resp.data.data;
        const userData = {
          id: rawUser._id || rawUser.id,
          username: rawUser.username,
          email: rawUser.email,
          role: Array.isArray(rawUser.role) ? rawUser.role : rawUser.role,
          sellerInfo: rawUser.sellerInfo || null,
        };
        
        // Lưu token và user vào localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        // Giữ tương thích với các chỗ legacy đang kiểm tra khóa này
        localStorage.setItem('isLoggedIn', 'true');
        // Nếu trước đó có adminToken (đăng nhập admin), xóa đi để tránh gây nhiễu
        localStorage.removeItem('adminToken');
        
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

  // Đăng nhập ADMIN
  const loginAdmin = async (username, password) => {
    try {
      // Admin API chỉ chấp nhận username + password
      const resp = await authAPI.loginAdmin(username, password);
      if (resp?.data?.data) {
        const { token: newToken, admin } = resp.data.data;
        const adminUser = {
          id: admin?._id || admin?.id,
          username: admin?.username,
          email: admin?.email,
          role: 'admin',
        };

        // Lưu token và user (dùng chung key để ProtectedRoute hoạt động thống nhất)
        localStorage.setItem('token', newToken);
        // Lưu thêm adminToken cho các màn admin đang dùng key riêng
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('isLoggedIn', 'true');

        setToken(newToken);
        setUser(adminUser);

        return { success: true, user: adminUser };
      }

      const message = resp?.data?.message || 'Đăng nhập admin thất bại';
      return { success: false, message };
    } catch (error) {
      const message = error?.response?.data?.message || 'Đăng nhập admin thất bại';
      return { success: false, message };
    }
  };

  // Đăng xuất
  const logout = () => {
    LogoutController.clearLocalStorage();
    setToken(null);
    setUser(null);
  };

  // Enhanced logout with navigation
  const logoutWithNavigation = (navigate, isAdmin = false) => {
    if (isAdmin) {
      return LogoutController.adminLogout(navigate, setUser, setToken);
    } else {
      return LogoutController.userLogout(navigate, setUser, setToken);
    }
  };

  // Force logout for invalid tokens
  const forceLogout = (navigate) => {
    LogoutController.forceLogout(navigate, setUser, setToken);
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
    loginAdmin,
    logout,
    logoutWithNavigation,
    forceLogout,
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