// CartManager.jsx
import { useEffect, useState } from "react"

const initialItems = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    price: 299.99,
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    name: "Premium USB-C Fast Charger",
    price: 24.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function CartManager() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("cartItems")
    setCartItems(saved ? JSON.parse(saved) : initialItems)
  }, [])

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    )
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
    )
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
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="product-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span className="quantity-display">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="delete-btn">🗑️</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-header">Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <a href="/checkout" className="btn btn-primary">Proceed to Checkout</a>
            <a href="/products" className="btn btn-secondary">Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  )
}