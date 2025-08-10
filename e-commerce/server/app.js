export class ApiService {
    constructor(baseURL = '') {
      this.baseURL = baseURL;
      this.cache = new Map();
    }
  
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`API Error for ${endpoint}:`, error);
        throw new Error(`Không thể tải dữ liệu: ${error.message}`);
      }
    }
  
    // Product methods
    async getProduct(id) {
      const cacheKey = `product_${id}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
          return cached.data;
        }
      }
  
      try {
        // Try API first
        const data = await this.request(`/api/products/${id}`);
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (error) {
        // Fallback to JSON file
        return this.getProductFromJSON(id);
      }
    }
  
    async getProductFromJSON(id) {
      try {
        const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) ||
                     process.env.PUBLIC_URL || "/";
        const url = (base.replace(/\/+$/, "") || "") + "/data/products.json";
        
        const products = await this.request(url.replace(this.baseURL, ''));
        const found = products.find(p => Number(p.id) === Number(id));
        
        if (!found) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        return this.normalizeProduct(found);
      } catch (error) {
        throw new Error(`Không tìm thấy sản phẩm: ${error.message}`);
      }
    }
  
    async getRelatedProducts(id, limit = 4) {
      try {
        return await this.request(`/api/products/${id}/related?limit=${limit}`);
      } catch {
        // Fallback logic
        return [];
      }
    }
  
    async getProductReviews(id, page = 1, limit = 10) {
      try {
        return await this.request(`/api/products/${id}/reviews?page=${page}&limit=${limit}`);
      } catch {
        return { reviews: [], total: 0 };
      }
    }
  
    normalizeProduct(rawProduct) {
      return {
        id: rawProduct.id,
        name: rawProduct.name,
        price: {
          original: rawProduct.price_original,
          sale: rawProduct.price_sale ?? rawProduct.price_original,
        },
        description: rawProduct.description,
        images: rawProduct.images_url ? [rawProduct.images_url] : [],
        rating: {
          average: rawProduct.rating_average ?? 0,
          count: rawProduct.rating_count ?? 0,
        },
        sold: rawProduct.sold ?? 0,
        inventory: { 
          quantity: rawProduct.inventory_quantity ?? 0 
        },
        sizes: rawProduct.sizes || [],
        category: rawProduct.category || {},
        features: rawProduct.features || [],
        specifications: rawProduct.specifications || {},
      };
    }
  
    clearCache() {
      this.cache.clear();
    }
  }
  
  // Singleton instance
  export const apiService = new ApiService();