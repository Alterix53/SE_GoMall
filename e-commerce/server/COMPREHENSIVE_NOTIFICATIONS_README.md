# 🚀 Comprehensive Order Notifications System

Hệ thống thông báo tự động hoàn chỉnh cho tất cả thao tác đặt hàng trong GoMall.

## 📋 Tổng quan các loại thông báo

### 🛒 **Order Management Notifications**
1. **`order_success`** - Đặt hàng thành công
2. **`shipping_update`** - Cập nhật trạng thái giao hàng
3. **`delivery_success`** - Giao hàng thành công
4. **`order_cancelled`** - Hủy đơn hàng
5. **`order_returned`** - Đơn hàng bị trả lại
6. **`order_delayed`** - Đơn hàng bị hoãn
7. **`order_ready_for_pickup`** - Sẵn sàng nhận hàng

### 💳 **Payment Notifications**
8. **`payment_success`** - Thanh toán thành công
9. **`refund_processed`** - Hoàn tiền hoàn tất
10. **`order_partially_refunded`** - Hoàn tiền một phần

### 🎯 **Marketing & System Notifications**
11. **`promotion`** - Khuyến mãi mới
12. **`seller_approved`** - Seller được chấp nhận
13. **`seller_rejected`** - Seller bị từ chối
14. **`seller_welcome`** - Chào mừng seller mới
15. **`seller_guide`** - Hướng dẫn seller

## 🔧 Cách sử dụng

### Trong Controllers

```javascript
import NotificationService from '../services/notificationService.js';

// Đặt hàng thành công
await NotificationService.createOrderSuccessNotification(
  userId, 
  orderId, 
  orderDetails
);

// Cập nhật trạng thái giao hàng
await NotificationService.createShippingUpdateNotification(
  userId, 
  orderId, 
  status, 
  estimatedDelivery
);

// Giao hàng thành công
await NotificationService.createDeliverySuccessNotification(
  userId, 
  orderId
);

// Hủy đơn hàng
await NotificationService.createOrderCancelledNotification(
  userId, 
  orderId, 
  reason
);

// Thanh toán thành công
await NotificationService.createPaymentSuccessNotification(
  userId, 
  orderId, 
  amount
);

// Hoàn tiền
await NotificationService.createRefundNotification(
  userId, 
  orderId, 
  amount, 
  reason
);

// Đơn hàng bị trả lại
await NotificationService.createOrderReturnedNotification(
  userId, 
  orderId, 
  reason
);

// Đơn hàng bị hoãn
await NotificationService.createOrderDelayedNotification(
  userId, 
  orderId, 
  reason, 
  newEstimatedDate
);

// Sẵn sàng nhận hàng
await NotificationService.createOrderReadyForPickupNotification(
  userId, 
  orderId, 
  pickupLocation, 
  pickupCode
);

// Hoàn tiền một phần
await NotificationService.createPartialRefundNotification(
  userId, 
  orderId, 
  refundAmount, 
  reason
);
```

## 🧪 Testing

### Test tất cả notifications:
```bash
npm run test-all-notifications
```

### Test từng loại riêng lẻ:
```bash
# Test cơ bản
npm run test-order-notifications

# Test notifications cũ
npm run test-notifications
```

## 📱 API Endpoints với Notifications

### Orders
- `POST /api/orders` → `order_success` notification
- `PUT /api/orders/:id/status` → `shipping_update` notification
- `PUT /api/orders/:id/delivered` → `delivery_success` notification
- `DELETE /api/orders/:id` → `order_cancelled` notification

### Payments
- `POST /api/payments` → `payment_success` notification
- `POST /api/payments/refund` → `refund_processed` notification

### Admin Actions
- `PUT /api/admin/orders/:id/return` → `order_returned` notification
- `PUT /api/admin/orders/:id/delay` → `order_delayed` notification
- `PUT /api/admin/orders/:id/ready-pickup` → `order_ready_for_pickup` notification
- `PUT /api/admin/orders/:id/partial-refund` → `order_partially_refunded` notification

## 🗄️ Database Schema

### Notification Model
```javascript
{
  userId: ObjectId,        // ID của user
  type: String,            // Loại thông báo (16 loại)
  title: String,           // Tiêu đề (max 200 chars)
  message: String,         // Nội dung (max 1000 chars)
  orderId: String,         // ID đơn hàng (nếu có)
  productId: ObjectId,     // ID sản phẩm (nếu có)
  isRead: Boolean,         // Đã đọc chưa
  metadata: Object,        // Dữ liệu bổ sung
  priority: String,        // Độ ưu tiên (low/medium/high)
  icon: String,            // Icon hiển thị (7 loại)
  createdAt: Date,         // Thời gian tạo
  updatedAt: Date          // Thời gian cập nhật
}
```

### Notification Types Enum
```javascript
[
  'order_success',           // Đặt hàng thành công
  'shipping_update',         // Cập nhật trạng thái
  'delivery_success',        // Giao hàng thành công
  'promotion',               // Khuyến mãi
  'order_cancelled',         // Hủy đơn hàng
  'payment_success',         // Thanh toán thành công
  'refund_processed',        // Hoàn tiền
  'seller_approved',         // Seller được chấp nhận
  'seller_rejected',         // Seller bị từ chối
  'seller_welcome',          // Chào mừng seller
  'seller_guide',            // Hướng dẫn seller
  'order_returned',          // Đơn hàng bị trả lại
  'order_refunded',          // Đơn hàng được hoàn tiền
  'order_partially_refunded', // Hoàn tiền một phần
  'order_delayed',           // Đơn hàng bị hoãn
  'order_ready_for_pickup'   // Sẵn sàng nhận hàng
]
```

