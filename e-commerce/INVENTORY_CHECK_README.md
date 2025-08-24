# Inventory Check Implementation

## Tổng quan

Đã thêm logic kiểm tra số lượng tồn kho khi thêm vào giỏ hàng để tránh trường hợp người dùng thêm quá số lượng có sẵn hoặc thêm sản phẩm đã hết hàng.

## Các thay đổi chính

### 1. Server-side (Backend)

#### Cart Controller (`e-commerce/server/controllers/cartController.js`)

- **Hàm `addToCart`**: 
  - Kiểm tra sản phẩm có tồn tại và active không
  - Kiểm tra số lượng tồn kho trước khi thêm vào giỏ hàng
  - Tính toán tổng số lượng (số lượng hiện tại trong giỏ + số lượng muốn thêm)
  - Trả về lỗi nếu vượt quá số lượng tồn kho
  - Trả về thông tin số lượng còn lại sau khi thêm

- **Hàm `updateCartItem`**:
  - Kiểm tra số lượng tồn kho khi cập nhật số lượng trong giỏ hàng
  - Trả về lỗi nếu số lượng mới vượt quá tồn kho

- **Hàm `checkProductInventory`** (mới):
  - API endpoint để kiểm tra số lượng tồn kho của sản phẩm
  - Không cần authentication
  - Trả về thông tin chi tiết về inventory

#### Cart Routes (`e-commerce/server/routes/cartRoutes.js`)

- Thêm route `GET /api/cart/inventory/:productID` để kiểm tra inventory
- Route này không cần authentication

### 2. Client-side (Frontend)

#### Cart Context (`e-commerce/gomallclient/src/contexts/CartContext.js`)

- **Hàm `addToCart`**: 
  - Xử lý lỗi inventory từ server
  - Trả về thông tin chi tiết về lỗi
  - Cập nhật state dựa trên kết quả

- **Hàm `updateQuantity`**:
  - Xử lý lỗi inventory khi cập nhật số lượng
  - Trả về thông tin chi tiết về lỗi

- **Hàm `checkProductInventory`** (mới):
  - Gọi API để kiểm tra số lượng tồn kho
  - Trả về thông tin inventory

#### Product Detail (`e-commerce/gomallclient/src/Component/ProductDetail/ProductDetail.jsx`)

- **State mới**:
  - `maxQuantity`: Số lượng tối đa có thể thêm
  - `isAddingToCart`: Trạng thái loading khi thêm vào giỏ hàng

- **Logic kiểm tra inventory**:
  - Kiểm tra inventory khi load sản phẩm
  - Giới hạn số lượng tối đa bằng `maxQuantity`
  - Kiểm tra lại inventory trước khi thêm vào giỏ hàng
  - Hiển thị thông báo lỗi nếu không đủ hàng

- **UI cập nhật**:
  - Quantity selector giới hạn số lượng tối đa
  - Button "Add to cart" hiển thị trạng thái loading
  - Disable buttons khi hết hàng
  - Hiển thị số lượng có sẵn thay vì số lượng từ product data

#### Cart Component (`e-commerce/gomallclient/src/Component/Cart/Cart.jsx`)

- **Hàm `handleUpdateQuantity`**:
  - Kiểm tra inventory trước khi cập nhật số lượng
  - Hiển thị thông báo lỗi nếu vượt quá tồn kho
  - Xử lý kết quả từ API update

## API Endpoints

### 1. Kiểm tra inventory
```
GET /api/cart/inventory/:productID
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productID": "product-id",
    "availableQuantity": 10,
    "isInStock": true,
    "productName": "Product Name"
  }
}
```

### 2. Thêm vào giỏ hàng (cập nhật)
```
POST /api/cart/add
```

**Error Response (khi vượt quá tồn kho):**
```json
{
  "success": false,
  "message": "Only 5 items available in stock",
  "data": {
    "availableQuantity": 5,
    "requestedQuantity": 10,
    "currentCartQuantity": 2
  }
}
```

## Tính năng bảo vệ

1. **Kiểm tra real-time**: Mỗi lần thêm vào giỏ hàng đều kiểm tra lại số lượng tồn kho
2. **Giới hạn UI**: Số lượng không thể vượt quá tồn kho trong quantity selector
3. **Thông báo rõ ràng**: Hiển thị thông báo lỗi chi tiết khi không đủ hàng
4. **Fallback**: Nếu API lỗi, vẫn có thể sử dụng localStorage cho guest users

## Lưu ý

- Logic này đảm bảo rằng người dùng không thể thêm quá số lượng tồn kho
- Kiểm tra được thực hiện cả ở client và server để đảm bảo tính nhất quán
- Thông tin inventory được cập nhật real-time khi có thay đổi
