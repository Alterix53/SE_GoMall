// Checkout Page JavaScript
class CheckoutManager {
  constructor() {
    this.paymentMethod = "cod"
    this.isProcessing = false
    this.cartItems = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "2",
        name: "Smart Watch Series 5",
        price: 299.99,
        quantity: 2,
        image: "/placeholder.svg?height=60&width=60",
      },
    ]

    this.init()
  }

  init() {
    this.loadCartFromStorage()
    this.renderCheckout()
    this.attachEventListeners()
  }

  loadCartFromStorage() {
    const saved = localStorage.getItem("cartItems")
    if (saved) {
      this.cartItems = JSON.parse(saved)
    }
  }

  getSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  getShipping() {
    return this.getSubtotal() > 100 ? 0 : 9.99
  }

  getTax() {
    return this.getSubtotal() * 0.08
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping() + this.getTax()
  }

  async handlePlaceOrder() {
    if (this.isProcessing) return

    // Validate form
    if (!this.validateForm()) {
      alert("Please fill in all required fields")
      return
    }

    this.isProcessing = true
    this.updateUI()

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart
      localStorage.removeItem("cartItems")

      // Redirect to user page
      window.location.href = "/user"
    } catch (error) {
      console.error("Order processing failed:", error)
      alert("Order processing failed. Please try again.")
    } finally {
      this.isProcessing = false
      this.updateUI()
    }
  }

  validateForm() {
    const requiredFields = ["firstName", "lastName", "phone", "address"]
    return requiredFields.every((field) => {
      const element = document.getElementById(field)
      return element && element.value.trim() !== ""
    })
  }

  updateUI() {
    const button = document.getElementById("place-order-btn")
    const form = document.querySelector(".checkout-section")

    if (button) {
      button.textContent = this.isProcessing ? "Processing Order..." : "Place Order"
      button.disabled = this.isProcessing
    }

    if (form) {
      form.classList.toggle("processing", this.isProcessing)
    }
  }

  renderCheckout() {
    const container = document.getElementById("checkout-container")

    container.innerHTML = `
      <div class="checkout-header">
        <h1 class="checkout-title">Checkout</h1>
        <p class="checkout-subtitle">Complete your order</p>
      </div>
      
      <div class="checkout-content">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${this.renderShippingForm()}
          ${this.renderPaymentMethods()}
        </div>
        <div>
          ${this.renderOrderSummary()}
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  renderShippingForm() {
    return `
      <div class="checkout-section">
        <h2 class="section-header">
          <span class="payment-icon">🚚</span>
          Shipping Information
        </h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="firstName">First Name *</label>
            <input class="form-input" id="firstName" type="text" placeholder="John" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="lastName">Last Name *</label>
            <input class="form-input" id="lastName" type="text" placeholder="Doe" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="phone">Phone Number *</label>
          <input class="form-input" id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="address">Address *</label>
          <textarea class="form-textarea" id="address" placeholder="123 Main St, Apt 4B, City, State 12345" required></textarea>
        </div>
      </div>
    `
  }

  renderPaymentMethods() {
    return `
      <div class="checkout-section">
        <h2 class="section-header">
          <span class="payment-icon">💳</span>
          Payment Method
        </h2>
        <div class="payment-methods">
          <div class="payment-option ${this.paymentMethod === "cod" ? "selected" : ""}" data-payment="cod">
            <input type="radio" name="payment" value="cod" class="payment-radio" ${this.paymentMethod === "cod" ? "checked" : ""} />
            <label class="payment-label">
              <span class="payment-icon">🚚</span>
              Cash on Delivery
            </label>
          </div>
          <div class="payment-option ${this.paymentMethod === "momo" ? "selected" : ""}" data-payment="momo">
            <input type="radio" name="payment" value="momo" class="payment-radio" ${this.paymentMethod === "momo" ? "checked" : ""} />
            <label class="payment-label">
              <span class="payment-icon">📱</span>
              MoMo E-Wallet
            </label>
          </div>
          <div class="payment-option ${this.paymentMethod === "bank" ? "selected" : ""}" data-payment="bank">
            <input type="radio" name="payment" value="bank" class="payment-radio" ${this.paymentMethod === "bank" ? "checked" : ""} />
            <label class="payment-label">
              <span class="payment-icon">🏦</span>
              Bank Transfer
            </label>
          </div>
        </div>
      </div>
    `
  }

  renderOrderSummary() {
    return `
      <div class="checkout-section order-summary">
        <h2 class="section-header">
          <span class="payment-icon">📋</span>
          Order Summary
        </h2>
        ${this.cartItems
          .map(
            (item) => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image" />
            <div class="order-item-details">
              <h4 class="order-item-name">${item.name}</h4>
              <p class="order-item-qty">Quantity: ${item.quantity}</p>
            </div>
            <div class="order-item-price">
              $${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        `,
          )
          .join("")}
        
        <div class="order-totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>$${this.getSubtotal().toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span>${this.getShipping() === 0 ? "Free" : "$" + this.getShipping().toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax</span>
            <span>$${this.getTax().toFixed(2)}</span>
          </div>
          <div class="total-row total-final">
            <span>Total</span>
            <span>$${this.getTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div class="checkout-actions">
          <button id="place-order-btn" class="btn btn-primary">Place Order</button>
          <a href="/cart" class="btn btn-secondary">Back to Cart</a>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    // Payment method selection
    document.addEventListener("click", (e) => {
      if (e.target.closest(".payment-option")) {
        const paymentOption = e.target.closest(".payment-option")
        const paymentMethod = paymentOption.dataset.payment

        if (paymentMethod) {
          this.paymentMethod = paymentMethod
          this.updatePaymentSelection()
        }
      }
    })

    // Place order button
    const placeOrderBtn = document.getElementById("place-order-btn")
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => this.handlePlaceOrder())
    }
  }

  updatePaymentSelection() {
    document.querySelectorAll(".payment-option").forEach((option) => {
      option.classList.remove("selected")
      const radio = option.querySelector('input[type="radio"]')
      radio.checked = false
    })

    const selectedOption = document.querySelector(`[data-payment="${this.paymentMethod}"]`)
    if (selectedOption) {
      selectedOption.classList.add("selected")
      const radio = selectedOption.querySelector('input[type="radio"]')
      radio.checked = true
    }
  }
}

// Initialize checkout when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutManager()
})
