import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiService } from "../utils/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, getCurrentUser } = useAuth();

  // Load cart from API when user is authenticated
  const loadCartFromAPI = async () => {
    const currentUser = getCurrentUser();
    if (!isAuthenticated() || currentUser?.role === 'admin') {
      // Skip API call for guest or admin accounts
      // Fallback to localStorage for guest users
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(`/cart/me`);
      
      if (response.data.success) {
        const cartData = response.data.data.cart;
        // Transform cart items to match frontend format
        const transformedItems = cartData.items.map(item => ({
          id: item.productID._id,
          name: item.productID.name,
          price: item.productID.price?.sale || item.productID.price?.original || 0,
          image: item.productID.images?.[0] || "/images/default-product.jpg",
          quantity: item.quantity,
          size: item.size || 'default'
        }));
        setCartItems(transformedItems);
      }
    } catch (error) {
      console.error("Error loading cart from API:", error);
      setError("Không thể tải giỏ hàng");
      // Fallback to localStorage
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  // Save cart to API
  const saveCartToAPI = async (items) => {
    const currentUser = getCurrentUser();
    if (!isAuthenticated() || currentUser?.role === 'admin') {
      // Save to localStorage for guest users or ignore for admin
      localStorage.setItem("cartItems", JSON.stringify(items));
      return;
    }

    try {
      const user = getCurrentUser();
      // For now, we'll sync the entire cart
      // In a more sophisticated implementation, you might want to sync individual operations
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to API:", error);
      // Fallback to localStorage
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  };

  // Add item to cart with API integration
  const addToCart = async (item) => {
    if (!isAuthenticated()) {
      // Use localStorage for non-authenticated users
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (p) => p.id === item.id && p.size === item.size
        );
        let updated;
        if (idx !== -1) {
          updated = [...prev];
          updated[idx].quantity += item.quantity;
        } else {
          updated = [...prev, item];
        }
        // Save to localStorage immediately
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.post(`/cart/add`, {
        productID: item.id,
        quantity: item.quantity,
        size: item.size || 'default'
      });

      if (response.data.success) {
        // Reload cart from API to get updated data
        await loadCartFromAPI();
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      
      // Handle specific inventory errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        setError(errorData.message || "Không thể thêm vào giỏ hàng");
        return { 
          success: false, 
          error: errorData.message,
          data: errorData.data 
        };
      }
      
      setError("Không thể thêm vào giỏ hàng");
      // Fallback to localStorage
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (p) => p.id === item.id && p.size === item.size
        );
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx].quantity += item.quantity;
          return updated;
        } else {
          return [...prev, item];
        }
      });
      return { success: false, error: "Không thể thêm vào giỏ hàng" };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart with API integration
  const removeFromCart = async (id, size) => {
    if (!isAuthenticated()) {
      // Use localStorage for non-authenticated users
      setCartItems((prev) => {
        const updated = prev.filter((item) => !(item.id === id && item.size === size));
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.delete(`/cart/remove`, {
        data: {
          productID: id,
          size: size || 'default'
        }
      });

      if (response.data.success) {
        // Reload cart from API to get updated data
        await loadCartFromAPI();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Không thể xóa khỏi giỏ hàng");
      // Fallback to localStorage
      setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    } finally {
      setLoading(false);
    }
  };

  // Update quantity with API integration
  const updateQuantity = async (id, size, quantity) => {
    if (!isAuthenticated()) {
      // Use localStorage for non-authenticated users
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.put(`/cart/update`, {
        productID: id,
        quantity,
        size: size || 'default'
      });

      if (response.data.success) {
        // Reload cart from API to get updated data
        await loadCartFromAPI();
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      
      // Handle specific inventory errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        setError(errorData.message || "Không thể cập nhật số lượng");
        return { 
          success: false, 
          error: errorData.message,
          data: errorData.data 
        };
      }
      
      setError("Không thể cập nhật số lượng");
      // Fallback to localStorage
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        )
      );
      return { success: false, error: "Không thể cập nhật số lượng" };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart with API integration
  const clearCart = async () => {
    if (!isAuthenticated()) {
      // Use localStorage for non-authenticated users
      setCartItems([]);
      localStorage.removeItem("cartItems");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.delete(`/cart/clear`);

      if (response.data.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Không thể xóa giỏ hàng");
      // Fallback to localStorage
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication state changes
  useEffect(() => {
    loadCartFromAPI();
  }, [isAuthenticated()]);

  // Save to localStorage as backup
  useEffect(() => {
    saveCartToAPI(cartItems);
  }, [cartItems]);

  // Check product inventory
  const checkProductInventory = async (productID) => {
    try {
      const response = await apiService.get(`/cart/inventory/${productID}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error checking product inventory:", error);
      return null;
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      checkProductInventory,
      getTotalPrice,
      loading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
}; 