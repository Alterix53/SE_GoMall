import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['order_success', 'shipping_update', 'delivery_success', 'promotion', 'order_cancelled', 'payment_success', 'refund_processed', 'seller_approved', 'seller_rejected'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  orderId: {
    type: String,
    required: false
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  icon: {
    type: String,
    enum: ['package', 'truck', 'check', 'alert', 'info', 'bell'],
    default: 'bell'
  }
}, {
  timestamps: true
});

// Index để tối ưu query
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });

// Virtual để format thời gian
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return this.createdAt.toLocaleDateString('vi-VN');
});

// Method để đánh dấu đã đọc
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Static method để tạo thông báo
notificationSchema.statics.createNotification = function(data) {
  return this.create(data);
};

// Static method để tạo thông báo đặt hàng thành công
notificationSchema.statics.createOrderSuccessNotification = function(userId, orderId, orderDetails) {
  return this.create({
    userId,
    type: 'order_success',
    title: 'Đặt hàng thành công!',
    message: `Đơn hàng #${orderId} của bạn đã được đặt thành công. Chúng tôi sẽ xử lý và giao hàng sớm nhất.`,
    orderId,
    metadata: {
      orderDetails,
      totalAmount: orderDetails.totalAmount,
      itemsCount: orderDetails.items.length
    }
  });
};

// Static method để tạo thông báo cập nhật trạng thái giao hàng
notificationSchema.statics.createShippingUpdateNotification = function(userId, orderId, status, estimatedDelivery) {
  const statusMessages = {
    'processing': 'Đơn hàng đang được xử lý',
    'shipped': 'Đơn hàng đã được giao cho đơn vị vận chuyển',
    'in_transit': 'Đơn hàng đang được giao',
    'out_for_delivery': 'Đơn hàng đang được giao đến địa chỉ của bạn'
  };

  return this.create({
    userId,
    type: 'shipping_update',
    title: statusMessages[status] || 'Cập nhật trạng thái đơn hàng',
    message: `Đơn hàng #${orderId} ${statusMessages[status] || 'đã được cập nhật trạng thái'}. ${estimatedDelivery ? `Dự kiến giao hàng: ${estimatedDelivery}` : ''}`,
    orderId,
    metadata: {
      status,
      estimatedDelivery
    }
  });
};

// Static method để tạo thông báo giao hàng thành công
notificationSchema.statics.createDeliverySuccessNotification = function(userId, orderId) {
  return this.create({
    userId,
    type: 'delivery_success',
    title: 'Giao hàng thành công',
    message: `Đơn hàng #${orderId} đã được giao thành công. Vui lòng kiểm tra và đánh giá sản phẩm.`,
    orderId
  });
};

// Static method để tạo thông báo khuyến mãi
notificationSchema.statics.createPromotionNotification = function(userId, promotionTitle, promotionMessage) {
  return this.create({
    userId,
    type: 'promotion',
    title: promotionTitle || 'Khuyến mãi mới!',
    message: promotionMessage,
    priority: 'high'
  });
};

// Static method để tạo thông báo hủy đơn hàng
notificationSchema.statics.createOrderCancelledNotification = function(userId, orderId, reason) {
  return this.create({
    userId,
    type: 'order_cancelled',
    title: 'Đơn hàng bị hủy',
    message: `Đơn hàng #${orderId} đã bị hủy${reason ? ` do ${reason}` : ''}. Chúng tôi xin lỗi vì sự bất tiện này.`,
    orderId,
    metadata: { reason }
  });
};

// Pre-save middleware để validate
notificationSchema.pre('save', function(next) {
  if (this.message.length > 1000) {
    return next(new Error('Message quá dài (tối đa 1000 ký tự)'));
  }
  next();
});

export default mongoose.model('Notification', notificationSchema);
