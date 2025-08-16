import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Package, Truck, CheckCircle, AlertCircle, Info, X, Trash2 } from 'lucide-react';
import './Notifications.css';

const Notifications = ({ isVisible, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    if (isVisible && isAuthenticated()) {
      loadNotifications();
    }
  }, [isVisible, isAuthenticated]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Giả lập API call - trong thực tế sẽ gọi API thật
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock notifications data
      const mockNotifications = [
        {
          id: 1,
          type: 'order_success',
          title: 'Đặt hàng thành công!',
          message: 'Đơn hàng #ORD001 của bạn đã được đặt thành công. Chúng tôi sẽ xử lý và giao hàng sớm nhất.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 phút trước
          isRead: false,
          orderId: 'ORD001',
          icon: 'package'
        },
        {
          id: 2,
          type: 'shipping_update',
          title: 'Đơn hàng đang được giao',
          message: 'Đơn hàng #ORD002 đang được giao đến địa chỉ của bạn. Dự kiến giao hàng trong 2-3 giờ tới.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 giờ trước
          isRead: true,
          orderId: 'ORD002',
          icon: 'truck'
        },
        {
          id: 3,
          type: 'delivery_success',
          title: 'Giao hàng thành công',
          message: 'Đơn hàng #ORD003 đã được giao thành công. Vui lòng kiểm tra và đánh giá sản phẩm.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ngày trước
          isRead: true,
          orderId: 'ORD003',
          icon: 'check'
        },
        {
          id: 4,
          type: 'promotion',
          title: 'Khuyến mãi mới!',
          message: 'Giảm giá 20% cho tất cả sản phẩm điện tử. Áp dụng từ hôm nay đến hết tuần.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 giờ trước
          isRead: false,
          icon: 'info'
        },
        {
          id: 5,
          type: 'order_cancelled',
          title: 'Đơn hàng bị hủy',
          message: 'Đơn hàng #ORD004 đã bị hủy do hết hàng. Chúng tôi xin lỗi vì sự bất tiện này.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 giờ trước
          isRead: true,
          orderId: 'ORD004',
          icon: 'alert'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
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
      default:
        return 'default';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'orders') return ['order_success', 'shipping_update', 'delivery_success', 'order_cancelled'].includes(notif.type);
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
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.icon)}
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
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return timestamp.toLocaleDateString('vi-VN');
};

export default Notifications;
