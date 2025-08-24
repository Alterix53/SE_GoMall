import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { sellerService } from '../services/sellerService';
import { generateLocalId } from '../utils/format';

const STORAGE_KEY = 'sellerProducts';

const initialProducts = [
  { id: 1, name: "Áo thun", price: 120000, category: "Thời trang" },
  { id: 2, name: "Giày thể thao", price: 350000, category: "Giày dép" }
];

export const useSellerProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Load products from localStorage
  const loadProductsFromStorage = () => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          console.log('Products loaded from localStorage:', parsed.length, 'products');
        } else {
          setProducts(initialProducts);
          console.log('Invalid data, using initial products');
        }
      } else {
        setProducts(initialProducts);
        console.log('No saved products, using initial products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(initialProducts);
      console.log('Error occurred, using initial products');
    }
  };

  // Save products to localStorage
  const saveProductsToStorage = (productsToSave) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsToSave));
    console.log('Products saved to localStorage:', productsToSave.length, 'products');
  };

  // Load products on mount
  useEffect(() => {
    loadProductsFromStorage();
  }, []);

  // Save products whenever they change
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  // Save products on unmount
  useEffect(() => {
    return () => {
      if (products.length > 0) {
        console.log('Component unmounting, saving products to localStorage:', products.length, 'products');
        saveProductsToStorage(products);
      }
    };
  }, [products]);

  const createProduct = async (productData, imageFiles = []) => {
    setIsLoading(true);
    
    try {
      let serverProduct = null;
      let isOfflineMode = false;

      try {
        // Try to create product on server
        serverProduct = await productService.createProduct(productData, imageFiles);
        console.log('Product created on server:', serverProduct);
      } catch (serverError) {
        console.warn('Server error, falling back to local storage:', serverError);
        isOfflineMode = true;
      }

      // Get sellerID
      const sellerID = await sellerService.getSellerID();
      
      // Create new product
      const newItem = {
        id: serverProduct?._id ? Number(serverProduct._id.substring(serverProduct._id.length - 5)) : generateLocalId(),
        name: productData.name,
        price: productData.price,
        category: productData.category,
        categoryID: productData.categoryID,
        description: productData.description,
        image: serverProduct?.images?.[0]?.url || productData.image,
        stock: productData.stock,
        sellerID: sellerID,
        serverId: serverProduct?._id,
        status: 'active',
        isOffline: isOfflineMode
      };

      setProducts(prev => [...prev, newItem]);
      
      return {
        success: true,
        product: newItem,
        isOfflineMode
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (productId, productData, imageFile = null) => {
    setIsLoading(true);
    
    try {
      const productToUpdate = products.find(p => p.id === productId);
      if (!productToUpdate) {
        throw new Error('Product not found');
      }

      let serverProduct = null;
      let isOfflineMode = false;

      try {
        // Try to update product on server
        serverProduct = await productService.updateProduct(productToUpdate.serverId, productData, imageFile);
        console.log('Product updated on server:', serverProduct);
      } catch (serverError) {
        console.warn('Server error, falling back to local storage:', serverError);
        isOfflineMode = true;
      }

      // Update product in list
      const updatedItem = {
        ...productToUpdate,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        categoryID: productData.categoryID,
        description: productData.description,
        image: serverProduct?.images?.[0]?.url || productData.image,
        stock: productData.stock,
        serverId: serverProduct?._id,
        isOffline: isOfflineMode
      };

      setProducts(prev => prev.map(p => p.id === productId ? updatedItem : p));
      
      return {
        success: true,
        product: updatedItem,
        isOfflineMode
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const productToDelete = products.find(p => p.id === productId);
      
      // Try to delete from server if serverId exists
      if (productToDelete && productToDelete.serverId) {
        try {
          await productService.deleteProduct(productToDelete.serverId);
          console.log('Product deleted from server successfully');
        } catch (error) {
          console.warn('Failed to delete product from server, but will delete locally:', error);
        }
      }
      
      // Delete from local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const syncProduct = async (productId) => {
    setIsLoading(true);
    
    try {
      const productToSync = products.find(p => p.id === productId);
      if (!productToSync) {
        throw new Error('Product not found');
      }

      if (productToSync.isOffline) {
        throw new Error('Sản phẩm đã ở trạng thái offline, không thể đồng bộ lại.');
      }

      const updatedProduct = await productService.syncProduct(productToSync);

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, serverId: updatedProduct._id, isOffline: false } : p
      ));

      return { success: true };
    } catch (error) {
      console.error('Error syncing product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProduct,
    reloadProducts: loadProductsFromStorage
  };
};
