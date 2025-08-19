# Hệ thống Notifications - GoMall

## 📋 Tổng quan

Hệ thống Notifications cho phép tạo, quản lý và hiển thị thông báo cho người dùng trong ứng dụng GoMall. Hỗ trợ các loại thông báo khác nhau như đặt hàng, giao hàng, khuyến mãi, v.v.

## 🏗️ Kiến trúc

### Backend
- **Model**: `Notification.js` - Schema MongoDB
- **Controller**: `notificationController.js` - Xử lý API requests
- **Routes**: `notificationRoutes.js` - Định nghĩa API endpoints
- **Service**: `notificationService.js` - Business logic
- **Scripts**: `testNotifications.js` - Test và debug

### Frontend
- **Component**: `Notifications.jsx` - UI hiển thị thông báo
- **CSS**: `Notifications.css` - Styling
- **Integration**: Tích hợp với Header component

## 🚀 Cài đặt và chạy

### 1. Khởi động server
```bash
cd e-commerce/server
npm start
```

### 2. Test notifications
```bash
npm run test-notifications
```

## 📡 API Endpoints

### Authentication
Tất cả endpoints đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

### 1. Lấy danh sách thông báo
```
GET /api/notifications
Query params:
- page: Số trang (default: 1)
- limit: Số item mỗi trang (default: 20)
- type: Loại thông báo (all, order_success, shipping_update, etc.)
- unreadOnly: Chỉ lấy chưa đọc (true/false)
```

### 2. Lấy số thông báo chưa đọc
```
GET /api/notifications/unread-count
```

### 3. Đánh dấu đã đọc
```
PUT /api/notifications/:id/read
```

### 4. Đánh dấu tất cả đã đọc
```
PUT /api/notifications/read-all
```

### 5. Xóa thông báo
```
DELETE /api/notifications/:id
```

### 6. Xóa tất cả đã đọc
```
DELETE /api/notifications/read
```

### 7. Tạo thông báo mới (Admin/System)
```
POST /api/notifications
Body:
{
  "userId": "user_id",
  "type": "order_success",
  "title": "Tiêu đề",
  "message": "Nội dung",
  "orderId": "ORD001",
  "metadata": {}
}
```

### 8. Tạo thông báo broadcast
```
POST /api/notifications/broadcast
Body:
{
  "userIds": ["user1", "user2"],
  "type": "promotion",
  "title": "Khuyến mãi",
  "message": "Nội dung khuyến mãi"
}
```

## 🎯 Các loại thông báo

### 1. **order_success** - Đặt hàng thành công
- Tự động tạo khi đơn hàng được tạo
- Chứa thông tin đơn hàng và tổng tiền

### 2. **shipping_update** - Cập nhật trạng thái giao hàng
- Tự động tạo khi trạng thái đơn hàng thay đổi
- Hỗ trợ: processing, shipped, in_transit, out_for_delivery

### 3. **delivery_success** - Giao hàng thành công
- Tự động tạo khi đơn hàng được giao thành công

### 4. **promotion** - Khuyến mãi
- Có thể tạo thủ công hoặc tự động
- Hỗ trợ broadcast cho nhiều user

### 5. **order_cancelled** - Hủy đơn hàng
- Tự động tạo khi đơn hàng bị hủy
- Chứa lý do hủy

### 6. **payment_success** - Thanh toán thành công
- Tự động tạo khi thanh toán hoàn tất

### 7. **refund_processed** - Hoàn tiền
- Tự động tạo khi xử lý hoàn tiền

## 🔧 Sử dụng NotificationService

### Tạo thông báo tự động
```javascript
const NotificationService = require('../services/notificationService');

// Khi đặt hàng thành công
await NotificationService.createOrderSuccessNotification(
  userId, 
  orderId, 
  orderDetails
);

// Khi cập nhật trạng thái giao hàng
await NotificationService.createShippingUpdateNotification(
  userId, 
  orderId, 
  'in_transit', 
  '2-3 giờ tới'
);

// Khi có khuyến mãi mới
await NotificationService.createPromotionNotification(
  userIds,
  'Khuyến mãi mới!',
  'Giảm giá 20% cho tất cả sản phẩm'
);
```

### Tích hợp với Order Controller
```javascript
// Trong orderController.js
const NotificationService = require('../services/notificationService');

// Khi tạo đơn hàng thành công
const order = await Order.create(orderData);
await NotificationService.createOrderSuccessNotification(
  req.user.id,
  order._id,
  { totalAmount: order.totalAmount, items: order.items }
);
```

## 🎨 Frontend Integration

### 1. Hiển thị badge số thông báo
```javascript
// Trong Header.jsx
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (isAuthenticated()) {
    loadUnreadCount();
  }
}, [isAuthenticated]);

const loadUnreadCount = async () => {
  const response = await fetch('/api/notifications/unread-count', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  setUnreadCount(data.data.unreadCount);
};
```

### 2. Hiển thị danh sách thông báo
```javascript
// Trong Notifications.jsx
const loadNotifications = async () => {
  const response = await fetch('/api/notifications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  setNotifications(data.data.notifications);
};
```

## 🧪 Testing

### 1. Chạy test script
```bash
npm run test-notifications
```

### 2. Test API endpoints
```bash
# Lấy thông báo
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/notifications

# Đánh dấu đã đọc
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/notifications/<id>/read
```

### 3. Test tạo thông báo
```bash
# Tạo thông báo mới
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_id","type":"promotion","title":"Test","message":"Test message"}' \
  http://localhost:8080/api/notifications
```

## 🔒 Bảo mật

### 1. Authentication
- Tất cả endpoints yêu cầu JWT token
- Token được validate qua middleware `auth.js`

### 2. Authorization
- User chỉ có thể truy cập thông báo của mình
- Admin có thể tạo thông báo cho user khác

### 3. Rate Limiting
- Áp dụng rate limiting cho tất cả endpoints
- Ngăn chặn spam và abuse

## 📊 Monitoring và Logging

### 1. Console Logs
- Tất cả operations đều được log
- Error handling với detailed logging

### 2. Database Indexes
- Index trên `userId`, `isRead`, `createdAt`
- Tối ưu performance cho queries

### 3. Cleanup
- Tự động xóa thông báo cũ (>30 ngày)
- Có thể chạy manual cleanup

## 🚀 Deployment

### 1. Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/GoMall
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### 2. Database Migration
```bash
# Không cần migration đặc biệt
# Schema tự động được tạo khi khởi động
```

### 3. Health Check
```bash
# Kiểm tra API status
GET /api/notifications/unread-count
```

## 🐛 Troubleshooting

### 1. Thông báo không hiển thị
- Kiểm tra JWT token có hợp lệ
- Kiểm tra user ID trong database
- Kiểm tra console logs

### 2. API errors
- Kiểm tra server logs
- Kiểm tra database connection
- Kiểm tra middleware auth

### 3. Performance issues
- Kiểm tra database indexes
- Kiểm tra query optimization
- Kiểm tra memory usage

## 📝 Changelog

### Version 1.0.0
- ✅ Tạo model Notification
- ✅ Tạo API endpoints
- ✅ Tạo NotificationService
- ✅ Tích hợp frontend
- ✅ Test scripts
- ✅ Documentation

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

ISC License
