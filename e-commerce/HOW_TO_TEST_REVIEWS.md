# 🧪 Hướng Dẫn Test Hệ Thống Đánh Giá Sản Phẩm

## 🚀 **Khởi Động Hệ Thống**

### 1. **Khởi động Backend Server**
```bash
cd e-commerce/server
npm run dev
```
Server sẽ chạy tại: `http://localhost:8080`

### 2. **Khởi động Frontend**
```bash
cd e-commerce/gomallclient
npm start
```
Frontend sẽ chạy tại: `http://localhost:3000`

## 🎯 **Các Cách Test Hệ Thống Đánh Giá**

### **Cách 1: Trang Demo Chuyên Biệt**
- Truy cập: `http://localhost:3000/review-demo`
- Đây là trang demo riêng để test component ProductReview
- Hiển thị đầy đủ giao diện đánh giá sản phẩm

### **Cách 2: Trang Chi Tiết Sản Phẩm**
- Truy cập: `http://localhost:3000/product/[product-id]`
- Cuối trang sẽ có component đánh giá
- Ví dụ: `http://localhost:3000/product/64f8b2c1a2b3c4d5e6f7g8h9`

### **Cách 3: Trang ViewItemDetail**
- Truy cập: `http://localhost:3000/view-item-detail`
- Click vào tab "Reviews" để xem đánh giá

## 🔍 **Tính Năng Cần Test**

### **1. Hiển Thị Đánh Giá**
- ✅ Rating trung bình (ví dụ: 4.8⭐)
- ✅ Tổng số đánh giá
- ✅ Phân bố rating (5 sao, 4 sao, 3 sao...)
- ✅ Danh sách đánh giá với thông tin người dùng
- ✅ Phân trang đánh giá
- ✅ Sắp xếp theo thời gian/rating

### **2. Tạo Đánh Giá Mới**
- ✅ Nút "Viết đánh giá" (chỉ hiện khi đã đăng nhập)
- ✅ Form chọn rating 1-5 sao
- ✅ Textarea nhập comment
- ✅ Validation và gửi đánh giá

### **3. Quản Lý Đánh Giá**
- ✅ Cập nhật đánh giá đã có
- ✅ Xóa đánh giá của mình
- ✅ Tự động cập nhật rating trung bình

## 🧪 **Test Cases**

### **Test Case 1: Xem Đánh Giá (Không Đăng Nhập)**
1. Truy cập trang demo: `http://localhost:3000/review-demo`
2. Kiểm tra hiển thị rating trung bình
3. Kiểm tra phân bố rating
4. Kiểm tra danh sách đánh giá
5. Kiểm tra phân trang và sorting

### **Test Case 2: Tạo Đánh Giá Mới**
1. Đăng nhập vào hệ thống
2. Truy cập trang demo
3. Click "Viết đánh giá"
4. Chọn rating 5 sao
5. Nhập comment: "Sản phẩm tuyệt vời!"
6. Click "Gửi đánh giá"
7. Kiểm tra đánh giá xuất hiện trong danh sách

### **Test Case 3: Cập Nhật Đánh Giá**
1. Tìm đánh giá của mình trong danh sách
2. Click "Sửa" (nếu có)
3. Thay đổi rating từ 5 sao xuống 4 sao
4. Cập nhật comment
5. Kiểm tra thay đổi được lưu

### **Test Case 4: Xóa Đánh Giá**
1. Tìm đánh giá của mình
2. Click "Xóa" (nếu có)
3. Xác nhận xóa
4. Kiểm tra đánh giá biến mất

## 📱 **Test Responsive Design**

### **Desktop (1200px+)**
- Giao diện đầy đủ với sidebar rating
- Layout 2 cột cho rating summary

### **Tablet (768px - 1199px)**
- Rating summary chuyển thành 1 cột
- Form đánh giá responsive

### **Mobile (< 768px)**
- Tất cả elements stack vertically
- Buttons full width
- Touch-friendly interface

## 🐛 **Debug và Troubleshooting**

### **Lỗi Thường Gặp**

1. **"Không thể tải đánh giá"**
   - Kiểm tra server có chạy không
   - Kiểm tra console browser
   - Kiểm tra network tab

2. **"Bạn đã đánh giá sản phẩm này rồi"**
   - Mỗi user chỉ đánh giá 1 lần cho mỗi sản phẩm
   - Sử dụng chức năng cập nhật để thay đổi

3. **Rating không cập nhật**
   - Refresh trang
   - Kiểm tra database có dữ liệu không

### **Kiểm Tra Database**
```bash
cd e-commerce/server/scripts
node check-collections.js
```

### **Kiểm Tra API Endpoints**
- `GET /api/reviews/product/:productID` - Lấy đánh giá sản phẩm
- `POST /api/reviews` - Tạo đánh giá mới
- `PUT /api/reviews/:reviewID` - Cập nhật đánh giá
- `DELETE /api/reviews/:reviewID` - Xóa đánh giá

## 🎉 **Kết Quả Mong Đợi**

Sau khi test thành công, bạn sẽ thấy:

1. **Giao diện đẹp mắt** với rating stars, progress bars
2. **Chức năng đầy đủ** tạo, sửa, xóa đánh giá
3. **Responsive design** hoạt động tốt trên mọi thiết bị
4. **Real-time updates** rating trung bình tự động cập nhật
5. **User experience tốt** với validation và thông báo rõ ràng

## 📞 **Hỗ Trợ**

Nếu gặp vấn đề:
1. Kiểm tra console browser
2. Kiểm tra terminal server
3. Kiểm tra MongoDB connection
4. Tạo issue trên GitHub repository

---

**Chúc bạn test thành công! 🚀**
