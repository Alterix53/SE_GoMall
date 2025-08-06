# Cache System Documentation

## Tổng quan

Hệ thống cache đã được implement để tối ưu hiệu suất của ứng dụng e-commerce. Cache được lưu trữ trong localStorage của trình duyệt với thời gian sống (TTL) là 5 phút.

## Cấu trúc Cache

### 1. ProductCacheService (`src/utils/productCache.js`)

Service chính để quản lý cache cho tất cả API calls liên quan đến products.

**Các tính năng:**
- Cache tự động với TTL 5 phút
- Cache key được tạo dựa trên endpoint và parameters
- Tự động xóa cache hết hạn
- Hỗ trợ cache cho tất cả product APIs

**Các methods chính:**
```javascript
// Lấy tất cả products với cache
await productCacheService.getAllProducts(params)

// Lấy flash sale products với cache
await productCacheService.getFlashSaleProducts(params)

// Lấy top products với cache
await productCacheService.getTopProducts(params)

// Lấy product theo ID với cache
await productCacheService.getProductById(productId)

// Tìm kiếm products với cache
await productCacheService.searchProducts(searchParams)

// Xóa tất cả cache
productCacheService.clearCache()

// Xóa cache theo pattern
productCacheService.clearCacheByPattern(pattern)
```

### 2. Custom Hook (`src/hooks/useProductCache.js`)

Hook React để quản lý cache với loading state và error handling.

**Usage:**
```javascript
const { 
  getAllProducts, 
  getFlashSaleProducts, 
  getTopProducts,
  loading, 
  error,
  clearCache 
} = useProductCache();
```

### 3. Cache Manager Component (`src/Component/CacheManager/`)

Component UI để quản lý cache với các tính năng:
- Hiển thị thông tin cache (số lượng items, dung lượng)
- Xóa cache hết hạn
- Xóa tất cả cache
- Làm mới thông tin cache

### 4. Product Stats Component (`src/Component/ProductStats/`)

Component hiển thị thống kê products với API endpoint mới `/api/products/stats`.

## API Endpoints

### 1. Products API (với cache)

```
GET /api/products - Lấy tất cả products
GET /api/products/flash-sale - Lấy flash sale products  
GET /api/products/top-products - Lấy top products
GET /api/products/:id - Lấy product theo ID
GET /api/products/stats - Lấy thống kê products (mới)
```

### 2. Cache Management

Cache được quản lý tự động:
- **TTL**: 5 phút
- **Storage**: localStorage
- **Key format**: `product_cache_{endpoint}?{params}`
- **Auto cleanup**: Tự động xóa cache hết hạn

## Cách sử dụng

### 1. Trong Components

```javascript
import { useProductCache } from './hooks/useProductCache';

const MyComponent = () => {
  const { getAllProducts, loading, error } = useProductCache();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts();
        // Xử lý dữ liệu
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
    fetchData();
  }, []);
};
```

### 2. Cache Management

```javascript
import productCacheService from './utils/productCache';

// Xóa tất cả cache
productCacheService.clearCache();

// Xóa cache cho product cụ thể
productCacheService.invalidateProductCache(productId);

// Xóa cache theo pattern
productCacheService.clearCacheByPattern('flash-sale');
```

### 3. Cache Manager UI

```javascript
import CacheManager from './Component/CacheManager/CacheManager';

// Trong component
<CacheManager />
```

## Lợi ích

1. **Performance**: Giảm thời gian load dữ liệu
2. **Bandwidth**: Giảm số lượng API calls
3. **User Experience**: Tăng tốc độ phản hồi
4. **Server Load**: Giảm tải cho server
5. **Offline Support**: Dữ liệu vẫn có sẵn khi offline

## Monitoring

### Console Logs
Cache system log các hoạt động:
- `Cache hit for key: ...` - Cache được sử dụng
- `Cache set for key: ...` - Cache được tạo mới
- `Cache expired for key: ...` - Cache hết hạn
- `Product cache cleared` - Cache được xóa

### Cache Info
Component CacheManager hiển thị:
- Tổng số items cache
- Dung lượng cache
- Thời gian tạo cache cũ nhất/mới nhất

## Troubleshooting

### 1. Cache không hoạt động
- Kiểm tra localStorage có được enable không
- Kiểm tra console logs
- Thử clear cache và load lại

### 2. Dữ liệu không cập nhật
- Cache có thể đang sử dụng dữ liệu cũ
- Thử clear cache hoặc đợi TTL hết hạn
- Kiểm tra API response

### 3. Performance issues
- Kiểm tra dung lượng cache
- Xóa cache không cần thiết
- Điều chỉnh TTL nếu cần

## Configuration

### TTL (Time To Live)
```javascript
// Trong productCache.js
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

### Cache Key Prefix
```javascript
const CACHE_KEY_PREFIX = 'product_cache_';
```

## Future Improvements

1. **Redis Cache**: Implement server-side cache với Redis
2. **Cache Warming**: Pre-load cache cho popular products
3. **Smart Invalidation**: Invalidate cache thông minh hơn
4. **Compression**: Nén dữ liệu cache để tiết kiệm storage
5. **Analytics**: Track cache hit/miss rates 