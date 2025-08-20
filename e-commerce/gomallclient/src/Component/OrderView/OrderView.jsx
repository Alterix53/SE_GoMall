import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import { checkoutAPI } from '../../utils/api';
import './OrderView.css';

const OrderView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await checkoutAPI.getUserOrders();
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        setError('Cannot load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('An error occurred while loading orders');
    } finally {
      setLoading(false);
    }
  };

  const currencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#9c27b0';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return '⏳ Pending';
      case 'Processing': return '🔄 Processing';
      case 'Shipped': return '📦 Shipping';
      case 'Delivered': return '✅ Delivered';
      case 'Cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleBackToList = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleDownloadInvoice = (order) => {
    // Navigate to invoice page
    navigate('/invoice', { 
      state: { 
        orderData: {
          orderID: order._id,
          orderNumber: order.orderNumber || order._id,
          amount: order.total,
          items: order.items || [],
          createdAt: order.createdAt,
          shippingAddress: order.shippingAddress || 'Shipping address',
          paymentMethod: order.paymentMethod || 'Unknown'
        }
      }
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await checkoutAPI.cancelOrder(orderId);
        if (response.success) {
          alert('Order cancelled successfully!');
          loadOrders(); // Reload orders
        } else {
          alert('Cannot cancel order: ' + response.message);
        }
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('An error occurred while cancelling order');
      }
    }
  };

  if (showOrderDetail && selectedOrder) {
    return (
      <div className="order-view-page">
        <Header />
        <div className="order-detail-container">
          <div className="order-detail-header">
            <button className="back-btn" onClick={handleBackToList}>
              ← Back to list
            </button>
            <h1>Order Details</h1>
          </div>
          
          <div className="order-detail-card">
            <div className="order-info-section">
              <h2>📋 Order Information</h2>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{selectedOrder.orderNumber || selectedOrder._id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order date:</span>
                  <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value status" style={{ color: getStatusColor(selectedOrder.status) }}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total:</span>
                  <span className="info-value amount">{currencyVND(selectedOrder.total)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment method:</span>
                  <span className="info-value">{selectedOrder.paymentMethod || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Shipping address:</span>
                  <span className="info-value">{selectedOrder.shippingAddress}</span>
                </div>
                {selectedOrder.note && (
                  <div className="info-item">
                    <span className="info-label">Note:</span>
                    <span className="info-value">{selectedOrder.note}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-items-section">
              <h2>🛍️ Ordered Items</h2>
              <div className="order-items-list">
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:8080${item.image || '/images/placeholder-product.svg'}`} 
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        if (e.target && e.target['src']) {
                          e.target['src'] = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-info">
                        <span>Type: {item.variant || item.size || 'Standard'}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit Price: {currencyVND(item.unitPrice)}</span>
                        {item.discount > 0 && (
                          <span>Discount: {currencyVND(item.discount)}</span>
                        )}
                      </div>
                      <div className="item-total">
                        Subtotal: {currencyVND((item.unitPrice - item.discount) * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleDownloadInvoice(selectedOrder)}
              >
                📄 Download Invoice
              </button>
              {selectedOrder.status === 'Pending' && (
                <button 
                  className="btn btn-danger"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-view-page">
      <Header />
      
      <div className="order-view-container">
        <div className="order-view-header">
          <h1>📋 My Orders</h1>
          <button className="refresh-btn" onClick={loadOrders}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={loadOrders}>
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You have not placed any orders yet. Start shopping now!</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              🛒 Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <strong>Order:</strong> {order.orderNumber || order._id}
                  </div>
                  <div className="order-date">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-summary">
                  <div className="order-items-count">
                    {order.items ? order.items.length : 0} items
                  </div>
                  <div className="order-total">
                    <strong>Total:</strong> {currencyVND(order.total)}
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewOrderDetail(order)}
                  >
                    👁️ View Details
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleDownloadInvoice(order)}
                  >
                    📄 Download Invoice
                  </button>
                  {order.status === 'Pending' && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderView;
