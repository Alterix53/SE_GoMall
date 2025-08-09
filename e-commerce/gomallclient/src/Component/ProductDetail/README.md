# ProductDetail Component

Component hiển thị thông tin chi tiết sản phẩm với tích hợp API server.

## Tính năng

- ✅ Hiển thị thông tin sản phẩm từ server API
- ✅ Gallery ảnh với thumbnail và ảnh chính
- ✅ Thông tin giá, khuyến mãi, flash sale
- ✅ Lựa chọn biến thể sản phẩm (màu sắc, kích thước, dung lượng)
- ✅ Thêm vào giỏ hàng
- ✅ Thông tin shop/seller
- ✅ Đánh giá và review
- ✅ Responsive design với Tailwind CSS
- ✅ Loading và error states
- ✅ Modern UI với Shadcn components

## Cách sử dụng

```jsx
import ProductDetail from './Component/ProductDetail/ProductDetail';

// Sử dụng với React Router
<Route path="/product/:id" element={<ProductDetail />} />
```

## API Dependencies

Component này cần các API endpoints sau:

- `GET /api/products/:id` - Lấy thông tin chi tiết sản phẩm
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ hàng

## Cấu trúc dữ liệu mong đợi

```javascript
{
  "success": true,
  "data": {
    "product": {
      "_id": "product-id",
      "name": "Tên sản phẩm",
      "price": {
        "original": 100000,
        "sale": 80000
      },
      "images": [
        {
          "url": "/path/to/image.jpg",
          "alt": "Mô tả ảnh",
          "isPrimary": true
        }
      ],
      "rating": {
        "average": 4.5,
        "count": 150
      },
      "inventory": {
        "quantity": 50,
        "lowStockThreshold": 10
      },
      "specifications": [
        {
          "name": "color",
          "value": "Đen, Trắng, Xanh"
        }
      ],
      "description": "Mô tả sản phẩm",
      "tags": ["tag1", "tag2"],
      "isFlashSale": false,
      "sold": 100,
      "sellerID": {
        "name": "Shop name",
        "status": "active"
      }
    }
  }
}
```

## Components UI được sử dụng

- Badge
- Button
- Card, CardContent
- Input
- Label
- Progress
- RadioGroup, RadioGroupItem
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Separator
- Avatar, AvatarFallback

## Hooks và Utils

- `useToast` - Hiển thị thông báo
- `cn` - Utility để kết hợp class names
- `ApiService` - Service để gọi API

## Icons

Sử dụng `lucide-react` cho các icons:
- Star, StarHalf
- ShoppingCart, Heart, Share2
- ShieldCheck, Truck, RotateCcw
- Store, MessageCircle, Check
- Minus, Plus, MapPin, Tag
- Loader2, AlertCircle

## Styling

- Sử dụng Tailwind CSS classes
- Có fallback CSS trong `ProductDetail.css`
- Responsive design cho mobile, tablet, desktop

## Error Handling

- Loading state khi đang tải dữ liệu
- Error state khi không thể tải sản phẩm
- Fallback images khi không có ảnh sản phẩm
- Safe navigation với optional chaining

## Tối ưu hóa

- `useMemo` để tính toán giá và discount
- `useCallback` trong toast handler
- Lazy loading cho ảnh
- Error boundaries

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+