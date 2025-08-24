# Multi-Image Upload Fix

## Vấn đề đã sửa
- **Trước**: Khi chọn hình ảnh thứ 2, hình ảnh đầu tiên bị mất
- **Sau**: Có thể upload nhiều ảnh liên tiếp mà không mất ảnh trước đó

## Thay đổi chính

### 1. useImageUploader.js
- **Thay đổi**: `handleImageUpload` giờ append ảnh mới thay vì thay thế toàn bộ
- **Logic mới**: 
  - Kiểm tra tổng số ảnh (hiện tại + mới) không vượt quá 6
  - Append ảnh mới vào danh sách hiện tại
  - Chỉ ảnh đầu tiên được đánh dấu là main nếu chưa có ảnh nào

### 2. ProductForm.jsx
- **Thêm**: Hiển thị số lượng ảnh hiện tại (X/6)
- **Thêm**: Thông báo ảnh đầu tiên sẽ là ảnh chính

### 3. ImageGrid.jsx
- **Thêm**: Hướng dẫn có thể upload thêm ảnh

## Cách test

1. **Upload ảnh đầu tiên**:
   - Chọn 1 ảnh → Hiển thị 1/6
   - Ảnh này tự động là ảnh chính

2. **Upload ảnh thứ 2**:
   - Chọn thêm 1 ảnh → Hiển thị 2/6
   - Ảnh đầu tiên vẫn là ảnh chính
   - Cả 2 ảnh đều hiển thị

3. **Upload nhiều ảnh cùng lúc**:
   - Chọn 3 ảnh → Hiển thị 5/6
   - Tất cả ảnh đều được giữ lại

4. **Test giới hạn**:
   - Upload đến 6 ảnh
   - Thử upload thêm → Hiển thị lỗi

5. **Test thay đổi ảnh chính**:
   - Click vào ngôi sao trên ảnh khác
   - Ảnh đó trở thành ảnh chính

6. **Test xóa ảnh**:
   - Xóa ảnh chính → Ảnh đầu tiên còn lại trở thành chính
   - Xóa ảnh thường → Không ảnh hưởng ảnh chính

## Kết quả mong đợi
- ✅ Upload nhiều ảnh liên tiếp không mất ảnh trước
- ✅ Hiển thị số lượng ảnh rõ ràng
- ✅ Ảnh chính được quản lý đúng
- ✅ Giới hạn 6 ảnh được thực thi
- ✅ UI thân thiện với người dùng
