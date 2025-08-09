# Admin API Documentation

## Tổng quan

Hệ thống API Admin được xây dựng để quản lý toàn bộ hệ thống e-commerce với các tính năng bảo mật cao và phân quyền chi tiết.

## Bảo mật

### Authentication
- Sử dụng JWT token cho xác thực
- Rate limiting: 100 requests/phút cho mỗi IP
- Middleware bảo mật cho tất cả admin routes

### Authorization
- Role-based access control (RBAC)
- Permissions system cho từng chức năng
- Super admin có quyền truy cập tất cả

## Cài đặt và Khởi tạo

### 1. Tạo Admin mặc định
```bash
cd server
node scripts/createAdmin.js
```

Thông tin đăng nhập mặc định:
- Username: admin
- Password: admin123
- Email: admin@gomall.com

### 2. Cấu hình Environment Variables
```env
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/gomall
```

## API Endpoints

### Authentication

#### POST /api/admin/login
Đăng nhập admin
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "...",
      "username": "admin",
      "email": "admin@gomall.com",
      "fullName": "System Administrator",
      "role": "admin",
      "permissions": [...]
    },
    "token": "jwt-token-here"
  },
  "message": "Đăng nhập admin thành công"
}
```

### Dashboard APIs

#### GET /api/admin/dashboard/stats
Lấy thống kê tổng quan dashboard
```bash
Authorization: Bearer <token>
```

#### GET /api/admin/dashboard/revenue?period=month
Lấy thống kê doanh thu theo thời gian
```bash
Authorization: Bearer <token>
```

#### GET /api/admin/dashboard/top-products?limit=10
Lấy danh sách sản phẩm bán chạy
```bash
Authorization: Bearer <token>
```

### User Management APIs

#### GET /api/admin/users
Lấy danh sách người dùng với phân trang và tìm kiếm
```bash
Authorization: Bearer <token>
Query params: page, limit, search, status
```

#### GET /api/admin/users/:id
Lấy thông tin chi tiết người dùng
```bash
Authorization: Bearer <token>
```

#### POST /api/admin/users
Tạo người dùng mới
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "New User",
  "phoneNumber": "0123456789",
  "address": "Ho Chi Minh City"
}
```

#### PUT /api/admin/users/:id
Cập nhật thông tin người dùng
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phoneNumber": "0987654321",
  "address": "Updated Address"
}
```

#### DELETE /api/admin/users/:id
Xóa người dùng
```bash
Authorization: Bearer <token>
```

#### PATCH /api/admin/users/:id/status
Cập nhật trạng thái người dùng
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active" // or "inactive"
}
```

### Seller Management APIs

#### GET /api/admin/sellers
Lấy danh sách người bán
```bash
Authorization: Bearer <token>
Query params: page, limit, search, status
```

#### GET /api/admin/sellers/:id
Lấy thông tin chi tiết người bán
```bash
Authorization: Bearer <token>
```

#### POST /api/admin/sellers
Tạo người bán mới
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newseller",
  "email": "seller@example.com",
  "password": "password123",
  "businessName": "New Business",
  "phoneNumber": "0123456789",
  "address": "Business Address"
}
```

#### PUT /api/admin/sellers/:id
Cập nhật thông tin người bán
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Updated Business",
  "phoneNumber": "0987654321",
  "address": "Updated Address"
}
```

#### DELETE /api/admin/sellers/:id
Xóa người bán
```bash
Authorization: Bearer <token>
```

#### PATCH /api/admin/sellers/:id/status
Cập nhật trạng thái người bán
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active" // or "inactive"
}
```

#### PATCH /api/admin/sellers/:id/approve
Duyệt người bán
```bash
Authorization: Bearer <token>
```

### Product Management APIs

#### GET /api/admin/products
Lấy danh sách sản phẩm
```bash
Authorization: Bearer <token>
Query params: page, limit, search, category, status
```

#### GET /api/admin/products/:id
Lấy thông tin chi tiết sản phẩm
```bash
Authorization: Bearer <token>
```

#### POST /api/admin/products
Tạo sản phẩm mới
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": {
    "original": 100000,
    "sale": 80000
  },
  "categoryID": "category-id",
  "sellerID": "seller-id",
  "stock": 100,
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### PUT /api/admin/products/:id
Cập nhật sản phẩm
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product",
  "price": {
    "original": 120000,
    "sale": 100000
  },
  "stock": 150
}
```

