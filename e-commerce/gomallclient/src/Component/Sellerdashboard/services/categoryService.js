import { apiClient } from './apiClient';

export const categoryService = {
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      return response.data.categories || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }
};
