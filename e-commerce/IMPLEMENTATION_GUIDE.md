# 🚀 Testing Implementation Guide for GoMall

## 📋 Quick Implementation Steps

This guide provides step-by-step instructions to implement the testing strategy for your GoMall e-commerce application.

---

## Step 1: Install Testing Dependencies

### Frontend Dependencies
```bash
cd e-commerce/gomallclient
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event jest jest-environment-jsdom
```

### Backend Dependencies
```bash
cd e-commerce/server
npm install --save-dev jest supertest @types/jest mongodb-memory-server
```

### E2E Dependencies
```bash
npm install --save-dev @playwright/test
npx playwright install
```

---

## Step 2: Create Configuration Files

### Frontend Jest Configuration
```javascript
// e-commerce/gomallclient/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Backend Jest Configuration
```javascript
// e-commerce/server/jest.config.js
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/controllers/**/*.test.js',
    '<rootDir>/services/**/*.test.js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Playwright Configuration
```javascript
// e-commerce/playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'cd e-commerce/gomallclient && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## Step 3: Create Test Setup Files

### Frontend Test Setup
```javascript
// e-commerce/gomallclient/src/setupTests.js
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Backend Test Setup
```javascript
// e-commerce/server/test/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
```

---

## Step 4: Create Mock Files

### File Mock for Images
```javascript
// e-commerce/gomallclient/src/__mocks__/fileMock.js
module.exports = 'test-file-stub';
```

---

## Step 5: Create Sample Test Files

### Frontend Component Test
```javascript
// e-commerce/gomallclient/src/Component/ProductCard/ProductCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 99.99,
  images: ['test-image.jpg'],
  flashSale: { 
    isActive: true,
    discount: 20 
  },
  description: 'Test product description'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  test('renders product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test product description')).toBeInTheDocument();
  });

  test('shows flash sale badge when applicable', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  test('does not show flash sale badge when inactive', () => {
    const productWithoutFlashSale = {
      ...mockProduct,
      flashSale: { isActive: false, discount: 20 }
    };
    
    renderWithRouter(<ProductCard product={productWithoutFlashSale} />);
    
    expect(screen.queryByText('20% OFF')).not.toBeInTheDocument();
  });

  test('handles add to cart click', () => {
    const mockAddToCart = jest.fn();
    renderWithRouter(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );
    
    const addToCartButton = screen.getByText(/add to cart/i);
    fireEvent.click(addToCartButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct._id);
  });
});
```

### Backend Controller Test
```javascript
// e-commerce/server/controllers/authController.test.js
import request from 'supertest';
import app from '../Server.js';
import User from '../models/User.js';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    test('should create new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        fullName: 'Test User',
        phoneNumber: '1234567890',
        address: '123 Test St'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.token).toBeDefined();
    });

    test('should reject duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        fullName: 'Test User'
      };

      // Create first user
      await request(app).post('/api/auth/register').send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    test('should validate required fields', async () => {
      const invalidUserData = {
        username: 'testuser',
        // Missing email and password
        fullName: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
        fullName: 'Test User'
      };
      await request(app).post('/api/auth/register').send(userData);
    });

    test('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    test('should reject incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
```

### Integration Test
```javascript
// e-commerce/server/test/integration/cart.integration.test.js
import request from 'supertest';
import app from '../../Server.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Cart from '../../models/Cart.js';

describe('Cart Integration Tests', () => {
  let authToken;
  let productId;
  let userId;

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'carttest',
        email: 'cart@test.com',
        password: 'TestPass123',
        fullName: 'Cart Test User'
      });
    
    authToken = userResponse.body.data.token;
    userId = userResponse.body.data.user._id;

    // Create test product
    const product = new Product({
      name: 'Test Product',
      price: 50,
      stock: 10,
      sellerID: userId,
      description: 'Test product for cart testing'
    });
    await product.save();
    productId = product._id;
  });

  test('Complete cart workflow', async () => {
    // 1. Add item to cart
    const addResponse = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productID: productId,
        quantity: 2,
        size: 'M'
      });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.success).toBe(true);

    // 2. Get cart contents
    const getCartResponse = await request(app)
      .get('/api/cart/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getCartResponse.status).toBe(200);
    expect(getCartResponse.body.data.items).toHaveLength(1);
    expect(getCartResponse.body.data.items[0].quantity).toBe(2);

    // 3. Update cart item
    const updateResponse = await request(app)
      .put('/api/cart/update')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productID: productId,
        quantity: 3,
        size: 'M'
      });

    expect(updateResponse.status).toBe(200);

    // 4. Verify update
    const updatedCartResponse = await request(app)
      .get('/api/cart/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(updatedCartResponse.body.data.items[0].quantity).toBe(3);

    // 5. Remove item from cart
    const removeResponse = await request(app)
      .delete('/api/cart/remove')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productID: productId });

    expect(removeResponse.status).toBe(200);

    // 6. Verify removal
    const emptyCartResponse = await request(app)
      .get('/api/cart/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(emptyCartResponse.body.data.items).toHaveLength(0);
  });

  test('should handle unauthorized cart access', async () => {
    const response = await request(app)
      .get('/api/cart/me');

    expect(response.status).toBe(401);
  });
});
```

