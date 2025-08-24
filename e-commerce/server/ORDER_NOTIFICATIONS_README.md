# 🚀 Order Notifications System

Hệ thống thông báo tự động cho các thao tác đặt hàng trong GoMall.

## 📋 Các loại thông báo được hỗ trợ

### 1. 🛒 Đặt hàng thành công
- **Trigger:** Khi user tạo order mới
- **Type:** `order_success`
- **Content:** Thông tin đơn hàng, tổng tiền, phương thức thanh toán

### 2. 🚚 Cập nhật trạng thái giao hàng
- **Trigger:** Khi admin/seller cập nhật trạng thái đơn hàng
- **Type:** `shipping_update`
- **Content:** Trạng thái mới, thời gian dự kiến giao hàng

### 3. ✅ Giao hàng thành công
- **Trigger:** Khi đơn hàng được giao thành công
- **Type:** `delivery_success`
- **Content:** Xác nhận giao hàng, yêu cầu đánh giá

### 4. ❌ Hủy đơn hàng
- **Trigger:** Khi đơn hàng bị hủy
- **Type:** `order_cancelled`
- **Content:** Lý do hủy, hướng dẫn xử lý

### 5. 💳 Thanh toán thành công
- **Trigger:** Khi thanh toán hoàn tất
- **Type:** `payment_success`
- **Content:** Số tiền, mã đơn hàng

### 6. 💰 Hoàn tiền
- **Trigger:** Khi xử lý hoàn tiền
- **Type:** `refund_processed`
- **Content:** Số tiền hoàn, lý do

## 🔧 Cách sử dụng

### Trong Order Controller

```javascript
import NotificationService from '../services/notificationService.js';

// Tạo thông báo đặt hàng thành công
await NotificationService.createOrderSuccessNotification(
  userId, 
  orderId, 
  orderDetails
);

// Tạo thông báo cập nhật trạng thái
await NotificationService.createShippingUpdateNotification(
  userId, 
  orderId, 
  status, 
  estimatedDelivery
);
```

### Trong Payment Controller

```javascript
// Tạo thông báo thanh toán thành công
await NotificationService.createPaymentSuccessNotification(
  userId, 
  orderId, 
  amount
);

// Tạo thông báo hoàn tiền
await NotificationService.createRefundNotification(
  userId, 
  orderId, 
  amount, 
  reason
);
```

## 🧪 Testing

### Chạy test tất cả notifications:
```bash
npm run test-order-notifications
```

### Test từng loại riêng lẻ:
```bash
# Test đặt hàng thành công
node scripts/testOrderNotifications.js

# Test cập nhật trạng thái
# Test giao hàng thành công
# Test hủy đơn hàng
# Test thanh toán thành công
# Test hoàn tiền
```

## 📱 API Endpoints

### Orders
- `POST /api/orders` - Tạo đơn hàng (tự động tạo notification)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (tự động tạo notification)
- `PUT /api/orders/:id/delivered` - Đánh dấu đã giao (tự động tạo notification)
- `DELETE /api/orders/:id` - Hủy đơn hàng (tự động tạo notification)

### Payments
- `POST /api/payments` - Xử lý thanh toán (tự động tạo notification)
- `POST /api/payments/refund` - Xử lý hoàn tiền (tự động tạo notification)

## 🗄️ Database Schema

### Notification Model
```javascript
{
  userId: ObjectId,        // ID của user
  type: String,            // Loại thông báo
  title: String,           // Tiêu đề
  message: String,         // Nội dung
  orderId: String,         // ID đơn hàng (nếu có)
  productId: ObjectId,     // ID sản phẩm (nếu có)
  isRead: Boolean,         // Đã đọc chưa
  metadata: Object,        // Dữ liệu bổ sung
  priority: String,        // Độ ưu tiên
  icon: String,            // Icon hiển thị
  createdAt: Date,         // Thời gian tạo
  updatedAt: Date          // Thời gian cập nhật
}
```

## 🔄 Workflow

### 1. User đặt hàng
```
User tạo order → OrderController.createOrder() → 
NotificationService.createOrderSuccessNotification() → 
Database lưu notification
```

### 2. Admin cập nhật trạng thái
```
Admin cập nhật status → OrderController.updateOrderStatus() → 
NotificationService.createShippingUpdateNotification() → 
Database lưu notification
```

### 3. Giao hàng thành công
```
Admin đánh dấu delivered → OrderController.markOrderAsDelivered() → 
NotificationService.createDeliverySuccessNotification() → 
Database lưu notification
```

## 🚨 Error Handling

- Tất cả notification calls đều được wrap trong try-catch
- Nếu notification fail, order/payment vẫn được xử lý bình thường
- Log errors để debug và monitor

## 📊 Monitoring

### Logs
- Tất cả notification operations đều được log
- Format: `Created [type] notification for user [userId], order [orderId]`

### Statistics
```javascript
// Lấy thống kê notifications của user
const stats = await NotificationService.getNotificationStats(userId);
// Returns: { total, unread, byType }
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

## 📝 Notes

- Notifications được tạo tự động, không cần manual intervention
- Hỗ trợ đa ngôn ngữ (hiện tại: Vietnamese)
- Có thể customize content và format
- Performance optimized với database indexing
- Auto-cleanup notifications cũ (30+ days)
