# Component Notifications

## Mô tả
Component Notifications hiển thị danh sách thông báo khi user click vào nút "Notifications" trên header. Nó hỗ trợ các loại thông báo khác nhau như đặt hàng thành công, cập nhật trạng thái giao hàng, khuyến mãi, v.v.

## Tính năng chính

### 1. **Hiển thị thông báo**
- Thông báo đặt hàng thành công
- Cập nhật trạng thái giao hàng
- Thông báo giao hàng thành công
- Khuyến mãi mới
- Thông báo hủy đơn hàng

### 2. **Quản lý thông báo**
- Đánh dấu đã đọc
- Đánh dấu tất cả đã đọc
- Xóa thông báo
- Lọc theo loại (Tất cả, Chưa đọc, Đơn hàng, Khuyến mãi)

### 3. **Giao diện**
- Modal popup đẹp mắt
- Responsive design
- Animation mượt mà
- Badge hiển thị số thông báo chưa đọc

## Cách sử dụng

### 1. **Import component**
```javascript
import Notifications from '../Notifications/Notifications';
```

### 2. **Sử dụng trong component**
```javascript
const [showNotifications, setShowNotifications] = useState(false);

// Trong JSX
<Notifications 
  isVisible={showNotifications}
  onClose={() => setShowNotifications(false)}
/>
```

### 3. **Trigger hiển thị**
```javascript
<button onClick={() => setShowNotifications(true)}>
  🔔 Notifications
</button>
```

## Cấu trúc dữ liệu

### Notification Object
```javascript
{
  id: 1,
  type: 'order_success', // order_success, shipping_update, delivery_success, promotion, order_cancelled
  title: 'Đặt hàng thành công!',
  message: 'Đơn hàng #ORD001 của bạn đã được đặt thành công...',
  timestamp: new Date(),
  isRead: false,
  orderId: 'ORD001',
  icon: 'package' // package, truck, check, alert, info
}
```

## Tích hợp với Backend

### 1. **API Endpoints cần thiết**
```javascript
// Lấy danh sách thông báo
GET /api/notifications

// Đánh dấu đã đọc
PUT /api/notifications/:id/read

// Đánh dấu tất cả đã đọc
PUT /api/notifications/read-all

// Xóa thông báo
DELETE /api/notifications/:id
```

### 2. **Thay thế mock data**
```javascript
// Thay thế loadNotifications() function
const loadNotifications = async () => {
  try {
    const response = await fetch('/api/notifications');
    const data = await response.json();
    setNotifications(data.notifications);
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
};
```

## Tùy chỉnh

### 1. **Thêm loại thông báo mới**
```javascript
// Thêm vào getIcon()
case 'new_type':
  return <NewIcon size={20} />;

// Thêm vào getTypeColor()
case 'new_type':
  return 'custom-color';
```

### 2. **Thay đổi giao diện**
- Chỉnh sửa `Notifications.css`
- Thay đổi màu sắc, kích thước, layout
- Thêm animation mới

## Responsive Design
- Mobile: Tối ưu cho màn hình nhỏ
- Tablet: Layout cân bằng
- Desktop: Hiển thị đầy đủ tính năng

## Browser Support
- Chrome, Firefox, Safari, Edge
- IE11+ (với polyfills)
- Mobile browsers
