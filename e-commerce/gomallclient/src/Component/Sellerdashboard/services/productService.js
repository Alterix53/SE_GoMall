import { apiClient } from './apiClient';
import { generateSKU, slugify } from '../utils/format';

export const productService = {
  async createProduct(productData, imageFiles = []) {
    const formData = new FormData();
    
    // Add product information
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('price[original]', productData.price.toString());
    formData.append('inventory[quantity]', productData.stock?.toString() || '0');
    formData.append('categoryID', productData.categoryID || '');
    formData.append('brand', 'Thương hiệu riêng');
    formData.append('sku', generateSKU());
    formData.append('slug', slugify(productData.name));
    
    // Add multiple images
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
        formData.append('imageAlts', productData.name);
      });
    } else if (productData.image && productData.image.startsWith('http')) {
      // If URL, create default image
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', productData.name);
    }

    console.log('Attempting to connect to:', '/products');
    
    const response = await apiClient.post('/products', formData);
    return response.data.product;
  },

  async updateProduct(productId, productData, imageFile = null) {
    const formData = new FormData();
    
    // Add product information
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('price[original]', productData.price.toString());
    formData.append('inventory[quantity]', productData.stock?.toString() || '0');
    formData.append('categoryID', productData.categoryID || '');
    formData.append('brand', 'Thương hiệu riêng');
    formData.append('sku', generateSKU());
    formData.append('slug', slugify(productData.name));
    
    // Add image
    if (imageFile) {
      formData.append('images', imageFile);
      formData.append('imageAlts', productData.name);
    } else if (productData.image && productData.image.startsWith('http')) {
      // If URL, create default image
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', productData.name);
    }

    console.log('Attempting to update product:', productId);
    
    const response = await apiClient.put(`/products/${productId}`, formData);
    return response.data.product;
  },

  async deleteProduct(serverId) {
    return await apiClient.delete(`/products/${serverId}`);
  },

  async syncProduct(product) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('price[original]', product.price.toString());
    formData.append('inventory[quantity]', product.stock?.toString() || '0');
    formData.append('categoryID', product.categoryID || ''); // Fix: Use categoryID instead of serverId
    formData.append('brand', 'Thương hiệu riêng');
    formData.append('sku', product.serverId ? product.serverId.substring(0, 8) + Date.now() : generateSKU());
    formData.append('slug', slugify(product.name));

    if (product.image && product.image.startsWith('http')) {
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', product.name);
    } else if (product.image) {
      formData.append('images', new File([product.image], 'product.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', product.name);
    }

    const response = await apiClient.put(`/products/${product.serverId}`, formData);
    return response.data.product;
  }
};
