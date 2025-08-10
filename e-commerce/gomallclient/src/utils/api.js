import axios from 'axios';

// Tạo axios instance với base URL cho user API
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
      const url = error.config?.url || '';
      // Đừng redirect nếu là gọi login user
      if (url.includes('/auth/login')) {
        return Promise.reject(error);
      }
      // Token không hợp lệ hoặc hết hạn
      let currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem('user'));
      } catch {}

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');

      // Redirect phù hợp theo role trước đó
      if (currentUser?.role === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper functions cho user API
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
  },

  // User management functions
  updateUserProfile: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  getCurrentUserProfile: (userId) => {
    return api.get(`/users/${userId}`);
  },

  changePassword: (userId, passwordData) => {
    return api.put(`/auth/change-password`, passwordData);
  },
  // Seller application
  applyForSeller: (data) => {
    return api.post(`/sellers/apply`, data);
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

// Checkout and Order APIs
export const checkoutAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiService.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await apiService.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await apiService.get('/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiService.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Auth/User self-service APIs
export const selfAPI = {
  getMe: async () => {
    const resp = await apiService.get('/auth/me');
    return resp.data;
  },
  updateMe: async (payload) => {
    const resp = await apiService.put('/auth/me', payload);
    return resp.data;
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

// Admin API functions - sử dụng fetch API
// Đồng bộ base URL với server hiện tại (8080) để tránh 404 do sai cổng
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const adminAPI = {
    // Admin authentication
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    // Dashboard APIs
    getDashboardStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getRevenueStats: async (token, period = 'month') => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/revenue?period=${period}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getTopSellingProducts: async (token, limit = 10) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/top-products?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getSellerStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/seller-stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getUserActivityStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/user-activity`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getSystemOverview: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/overview`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    // User Management APIs
    getAllUsers: async (token, params = {}) => {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getUserById: async (token, userId) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    createUser: async (token, userData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    updateUser: async (token, userId, updateData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    deleteUser: async (token, userId) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    updateUserStatus: async (token, userId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },

    // Seller Management APIs
    getAllSellers: async (token, params = {}) => {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/admin/sellers?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getSellerById: async (token, sellerId) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    createSeller: async (token, sellerData) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sellerData),
        });
        return response.json();
    },

    updateSeller: async (token, sellerId, updateData) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    deleteSeller: async (token, sellerId) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    updateSellerStatus: async (token, sellerId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },

    approveSeller: async (token, sellerId) => {
        const response = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/approve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    // Product Management APIs
    getAllProducts: async (token, params = {}) => {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/admin/products?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getProductById: async (token, productId) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    createProduct: async (token, productData) => {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        return response.json();
    },

    updateProduct: async (token, productId, updateData) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    deleteProduct: async (token, productId) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    updateProductStatus: async (token, productId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },

    toggleProductFeature: async (token, productId) => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/feature`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    // Order Management APIs
    getAllOrders: async (token, params = {}) => {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/admin/orders?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getOrderById: async (token, orderId) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    updateOrder: async (token, orderId, updateData) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    updateOrderStatus: async (token, orderId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },

    // Category Management APIs
    getAllCategories: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getCategoryById: async (token, categoryId) => {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    createCategory: async (token, categoryData) => {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });
        return response.json();
    },

    updateCategory: async (token, categoryId, updateData) => {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    deleteCategory: async (token, categoryId) => {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    // System Management APIs
    getSystemLogs: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/system/logs`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    createBackup: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/system/backup`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    toggleMaintenanceMode: async (token, enabled) => {
        const response = await fetch(`${API_BASE_URL}/admin/system/maintenance`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enabled }),
        });
        return response.json();
    },
};

export default api;
