import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Lấy danh sách thông báo của user
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, unreadOnly } = req.query;
    const userId = req.user.id;

    // Build query
    let query = { userId };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Notification.countDocuments(query);
    
    // Get unread count
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    // Transform data for frontend
    const transformedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt,
      isRead: notification.isRead,
      orderId: notification.orderId,
      productId: notification.productId,
      metadata: notification.metadata,
      priority: notification.priority,
      icon: getIconForType(notification.type)
    }));

    res.json(successResponse({
      notifications: transformedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    }));

  } catch (error) {
    console.error('Error getting user notifications:', error);
    res.status(500).json(errorResponse('Không thể lấy danh sách thông báo'));
  }
};

// Đánh dấu một thông báo đã đọc
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ 
      _id: id, 
      userId 
    });

    if (!notification) {
      return res.status(404).json(errorResponse('Không tìm thấy thông báo'));
    }

    notification.isRead = true;
    await notification.save();

    res.json(successResponse({
      message: 'Đã đánh dấu thông báo đã đọc',
      notification: {
        id: notification._id,
        isRead: notification.isRead
      }
    }));

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json(errorResponse('Không thể đánh dấu thông báo đã đọc'));
  }
};

// Đánh dấu tất cả thông báo đã đọc
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json(successResponse({
      message: 'Đã đánh dấu tất cả thông báo đã đọc',
      updatedCount: result.modifiedCount
    }));

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json(errorResponse('Không thể đánh dấu tất cả thông báo đã đọc'));
  }
};

// Xóa một thông báo
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!notification) {
      return res.status(404).json(errorResponse('Không tìm thấy thông báo'));
    }

    res.json(successResponse({
      message: 'Đã xóa thông báo',
      deletedId: id
    }));

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json(errorResponse('Không thể xóa thông báo'));
  }
};

// Xóa tất cả thông báo đã đọc
const deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.deleteMany({ 
      userId, 
      isRead: true 
    });

    res.json(successResponse({
      message: 'Đã xóa tất cả thông báo đã đọc',
      deletedCount: result.deletedCount
    }));

  } catch (error) {
    console.error('Error deleting read notifications:', error);
    res.status(500).json(errorResponse('Không thể xóa thông báo đã đọc'));
  }
};

// Lấy số thông báo chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    res.json(successResponse({
      unreadCount
    }));

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json(errorResponse('Không thể lấy số thông báo chưa đọc'));
  }
};

// Tạo thông báo mới (cho admin hoặc system)
const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, orderId, productId, metadata, priority } = req.body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return res.status(400).json(errorResponse('Thiếu thông tin bắt buộc'));
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      orderId,
      productId,
      metadata,
      priority
    });

    res.status(201).json(successResponse({
      message: 'Đã tạo thông báo thành công',
      notification: {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt,
        isRead: notification.isRead
      }
    }));

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json(errorResponse('Không thể tạo thông báo'));
  }
};

// Tạo thông báo cho nhiều user (broadcast)
const createBroadcastNotification = async (req, res) => {
  try {
    const { userIds, type, title, message, metadata, priority } = req.body;

    if (!userIds || !Array.isArray(userIds) || !type || !title || !message) {
      return res.status(400).json(errorResponse('Thiếu thông tin bắt buộc'));
    }

    const notifications = [];
    for (const userId of userIds) {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        metadata,
        priority
      });
      notifications.push(notification);
    }

    res.status(201).json(successResponse({
      message: `Đã tạo ${notifications.length} thông báo thành công`,
      count: notifications.length
    }));

  } catch (error) {
    console.error('Error creating broadcast notification:', error);
    res.status(500).json(errorResponse('Không thể tạo thông báo broadcast'));
  }
};

// Helper function để map icon cho từng loại thông báo
const getIconForType = (type) => {
  const iconMap = {
    'order_success': 'package',
    'shipping_update': 'truck',
    'delivery_success': 'check',
    'promotion': 'info',
    'order_cancelled': 'alert',
    'payment_success': 'check',
    'refund_processed': 'refresh'
  };
  return iconMap[type] || 'bell';
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount,
  createNotification,
  createBroadcastNotification
};
