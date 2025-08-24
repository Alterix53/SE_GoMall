import { apiClient } from './apiClient';

export const sellerService = {
  async getSellerStatus() {
    try {
      const response = await apiClient.get('/sellers/my-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller status:', error);
      throw error;
    }
  },

  async getSellerID() {
    let sellerID = localStorage.getItem('sellerID');
    console.log('Current sellerID from localStorage:', sellerID);
    
    if (!sellerID) {
      try {
        console.log('No sellerID in localStorage, fetching from API...');
        const data = await this.getSellerStatus();
        
        if (data.success && data.data.hasApplication && data.data.status === 'approved') {
          sellerID = data.data.sellerID;
          localStorage.setItem('sellerID', sellerID);
          localStorage.setItem('sellerBusinessName', data.data.businessName);
          console.log('SellerID fetched from API and saved to localStorage:', sellerID);
        }
      } catch (error) {
        console.error('Error fetching sellerID from API:', error);
      }
    }
    
    return sellerID;
  }
};
