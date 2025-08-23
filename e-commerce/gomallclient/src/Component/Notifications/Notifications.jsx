import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Package, Truck, CheckCircle, AlertCircle, Info, X, Trash2 } from 'lucide-react';
import './Notifications.css';

const Notifications = ({ isVisible, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Load notifications từ API thật
  useEffect(() => {
    if (isVisible && isAuthenticated()) {
      loadNotifications();
    }
  }, [isVisible, isAuthenticated]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
      } else {
        console.error('API Error:', data.message);
        // Fallback to empty array
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to empty array
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'package':
        return <Package size={20} />;
      case 'truck':
        return <Truck size={20} />;
      case 'check':
        return <CheckCircle size={20} />;
      case 'alert':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order_success':
        return 'success';
      case 'shipping_update':
        return 'info';
      case 'delivery_success':
        return 'success';
      case 'promotion':
        return 'warning';
      case 'order_cancelled':
        return 'error';
      case 'seller_approved':
        return 'success';
      case 'seller_rejected':
        return 'error';
      case 'seller_welcome':
        return 'success';
      case 'seller_guide':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleNotificationClick = (notification) => {
    // Đánh dấu đã đọc
    markAsRead(notification.id);
    
    // Xử lý chuyển hướng dựa trên loại notification
    if (notification.type === 'seller_approved' && notification.metadata?.action === 'navigate_to_seller_dashboard') {
      navigate('/seller');
      onClose(); // Đóng notification panel
    } else if (notification.type === 'seller_welcome' && notification.metadata?.action === 'navigate_to_seller_dashboard') {
      navigate('/seller');
      onClose(); // Đóng notification panel
    } else if (notification.type === 'seller_guide' && notification.metadata?.action === 'navigate_to_seller_dashboard') {
      navigate('/seller');
      onClose(); // Đóng notification panel
    } else if (notification.type === 'seller_rejected' && notification.metadata?.action === 'navigate_to_register_seller') {
      navigate('/register-seller');
      onClose(); // Đóng notification panel
    } else if (notification.orderId) {
      // Chuyển hướng đến trang đơn hàng nếu có orderId
      navigate(`/orders/${notification.orderId}`);
      onClose();
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'orders') return ['order_success', 'shipping_update', 'delivery_success', 'order_cancelled', 'seller_approved', 'seller_rejected', 'seller_welcome', 'seller_guide'].includes(notif.type);
    if (activeTab === 'promotions') return notif.type === 'promotion';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (!isVisible) return null;

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-title">
            <Bell size={20} />
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notifications-actions">
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Đánh dấu đã đọc
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="notifications-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button 
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Chưa đọc
            {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Đơn hàng
          </button>
          <button 
            className={`tab ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            Khuyến mãi
          </button>
        </div>

        {/* Content */}
        <div className="notifications-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Đang tải thông báo...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} className="empty-icon" />
              <span>Không có thông báo nào</span>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getTypeColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.icon || 'bell')}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {notification.orderId && (
                        <span className="notification-order">#{notification.orderId}</span>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="notifications-footer">
          <button className="view-all-btn">Xem tất cả thông báo</button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const timestampDate = new Date(timestamp);
  const diff = now.getTime() - timestampDate.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return timestampDate.toLocaleDateString('vi-VN');
};

export default Notifications;
