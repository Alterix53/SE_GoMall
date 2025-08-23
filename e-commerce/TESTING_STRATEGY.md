# 🧪 Complete Testing Strategy for GoMall E-commerce

## 📋 Overview

This document outlines a comprehensive testing strategy for the GoMall e-commerce application, covering all testing levels from unit tests to end-to-end scenarios. The strategy ensures robust functionality while maintaining development velocity.

## 🏗️ Architecture Overview

- **Frontend**: React 18 with React Router, Context API, Bootstrap
- **Backend**: Node.js/Express with MongoDB (Mongoose)
- **Authentication**: JWT-based with role-based access control
- **File Storage**: Cloudinary for images
- **Payment**: Integration ready (stripe/paypal)

---

## 1. 🧩 Unit Testing Strategy

### Frontend Unit Tests

#### 1.1 Component Testing
```javascript
// Example: ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 99.99,
  images: ['test-image.jpg'],
  flashSale: { discount: 20 }
};

describe('ProductCard Component', () => {
  test('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('shows flash sale badge when applicable', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });
});
```

#### 1.2 Hook Testing
```javascript
// Example: useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../contexts/AuthContext';

describe('useAuth Hook', () => {
  test('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  test('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.login('test@example.com', 'password');
      expect(response.success).toBe(true);
    });
  });
});
```

#### 1.3 Utility Function Testing
```javascript
// Example: apiService.test.js
import { authAPI, productAPI } from '../utils/api';

describe('API Services', () => {
  test('authAPI.login should handle successful login', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          token: 'mock-token',
          user: { _id: '1', email: 'test@example.com' }
        }
      }
    };
    
    // Mock axios
    jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
    
    const result = await authAPI.login('test@example.com', 'password');
    expect(result.data.success).toBe(true);
  });
});
```

### Backend Unit Tests

#### 1.4 Controller Testing
```javascript
// Example: authController.test.js
import request from 'supertest';
import app from '../Server.js';
import User from '../models/User.js';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/register should create new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123',
      fullName: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });

  test('POST /api/auth/login should authenticate user', async () => {
    // First create a user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123',
      fullName: 'Test User'
    };
    
    await request(app).post('/api/auth/register').send(userData);

    // Then test login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

#### 1.5 Service Layer Testing
```javascript
// Example: productService.test.js
import productService from '../services/productService.js';
import Product from '../models/Product.js';

describe('Product Service', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  test('getFlashSaleProducts should return active flash sale products', async () => {
    // Create test products with flash sale data
    const flashSaleProduct = new Product({
      name: 'Flash Sale Item',
      price: 100,
      flashSale: {
        isActive: true,
        discount: 20,
        startDate: new Date(Date.now() - 86400000), // 1 day ago
        endDate: new Date(Date.now() + 86400000)    // 1 day from now
      }
    });
    await flashSaleProduct.save();

    const result = await productService.getFlashSaleProducts({});
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe('Flash Sale Item');
  });
});
```
