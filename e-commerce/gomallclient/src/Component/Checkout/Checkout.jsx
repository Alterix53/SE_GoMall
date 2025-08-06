import React, { useState, useEffect } from 'react';

const INITIAL_CART_ITEMS = [
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
];

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      setCartItems(JSON.parse(saved));
    } else {
      setCartItems(INITIAL_CART_ITEMS);
    }
  }, []);

  // Calculate totals
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getShipping = () => {
    return getSubtotal() > 100 ? 0 : 9.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  // Validate form
  const validateForm = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle payment method selection
  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (isProcessing) return;

    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart
      localStorage.removeItem('cartItems');

      // Redirect to user page
      window.location.href = '/user';
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Order processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render shipping form
  const renderShippingForm = () => (
    <div className="checkout-section">
      <h2 className="section-header">
        <span className="payment-icon">🚚</span>
        Shipping Information
      </h2>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name *</label>
          <input
            className="form-input"
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name *</label>
          <input
            className="form-input"
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="phone">Phone Number *</label>
        <input
          className="form-input"
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="address">Address *</label>
        <textarea
          className="form-textarea"
          id="address"
          placeholder="123 Main St, Apt 4B, City, State 12345"
          value={formData.address}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
    </div>
  );

  // Render payment methods
  const renderPaymentMethods = () => (
    <div className="checkout-section">
      <h2 className="section-header">
        <span className="payment-icon">💳</span>
        Payment Method
      </h2>
      <div className="payment-methods">
        {[
          { value: 'cod', label: 'Cash on Delivery', icon: '🚚' },
          { value: 'momo', label: 'MoMo E-Wallet', icon: '📱' },
          { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
        ].map((method) => (
          <div
            key={method.value}
            className={`payment-option ${paymentMethod === method.value ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect(method.value)}
          >
            <input
              type="radio"
              name="payment"
              value={method.value}
              className="payment-radio"
              checked={paymentMethod === method.value}
              onChange={() => handlePaymentSelect(method.value)}
            />
            <label className="payment-label">
              <span className="payment-icon">{method.icon}</span>
              {method.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // Render order summary
  const renderOrderSummary = () => (
    <div className="checkout-section order-summary">
      <h2 className="section-header">
        <span className="payment-icon">📋</span>
        Order Summary
      </h2>
      {cartItems.map((item) => (
        <div className="order-item" key={item.id}>
          <img src={item.image} alt={item.name} className="order-item-image" />
          <div className="order-item-details">
            <h4 className="order-item-name">{item.name}</h4>
            <p className="order-item-qty">Quantity: {item.quantity}</p>
          </div>
          <div className="order-item-price">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>${getSubtotal().toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
        </div>
        <div className="total-row">
          <span>Tax</span>
          <span>${getTax().toFixed(2)}</span>
        </div>
        <div className="total-row total-final">
          <span>Total</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
      </div>
      <div className="checkout-actions">
        <button
          id="place-order-btn"
          className="btn btn-primary"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Order...' : 'Place Order'}
        </button>
        <a href="/cart" className="btn btn-secondary">Back to Cart</a>
      </div>
    </div>
  );

  return (
    <div id="checkout-container">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your order</p>
      </div>
      <div className="checkout-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {renderShippingForm()}
        {renderPaymentMethods()}
        {renderOrderSummary()}
      </div>
    </div>
  );
}

export default CheckoutPage;