import React from "react";
import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

export default function CartManager() {
  const { cartItems, updateQuantity, removeFromCart, loading, error } = useCart();

  const handleUpdateQuantity = async (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, size, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (id, size) => {
    try {
      await removeFromCart(id, size);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="loading-indicator">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="error-message">Lỗi: {error}</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-text">Add some products to get started with your shopping</p>
          <a href="/products" className="btn btn-primary">Start Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-subtitle">{getTotalItems()} items in your cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <h2 className="cart-items-header">Your Items</h2>
          {cartItems.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.size}`}>
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="product-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">${item.price.toFixed(2)}</p>
                {item.size && item.size !== 'default' && (
                  <p className="product-size">Size: {item.size}</p>
                )}
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                  disabled={loading}
                >
                  −
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleRemoveItem(item.id, item.size)} 
                className="delete-btn"
                disabled={loading}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal ({getTotalItems()} items)</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}