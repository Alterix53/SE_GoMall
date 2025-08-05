# 🎨 GoMall Color System

## 📋 Overview

Custom color system for GoMall e-commerce, built on Bootstrap with SCSS variables and CSS custom properties.

## 🚀 How to Use

### 1. Import SCSS
File `custom.scss` has been imported in `src/index.js`:
```javascript
import './scss/custom.scss';
```

### 2. Use Bootstrap Classes
```jsx
// Buttons
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-success">Success Button</button>
<button className="btn btn-warning">Warning Button</button>

// Badges
<span className="badge bg-primary">Primary Badge</span>
<span className="badge bg-success">Success Badge</span>

// Alerts
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
```

### 3. Use Custom Classes
```jsx
// Custom buttons
<button className="btn btn-flash-sale">Flash Sale</button>
<button className="btn btn-premium">Premium</button>

// Custom badges
<span className="badge flash-sale-badge">FLASH SALE</span>
<span className="badge premium-badge">PREMIUM</span>
<span className="badge trust-badge">TRUSTED</span>
<span className="badge fashion-badge">FASHION</span>

// Custom cards
<div className="card card-ecommerce">
  <div className="card-body">
    <h5 className="card-title">Product Name</h5>
    <p className="product-price">$99.99</p>
    <p className="product-discount">-20%</p>
  </div>
</div>

// Custom forms
<input className="form-control form-control-ecommerce" />

// Custom navbar
<nav className="navbar navbar-ecommerce">
  {/* Navbar content */}
</nav>
```

### 4. Use CSS Variables
```jsx
// Inline styles
<div style={{ color: 'var(--primary-color)' }}>
  Custom styled text
</div>

<div style={{ backgroundColor: 'var(--accent-orange)' }}>
  Orange background
</div>
```

## 🎨 Color Palette

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

## 🎯 Best Practices

### 1. Consistency
- Always use defined colors
- Don't hardcode new colors
- Use CSS variables when custom colors are needed

### 2. Accessibility
- Ensure sufficient contrast ratio
- Test with screen readers
- Use colors to support, not replace text

### 3. Branding
- Use primary color for logo and branding
- Accent colors for special features
- Consistent color usage across components

### 4. Emotion & Psychology
- **Orange**: Urgency, excitement (flash sales)
- **Green**: Success, trust, money
- **Blue**: Trust, security, information
- **Red**: Error, danger, stop
- **Purple**: Premium, luxury, creativity
- **Pink**: Fashion, beauty, feminine

## 🔧 Customization

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

## 📱 Responsive & Dark Mode

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

### Mobile Optimization
- All colors are responsive
- Touch-friendly button sizes
- Adequate contrast on mobile

## 🎨 Demo Component

To see full demo, import and use `ColorDemo` component:

```jsx
import ColorDemo from './Component/ColorDemo/ColorDemo';

// In App.js or route
<ColorDemo />
```

## 📁 File Structure

```
src/
├── scss/
│   └── custom.scss          # Main color definitions
├── Component/
│   └── ColorDemo/
│       ├── ColorDemo.jsx    # Demo component
│       └── ColorDemo.css    # Demo styles
└── scss/
    └── color-guide.md       # Detailed color guide
```

## 🚀 Quick Start Examples

### Product Card
```jsx
<div className="card card-ecommerce product-card-ecommerce">
  <img className="product-image" src="product.jpg" alt="Product" />
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

## 🔄 Migration Guide

### From Bootstrap Default
1. Replace hardcoded colors with CSS variables
2. Use custom classes instead of inline styles
3. Test contrast and accessibility

### From Custom Colors
1. Map existing colors to new palette
2. Update component styles
3. Test visual consistency

## 🎯 Performance

- CSS variables are optimized
- Minimal CSS bundle size
- Efficient color inheritance
- Browser caching friendly

## 🐛 Troubleshooting

### Colors not displaying correctly
- Check SCSS file import
- Clear browser cache
- Verify CSS variables syntax

### Bootstrap conflicts
- Ensure custom.scss imports after Bootstrap
- Check specificity conflicts
- Use `!important` sparingly

### Dark mode issues
- Test `prefers-color-scheme` media query
- Verify color contrast ratios
- Check browser compatibility 