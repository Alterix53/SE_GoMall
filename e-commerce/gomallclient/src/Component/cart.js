// Cart Page JavaScript
class CartManager {
  constructor() {
    this.cartItems = [
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

    this.init()
  }

  init() {
    this.renderCart()
    this.attachEventListeners()
  }

  updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return

    this.cartItems = this.cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    this.renderCart()
    this.saveToLocalStorage()
  }

  removeItem(id) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id)
    this.renderCart()
    this.saveToLocalStorage()
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  getTotalItems() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  saveToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(this.cartItems))
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("cartItems")
    if (saved) {
      this.cartItems = JSON.parse(saved)
    }
  }

  renderCart() {
    const container = document.getElementById("cart-container")

    if (this.cartItems.length === 0) {
      container.innerHTML = this.renderEmptyCart()
      return
    }

    container.innerHTML = `
      <div class="cart-header">
        <h1 class="cart-title">Shopping Cart</h1>
        <p class="cart-subtitle">${this.getTotalItems()} items in your cart</p>
      </div>
      
      <div class="cart-content">
        <div class="cart-items-section">
          <h2 class="cart-items-header">Your Items</h2>
          ${this.cartItems.map((item) => this.renderCartItem(item)).join("")}
        </div>
        
        <div class="cart-summary">
          <h2 class="summary-header">Order Summary</h2>
          <div class="summary-items">
            ${this.cartItems
              .map(
                (item) => `
              <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>$${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <div class="cart-actions">
            <a href="/checkout" class="btn btn-primary">Proceed to Checkout</a>
            <a href="/products" class="btn btn-secondary">Continue Shopping</a>
          </div>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  renderCartItem(item) {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="product-image" />
        <div class="product-details">
          <h3 class="product-name">${item.name}</h3>
          <p class="product-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <button class="delete-btn" data-action="remove" data-id="${item.id}">🗑️</button>
      </div>
    `
  }

  renderEmptyCart() {
    return `
      <div class="cart-header">
        <h1 class="cart-title">Shopping Cart</h1>
      </div>
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-cart-title">Your cart is empty</h2>
        <p class="empty-cart-text">Add some products to get started with your shopping</p>
        <a href="/products" class="btn btn-primary">Start Shopping</a>
      </div>
    `
  }

  attachEventListeners() {
    document.addEventListener("click", (e) => {
      const action = e.target.dataset.action
      const id = e.target.dataset.id

      if (!action || !id) return

      const currentItem = this.cartItems.find((item) => item.id === id)
      if (!currentItem) return

      switch (action) {
        case "increase":
          this.updateQuantity(id, currentItem.quantity + 1)
          break
        case "decrease":
          this.updateQuantity(id, currentItem.quantity - 1)
          break
        case "remove":
          this.removeItem(id)
          break
      }
    })
  }
}

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartManager()
})
