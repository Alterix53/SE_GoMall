import apiService from './apiService.js';

// Seller API service functions
export const getSellerNotifications = async (params = {}) => {
    try {
        const response = await apiService.request('/seller/notifications', {
            method: 'GET',
            params: new URLSearchParams(params)
        });
        return response.data || [];
    } catch (error) {
        console.error('Error fetching seller notifications:', error);
        throw error;
    }
};

// Get seller status
export const getSellerStatus = async () => {
    try {
        const response = await apiService.request('/seller/my-status', {
            method: 'GET'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seller status:', error);
        throw error;
    }
};
