# Inventory Alert Implementation

## Tổng quan

Đã thêm alert thông báo chi tiết khi số lượng đã chọn trong giỏ hàng vượt quá số lượng tồn kho.

## Các thay đổi chính

### 1. Server-side (Backend)

#### Cart Controller (`e-commerce/server/controllers/cartController.js`)

- **Hàm `addToCart`**: 
  - Cập nhật thông báo lỗi: `"Số lượng đã chọn (X) vượt quá số lượng tồn kho (Y)"`
  - Thêm field `canAddQuantity` để chỉ ra số lượng có thể thêm
  - Trả về thông tin chi tiết về số lượng hiện tại trong giỏ hàng

- **Hàm `updateCartItem`**:
  - Cập nhật thông báo lỗi tương tự
  - Thêm field `canAddQuantity` để chỉ ra số lượng tối đa có thể chọn

### 2. Client-side (Frontend)

#### Product Detail (`e-commerce/gomallclient/src/Component/ProductDetail/ProductDetail.jsx`)

- **Hàm `onAddToCart`**:
  - Hiển thị alert với thông báo chi tiết
  - Hiển thị toast notification với tiêu đề tiếng Việt
  - Tự động điều chỉnh số lượng về mức tối đa có thể

- **Hàm `onBuyNow`**:
  - Tương tự như `onAddToCart`
  - Thông báo rõ ràng về số lượng có thể mua

#### Cart Context (`e-commerce/gomallclient/src/contexts/CartContext.js`)

- **Hàm `addToCart`**:
  - Xử lý thông báo lỗi chi tiết từ server
  - Hiển thị alert với số lượng có thể thêm
  - Trả về thông tin chi tiết về lỗi

- **Hàm `updateQuantity`**:
  - Xử lý thông báo lỗi khi cập nhật số lượng
  - Hiển thị alert với số lượng tối đa có thể chọn

#### Cart Component (`e-commerce/gomallclient/src/Component/Cart/Cart.jsx`)

- **Hàm `handleUpdateQuantity`**:
  - Kiểm tra inventory trước khi cập nhật
  - Hiển thị alert chi tiết nếu vượt quá tồn kho
  - Xử lý kết quả từ API với thông báo rõ ràng

## Ví dụ thông báo

### Alert khi thêm vào giỏ hàng:
```
Số lượng đã chọn (15) vượt quá số lượng tồn kho (10).

Bạn có thể thêm tối đa 10 sản phẩm.
```

### Alert khi cập nhật số lượng:
```
Số lượng đã chọn (8) vượt quá số lượng tồn kho (5).

Bạn có thể chọn tối đa 5 sản phẩm.
```

### Toast notification:
- **Title**: "Vượt quá tồn kho!"
- **Description**: "Chỉ có X sản phẩm trong kho"

## Tính năng bảo vệ

1. **Thông báo rõ ràng**: Hiển thị số lượng đã chọn và số lượng có sẵn
2. **Hướng dẫn cụ thể**: Cho biết số lượng tối đa có thể chọn
3. **Tự động điều chỉnh**: Điều chỉnh số lượng về mức tối đa khi vượt quá
4. **Đa dạng thông báo**: Alert + Toast notification để đảm bảo người dùng thấy

## Các trường hợp xử lý

### 1. Thêm sản phẩm mới vào giỏ hàng
- Kiểm tra số lượng muốn thêm vs tồn kho
- Hiển thị thông báo nếu vượt quá

### 2. Cập nhật số lượng sản phẩm đã có trong giỏ
- Kiểm tra số lượng mới vs tồn kho
- Tính toán số lượng có thể thêm dựa trên số lượng hiện tại

### 3. Mua ngay (Buy now)
- Kiểm tra số lượng vs tồn kho
- Hiển thị thông báo và điều chỉnh số lượng

## Files đã thay đổi
- `e-commerce/server/controllers/cartController.js`
- `e-commerce/gomallclient/src/Component/ProductDetail/ProductDetail.jsx`
- `e-commerce/gomallclient/src/contexts/CartContext.js`
- `e-commerce/gomallclient/src/Component/Cart/Cart.jsx`

## Lưu ý
- Alert hiển thị thông tin chi tiết và hướng dẫn cụ thể
- Toast notification bổ sung để đảm bảo người dùng thấy thông báo
- Tự động điều chỉnh số lượng về mức tối đa có thể
- Thông báo bằng tiếng Việt để dễ hiểu
