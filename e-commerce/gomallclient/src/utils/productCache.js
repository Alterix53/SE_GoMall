import axios from 'axios';
import { apiService } from './api.js';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY_PREFIX = 'product_cache_';

class ProductCacheService {
  constructor() {
    this.cache = new Map();
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2 seconds
  }

  // Generate cache key based on endpoint and parameters
  generateCacheKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${CACHE_KEY_PREFIX}${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  // Get cached data if valid
  getCachedData(cacheKey) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < CACHE_TTL) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
        console.log(`Cache expired for key: ${cacheKey}`);
        return null;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  // Set cache data with timestamp
  setCachedData(cacheKey, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`Cache set for key: ${cacheKey}`);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  // Clear all product cache
  clearCache() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('Product cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Clear specific cache by pattern
  clearCacheByPattern(pattern) {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX) && key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
      console.log(`Cache cleared for pattern: ${pattern}`);
    } catch (error) {
      console.error('Error clearing cache by pattern:', error);
    }
  }

  // Retry logic for API calls
  async retryApiCall(apiCall, retries = 0) {
    try {
      return await apiCall();
    } catch (error) {
      retries++;
      console.error(`API call failed (attempt ${retries}/${this.maxRetries}):`, error.message);
      
      if (retries < this.maxRetries) {
        console.log(`Retrying in ${this.retryDelay * retries}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
        return this.retryApiCall(apiCall, retries);
      } else {
        console.error("Max retries reached, throwing error");
        throw error;
      }
    }
  }

  // Get all products with cache
  async getAllProducts(params = {}) {
    const cacheKey = this.generateCacheKey('products', params);
    
    // Try to get from cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API with retry logic
    return this.retryApiCall(async () => {
      console.log('Fetching products from API...');
      const response = await apiService.get('/products', { params });
      
      if (response.data.success) {
        // Cache the response
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    });
  }

  // Get flash sale products with cache
  async getFlashSaleProducts(params = {}) {
    const cacheKey = this.generateCacheKey('products/flash-sale', params);
    
    // Try to get from cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API with retry logic
    return this.retryApiCall(async () => {
      console.log('Fetching flash sale products from API...');
      const response = await apiService.get('/products/flash-sale', { params });
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch flash sale products');
      }
    });
  }

  // Get top products with cache
  async getTopProducts(params = {}) {
    const cacheKey = this.generateCacheKey('products/top-products', params);
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    return this.retryApiCall(async () => {
      console.log('Fetching top products from API...');
      const response = await apiService.get('/products/top-products', { params });
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch top products');
      }
    });
  }

  // Get product by ID with cache
  async getProductById(productId) {
    const cacheKey = this.generateCacheKey(`products/${productId}`);
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    return this.retryApiCall(async () => {
      console.log(`Fetching product ${productId} from API...`);
      const response = await apiService.get(`/products/${productId}`);
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch product');
      }
    });
  }

  // Search products with cache
  async searchProducts(searchParams = {}) {
    const cacheKey = this.generateCacheKey('products', searchParams);
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    return this.retryApiCall(async () => {
      console.log('Searching products from API...');
      const response = await apiService.get('/products', { params: searchParams });
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to search products');
      }
    });
  }

  // Invalidate cache when product is updated/created/deleted
  invalidateProductCache(productId = null) {
    if (productId) {
      // Clear specific product cache
      this.clearCacheByPattern(`products/${productId}`);
    } else {
      // Clear all product cache
      this.clearCache();
    }
  }
}

// Create singleton instance
const productCacheService = new ProductCacheService();

export default productCacheService; 