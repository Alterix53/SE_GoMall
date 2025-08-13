// API service utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Product APIs
  static async getAllProducts(page = 1, limit = 12) {
    return this.request(`/products?page=${page}&limit=${limit}`);
  }

  static async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  static async getFlashSaleProducts() {
    return this.request('/products/flash-sale');
  }

  static async getTopProducts() {
    return this.request('/products/top-products');
  }

  static async getProductStats() {
    return this.request('/products/stats');
  }

  // Category APIs
  static async getAllCategories() {
    return this.request('/categories');
  }

  static async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  static async getCategoryProducts(id) {
    return this.request(`/categories/${id}/products`);
  }

  // Authentication APIs
  static async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  static async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
    return result;
  }

  // Cart APIs
  static async getCart() {
    return this.request('/cart');
  }

  static async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async removeFromCart(productId) {
    return this.request('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  static async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Order APIs
  static async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getOrders() {
    return this.request('/orders');
  }

  static async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  // Admin APIs
  static async getAdminStats() {
    return this.request('/admin/stats');
  }

  static async getAllUsers() {
    return this.request('/admin/users');
  }

  static async getAllSellers() {
    return this.request('/admin/sellers');
  }

  static async approveSeller(sellerId) {
    return this.request(`/admin/sellers/${sellerId}/approve`, {
      method: 'PATCH',
    });
  }

  static async rejectSeller(sellerId) {
    return this.request(`/admin/sellers/${sellerId}/reject`, {
      method: 'PATCH',
    });
  }

  // Seller APIs
  static async getSellerProducts() {
    return this.request('/products/seller/my-products');
  }

  static async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  static async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  static async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export default ApiService;