import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const login = async (username, password) => {
    try {
      // Giả lập API call
      const response = await mockLoginAPI(username, password);
      
      if (response.success) {
        const { token: newToken, user: userData } = response;
        
        // Lưu token và user vào localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Cập nhật state
        setToken(newToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Đăng nhập thất bại' };
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

  // Mock API cho demo
  const mockLoginAPI = async (username, password) => {
    // Giả lập delay network
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Kiểm tra thông tin đăng nhập từ localStorage (như code cũ)
    const storedAccount = JSON.parse(localStorage.getItem('account'));
    
    if (storedAccount && 
        storedAccount.username === username && 
        storedAccount.password === password) {
      
      // Tạo mock token (JWT format)
      const mockToken = createMockJWT({
        userId: Date.now(),
        username: username,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 giờ
      });
      
      return {
        success: true,
        token: mockToken,
        user: {
          id: Date.now(),
          username: username,
          email: storedAccount.email,
          role: 'user'
        }
      };
    } else {
      return {
        success: false,
        message: 'Sai tài khoản hoặc mật khẩu!'
      };
    }
  };

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