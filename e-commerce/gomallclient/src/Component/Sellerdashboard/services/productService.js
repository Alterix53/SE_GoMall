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
    
    // Add multiple images with main image designation
    if (imageFiles.length > 0) {
      // Find main image index
      const mainImageIndex = productData.images?.findIndex(img => img.isMain) ?? 0;
      
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
        formData.append('imageAlts', productData.name);
        // Mark main image
        if (index === mainImageIndex) {
          formData.append('mainIndex', index.toString());
        }
      });
    } else if (productData.images && productData.images.length > 0) {
      // Handle URL images
      const mainImageIndex = productData.images.findIndex(img => img.isMain) ?? 0;
      formData.append('mainIndex', mainImageIndex.toString());
      
      productData.images.forEach((image, index) => {
        if (image.url && image.url.startsWith('http')) {
          // Create a placeholder file for URL images
          formData.append('images', new File([''], `image-${index}.jpg`, { type: 'image/jpeg' }));
          formData.append('imageAlts', productData.name);
        }
      });
    } else if (productData.image && productData.image.startsWith('http')) {
      // Fallback for single image URL
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', productData.name);
      formData.append('mainIndex', '0');
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
      formData.append('mainIndex', '0');
    } else if (productData.images && productData.images.length > 0) {
      // Handle URL images for edit
      const mainImageIndex = productData.images.findIndex(img => img.isMain) ?? 0;
      formData.append('mainIndex', mainImageIndex.toString());
      
      productData.images.forEach((image, index) => {
        if (image.url && image.url.startsWith('http')) {
          formData.append('images', new File([''], `image-${index}.jpg`, { type: 'image/jpeg' }));
          formData.append('imageAlts', productData.name);
        }
      });
    } else if (productData.image && productData.image.startsWith('http')) {
      // If URL, create default image
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', productData.name);
      formData.append('mainIndex', '0');
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

    if (product.images && product.images.length > 0) {
      // Handle multi-image sync
      const mainImageIndex = product.images.findIndex(img => img.isMain) ?? 0;
      formData.append('mainIndex', mainImageIndex.toString());
      
      product.images.forEach((image, index) => {
        if (image.url && image.url.startsWith('http')) {
          formData.append('images', new File([''], `image-${index}.jpg`, { type: 'image/jpeg' }));
          formData.append('imageAlts', product.name);
        }
      });
    } else if (product.image && product.image.startsWith('http')) {
      formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', product.name);
      formData.append('mainIndex', '0');
    } else if (product.image) {
      formData.append('images', new File([product.image], 'product.jpg', { type: 'image/jpeg' }));
      formData.append('imageAlts', product.name);
      formData.append('mainIndex', '0');
    }

    const response = await apiClient.put(`/products/${product.serverId}`, formData);
    return response.data.product;
  }
};
