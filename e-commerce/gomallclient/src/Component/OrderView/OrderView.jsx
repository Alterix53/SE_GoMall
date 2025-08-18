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
        setError('Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Có lỗi xảy ra khi tải đơn hàng');
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
      case 'Pending': return '⏳ Chờ xử lý';
      case 'Processing': return '🔄 Đang xử lý';
      case 'Shipped': return '📦 Đang giao';
      case 'Delivered': return '✅ Đã giao';
      case 'Cancelled': return '❌ Đã hủy';
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
    // Navigate đến trang tải hóa đơn
    navigate('/invoice', { 
      state: { 
        orderData: {
          orderID: order._id,
          orderNumber: order.orderNumber || order._id,
          amount: order.total,
          items: order.items || [],
          createdAt: order.createdAt,
          shippingAddress: order.shippingAddress || 'Địa chỉ giao hàng',
          paymentMethod: order.paymentMethod || 'Chưa xác định'
        }
      }
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      try {
        const response = await checkoutAPI.cancelOrder(orderId);
        if (response.success) {
          alert('Đã hủy đơn hàng thành công!');
          loadOrders(); // Reload orders
        } else {
          alert('Không thể hủy đơn hàng: ' + response.message);
        }
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('Có lỗi xảy ra khi hủy đơn hàng');
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
              ← Quay lại danh sách
            </button>
            <h1>Chi Tiết Đơn Hàng</h1>
          </div>
          
          <div className="order-detail-card">
            <div className="order-info-section">
              <h2>📋 Thông Tin Đơn Hàng</h2>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="info-label">Mã đơn hàng:</span>
                  <span className="info-value">{selectedOrder.orderNumber || selectedOrder._id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày đặt:</span>
                  <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái:</span>
                  <span className="info-value status" style={{ color: getStatusColor(selectedOrder.status) }}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tổng tiền:</span>
                  <span className="info-value amount">{currencyVND(selectedOrder.total)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phương thức thanh toán:</span>
                  <span className="info-value">{selectedOrder.paymentMethod || 'Chưa xác định'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Địa chỉ giao hàng:</span>
                  <span className="info-value">{selectedOrder.shippingAddress}</span>
                </div>
                {selectedOrder.note && (
                  <div className="info-item">
                    <span className="info-label">Ghi chú:</span>
                    <span className="info-value">{selectedOrder.note}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-items-section">
              <h2>🛍️ Sản Phẩm Đã Đặt</h2>
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
                        <span>Loại: {item.variant || item.size || 'Standard'}</span>
                        <span>Số lượng: {item.quantity}</span>
                        <span>Đơn giá: {currencyVND(item.unitPrice)}</span>
                        {item.discount > 0 && (
                          <span>Giảm giá: {currencyVND(item.discount)}</span>
                        )}
                      </div>
                      <div className="item-total">
                        Thành tiền: {currencyVND((item.unitPrice - item.discount) * item.quantity)}
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
                📄 Tải Hóa Đơn
              </button>
              {selectedOrder.status === 'Pending' && (
                <button 
                  className="btn btn-danger"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                >
                  ❌ Hủy Đơn Hàng
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
          <h1>📋 Đơn Hàng Của Tôi</h1>
          <button className="refresh-btn" onClick={loadOrders}>
            🔄 Làm mới
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={loadOrders}>
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>Chưa có đơn hàng nào</h2>
            <p>Bạn chưa đặt hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              🛒 Mua Sắm Ngay
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <strong>Đơn hàng:</strong> {order.orderNumber || order._id}
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
                    {order.items ? order.items.length : 0} sản phẩm
                  </div>
                  <div className="order-total">
                    <strong>Tổng tiền:</strong> {currencyVND(order.total)}
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewOrderDetail(order)}
                  >
                    👁️ Xem Chi Tiết
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleDownloadInvoice(order)}
                  >
                    📄 Tải Hóa Đơn
                  </button>
                  {order.status === 'Pending' && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      ❌ Hủy
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
