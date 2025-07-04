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
        name: "USB-C Fast Charger",
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
  }

  removeItem(id) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id)
    this.renderCart()
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  renderCart() {
    const container = document.getElementById("cart-container")

    if (this.cartItems.length === 0) {
      container.innerHTML = this.renderEmptyCart()
      return
    }

    container.innerHTML = `
      <div class="cart-wrapper">
        <h1 class="cart-title">Shopping Cart</h1>
        <div class="cart-grid">
          <div class="cart-card">
            <div class="cart-items">
              ${this.cartItems.map((item, index) => this.renderCartItem(item, index)).join("")}
            </div>
          </div>
          <div class="order-summary">
            <h2 class="summary-title">Order Summary</h2>
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
            <div class="cart-separator"></div>
            <div class="summary-total">
              <span>Total</span>
              <span>$${this.getTotalPrice().toFixed(2)}</span>
            </div>
            <div class="action-buttons">
              <a href="/checkout" class="btn btn-primary">Checkout</a>
              <a href="/products" class="btn btn-outline">Continue Shopping</a>
            </div>
          </div>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  renderCartItem(item, index) {
    return `
      <div>
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
          </div>
          <button class="delete-btn" data-action="remove" data-id="${item.id}">🗑️</button>
        </div>
        ${index < this.cartItems.length - 1 ? '<div class="cart-separator"></div>' : ""}
      </div>
    `
  }

  renderEmptyCart() {
    return `
      <div class="cart-wrapper">
        <h1 class="cart-title">Shopping Cart</h1>
        <div class="cart-card">
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h2 class="empty-cart-title">Your cart is empty</h2>
            <p class="empty-cart-text">Add some products to get started</p>
            <a href="/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    document.addEventListener("click", (e) => {
      const action = e.target.dataset.action
      const id = e.target.dataset.id

      if (!action || !id) return

      switch (action) {
        case "increase":
          const currentItem = this.cartItems.find((item) => item.id === id)
          this.updateQuantity(id, currentItem.quantity + 1)
          break
        case "decrease":
          const currentItemDec = this.cartItems.find((item) => item.id === id)
          this.updateQuantity(id, currentItemDec.quantity - 1)
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

