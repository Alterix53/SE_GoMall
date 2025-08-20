// API service utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
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
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        // Don't redirect on login calls
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/admin/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/login';
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Product APIs
  static async getAllProducts(page = 1, limit = 12, extra = {}) {
    const paramsObj = { page: String(page), limit: String(limit), ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) };
    const params = new URLSearchParams(paramsObj);
    return this.request(`/products?${params.toString()}`);
  }

  static async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  static async getFlashSaleProducts(extra = {}) {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])));
    const qs = params.toString();
    return this.request(`/products/flash-sale${qs ? `?${qs}` : ''}`);
  }

  static async getTopProducts(type = 'bestseller', extra = {}) {
    const paramsObj = { type: String(type), ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) };
    const params = new URLSearchParams(paramsObj);
    return this.request(`/products/top-products?${params.toString()}`);
  }

  static async getProductStats() {
    return this.request('/products/stats');
  }

  // Category APIs
  static async getAllCategories() {
    // server exposes /api/categories without auth
    return this.request('/categories');
  }

  // Authentication APIs
  static async login(identifier, password) {
    // backend accepts username or email via /auth/login
    const body = identifier?.includes('@') ? { email: identifier, password } : { username: identifier, password };
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
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
    // No dedicated endpoint; clear client state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    return { success: true };
  }

  // Cart APIs (require auth)
  static async getCart() {
    return this.request('/cart/me');
  }

  static async addToCart(productID, quantity = 1, size = 'default') {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productID, quantity, size }),
    });
  }

  static async updateCartItem(productID, quantity, size = 'default') {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productID, quantity, size }),
    });
  }

  static async removeFromCart(productID, size = 'default') {
    return this.request('/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productID, size }),
    });
  }

  static async clearCart() {
    return this.request('/cart/clear', { method: 'DELETE' });
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

  // Seller/Product management (seller auth)
  static async getSellerProducts(extra = {}) {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])));
    return this.request(`/products/seller/my-products?${params.toString()}`);
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
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }
}

export default ApiService;