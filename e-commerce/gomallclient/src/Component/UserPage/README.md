# User Profile Management

Hệ thống quản lý thông tin người dùng với các tính năng cập nhật và bảo mật.

## Các Component

### 1. UserPage.jsx
Component chính hiển thị trang thông tin người dùng với các tính năng:
- Hiển thị thông tin cá nhân
- Nút chỉnh sửa thông tin (Edit Profile)
- Nút thay đổi mật khẩu (Change Password)
- Modal popup cho các form

### 2. UserProfileForm.jsx
Form cập nhật thông tin cá nhân với các trường:
- Họ tên (bắt buộc)
- Email (chỉ đọc)
- Số điện thoại
- Địa chỉ
- Ngày sinh
- Giới tính
- Ảnh đại diện

**Tính năng:**
- Validation real-time
- Loading state
- Success/Error messages
- Responsive design

### 3. PasswordChangeForm.jsx
Form thay đổi mật khẩu với các tính năng:
- Nhập mật khẩu cũ
- Nhập mật khẩu mới
- Xác nhận mật khẩu mới
- Thanh độ mạnh mật khẩu
- Validation chi tiết

**Validation rules:**
- Mật khẩu mới tối thiểu 6 ký tự
- Phải chứa chữ hoa, chữ thường và số
- Mật khẩu xác nhận phải khớp

## API Endpoints

### Cập nhật thông tin người dùng
```javascript
PUT /api/users/:userId
{
  "fullName": "string",
  "phoneNumber": "string",
  "address": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "male|female|other"
}
```

### Thay đổi mật khẩu
```javascript
PUT /api/auth/change-password
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### Lấy thông tin người dùng
```javascript
GET /api/users/:userId
```

## Cách sử dụng

### 1. Cập nhật thông tin cá nhân
1. Vào trang `/user`
2. Click nút "Edit Profile"
3. Điền thông tin mới
4. Click "Cập nhật thông tin"

### 2. Thay đổi mật khẩu
1. Vào trang `/user`
2. Click nút "Change Password"
3. Nhập mật khẩu cũ và mật khẩu mới
4. Click "Đổi mật khẩu"

## Validation Rules

### Thông tin cá nhân
- **Họ tên**: Bắt buộc, tối thiểu 2 ký tự
- **Email**: Bắt buộc, định dạng email hợp lệ
- **Số điện thoại**: Tùy chọn, định dạng 10-11 số
- **Địa chỉ**: Tùy chọn, tối thiểu 10 ký tự

### Mật khẩu
- **Mật khẩu cũ**: Bắt buộc
- **Mật khẩu mới**: Bắt buộc, tối thiểu 6 ký tự
- **Xác nhận mật khẩu**: Bắt buộc, phải khớp với mật khẩu mới

## Độ mạnh mật khẩu

- **Yếu**: Dưới 6 ký tự
- **Trung bình**: 6+ ký tự
- **Mạnh**: 6+ ký tự + chữ hoa + chữ thường + số

## Error Handling

Hệ thống xử lý các lỗi sau:
- Lỗi mạng
- Lỗi validation
- Lỗi server
- Token hết hạn

## Responsive Design

Tất cả component đều responsive và hoạt động tốt trên:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Dependencies

- React 18+
- React Router DOM
- Axios
- Bootstrap CSS (optional)

## File Structure

```
UserPage/
├── UserPage.jsx              # Component chính
├── UserPage.css              # Styles cho UserPage
├── UserProfileForm.jsx       # Form cập nhật thông tin
├── UserProfileForm.css       # Styles cho UserProfileForm
├── PasswordChangeForm.jsx    # Form thay đổi mật khẩu
├── PasswordChangeForm.css    # Styles cho PasswordChangeForm
└── README.md                 # Hướng dẫn sử dụng
```

## Security Features

- Token-based authentication
- Password strength validation
- Input sanitization
- CSRF protection (server-side)
- Secure password storage (server-side)

## Performance Optimizations

- Lazy loading cho modals
- Debounced validation
- Optimized re-renders
- Efficient state management
