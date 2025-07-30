import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    setCartItems(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === item.id && p.size === item.size
      );
      if (idx !== -1) {
        // Đã có sản phẩm cùng size, tăng số lượng
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 