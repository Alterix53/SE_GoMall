const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Admin API functions
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