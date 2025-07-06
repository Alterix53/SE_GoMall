// User Profile Page JavaScript
class UserProfileManager {
  constructor() {
    this.user = {
      name: "Nguyen MinhHieu",
      email: "nmhieu@gmail.com",
      phone: "(+84)1234567",
      address: "1 NguyenVanCu St, Disc 5\nHoChiMinh",
      avatar: "/placeholder.svg?height=100&width=100",
    }

    this.orders = [
      {
        id: "ORD-001",
        date: "2025-01-15",
        total: 299.99,
        status: "delivered",
        items: 2,
      },
      {
        id: "ORD-002",
        date: "2025-01-10",
        total: 79.99,
        status: "processing",
        items: 1,
      },
      {
        id: "ORD-003",
        date: "2024-09-05",
        total: 149.99,
        status: "shipped",
        items: 3,
      },
      {
        id: "ORD-004",
        date: "2024-12-28",
        total: 199.99,
        status: "delivered",
        items: 1,
      },
      {
        id: "ORD-005",
        date: "2024-12-20",
        total: 49.99,
        status: "cancelled",
        items: 1,
      },
    ]

    this.init()
  }

  init() {
    this.loadUserData()
    this.renderUserProfile()
    this.attachEventListeners()
  }

  loadUserData() {
    // Load user data from localStorage if available
    const savedUser = localStorage.getItem("userData")
    if (savedUser) {
      this.user = { ...this.user, ...JSON.parse(savedUser) }
    }

    const savedOrders = localStorage.getItem("userOrders")
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders)
    }
  }

  saveUserData() {
    localStorage.setItem("userData", JSON.stringify(this.user))
    localStorage.setItem("userOrders", JSON.stringify(this.orders))
  }

  getStatusClass(status) {
    const statusClasses = {
      delivered: "status-delivered",
      processing: "status-processing",
      shipped: "status-shipped",
      cancelled: "status-cancelled",
    }
    return statusClasses[status] || "status-delivered"
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  getUserInitials() {
    return this.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  handleLogout() {
    if (confirm("You want to logout?")) {
      // Clear user data
      localStorage.removeItem("userData")
      localStorage.removeItem("userOrders")
      localStorage.removeItem("cartItems")

      // Redirect to login page or home
      console.log("Logging out...")
      alert("You have been logged out successfully!")
      // window.location.href = "/login";
    }
  }

  handleEditProfile() {
    const newName = prompt("Enter your name:", this.user.name)
    if (newName && newName.trim() !== "") {
      this.user.name = newName.trim()
      this.saveUserData()
      this.renderUserProfile()
    }
  }

  handleViewOrderDetails(orderId) {
    const order = this.orders.find((o) => o.id === orderId)
    if (order) {
      alert(
        `Order Details:\n\nOrder ID: ${order.id}\nDate: ${this.formatDate(order.date)}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}\nItems: ${order.items}`,
      )
    }
  }

  renderUserProfile() {
    const container = document.getElementById("user-container")

    container.innerHTML = `
      <div class="user-header">
        <h1 class="user-title">My Profile</h1>
        <div class="header-actions">
          <button class="btn btn-secondary btn-small" id="edit-profile-btn">
            ✏️ Edit Profile
          </button>
          <button class="btn btn-secondary btn-small" id="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      <div class="user-content">
        ${this.renderProfileSection()}
        ${this.renderOrdersSection()}
      </div>
    `

    this.attachEventListeners()
  }

  renderProfileSection() {
    return `
      <div class="user-section">
        <h2 class="section-header">
          👤 Profile Information
        </h2>
        
        <div class="profile-avatar-section">
          ${
            this.user.avatar
              ? `<img src="${this.user.avatar}" alt="${this.user.name}" class="profile-avatar" />`
              : `<div class="profile-avatar-fallback">${this.getUserInitials()}</div>`
          }
          <h2 class="profile-name">${this.user.name}</h2>
        </div>

        <div class="profile-details">
          <div class="profile-detail">
            <div class="profile-detail-icon">📧</div>
            <div class="profile-detail-content">
              <p class="profile-detail-label">Email Address</p>
              <p class="profile-detail-value">${this.user.email}</p>
            </div>
          </div>

          <div class="profile-detail">
            <div class="profile-detail-icon">📞</div>
            <div class="profile-detail-content">
              <p class="profile-detail-label">Phone Number</p>
              <p class="profile-detail-value">${this.user.phone}</p>
            </div>
          </div>

          <div class="profile-detail">
            <div class="profile-detail-icon">📍</div>
            <div class="profile-detail-content">
              <p class="profile-detail-label">Default Address</p>
              <p class="profile-detail-value">${this.user.address}</p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderOrdersSection() {
    return `
      <div class="user-section">
        <h2 class="section-header">
          📦 Order History
        </h2>
        
        <div class="orders-list">
          ${
            this.orders.length > 0
              ? this.orders.map((order) => this.renderOrderItem(order)).join("")
              : this.renderEmptyOrders()
          }
        </div>
      </div>
    `
  }

  renderOrderItem(order) {
    return `
      <div class="order-item">
        <div class="order-header">
          <div class="order-info">
            <h3>Order ${order.id}</h3>
            <p class="order-date">${this.formatDate(order.date)}</p>
          </div>
          <div class="order-status ${this.getStatusClass(order.status)}">
            ${order.status}
          </div>
        </div>

        <div class="order-footer">
          <div class="order-details">
            <span class="order-items-count">
              ${order.items} item${order.items > 1 ? "s" : ""}
            </span>
            <span class="order-total">$${order.total.toFixed(2)}</span>
          </div>

          <button class="btn btn-secondary btn-small" data-action="view-details" data-order-id="${order.id}">
            👁️ View Details
          </button>
        </div>
      </div>
    `
  }

  renderEmptyOrders() {
    return `
      <div class="empty-orders">
        <div class="empty-orders-icon">📦</div>
        <h3 class="empty-orders-title">No orders yet</h3>
        <p class="empty-orders-text">Start shopping to see your orders here</p>
        <a href="/products" class="btn btn-primary">Start Shopping</a>
      </div>
    `
  }

  attachEventListeners() {
    document.addEventListener("click", (e) => {
      const action = e.target.dataset.action

      if (e.target.id === "logout-btn") {
        this.handleLogout()
      } else if (e.target.id === "edit-profile-btn") {
        this.handleEditProfile()
      } else if (action === "view-details") {
        const orderId = e.target.dataset.orderId
        this.handleViewOrderDetails(orderId)
      }
    })
  }
}

// Initialize user profile
document.addEventListener("DOMContentLoaded", () => {
  new UserProfileManager()
})
