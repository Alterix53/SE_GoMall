# Cart API Documentation

## Overview
Cart API được tích hợp với hệ thống authentication và lưu trữ dữ liệu trong MongoDB. API hỗ trợ đầy đủ các thao tác CRUD cho giỏ hàng.

## Authentication
Tất cả các endpoints đều yêu cầu authentication token trong header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get User Cart
```
GET /api/cart/me
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "cart_id",
      "userID": "user_id",
      "items": [
        {
          "productID": {
            "_id": "product_id",
            "name": "Product Name",
            "price": {
              "original": 1000000,
              "sale": 800000
            },
            "images": [...],
            "rating": 4.5,
            "sold": 100
          },
          "quantity": 2,
          "size": "M"
        }
      ],
      "totalAmount": 1600000
    },
    "totalItems": 1,
    "totalAmount": 1600000
  }
}
```

### 2. Add Item to Cart
```
POST /api/cart/add
```
**Body:**
```json
{
  "productID": "product_id",
  "quantity": 1,
  "size": "M"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đã thêm vào giỏ hàng",
  "data": {
    "cart": {...},
    "totalItems": 1,
    "totalAmount": 800000
  }
}
```

### 3. Update Cart Item Quantity
```
PUT /api/cart/update
```
**Body:**
```json
{
  "productID": "product_id",
  "quantity": 3,
  "size": "M"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đã cập nhật giỏ hàng",
  "data": {
    "cart": {...},
    "totalItems": 1,
    "totalAmount": 2400000
  }
}
```

### 4. Remove Item from Cart
```
DELETE /api/cart/remove
```
**Body:**
```json
{
  "productID": "product_id",
  "size": "M"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đã xóa sản phẩm khỏi giỏ hàng",
  "data": {
    "cart": {...},
    "totalItems": 0,
    "totalAmount": 0
  }
}
```

### 5. Clear Cart
```
DELETE /api/cart/clear
```
**Response:**
```json
{
  "success": true,
  "message": "Đã xóa toàn bộ giỏ hàng",
  "data": {
    "cart": {...},
    "totalItems": 0,
    "totalAmount": 0
  }
}
```

## Error Responses

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Product Not Found (404)
```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại"
}
```

### Invalid Quantity (400)
```json
{
  "success": false,
  "message": "Số lượng phải lớn hơn 0"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Lỗi server",
  "error": "Error details"
}
```

## Frontend Integration

### CartContext Usage
```javascript
import { useCart } from '../contexts/CartContext';

const { 
  cartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  loading,
  error 
} = useCart();

// Add to cart
await addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  size: selectedSize,
  quantity: 1
});

// Update quantity
await updateQuantity(productId, size, newQuantity);

// Remove item
await removeFromCart(productId, size);

// Clear cart
await clearCart();
```

## Features

### ✅ Implemented
- [x] Authentication middleware
- [x] CRUD operations for cart
- [x] Product validation
- [x] Size support for products
- [x] Automatic total calculation
- [x] Error handling
- [x] Frontend integration
- [x] Fallback to localStorage for non-authenticated users

### 🔄 Fallback Mechanism
- **Authenticated users**: Data stored in MongoDB
- **Non-authenticated users**: Data stored in localStorage
- **API errors**: Automatic fallback to localStorage

### 📊 Data Structure
```javascript
// Cart Item Structure
{
  id: "product_id",
  name: "Product Name", 
  price: 800000,
  image: "/images/product.jpg",
  quantity: 2,
  size: "M"
}

// Cart API Response
{
  cart: {
    userID: "user_id",
    items: [...],
    totalAmount: 1600000
  },
  totalItems: 1,
  totalAmount: 1600000
}
```

## Testing

Run the test file to verify API endpoints:
```bash
cd server
node test-cart.js
```

## Notes

1. **Authentication Required**: All cart operations require valid JWT token
2. **Size Support**: Products can have different sizes (S, M, L, XL, etc.)
3. **Price Calculation**: Automatically calculates total based on sale price or original price
4. **Error Handling**: Comprehensive error handling with meaningful messages
5. **Performance**: Optimized database queries with proper indexing 