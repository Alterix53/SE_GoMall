# React Component Test Environment

Môi trường test component React với khả năng tự động load và hiển thị components.

## 🚀 Cách sử dụng

### 1. Chạy ứng dụng
```bash
cd Test
npm install
npm start
```

### 2. Truy cập các trang test
- **Home**: Trang chủ với tổng quan
- **Component Test**: Test component với drag & drop
- **Layout Test**: Test layout arrangements
- **Responsive Test**: Test responsive design
- **🔄 Auto Test**: **Tự động load và hiển thị components**

## 📦 Thêm component mới

### Cách 1: Copy thủ công
1. Copy component từ `gomallclient/src/Component/` sang `Test/src/components/`
2. Import trong `ComponentRegistry.js`:
```javascript
import YourComponent from './YourComponent';
```
3. Thêm vào registry:
```javascript
'YourComponent': {
  component: YourComponent,
  name: 'Your Component Name',
  description: 'Description',
  category: 'Your Category',
  defaultProps: { /* props */ },
  variants: [
    { name: 'Variant 1', props: { /* props */ } }
  ]
}
```

### Cách 2: Sử dụng script tự động
```bash
cd Test/scripts
node copy-component.js Navbar
```

Script sẽ:
- Copy tất cả files của component
- Tự động update ComponentRegistry.js
- Component sẽ xuất hiện ngay lập tức trong Auto Test

## 🎯 Tính năng chính

### Auto Component Loader
- **Tự động load**: Components được thêm vào registry sẽ tự động hiển thị
- **Variant testing**: Test nhiều biến thể của component
- **Live preview**: Xem component với props thực tế
- **Props inspection**: Xem và chỉnh sửa props

### Component Registry
- **Centralized management**: Quản lý tất cả components ở một nơi
- **Category organization**: Phân loại components theo category
- **Variant system**: Hỗ trợ nhiều biến thể cho mỗi component

## 📁 Cấu trúc thư mục

```
Test/
├── src/
│   ├── components/
│   │   ├── ComponentRegistry.js    # Registry chính
│   │   ├── AutoComponentLoader.js  # Auto loader
│   │   ├── TestButton.js          # Component mẫu
│   │   ├── TestCard.js            # Component mẫu
│   │   ├── TestInput.js           # Component mẫu
│   │   └── TestNavbar.js          # Component mẫu
│   ├── pages/
│   │   ├── AutoTestPage.js        # Trang auto test
│   │   └── ...                    # Các trang khác
│   └── App.js
├── scripts/
│   └── copy-component.js           # Script copy component
└── README.md
```

## 🔧 Tùy chỉnh

### Thêm component mới
1. Copy component vào `src/components/`
2. Import trong `ComponentRegistry.js`
3. Đăng ký trong `componentRegistry`
4. Refresh trang Auto Test

### Tạo variant mới
```javascript
variants: [
  { name: 'Default', props: { /* default props */ } },
  { name: 'Custom', props: { /* custom props */ } }
]
```

### Thêm category mới
Components được phân loại theo category:
- Basic: Button, Input, etc.
- Layout: Card, Container, etc.
- Navigation: Navbar, Menu, etc.
- Form: Form elements
- Custom: Your custom components

## 🎨 Ví dụ sử dụng

### Test Navbar component
1. Copy Navbar từ gomallclient
2. Đăng ký trong registry với variants:
   - Light theme
   - Dark theme
   - Primary theme
   - Minimal version
3. Test tất cả variants trong Auto Test page

### Test Button component
1. Tạo TestButton với nhiều variants
2. Test responsive behavior
3. Test different props combinations

## 🚀 Tips

- **Hot reload**: Thay đổi registry sẽ tự động reload
- **Props testing**: Click vào variant để test props khác nhau
- **Responsive testing**: Sử dụng Responsive Test page
- **Layout testing**: Sử dụng Layout Test page cho layout arrangements

## 📝 Lưu ý

- Đảm bảo component không có dependencies phức tạp
- CSS conflicts có thể xảy ra, cần namespace
- Context providers cần được mock trong test environment
- Router dependencies cần được handle riêng 