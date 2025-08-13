# Hệ thống Tối ưu hóa Hình ảnh

## Tổng quan

Hệ thống tối ưu hóa hình ảnh được thiết kế để giải quyết vấn đề hình ảnh bị request liên tục giữa client và server, thay vào đó sử dụng placeholder và cache để cải thiện hiệu suất.

## Các tính năng chính

### 1. Lazy Loading
- Hình ảnh chỉ được tải khi chúng xuất hiện trong viewport
- Sử dụng Intersection Observer API
- Có thể cấu hình margin để tải sớm hơn

### 2. Image Caching
- Cache hình ảnh đã tải thành công
- Theo dõi hình ảnh bị lỗi để tránh request lại
- Tự động sử dụng placeholder cho hình ảnh lỗi

### 3. Placeholder System
- Sử dụng SVG inline làm placeholder
- Có thể tùy chỉnh kích thước và text
- Không cần request thêm từ server

### 4. Error Handling
- Xử lý lỗi tải hình ảnh một cách thông minh
- Tránh infinite loop khi fallback cũng bị lỗi
- Logging để debug

## Cách sử dụng

### 1. Sử dụng OptimizedImage Component

```jsx
import OptimizedImage from '../utils/OptimizedImage';

// Cơ bản
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  className="my-image"
/>

// Với lazy loading
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  lazy={true}
  fallbackUrl="/images/default.jpg"
/>

// Với preload
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  preload={true}
  onLoad={() => console.log('Image loaded')}
  onError={(error) => console.error('Image failed:', error)}
/>
```

### 2. Sử dụng Utility Functions

```jsx
import { 
  getImageUrl, 
  preloadImage, 
  handleImageError,
  createPlaceholderUrl 
} from '../utils/imageUtils';

// Lấy URL hình ảnh với fallback
const imageUrl = getImageUrl('/uploads/product.jpg', '/default.jpg');

// Preload hình ảnh
preloadImage('/path/to/image.jpg')
  .then(() => console.log('Image preloaded'))
  .catch(error => console.error('Preload failed:', error));

// Tạo placeholder tùy chỉnh
const placeholder = createPlaceholderUrl(300, 200, 'Product Image');
```

### 3. Sử dụng Hooks

```jsx
import { useImageOptimization, useImagePreload } from '../hooks/useImageOptimization';

function MyComponent() {
  // Khởi tạo tối ưu hóa
  const { getCacheStats, clearImageCache } = useImageOptimization();
  
  // Preload danh sách hình ảnh
  useImagePreload([
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg'
  ]);
  
  return (
    <div>
      <OptimizedImage src="/image1.jpg" alt="Image 1" />
      <OptimizedImage src="/image2.jpg" alt="Image 2" />
    </div>
  );
}
```

## Cấu hình

### 1. Server URL
Trong `imageUtils.js`, bạn có thể thay đổi `SERVER_URL`:
```javascript
const SERVER_URL = 'http://localhost:8080';
```

### 2. Placeholder URL
Có thể tùy chỉnh placeholder mặc định:
```javascript
const PLACEHOLDER_URL = 'data:image/svg+xml;base64,...';
```

### 3. Lazy Loading Settings
Trong `OptimizedImage.jsx`:
```javascript
const observer = new IntersectionObserver(handleIntersection, {
  rootMargin: '50px', // Tải sớm 50px trước khi vào viewport
  threshold: 0.1      // Trigger khi 10% hình ảnh hiển thị
});
```

## Lợi ích

### 1. Hiệu suất
- Giảm số lượng request HTTP
- Tải hình ảnh theo nhu cầu
- Cache thông minh

### 2. Trải nghiệm người dùng
- Placeholder ngay lập tức
- Không có layout shift
- Loading animation mượt mà

### 3. Bảo trì
- Code sạch và tái sử dụng
- Error handling tập trung
- Dễ debug và monitor

## Monitoring

### 1. Cache Statistics
```javascript
import { getCacheStats } from '../utils/imageUtils';

const stats = getCacheStats();
console.log('Cached images:', stats.cached);
console.log('Failed images:', stats.failed);
```

### 2. Console Logs
- Warning khi hình ảnh lỗi
- Info khi preload thành công
- Error khi có vấn đề nghiêm trọng

## Best Practices

### 1. Sử dụng đúng kích thước
- Tải hình ảnh với kích thước phù hợp
- Sử dụng responsive images khi cần

### 2. Preload quan trọng
- Preload hình ảnh trên fold
- Preload hình ảnh trong navigation

### 3. Fallback strategy
- Luôn có fallback URL
- Sử dụng placeholder có ý nghĩa

### 4. Performance monitoring
- Theo dõi cache hit rate
- Monitor failed images
- Optimize based on usage patterns
