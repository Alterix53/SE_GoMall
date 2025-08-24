import { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';
import { sellerService } from '../services/sellerService';
import { apiClient } from '../services/apiClient';
import { generateLocalId, generateSafeId } from '../utils/format';

const STORAGE_KEY = 'sellerProducts';

const initialProducts = [
  { id: 1, name: "Áo thun", price: 120000, category: "Thời trang" },
  { id: 2, name: "Giày thể thao", price: 350000, category: "Giày dép" }
];

export const useSellerProducts = () => {
  console.log('🚀 useSellerProducts: Hook initialized');
  
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
      console.log('🌐 Fetching products from server...');
      const response = await apiClient.get('/products/seller/my-products');
      console.log('🌐 API Response received:', response);
      
      if (response.success && response.data && response.data.products) {
        console.log('🌐 Processing server products...');
        const serverProducts = response.data.products.map(product => {
          // Debug log to see the actual product structure
          console.log('🌐 Server product structure:', {
            id: product._id,
            name: product.name,
            images: product.images,
            image: product.image,
            price: product.price
          });

          // Handle image field properly
          let imageUrl = '';
          let images = [];

          if (product.images && product.images.length > 0) {
            // Use images array if available
            images = product.images;
            imageUrl = product.images[0]?.url || product.images[0] || '';
          } else if (product.image) {
            // Fallback to single image field
            imageUrl = product.image;
            images = [{ url: product.image, isPrimary: true }];
          }

          return {
            id: generateSafeId(product._id),
            name: product.name,
            price: product.price?.original || product.price,
            category: product.categoryID?.categoryName || 'Unknown',
            categoryID: product.categoryID?._id || product.categoryID,
            description: product.description || '',
            image: imageUrl,
            images: images,
            stock: product.inventory?.quantity || product.stock || 0,
            sellerID: product.sellerID,
            serverId: product._id,
            status: product.isActive ? 'active' : 'paused',
            isOffline: false,
            createdAt: product.createdAt
          };
        });
        
        console.log('🌐 Products fetched from server:', serverProducts.length, 'products');
        return serverProducts;
      }
      console.log('🌐 No products found in response');
      return [];
    } catch (error) {
      console.error('❌ Error fetching products from server:', error);
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
  const loadAndMergeProducts = async (setLoadingState = true) => {
    console.log('🔍 loadAndMergeProducts called with setLoadingState:', setLoadingState);
    
    if (setLoadingState) {
      console.log('🔍 Setting isLoading to true');
      setIsLoading(true);
    }
    setServerError(null);
    
    // Add timeout to force clear loading state after 15 seconds
    const loadingTimeout = setTimeout(() => {
      console.warn('⏰ LoadAndMerge timeout reached, forcing clear loading state');
      if (setLoadingState) {
        setIsLoading(false);
      }
      setServerError('Request timeout. Please try again.');
    }, 15000);
    
    try {
      console.log('🔍 Loading from localStorage...');
      // Load from localStorage first
      const localProducts = loadProductsFromStorage();
      console.log('🔍 Local products loaded:', localProducts.length);
      
      console.log('🔍 Fetching from server...');
      // Try to fetch from server
      const serverProducts = await fetchProductsFromServer();
      console.log('🔍 Server products fetched:', serverProducts.length);
      
      console.log('🔍 Merging products...');
      // Merge products
      const mergedProducts = mergeProducts(serverProducts, localProducts);
      console.log('🔍 Products merged:', mergedProducts.length);
      
      console.log('🔍 Setting products state...');
      setProducts(mergedProducts);
      console.log('🔍 Setting isInitialized to true');
      setIsInitialized(true);
      
      // Save merged products back to localStorage
      if (mergedProducts.length > 0) {
        console.log('🔍 Saving to localStorage...');
        saveProductsToStorage(mergedProducts);
      }
      
      console.log('🔍 Clearing timeout');
      clearTimeout(loadingTimeout);
      
    } catch (error) {
      console.error('❌ Error loading and merging products:', error);
      // Fallback to localStorage only
      const localProducts = loadProductsFromStorage();
      console.log('🔍 Fallback: Loading from localStorage only');
      setProducts(localProducts);
      setIsInitialized(true);
      setServerError(error.message);
      clearTimeout(loadingTimeout);
    } finally {
      if (setLoadingState) {
        console.log('🔍 FINALLY: Clearing loading state in loadAndMergeProducts...');
        setIsLoading(false);
      }
      clearTimeout(loadingTimeout);
    }
  };

  // Load products on mount (only once)
  useEffect(() => {
    console.log('🔄 useEffect: Checking if initial load...');
    console.log('🔄 useEffect: isInitialLoadRef.current =', isInitialLoadRef.current);
    
    if (isInitialLoadRef.current) {
      console.log('🔄 useEffect: Starting initial load...');
      loadAndMergeProducts();
      isInitialLoadRef.current = false;
      console.log('🔄 useEffect: Initial load started, isInitialLoadRef set to false');
    } else {
      console.log('🔄 useEffect: Not initial load, skipping...');
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
        id: generateSafeId(serverProduct?._id),
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
    console.log('🔄 Refreshing products from server...');
    setIsLoading(true);
    setServerError(null);
    
    // Add timeout to force clear loading state after 15 seconds
    const loadingTimeout = setTimeout(() => {
      console.warn('⏰ Loading timeout reached, forcing clear loading state');
      setIsLoading(false);
      setServerError('Request timeout. Please try again.');
    }, 15000);
    
    try {
      await loadAndMergeProducts(false); // Don't set loading state here since we already set it
      console.log('🔄 Products refreshed successfully');
      clearTimeout(loadingTimeout);
    } catch (error) {
      console.error('❌ Error refreshing products:', error);
      setServerError(error.message);
      // Fallback to localStorage only
      const localProducts = loadProductsFromStorage();
      setProducts(localProducts);
      clearTimeout(loadingTimeout);
    } finally {
      console.log('🔄 FINALLY: Clearing loading state...');
      setIsLoading(false);
      clearTimeout(loadingTimeout);
    }
  };

  // Debug function to check current state
  const debugState = () => {
    console.log('🔍 DEBUG STATE:', {
      isLoading,
      isInitialized,
      productsCount: products.length,
      serverError,
      isInitialLoadRef: isInitialLoadRef.current
    });
  };

  // Export debug function for development
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    window.debugSellerProducts = debugState;
  }

  return {
    products,
    isLoading,
    isInitialized,
    serverError,
    setIsLoading,
    setServerError,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProduct,
    refreshProducts,
    reloadProducts: loadAndMergeProducts
  };
};
