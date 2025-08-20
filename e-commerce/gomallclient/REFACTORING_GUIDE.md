# 🏗️ GoMall Codebase Refactoring Guide

## 📋 Overview

This document outlines the refactored structure of the GoMall e-commerce application, providing a cleaner, more maintainable, and scalable codebase.

## 🗂️ New Directory Structure

```
src/
├── components/           # Shared UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   └── layout/          # Layout components
├── Component/           # Feature-specific components
│   ├── Admin/           # Admin panel components
│   ├── Auth/            # Authentication components
│   ├── Cart/            # Shopping cart components
│   ├── Product/         # Product-related components
│   └── User/            # User profile components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and services
│   ├── api/             # API services
│   ├── helpers/         # Helper functions
│   ├── constants/       # Application constants
│   └── services/        # Business logic services
├── styles/              # Global styles and themes
└── pages/               # Page components (if using page-based routing)
```

## 🔧 Key Improvements

### 1. **Centralized API Management**

**Before:**
```javascript
// Scattered API calls across components
import { apiService } from '../utils/api';
import { adminAPI } from '../utils/api';
```

**After:**
```javascript
// Centralized API imports
import { authAPI, userAPI, productAPI, adminAPI } from '../utils/api';
```

**Benefits:**
- ✅ Single source of truth for all API calls
- ✅ Consistent error handling
- ✅ Easy to maintain and update
- ✅ Better TypeScript support

### 2. **Organized Constants**

**Before:**
```javascript
// Hardcoded values scattered throughout code
const API_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'token';
```

**After:**
```javascript
// Centralized constants
import { API_CONFIG, AUTH_CONFIG, USER_ROLES } from '../utils/constants';

// Usage
localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
```

**Benefits:**
- ✅ No more magic strings
- ✅ Easy to change values globally
- ✅ Better maintainability
- ✅ Prevents typos

### 3. **Utility Functions**

**Before:**
```javascript
// Duplicate utility functions across files
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
```

**After:**
```javascript
// Centralized utility functions
import { formatCurrency, formatDate, truncateText } from '../utils/helpers';

// Usage
formatCurrency(1000000); // "1,000,000 ₫"
```

**Benefits:**
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ Consistent formatting across the app
- ✅ Easy to test and maintain
- ✅ Reusable across components

### 4. **Enhanced Authentication**

**Before:**
```javascript
// Basic logout
const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
};
```

**After:**
```javascript
// Enhanced logout with proper cleanup
import { logoutWithNavigation } from '../contexts/AuthContext';

const handleLogout = async () => {
  const result = await logoutWithNavigation(navigate, isAdmin);
  // Automatic cleanup, navigation, and error handling
};
```

**Benefits:**
- ✅ Proper cleanup of all auth data
- ✅ Automatic navigation
- ✅ Error handling
- ✅ Activity tracking
- ✅ Auto-logout on inactivity

## 📚 Migration Guide

### For Existing Components

#### 1. **Update API Imports**

**Old:**
```javascript
import { apiService } from '../utils/api';
import { adminAPI } from '../utils/api';
```

**New:**
```javascript
import { authAPI, userAPI, productAPI, adminAPI } from '../utils/api';
```

#### 2. **Update Constants Usage**

**Old:**
```javascript
localStorage.setItem('token', token);
if (user.role === 'admin') { ... }
```

**New:**
```javascript
import { AUTH_CONFIG, USER_ROLES } from '../utils/constants';

localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
if (user.role === USER_ROLES.ADMIN) { ... }
```

#### 3. **Use Helper Functions**

**Old:**
```javascript
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
```

**New:**
```javascript
import { formatCurrency } from '../utils/helpers';

const price = formatCurrency(product.price);
```

#### 4. **Update Authentication**

**Old:**
```javascript
const { logout } = useAuth();
logout();
```

**New:**
```javascript
const { logoutWithNavigation } = useAuth();

const handleLogout = async () => {
  await logoutWithNavigation(navigate, isAdmin);
};
```

## 🎯 Best Practices

### 1. **Import Organization**

```javascript
// 1. React and third-party libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal utilities and constants
import { formatCurrency, formatDate } from '../utils/helpers';
import { USER_ROLES, ORDER_STATUS } from '../utils/constants';

// 3. API services
import { productAPI, userAPI } from '../utils/api';

// 4. Contexts and hooks
import { useAuth } from '../contexts/AuthContext';

// 5. Components
import ProductCard from '../components/ProductCard';
```

### 2. **Error Handling**

```javascript
try {
  const response = await productAPI.getProductById(id);
  setProduct(response.data);
} catch (error) {
  console.error('Error fetching product:', error);
  // Use centralized error handling
  showNotification('error', ERROR_MESSAGES.NOT_FOUND);
}
```

### 3. **Loading States**

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await api.getData();
    setData(data);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};
```

### 4. **Form Validation**

```javascript
import { VALIDATION_MESSAGES } from '../utils/constants';

const validateForm = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEmail(values.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL;
  }
  
  return errors;
};
```

## 🔄 Migration Checklist

### Phase 1: Core Infrastructure ✅
- [x] Centralized API services
- [x] Constants organization
- [x] Helper functions
- [x] Enhanced authentication

### Phase 2: Component Updates
- [ ] Update Admin components
- [ ] Update User components
- [ ] Update Product components
- [ ] Update Cart components

### Phase 3: Testing & Optimization
- [ ] Unit tests for utilities
- [ ] Integration tests for API services
- [ ] Performance optimization
- [ ] Code documentation

## 🚀 Getting Started

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start Development Server**
```bash
# For PowerShell
cd e-commerce/gomallclient
npm start

# For Command Prompt
cd e-commerce/gomallclient && npm start
```

### 3. **Run Tests**
```bash
npm test
```

## 📖 API Documentation

### Authentication API
```javascript
import { authAPI } from '../utils/api';

// Login
const result = await authAPI.login(email, password);

// Admin Login
const result = await authAPI.loginAdmin(username, password);

// Logout
const result = await authAPI.logout(token, isAdmin);
```

### Product API
```javascript
import { productAPI } from '../utils/api';

// Get products
const products = await productAPI.getProducts({ page: 1, limit: 10 });

// Get product by ID
const product = await productAPI.getProductById(id);

// Get flash sale products
const flashSaleProducts = await productAPI.getFlashSaleProducts();
```

### Admin API
```javascript
import { adminAPI } from '../utils/api';

// Dashboard stats
const stats = await adminAPI.getDashboardStats(token);

// User management
const users = await adminAPI.getAllUsers(token, { page: 1, limit: 10 });

// Product management
const products = await adminAPI.getAllProducts(token, { status: 'active' });
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Import Errors**
```javascript
// Error: Cannot find module '../utils/api'
// Solution: Update import path
import { authAPI } from '../utils/api/index.js';
```

#### 2. **PowerShell Command Issues**
```powershell
# Error: The token '&&' is not a valid statement separator
# Solution: Use semicolon instead
cd e-commerce/gomallclient; npm start
```

#### 3. **API Response Format**
```javascript
// Old format
const response = await api.get('/products');
const products = response.data.data;

// New format
const products = await productAPI.getProducts();
```

## 📞 Support

For questions or issues with the refactored codebase:

1. Check this documentation first
2. Review the migration guide
3. Check existing components for examples
4. Create an issue with detailed description

---

**Happy Coding! 🎉**