### Icon Types
```javascript
[
  'package',    // 📦 Đơn hàng
  'truck',      // 🚚 Giao hàng
  'check',      // ✅ Thành công
  'alert',      // ⚠️ Cảnh báo
  'info',       // ℹ️ Thông tin
  'bell'        // 🔔 Thông báo
]
```

## 🔄 Workflow Examples

### 1. User đặt hàng thành công
```
User tạo order → OrderController.createOrder() → 
NotificationService.createOrderSuccessNotification() → 
Database lưu notification với type: 'order_success'
```

### 2. Admin cập nhật trạng thái giao hàng
```
Admin cập nhật status → OrderController.updateOrderStatus() → 
NotificationService.createShippingUpdateNotification() → 
Database lưu notification với type: 'shipping_update'
```

### 3. Giao hàng thành công
```
Admin đánh dấu delivered → OrderController.markOrderAsDelivered() → 
NotificationService.createDeliverySuccessNotification() → 
Database lưu notification với type: 'delivery_success'
```

### 4. Đơn hàng bị hoãn
```
Admin đánh dấu delayed → OrderController.updateOrderStatus() → 
NotificationService.createOrderDelayedNotification() → 
Database lưu notification với type: 'order_delayed'
```

## 🚨 Error Handling

- Tất cả notification calls đều được wrap trong try-catch
- Nếu notification fail, order/payment vẫn được xử lý bình thường
- Log errors để debug và monitor
- Graceful degradation - không làm crash hệ thống

## 📊 Monitoring & Analytics

### Logs
- Tất cả notification operations đều được log
- Format: `Created [type] notification for user [userId], order [orderId]`

### Statistics
```javascript
// Lấy thống kê notifications của user
const stats = await NotificationService.getNotificationStats(userId);
// Returns: { total, unread, byType }

// Cleanup notifications cũ
const deletedCount = await NotificationService.cleanupOldNotifications();
```

### Database Queries
```javascript
// Lấy notifications chưa đọc
db.notifications.find({ userId: ObjectId("..."), isRead: false })

// Lấy notifications theo loại
db.notifications.find({ userId: ObjectId("..."), type: "order_success" })

// Lấy notifications theo thời gian
db.notifications.find({ 
  userId: ObjectId("..."), 
  createdAt: { $gte: new Date("2025-08-01") } 
})
```

## 🔮 Future Enhancements

- [ ] Push notifications qua mobile app
- [ ] Email notifications
- [ ] SMS notifications
- [ ] WebSocket real-time updates
- [ ] Notification templates
- [ ] Bulk notifications
- [ ] Notification scheduling
- [ ] User notification preferences
- [ ] Notification categories
- [ ] Smart notification timing
- [ ] A/B testing notifications
- [ ] Notification analytics dashboard

## 📝 Best Practices

1. **Always wrap notifications in try-catch** - Không để notification fail làm crash order
2. **Use appropriate priority levels** - High cho urgent, Medium cho normal, Low cho info
3. **Include relevant metadata** - Giúp frontend hiển thị rich content
4. **Use descriptive icons** - Giúp user nhận biết loại notification
5. **Keep messages concise** - Dưới 1000 ký tự
6. **Log all operations** - Để debug và monitor
7. **Clean up old notifications** - Tự động xóa notifications cũ

## 🎯 Use Cases

### E-commerce Flow
1. **Order Placement** → `order_success`
2. **Payment Processing** → `payment_success`
3. **Order Processing** → `shipping_update`
4. **Shipping** → `shipping_update`
5. **Delivery** → `delivery_success`
6. **Returns/Refunds** → `order_returned` / `refund_processed`

### Admin Operations
1. **Order Management** → Various shipping notifications
2. **Seller Approval** → `seller_approved` / `seller_rejected`
3. **Promotion Management** → `promotion`
4. **Issue Resolution** → `order_delayed` / `order_cancelled`

## 📱 Frontend Integration

### Notification Component
```javascript
// Lấy notifications của user
const notifications = await fetch('/api/notifications');

// Đánh dấu đã đọc
await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });

// Hiển thị notification count
const unreadCount = notifications.filter(n => !n.isRead).length;
```

### Real-time Updates
```javascript
// WebSocket connection
const ws = new WebSocket('ws://localhost:8080/notifications');

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Hiển thị notification mới
  showNotification(notification);
};
```

## 🚀 Performance Optimization

- **Database Indexing** - Index trên userId, isRead, createdAt
- **Batch Operations** - Xử lý nhiều notifications cùng lúc
- **Cleanup Jobs** - Tự động xóa notifications cũ
- **Caching** - Cache notifications thường xuyên truy cập
- **Async Processing** - Không block main thread

---

**🎉 Hệ thống notifications đã hoàn chỉnh và sẵn sàng sử dụng!**
