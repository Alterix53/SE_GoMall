# Hệ Thống Đánh Giá Sản Phẩm - GoMall

## Tổng Quan

Hệ thống đánh giá sản phẩm cho phép người dùng đã đăng nhập đánh giá sản phẩm với rating từ 1-5 sao và nhận xét. Hệ thống tự động tính toán rating trung bình và cập nhật thống kê cho mỗi sản phẩm.

## Tính Năng Chính

### 1. Đánh Giá Sản Phẩm
- **Rating**: Hệ thống sao từ 1-5
- **Comment**: Nhận xét chi tiết về sản phẩm
- **Validation**: Mỗi user chỉ được đánh giá một lần cho mỗi sản phẩm
- **Authentication**: Yêu cầu đăng nhập để đánh giá

### 2. Hiển Thị Đánh Giá
- **Rating trung bình**: Hiển thị rating trung bình của sản phẩm
- **Phân bố rating**: Biểu đồ phân bố số lượng đánh giá theo từng mức sao
- **Danh sách đánh giá**: Hiển thị tất cả đánh giá với thông tin người dùng
- **Pagination**: Phân trang cho danh sách đánh giá
- **Sorting**: Sắp xếp theo thời gian, rating

### 3. Quản Lý Đánh Giá
- **Cập nhật**: User có thể sửa đánh giá của mình
- **Xóa**: User có thể xóa đánh giá của mình
- **Tự động cập nhật**: Rating trung bình tự động cập nhật khi có thay đổi

## Cấu Trúc API

### Endpoints

#### 1. Tạo đánh giá mới
```
POST /api/reviews
Authorization: Bearer <token>
Body: {
  "productID": "product_id",
  "rating": 5,
  "comment": "Nhận xét về sản phẩm"
}
```

#### 2. Lấy đánh giá của sản phẩm
```
GET /api/reviews/product/:productID?page=1&limit=10&sort=newest
```

**Query Parameters:**
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số lượng đánh giá mỗi trang (mặc định: 10)
- `sort`: Sắp xếp theo:
  - `newest`: Mới nhất (mặc định)
  - `oldest`: Cũ nhất
  - `rating_high`: Rating cao nhất
  - `rating_low`: Rating thấp nhất

#### 3. Lấy đánh giá của user
```
GET /api/reviews/user
Authorization: Bearer <token>
```

#### 4. Cập nhật đánh giá
```
PUT /api/reviews/:reviewID
Authorization: Bearer <token>
Body: {
  "rating": 4,
  "comment": "Nhận xét đã cập nhật"
}
```

#### 5. Xóa đánh giá
```
DELETE /api/reviews/:reviewID
Authorization: Bearer <token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": {
    // Dữ liệu trả về
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi (nếu có)"
}
```

## Cấu Trúc Database

### Review Model
```javascript
{
  productID: ObjectId,    // Reference đến Product
  userID: ObjectId,       // Reference đến User
  rating: Number,         // 1-5 sao
  comment: String,        // Nhận xét
  createdAt: Date,        // Thời gian tạo
  updatedAt: Date         // Thời gian cập nhật
}
```

### Product Model (Updated)
```javascript
{
  // ... các field khác
  averageRating: Number,  // Rating trung bình (0-5)
  totalReviews: Number    // Tổng số đánh giá
}
```

## Component React

### ProductReview Component
```jsx
import ProductReview from '../Component/ProductReview';

<ProductReview 
  productId="product_id" 
  productName="Tên sản phẩm" 
/>
```

### Props
- `productId`: ID của sản phẩm
- `productName`: Tên sản phẩm (hiển thị trong form đánh giá)

## Cài Đặt và Sử Dụng

### 1. Backend
```bash
# Cài đặt dependencies
npm install

# Chạy seed data (bao gồm đánh giá mẫu)
cd server/scripts
node seedData.js
```

### 2. Frontend
```bash
# Cài đặt dependencies
cd gomallclient
npm install

# Chạy ứng dụng
npm start
```

### 3. Tích hợp vào trang sản phẩm
```jsx
// Trong ProductDetail.jsx hoặc trang chi tiết sản phẩm
import ProductReview from '../ProductReview';

// Thêm vào cuối trang
<ProductReview 
  productId={product._id} 
  productName={product.name} 
/>
```

## Dữ Liệu Mẫu

Hệ thống đã có sẵn dữ liệu đánh giá mẫu trong file `data/reviews.json` với:
- 20 đánh giá mẫu
- Rating từ 3-5 sao
- Comment đa dạng về nội dung
- Thời gian tạo khác nhau

## Bảo Mật

### Authentication
- Tất cả API đánh giá (trừ GET) yêu cầu JWT token
- User chỉ có thể sửa/xóa đánh giá của chính mình

### Validation
- Rating phải từ 1-5
- Comment không được để trống
- Mỗi user chỉ đánh giá một lần cho mỗi sản phẩm

## Tính Năng Nâng Cao

### 1. Moderation
- Admin có thể xóa đánh giá không phù hợp
- Hệ thống báo cáo đánh giá spam

### 2. Analytics
- Thống kê rating theo thời gian
- Phân tích sentiment của comment
- Báo cáo đánh giá theo danh mục

### 3. Notification
- Thông báo khi có đánh giá mới
- Email cảm ơn sau khi đánh giá

## Troubleshooting

### Lỗi Thường Gặp

1. **"Bạn đã đánh giá sản phẩm này rồi"**
   - Mỗi user chỉ được đánh giá một lần cho mỗi sản phẩm
   - Sử dụng chức năng cập nhật để thay đổi đánh giá

2. **"Cần đăng nhập để đánh giá"**
   - Kiểm tra token trong localStorage
   - Đăng nhập lại nếu token hết hạn

3. **Rating không cập nhật**
   - Kiểm tra kết nối database
   - Chạy lại seed data nếu cần

### Debug
```bash
# Kiểm tra logs server
cd server
npm run dev

# Kiểm tra database
cd scripts
node check-collections.js
```

## Đóng Góp

Để đóng góp vào hệ thống đánh giá:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## Liên Hệ

Nếu có vấn đề hoặc đề xuất cải tiến, vui lòng tạo issue trên GitHub repository.
