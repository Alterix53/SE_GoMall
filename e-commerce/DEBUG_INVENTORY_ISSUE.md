# Debug Inventory Issue

## Vấn đề
Mặc dù trên màn hình hiển thị vẫn còn 1 sản phẩm nhưng khi bấm add to cart lại hiện thông báo hết sản phẩm.

## Nguyên nhân
1. **API Inventory không hoạt động**: Route `/api/cart/inventory/:productID` bị lỗi 404 do server chưa restart sau khi thêm route mới.
2. **Fallback logic chưa hoàn chỉnh**: Khi API inventory fail, client không có fallback logic để sử dụng dữ liệu inventory từ product.

## Giải pháp đã thực hiện

### 1. Server-side
- ✅ Thêm route `GET /api/cart/inventory/:productID` trong `cartRoutes.js`
- ✅ Thêm hàm `checkProductInventory` trong `cartController.js`
- ✅ Route được đặt trước middleware authentication để không cần auth
- ✅ Restart server để áp dụng thay đổi

### 2. Client-side
- ✅ Cập nhật `CartContext.js` để có hàm `checkProductInventory`
- ✅ Cập nhật `ProductDetail.jsx` để kiểm tra inventory khi load sản phẩm
- ✅ Thêm fallback logic: nếu API inventory fail, sử dụng `product.inventory.quantity`
- ✅ Cập nhật logic trong `onAddToCart` và `onBuyNow` để xử lý trường hợp inventory check fail

## Cách test

### 1. Test API trực tiếp
```bash
# Test với product ID thực
curl http://localhost:8080/api/cart/inventory/68aafc3d6b7722dadff351a8

# Expected response:
{
  "success": true,
  "data": {
    "productID": "68aafc3d6b7722dadff351a8",
    "availableQuantity": 10,
    "isInStock": true,
    "productName": "Sách thể thao"
  }
}
```

### 2. Test trong browser
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Load trang product detail
4. Kiểm tra logs:
   - `🔍 Checking inventory for product: [productID]`
   - `📦 Inventory response: [response]`
   - `✅ Inventory check successful: [data]`

### 3. Test add to cart
1. Chọn số lượng sản phẩm
2. Bấm "Add to cart"
3. Kiểm tra:
   - Toast notification hiển thị đúng
   - Số lượng được cập nhật chính xác
   - Không có lỗi 404 trong console

## Debug steps

### Nếu vẫn có lỗi 404:
1. Kiểm tra server có đang chạy không:
   ```bash
   netstat -ano | findstr :8080
   ```

2. Restart server:
   ```bash
   # Kill process
   taskkill /F /PID [PID]
   
   # Start server
   npm start
   ```

3. Test API:
   ```bash
   curl http://localhost:8080/api/cart/inventory/test
   ```

### Nếu API hoạt động nhưng client vẫn lỗi:
1. Kiểm tra console logs trong browser
2. Kiểm tra network tab để xem API calls
3. Kiểm tra xem có CORS error không

### Nếu inventory hiển thị sai:
1. Kiểm tra `product.inventory.quantity` trong database
2. Kiểm tra logic fallback trong `ProductDetail.jsx`
3. Kiểm tra `maxQuantity` state có được cập nhật đúng không

## Files đã thay đổi
- `e-commerce/server/routes/cartRoutes.js`
- `e-commerce/server/controllers/cartController.js`
- `e-commerce/gomallclient/src/contexts/CartContext.js`
- `e-commerce/gomallclient/src/Component/ProductDetail/ProductDetail.jsx`
- `e-commerce/gomallclient/src/Component/Cart/Cart.jsx`

## Lưu ý
- Server cần restart sau khi thay đổi routes
- API inventory không cần authentication
- Fallback logic sử dụng `product.inventory.quantity` khi API fail
- Console logs sẽ hiển thị chi tiết quá trình check inventory
