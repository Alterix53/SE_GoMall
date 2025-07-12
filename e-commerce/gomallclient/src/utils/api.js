import axios from 'axios';

// Tạo axios instance với base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Request interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi authentication
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token không hợp lệ hoặc hết hạn
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      
      // Redirect về trang login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper functions
export const apiService = {
  // GET request
  get: (url, config = {}) => {
    return api.get(url, config);
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return api.patch(url, data, config);
  }
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = (token) => {
  try {
    if (!token) return false;
    
    // Nếu token là JWT, decode để kiểm tra expiration
    if (token.split('.').length === 3) {
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

// Lấy thông tin user từ token
export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    
    if (token.split('.').length === 3) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export default api; 