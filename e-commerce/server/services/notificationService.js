const Notification = require('../models/Notification');

class NotificationService {
  // Tạo thông báo đặt hàng thành công
  static async createOrderSuccessNotification(userId, orderId, orderDetails) {
    try {
      await Notification.createOrderSuccessNotification(userId, orderId, orderDetails);
      console.log(`Created order success notification for user ${userId}, order ${orderId}`);
    } catch (error) {
      console.error('Error creating order success notification:', error);
    }
  }

  // Tạo thông báo cập nhật trạng thái giao hàng
  static async createShippingUpdateNotification(userId, orderId, status, estimatedDelivery) {
    try {
      await Notification.createShippingUpdateNotification(userId, orderId, status, estimatedDelivery);
      console.log(`Created shipping update notification for user ${userId}, order ${orderId}, status ${status}`);
    } catch (error) {
      console.error('Error creating shipping update notification:', error);
    }
  }

  // Tạo thông báo giao hàng thành công
  static async createDeliverySuccessNotification(userId, orderId) {
    try {
      await Notification.createDeliverySuccessNotification(userId, orderId);
      console.log(`Created delivery success notification for user ${userId}, order ${orderId}`);
    } catch (error) {
      console.error('Error creating delivery success notification:', error);
    }
  }

  // Tạo thông báo hủy đơn hàng
  static async createOrderCancelledNotification(userId, orderId, reason) {
    try {
      await Notification.createOrderCancelledNotification(userId, orderId, reason);
      console.log(`Created order cancelled notification for user ${userId}, order ${orderId}`);
    } catch (error) {
      console.error('Error creating order cancelled notification:', error);
    }
  }

  // Tạo thông báo khuyến mãi
  static async createPromotionNotification(userIds, promotionTitle, promotionMessage) {
    try {
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }

      for (const userId of userIds) {
        await Notification.createPromotionNotification(userId, promotionTitle, promotionMessage);
      }
      
      console.log(`Created promotion notification for ${userIds.length} users`);
    } catch (error) {
      console.error('Error creating promotion notification:', error);
    }
  }

  // Tạo thông báo thanh toán thành công
  static async createPaymentSuccessNotification(userId, orderId, amount) {
    try {
      await Notification.create({
        userId,
        type: 'payment_success',
        title: 'Thanh toán thành công',
        message: `Đơn hàng #${orderId} đã được thanh toán thành công với số tiền ${amount.toLocaleString('vi-VN')}đ.`,
        orderId,
        metadata: { amount }
      });
      console.log(`Created payment success notification for user ${userId}, order ${orderId}`);
    } catch (error) {
      console.error('Error creating payment success notification:', error);
    }
  }

  // Tạo thông báo hoàn tiền
  static async createRefundNotification(userId, orderId, amount, reason) {
    try {
      await Notification.create({
        userId,
        type: 'refund_processed',
        title: 'Hoàn tiền đã được xử lý',
        message: `Đơn hàng #${orderId} đã được hoàn tiền ${amount.toLocaleString('vi-VN')}đ${reason ? ` do ${reason}` : ''}.`,
        orderId,
        metadata: { amount, reason }
      });
      console.log(`Created refund notification for user ${userId}, order ${orderId}`);
    } catch (error) {
      console.error('Error creating refund notification:', error);
    }
  }

  // Tạo thông báo hệ thống
  static async createSystemNotification(userId, title, message, metadata = {}) {
    try {
      await Notification.create({
        userId,
        type: 'system',
        title,
        message,
        metadata,
        priority: 'high'
      });
      console.log(`Created system notification for user ${userId}`);
    } catch (error) {
      console.error('Error creating system notification:', error);
    }
  }

  // Tạo thông báo cho tất cả user (broadcast)
  static async createBroadcastNotification(userIds, type, title, message, metadata = {}) {
    try {
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }

      const notifications = [];
      for (const userId of userIds) {
        const notification = await Notification.create({
          userId,
          type,
          title,
          message,
          metadata
        });
        notifications.push(notification);
      }
      
      console.log(`Created broadcast notification for ${userIds.length} users`);
      return notifications;
    } catch (error) {
      console.error('Error creating broadcast notification:', error);
      throw error;
    }
  }

  // Xóa thông báo cũ (older than 30 days)
  static async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  // Lấy thống kê thông báo
  static async getNotificationStats(userId) {
    try {
      const stats = await Notification.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
            byType: {
              $push: {
                type: '$type',
                isRead: '$isRead'
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        return { total: 0, unread: 0, byType: {} };
      }

      const stat = stats[0];
      const byType = {};
      
      stat.byType.forEach(item => {
        if (!byType[item.type]) {
          byType[item.type] = { total: 0, unread: 0 };
        }
        byType[item.type].total++;
        if (!item.isRead) {
          byType[item.type].unread++;
        }
      });

      return {
        total: stat.total,
        unread: stat.unread,
        byType
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;

