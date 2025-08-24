import { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';
import { sellerService } from '../services/sellerService';
import { apiClient } from '../services/apiClient';
import { generateLocalId } from '../utils/format';

const STORAGE_KEY = 'sellerProducts';

const initialProducts = [
  { id: 1, name: "Áo thun", price: 120000, category: "Thời trang" },
  { id: 2, name: "Giày thể thao", price: 350000, category: "Giày dép" }
];

export const useSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [serverError, setServerError] = useState(null);
  const isInitialLoadRef = useRef(true);

  // Load products from localStorage
  const loadProductsFromStorage = () => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Products loaded from localStorage:', parsed.length, 'products');
          return parsed;
        }
      }
      console.log('No valid products in localStorage, using initial products');
      return initialProducts;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return initialProducts;
    }
  };

  // Save products to localStorage
  const saveProductsToStorage = (productsToSave) => {
    if (productsToSave && productsToSave.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsToSave));
      console.log('Products saved to localStorage:', productsToSave.length, 'products');
    }
  };

  // Fetch products from server
  const fetchProductsFromServer = async () => {
    try {
      console.log('Fetching products from server...');
      const response = await apiClient.get('/products/seller/my-products');
      
      if (response.success && response.data && response.data.products) {
        const serverProducts = response.data.products.map(product => ({
          id: Number(product._id.substring(product._id.length - 5)),
          name: product.name,
          price: product.price?.original || product.price,
          category: product.categoryID?.categoryName || 'Unknown',
          categoryID: product.categoryID?._id || product.categoryID,
          description: product.description || '',
          image: product.images?.[0]?.url || product.image || '',
          images: product.images || [],
          stock: product.inventory?.quantity || product.stock || 0,
          sellerID: product.sellerID,
          serverId: product._id,
          status: product.isActive ? 'active' : 'paused',
          isOffline: false,
          createdAt: product.createdAt
        }));
        
        console.log('Products fetched from server:', serverProducts.length, 'products');
        return serverProducts;
      }
      return [];
    } catch (error) {
      console.error('Error fetching products from server:', error);
      setServerError(error.message);
      return [];
    }
  };

  // Merge server products with local products
  const mergeProducts = (serverProducts, localProducts) => {
    const merged = [...serverProducts];
    const serverIds = new Set(serverProducts.map(p => p.serverId));
    
    // Add local products that don't exist on server
    localProducts.forEach(localProduct => {
      if (!localProduct.serverId || !serverIds.has(localProduct.serverId)) {
        // This is a local-only product or server product not in current fetch
        merged.push(localProduct);
      }
    });
    
    console.log('Merged products:', {
      server: serverProducts.length,
      local: localProducts.length,
      total: merged.length
    });
    
    return merged;
  };

  // Load and merge products on mount
  const loadAndMergeProducts = async () => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      // Load from localStorage first
      const localProducts = loadProductsFromStorage();
      
      // Try to fetch from server
      const serverProducts = await fetchProductsFromServer();
      
      // Merge products
      const mergedProducts = mergeProducts(serverProducts, localProducts);
      
      setProducts(mergedProducts);
      setIsInitialized(true);
      
      // Save merged products back to localStorage
      if (mergedProducts.length > 0) {
        saveProductsToStorage(mergedProducts);
      }
      
    } catch (error) {
      console.error('Error loading and merging products:', error);
      // Fallback to localStorage only
      const localProducts = loadProductsFromStorage();
      setProducts(localProducts);
      setIsInitialized(true);
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount (only once)
  useEffect(() => {
    if (isInitialLoadRef.current) {
      loadAndMergeProducts();
      isInitialLoadRef.current = false;
    }
  }, []);

  // Save products whenever they change (but only after initialization)
  useEffect(() => {
    if (isInitialized && products.length > 0) {
      saveProductsToStorage(products);
    }
  }, [products, isInitialized]);

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
      
      // Handle images properly
      let imageUrl = '';
      let images = [];
      
      if (serverProduct?.images && serverProduct.images.length > 0) {
        // Use server images
        images = serverProduct.images;
        imageUrl = serverProduct.images[0]?.url || '';
      } else if (productData.images && productData.images.length > 0) {
        // Use local images
        images = productData.images;
        imageUrl = productData.images[0]?.url || '';
      } else if (productData.image) {
        // Fallback to single image
        imageUrl = productData.image;
        images = [{ url: productData.image, isPrimary: true }];
      }
      
      // Create new product
      const newItem = {
        id: serverProduct?._id ? Number(serverProduct._id.substring(serverProduct._id.length - 5)) : generateLocalId(),
        name: productData.name,
        price: productData.price,
        category: productData.category,
        categoryID: productData.categoryID,
        description: productData.description,
        image: imageUrl,
        images: images,
        stock: productData.stock,
        sellerID: sellerID,
        serverId: serverProduct?._id,
        status: 'active',
        isOffline: isOfflineMode,
        createdAt: new Date().toISOString()
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

  const updateProduct = async (productId, productData, imageFiles = []) => {
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
        serverProduct = await productService.updateProduct(productToUpdate.serverId, productData, imageFiles);
        console.log('Product updated on server:', serverProduct);
      } catch (serverError) {
        console.warn('Server error, falling back to local storage:', serverError);
        isOfflineMode = true;
      }

      // Handle images properly
      let imageUrl = '';
      let images = [];
      
      if (serverProduct?.images && serverProduct.images.length > 0) {
        // Use server images
        images = serverProduct.images;
        imageUrl = serverProduct.images[0]?.url || '';
      } else if (productData.images && productData.images.length > 0) {
        // Use local images
        images = productData.images;
        imageUrl = productData.images[0]?.url || '';
      } else if (productData.image) {
        // Fallback to single image
        imageUrl = productData.image;
        images = [{ url: productData.image, isPrimary: true }];
      }

      // Update product in list
      const updatedItem = {
        ...productToUpdate,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        categoryID: productData.categoryID,
        description: productData.description,
        image: imageUrl,
        images: images,
        stock: productData.stock,
        serverId: serverProduct?._id || productToUpdate.serverId,
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

      if (!productToSync.isOffline) {
        throw new Error('Product is already synced with server.');
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

  const refreshProducts = async () => {
    console.log('Refreshing products from server...');
    await loadAndMergeProducts();
  };

  return {
    products,
    isLoading,
    serverError,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProduct,
    refreshProducts,
    reloadProducts: loadAndMergeProducts
  };
};
