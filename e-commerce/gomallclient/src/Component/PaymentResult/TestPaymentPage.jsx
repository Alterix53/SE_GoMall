import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import './TestPaymentPage.css';

const TestPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Lấy order data từ location state hoặc tạo mock data
  const orderData = location.state?.orderData || {
    orderID: 'test-order-123',
    orderNumber: 'ORD-2024-001',
    amount: 1000000,
    items: [
      {
        name: 'Test Product',
        price: 1000000,
        quantity: 1
      }
    ]
  };

  const handleTestSuccess = () => {
    setLoading(true);
    console.log('🧪 Testing payment success...');
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      navigate('/payment/success', {
        state: {
          paymentData: {
            requestId: 'test-request-123',
            orderId: orderData.orderID,
            amount: orderData.amount,
            status: 'SUCCESS',
            message: 'Payment successful'
          },
          orderData
        }
      });
    }, 2000);
  };

  const handleTestFailed = () => {
    setLoading(true);
    console.log('🧪 Testing payment failed...');
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      navigate('/payment/failed', {
        state: {
          paymentData: {
            requestId: 'test-request-123',
            orderId: orderData.orderID,
            amount: orderData.amount,
            status: 'FAILED',
            message: 'Payment failed'
          },
          orderData
        }
      });
    }, 2000);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <>
      <Header />
      <div className="test-payment-container">
        <div className="test-payment-card">
          <div className="test-header">
            <h1>🧪 Test Payment Page</h1>
            <p>Payment test page - Select result to test</p>
          </div>

          <div className="order-info">
            <h3>📋 Order Information</h3>
            <div className="info-row">
              <span>Order ID:</span>
              <span>{orderData.orderNumber || orderData.orderID}</span>
            </div>
            <div className="info-row">
              <span>Amount:</span>
              <span className="amount">{formatAmount(orderData.amount)}</span>
            </div>
            <div className="info-row">
              <span>Items:</span>
              <span>{orderData.items?.length || 0} items</span>
            </div>
          </div>

          <div className="test-buttons">
            <h3>🎯 Select payment result</h3>
            
            <button 
              className="test-btn success"
              onClick={handleTestSuccess}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  ✅ Payment Successful
                </>
              )}
            </button>

            <button 
              className="test-btn failed"
              onClick={handleTestFailed}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  ❌ Payment Failed
                </>
              )}
            </button>
          </div>

          <div className="test-note">
            <p>💡 This is a test page to check payment result pages</p>
            <p>📱 In real scenarios, results will be processed automatically from MoMo callback</p>
          </div>

          <div className="back-button">
            <button 
              className="back-btn"
              onClick={() => navigate('/checkout')}
            >
              ← Back to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPaymentPage;
