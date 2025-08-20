import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './PaymentResult.css';

const CashPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order info from location state or fallback
  const orderData = location.state?.orderData || {
    orderID: 'N/A',
    orderNumber: 'N/A',
    amount: 0,
    items: []
  };

  const currencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleViewOrder = () => {
    // Navigate to orders page
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleDownloadInvoice = () => {
    // Navigate to invoice page
    navigate('/invoice', { 
      state: { 
        orderData: {
          orderID: orderData.orderID,
          orderNumber: orderData.orderNumber,
          amount: orderData.amount,
          items: orderData.items,
          createdAt: new Date(),
          shippingAddress: 'Your shipping address',
          paymentMethod: 'Cash'
        }
      }
    });
  };

  return (
    <div className="payment-result-page">
      <Header />
      
      <div className="result-container">
        <div className="result-card success">
          {/* Success Icon */}
          <div className="result-icon">
            <div className="success-icon">✅</div>
          </div>

          {/* Success Title */}
          <h1 className="result-title">Order Placed Successfully!</h1>
          
          {/* Success Message */}
          <p className="result-message">
            Thank you for your order. Your order has been confirmed and is being processed.
          </p>

          {/* Order Details */}
          <div className="order-details">
            <h3>📋 Order Information</h3>
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderData.orderNumber || orderData.orderID}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value amount">{currencyVND(orderData.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">💵 Cash (Pay on delivery)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-pending">⏳ Processing</span>
            </div>
          </div>

          {/* Products Summary */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="products-summary">
              <h3>🛍️ Ordered Products</h3>
              <div className="products-list">
                {orderData.items.map((item, index) => (
                  <div key={index} className="product-item">
                    <img 
                      src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:8080${item.image || '/images/placeholder-product.svg'}`} 
                      alt={item.name}
                      className="product-image"
                      onError={(e) => {
                        if (e.target && e.target['src']) {
                          e.target['src'] = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    <div className="product-info">
                      <div className="product-name">{item.name}</div>
                      <div className="product-details">
                        <span className="product-variant">Type: {item.variant || item.size || 'Standard'}</span>
                        <span className="product-quantity">Quantity: {item.quantity}</span>
                        <span className="product-unit-price">Unit Price: {currencyVND(item.price)}</span>
                        {item.brand && <span className="product-brand">Brand: {item.brand}</span>}
                        {item.category && <span className="product-category">Category: {item.category}</span>}
                      </div>
                      <div className="product-price">Subtotal: {currencyVND(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="next-steps">
            <h3>📋 Next Steps</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Order Confirmation:</strong> We will call to confirm your order within 30 minutes
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Prepare Items:</strong> Items will be packed and shipped within 1-3 business days
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Delivery:</strong> The delivery person will contact you 30 minutes before arrival
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Payment:</strong> Pay in cash upon delivery and inspect the items
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="important-notes">
            <h3>⚠️ Important Notes</h3>
            <ul>
              <li>Please prepare enough cash to pay on delivery</li>
              <li>Carefully check the items before making payment</li>
              <li>Keep the invoice for warranty and returns</li>
              <li>Contact hotline if there are any issues: <strong>1900-xxxx</strong></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleViewOrder}>
              👁️ View Orders
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadInvoice}>
              📄 Download Invoice
            </button>
            <button className="btn btn-outline" onClick={handleContinueShopping}>
              🛒 Continue Shopping
            </button>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <p>📞 Need help? Contact us:</p>
            <div className="contact-methods">
              <span>📧 Email: support@gomall.com</span>
              <span>📱 Hotline: 1900-xxxx</span>
              <span>💬 Chat: Open the chat at the bottom-right corner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashPaymentSuccess;
