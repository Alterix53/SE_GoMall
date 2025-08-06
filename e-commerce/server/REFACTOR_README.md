# Refactor: Tách Controller và Service Layer

## Tổng quan

Đã refactor hệ thống để tách biệt logic xử lý HTTP (Controller) và business logic (Service) theo nguyên tắc **Single Responsibility Principle**.

## Cấu trúc mới

### 1. **Service Layer** (`/services/`)
Chứa business logic và tương tác với database:

- **`productService.js`**: Xử lý logic sản phẩm
- **`userService.js`**: Xử lý logic người dùng  
- **`adminService.js`**: Xử lý logic admin

### 2. **Controller Layer** (`/controllers/`)
Chỉ xử lý HTTP request/response:

- **`productController.js`**: API endpoints cho sản phẩm
- **`userController.js`**: API endpoints cho người dùng
- **`adminController.js`**: API endpoints cho admin

### 3. **Utility Layer** (`/utils/`)
Cung cấp các utility functions:

- **`responseHandler.js`**: Xử lý response và error handling

## Lợi ích của refactor

### ✅ **Separation of Concerns**
- Controller chỉ xử lý HTTP
- Service chứa business logic
- Dễ test và maintain

### ✅ **Reusability**
- Service có thể được sử dụng bởi nhiều controller
- Logic được tái sử dụng

### ✅ **Testability**
- Có thể test business logic độc lập
- Mock service trong controller tests

### ✅ **Maintainability**
- Code dễ đọc và hiểu
- Dễ thêm tính năng mới

## Cách sử dụng

### Service Layer
```javascript
// Trong service
class ProductService {
    async getAllProducts(query) {
        // Business logic here
        return { products, pagination };
    }
}
```

### Controller Layer
```javascript
// Trong controller
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    ResponseHandler.success(res, result, "Thành công");
});
```

### Response Handler
```javascript
// Success response
ResponseHandler.success(res, data, message, statusCode);

// Error response
ResponseHandler.error(res, message, statusCode, error);

// Async handler với error catching
ResponseHandler.asyncHandler(async (req, res) => {
    // Controller logic
});
```

## Cấu trúc Package Diagram mới

```
APPLICATION LAYER (Server Tier)
├── API Controllers Package
│   ├── productController.js
│   ├── userController.js
│   └── adminController.js
├── Business Services Package
│   ├── productService.js
│   ├── userService.js
│   └── adminService.js
├── Utilities Package
│   └── responseHandler.js
└── Configuration Package
    ├── database.js
    └── Server.js
```

## Migration Guide

### Trước refactor:
```javascript
// Controller chứa cả HTTP và business logic
export const getAllProducts = async (req, res) => {
    try {
        // HTTP handling
        const { page, limit } = req.query;
        
        // Business logic
        const filter = { isActive: true };
        const products = await Product.find(filter);
        
        // Response handling
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

### Sau refactor:
```javascript
// Service: Business logic
class ProductService {
    async getAllProducts(query) {
        const filter = this.buildFilter(query);
        const products = await Product.find(filter);
        return { products, pagination };
    }
}

// Controller: HTTP handling
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    ResponseHandler.success(res, result);
});
```

## Best Practices

1. **Service Layer**:
   - Chứa business logic
   - Không xử lý HTTP
   - Có thể được test độc lập

2. **Controller Layer**:
   - Chỉ xử lý HTTP request/response
   - Sử dụng service để lấy data
   - Sử dụng ResponseHandler cho consistency

3. **Error Handling**:
   - Service throw errors
   - Controller catch và format response
   - ResponseHandler xử lý common errors

4. **Validation**:
   - Input validation trong controller
   - Business validation trong service

## Testing

### Service Testing
```javascript
describe('ProductService', () => {
    it('should return products with pagination', async () => {
        const result = await productService.getAllProducts({ page: 1, limit: 10 });
        expect(result.products).toBeDefined();
        expect(result.pagination).toBeDefined();
    });
});
```

### Controller Testing
```javascript
describe('ProductController', () => {
    it('should return 200 for valid request', async () => {
        const req = { query: { page: 1, limit: 10 } };
        const res = mockResponse();
        
        await getAllProducts(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
``` 