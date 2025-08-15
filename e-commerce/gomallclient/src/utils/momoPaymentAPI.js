import apiService from './apiService.js';

const MOMO_API_BASE = 'http://localhost:8080/api/momo';

export const momoPaymentAPI = {
    // Tạo giao dịch MoMo mới
    createPayment: async (orderID, amount, orderInfo) => {
        try {
            const response = await apiService.post(`${MOMO_API_BASE}/create`, {
                orderID,
                amount,
                orderInfo
            });
            return response;
        } catch (error) {
            console.error('Error creating MoMo payment:', error);
            throw error;
        }
    },

    // Kiểm tra trạng thái giao dịch
    checkPaymentStatus: async (requestId) => {
        try {
            const response = await apiService.get(`${MOMO_API_BASE}/status/${requestId}`);
            return response;
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    },

    // Lấy lịch sử giao dịch của user
    getUserPayments: async (page = 1, limit = 10) => {
        try {
            const response = await apiService.get(`${MOMO_API_BASE}/user?page=${page}&limit=${limit}`);
            return response;
        } catch (error) {
            console.error('Error getting user payments:', error);
            throw error;
        }
    },

    // Hủy giao dịch
    cancelPayment: async (requestId) => {
        try {
            const response = await apiService.delete(`${MOMO_API_BASE}/cancel/${requestId}`);
            return response;
        } catch (error) {
            console.error('Error cancelling payment:', error);
            throw error;
        }
    },

    // Lấy thông tin giao dịch theo ID
    getPaymentById: async (id) => {
        try {
            const response = await apiService.get(`${MOMO_API_BASE}/${id}`);
            return response;
        } catch (error) {
            console.error('Error getting payment by ID:', error);
            throw error;
        }
    },

    // Simulate MoMo response (cho testing)
    simulateResponse: async (requestId, resultCode = 0) => {
        try {
            const response = await apiService.post(`${MOMO_API_BASE}/simulate`, {
                requestId,
                resultCode
            });
            return response;
        } catch (error) {
            console.error('Error simulating MoMo response:', error);
            throw error;
        }
    },

    // Health check
    healthCheck: async () => {
        try {
            const response = await apiService.get(`${MOMO_API_BASE}/health`);
            return response;
        } catch (error) {
            console.error('Error checking MoMo service health:', error);
            throw error;
        }
    }
};

export default momoPaymentAPI;