### E2E Test
```javascript
// e-commerce/e2e/customer-purchase.e2e.test.js
import { test, expect } from '@playwright/test';

test.describe('Customer Purchase Flow', () => {
  test('Complete purchase journey', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('GoMall');

    // 2. Browse products
    await page.waitForSelector('[data-testid="product-card"]');
    await page.click('[data-testid="product-card"]:first-child');
    
    // 3. Verify product detail page
    await expect(page.locator('.product-detail')).toBeVisible();

    // 4. Add to cart
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('.cart-notification')).toBeVisible();

    // 5. View cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('.cart-items')).toBeVisible();

    // 6. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page.locator('.checkout-form')).toBeVisible();

    // 7. Fill shipping information
    await page.fill('[data-testid="shipping-name"]', 'John Doe');
    await page.fill('[data-testid="shipping-address"]', '123 Test St');
    await page.fill('[data-testid="shipping-phone"]', '1234567890');

    // 8. Complete order (mock payment)
    await page.click('[data-testid="place-order"]');
    await expect(page.locator('.order-confirmation')).toBeVisible();
  });

  test('User registration and login', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on login/register button
    await page.click('[data-testid="auth-button"]');
    
    // Switch to register tab
    await page.click('[data-testid="register-tab"]');
    
    // Fill registration form
    await page.fill('[data-testid="username-input"]', 'testuser');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPass123');
    await page.fill('[data-testid="fullname-input"]', 'Test User');
    
    // Submit registration
    await page.click('[data-testid="register-submit"]');
    
    // Verify successful registration
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

---

## Step 6: Update Package.json Scripts

### Frontend Package.json
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "react-scripts test --ci --coverage --watchAll=false",
    "eject": "react-scripts eject"
  }
}
```

### Backend Package.json
```json
{
  "scripts": {
    "start": "node Server.js",
    "dev": "nodemon Server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --config jest.integration.config.js",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

---

## Step 7: Add Data Test IDs to Components

### Example: ProductCard Component
```jsx
// e-commerce/gomallclient/src/Component/ProductCard/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card" data-testid="product-card">
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {product.flashSale?.isActive && (
        <span className="flash-sale-badge" data-testid="flash-sale-badge">
          {product.flashSale.discount}% OFF
        </span>
      )}
      <button 
        onClick={() => onAddToCart(product._id)}
        data-testid="add-to-cart"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
```

---

## Step 8: Run Tests

### Run All Tests
```bash
# Frontend tests
cd e-commerce/gomallclient
npm test

# Backend tests
cd e-commerce/server
npm test

# E2E tests
cd e-commerce
npx playwright test
```

### Run with Coverage
```bash
# Frontend coverage
cd e-commerce/gomallclient
npm run test:coverage

# Backend coverage
cd e-commerce/server
npm run test:coverage
```

---

## Step 9: CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install frontend dependencies
        run: cd e-commerce/gomallclient && npm ci
      
      - name: Install backend dependencies
        run: cd e-commerce/server && npm ci
      
      - name: Run frontend tests
        run: cd e-commerce/gomallclient && npm run test:ci
      
      - name: Run backend tests
        run: cd e-commerce/server && npm run test:ci
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./e-commerce/*/coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

---

## 🎯 Next Steps

1. **Start with Unit Tests**: Begin with core components and controllers
2. **Add Integration Tests**: Test API endpoints and database interactions
3. **Implement E2E Tests**: Cover critical user journeys
4. **Set up CI/CD**: Automate testing in your deployment pipeline
5. **Monitor Coverage**: Aim for >80% coverage on critical paths
6. **Performance Testing**: Add load testing for high-traffic scenarios

This implementation guide provides a solid foundation for testing your GoMall application. Start with the unit tests and gradually build up to more comprehensive testing as your application grows.
