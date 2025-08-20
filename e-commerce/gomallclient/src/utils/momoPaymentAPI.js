import { apiService } from './api.js';

// Sử dụng apiService với các method đúng
export const momoPaymentAPI = {
    // Tạo giao dịch MoMo mới
    createPayment: async (orderID, amount, orderInfo) => {
        try {
            return await apiService.post('/momo/create', { orderID, amount, orderInfo });
        } catch (error) {
            console.error('Error creating MoMo payment:', error);
            throw error;
        }
    },

    // Tạo giao dịch test (không cần authentication)
    createTestPayment: async (orderID, amount, orderInfo) => {
        try {
            return await apiService.post('/momo/test-create', { orderID, amount, orderInfo });
        } catch (error) {
            console.error('Error creating test MoMo payment:', error);
            throw error;
        }
    },

    // Kiểm tra trạng thái giao dịch
    checkPaymentStatus: async (requestId) => {
        try {
            return await apiService.get(`/momo/status/${requestId}`);
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    },

    // Lấy lịch sử giao dịch của user
    getUserPayments: async (page = 1, limit = 10) => {
        try {
            return await apiService.get(`/momo/user?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('Error getting user payments:', error);
            throw error;
        }
    },

    // Hủy giao dịch
    cancelPayment: async (requestId) => {
        try {
            return await apiService.delete(`/momo/cancel/${requestId}`);
        } catch (error) {
            console.error('Error cancelling payment:', error);
            throw error;
        }
    },

    // Lấy thông tin giao dịch theo ID
    getPaymentById: async (id) => {
        try {
            return await apiService.get(`/momo/${id}`);
        } catch (error) {
            console.error('Error getting payment by ID:', error);
            throw error;
        }
    },

    // Simulate MoMo response (cho testing)
    simulateResponse: async (requestId, resultCode = 0) => {
        try {
            return await apiService.post('/momo/simulate', { requestId, resultCode });
        } catch (error) {
            console.error('Error simulating MoMo response:', error);
            throw error;
        }
    },

    // Health check
    healthCheck: async () => {
        try {
            return await apiService.get('/momo/health');
        } catch (error) {
            console.error('Error checking MoMo service health:', error);
            throw error;
        }
    }
};

export default momoPaymentAPI;
