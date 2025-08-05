# 🎨 GoMall Color Guide

## 📋 Main Color Palette

### Primary Colors
- **Primary**: `#6366f1` (Indigo) - Main color
- **Secondary**: `#64748b` (Slate gray) - Secondary color
- **Success**: `#10b981` (Emerald green) - Success actions
- **Info**: `#3b82f6` (Blue) - Information
- **Warning**: `#f59e0b` (Amber) - Warnings
- **Danger**: `#ef4444` (Red) - Errors/danger

### Accent Colors (E-commerce)
- **Orange**: `#f97316` - Flash sales, promotions
- **Purple**: `#8b5cf6` - Premium features
- **Teal**: `#14b8a6` - Trust, security
- **Pink**: `#ec4899` - Fashion, beauty

## 🎯 How to Use

### 1. Bootstrap Classes (Automatic)
```html
<!-- Use Bootstrap classes directly -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-success">Success Button</button>
<button class="btn btn-warning">Warning Button</button>
```

### 2. CSS Variables (Flexible)
```css
/* Use CSS variables */
.my-custom-element {
  color: var(--primary-color);
  background: var(--accent-orange);
}
```

### 3. Custom Classes (Pre-defined)
```html
<!-- Flash sale badge -->
<span class="badge flash-sale-badge">FLASH SALE</span>

<!-- Premium product badge -->
<span class="badge premium-badge">PREMIUM</span>

<!-- Trust badge -->
<span class="badge trust-badge">TRUSTED</span>

<!-- Fashion badge -->
<span class="badge fashion-badge">FASHION</span>

<!-- Custom buttons -->
<button class="btn btn-flash-sale">Flash Sale</button>
<button class="btn btn-premium">Premium</button>

<!-- Custom cards -->
<div class="card card-ecommerce">
  <div class="card-body">
    <!-- Content -->
  </div>
</div>

<!-- Custom forms -->
<input class="form-control form-control-ecommerce" />

<!-- Custom navbar -->
<nav class="navbar navbar-ecommerce">
  <!-- Navbar content -->
</nav>
```

## 🎨 Real Examples

### Product Card
```jsx
<div className="card card-ecommerce product-card-ecommerce">
  <img className="product-image" src="product.jpg" />
  <div className="card-body">
    <h5 className="card-title">Product Name</h5>
    <span className="badge flash-sale-badge">FLASH SALE</span>
    <p className="product-price">$99.99</p>
    <p className="product-discount">-20%</p>
    <button className="btn btn-primary">Add to Cart</button>
  </div>
</div>
```

### Cart Icon with Badge
```jsx
<div className="cart-icon">
  <i className="fas fa-shopping-cart"></i>
  <span className="cart-badge">3</span>
</div>
```

### Alert Messages
```jsx
<div className="alert alert-success alert-ecommerce">
  Product added to cart successfully!
</div>
```

## 🔧 Additional Customization

### Add New Colors
```scss
// In custom.scss
$custom-color: #your-color;

:root {
  --custom-color: #{$custom-color};
}
```

### Gradient Backgrounds
```scss
.custom-gradient {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-purple));
}
```

### Hover Effects
```scss
.custom-hover {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
```

## 📱 Responsive Colors

### Dark Mode Support
```scss
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #818cf8; // Lighter version
    --body-bg: #1e293b;
    --body-color: #f1f5f9;
  }
}
```

## 🎯 Best Practices

1. **Consistency**: Always use defined colors
2. **Accessibility**: Ensure sufficient contrast ratio
3. **Branding**: Use primary color for logo and branding
4. **Hierarchy**: Use colors to create information hierarchy
5. **Emotion**: Use colors to convey emotions (orange = urgency, green = success)

## 🚀 Quick Start

1. Import SCSS in component:
```jsx
import '../scss/custom.scss';
```

2. Use available classes:
```jsx
<button className="btn btn-flash-sale">Buy Now</button>
```

3. Or use CSS variables:
```jsx
<div style={{ color: 'var(--primary-color)' }}>
  Custom styled text
</div>
``` 