#### DELETE /api/admin/products/:id
Xóa sản phẩm
```bash
Authorization: Bearer <token>
```

#### PATCH /api/admin/products/:id/status
Cập nhật trạng thái sản phẩm
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active" // or "inactive"
}
```

#### PATCH /api/admin/products/:id/feature
Bật/tắt tính năng nổi bật
```bash
Authorization: Bearer <token>
```

### Order Management APIs

#### GET /api/admin/orders
Lấy danh sách đơn hàng
```bash
Authorization: Bearer <token>
Query params: page, limit, status, dateFrom, dateTo
```

#### GET /api/admin/orders/:id
Lấy thông tin chi tiết đơn hàng
```bash
Authorization: Bearer <token>
```

#### PUT /api/admin/orders/:id
Cập nhật đơn hàng
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "Updated Address",
  "notes": "Updated notes"
}
```

#### PATCH /api/admin/orders/:id/status
Cập nhật trạng thái đơn hàng
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped" // pending, processing, shipped, delivered, cancelled
}
```

### Category Management APIs

#### GET /api/admin/categories
Lấy danh sách danh mục
```bash
Authorization: Bearer <token>
```

#### GET /api/admin/categories/:id
Lấy thông tin chi tiết danh mục
```bash
Authorization: Bearer <token>
```

#### POST /api/admin/categories
Tạo danh mục mới
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryName": "New Category",
  "description": "Category description",
  "imageUrl": "category-image.jpg"
}
```

#### PUT /api/admin/categories/:id
Cập nhật danh mục
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryName": "Updated Category",
  "description": "Updated description"
}
```

#### DELETE /api/admin/categories/:id
Xóa danh mục
```bash
Authorization: Bearer <token>
```

### System Management APIs

#### GET /api/admin/system/logs
Lấy logs hệ thống
```bash
Authorization: Bearer <token>
```

#### GET /api/admin/system/backup
Tạo backup hệ thống
```bash
Authorization: Bearer <token>
```

#### POST /api/admin/system/maintenance
Bật/tắt chế độ bảo trì
```bash
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": true
}
```

## Error Responses

Tất cả API đều trả về response theo format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

- Giới hạn: 100 requests/phút cho mỗi IP
- Headers trả về:
  - X-RateLimit-Limit: 100
  - X-RateLimit-Remaining: 99
  - X-RateLimit-Reset: timestamp

## Permissions

Hệ thống sử dụng permissions để kiểm soát quyền truy cập:

- `user_management`: Quản lý người dùng
- `seller_management`: Quản lý người bán
- `product_management`: Quản lý sản phẩm
- `order_management`: Quản lý đơn hàng
- `category_management`: Quản lý danh mục
- `system_management`: Quản lý hệ thống
- `dashboard_view`: Xem dashboard
- `reports_view`: Xem báo cáo

Super admin có tất cả quyền truy cập.

## Frontend Integration

Sử dụng `adminAPI` từ `src/utils/api.js` để gọi các API:

```javascript
import { adminAPI } from '../utils/api';

// Login
const loginResponse = await adminAPI.login({
  username: 'admin',
  password: 'admin123'
});

// Get dashboard stats
const statsResponse = await adminAPI.getDashboardStats(token);

// Get users with pagination
const usersResponse = await adminAPI.getAllUsers(token, {
  page: 1,
  limit: 10,
  search: 'user',
  status: 'active'
});
```

## Security Best Practices

1. **Token Management**: Luôn sử dụng HTTPS và lưu trữ token an toàn
2. **Input Validation**: Validate tất cả input từ client
3. **SQL Injection**: Sử dụng Mongoose để tránh injection
4. **XSS Protection**: Sanitize tất cả user input
5. **CORS**: Cấu hình CORS đúng cách
6. **Rate Limiting**: Đã implement rate limiting
7. **Logging**: Log tất cả admin actions
8. **Backup**: Tạo backup định kỳ

## Monitoring

- Monitor API response times
- Track failed login attempts
- Monitor rate limit violations
- Log admin actions for audit trail
- Monitor system resources

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Kiểm tra token và permissions
2. **429 Too Many Requests**: Đợi rate limit reset
3. **500 Internal Server Error**: Kiểm tra logs server
4. **Database Connection**: Kiểm tra MongoDB connection

### Debug Mode

Để bật debug mode, set environment variable:
```env
DEBUG=true
```

## Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs server
2. Verify API endpoints
3. Check authentication token
4. Review permissions
5. Contact development team 