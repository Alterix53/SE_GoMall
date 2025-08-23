# 🧪 Testing Strategy - Part 2: Integration, E2E & Performance

## 2. 🔗 Integration Testing Strategy

### 2.1 API Integration Tests

#### Authentication Flow
```javascript
// Example: auth.integration.test.js
import request from 'supertest';
import app from '../Server.js';
import mongoose from 'mongoose';

describe('Authentication Integration Tests', () => {
  let authToken;
  let userId;

  test('Complete user registration and login flow', async () => {
    // 1. Register new user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'integrationtest',
        email: 'integration@test.com',
        password: 'TestPass123',
        fullName: 'Integration Test User'
      });

    expect(registerResponse.status).toBe(201);
    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user._id;

    // 2. Test protected route access
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.data.user._id).toBe(userId);
  });
});
```

#### Cart Integration Tests
```javascript
// Example: cart.integration.test.js
describe('Cart Integration Tests', () => {
  let authToken;
  let productId;

  beforeEach(async () => {
    // Setup: Create user and product
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'carttest',
        email: 'cart@test.com',
        password: 'TestPass123',
        fullName: 'Cart Test User'
      });
    
    authToken = userResponse.body.data.token;

    // Create test product
    const product = new Product({
      name: 'Test Product',
      price: 50,
      stock: 10
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

    // 2. Get cart contents
    const getCartResponse = await request(app)
      .get('/api/cart/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getCartResponse.status).toBe(200);
    expect(getCartResponse.body.data.items).toHaveLength(1);

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

    // 4. Remove item from cart
    const removeResponse = await request(app)
      .delete('/api/cart/remove')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productID: productId });

    expect(removeResponse.status).toBe(200);
  });
});
```

### 2.2 Database Integration Tests

```javascript
// Example: database.integration.test.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/gomall_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
  });

  test('User-Product-Order relationship integrity', async () => {
    // Create user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();

    // Create product
    const product = new Product({
      name: 'Test Product',
      price: 100,
      sellerID: user._id
    });
    await product.save();

    // Create order
    const order = new Order({
      userID: user._id,
      items: [{
        productID: product._id,
        quantity: 2,
        price: product.price
      }],
      totalAmount: 200
    });
    await order.save();

    // Verify relationships
    const populatedOrder = await Order.findById(order._id)
      .populate('userID')
      .populate('items.productID');

    expect(populatedOrder.userID.email).toBe('test@example.com');
    expect(populatedOrder.items[0].productID.name).toBe('Test Product');
  });
});
```

---

## 3. 🎯 End-to-End Testing Strategy

### 3.1 User Journey Tests

#### Customer Purchase Flow
```javascript
// Example: customer-purchase.e2e.test.js
import { test, expect } from '@playwright/test';

test.describe('Customer Purchase Flow', () => {
  test('Complete purchase journey', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('GoMall');

    // 2. Browse products
    await page.click('[data-testid="product-card"]');
    await expect(page.locator('.product-detail')).toBeVisible();

    // 3. Add to cart
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('.cart-notification')).toBeVisible();

    // 4. View cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('.cart-items')).toBeVisible();

    // 5. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page.locator('.checkout-form')).toBeVisible();

    // 6. Fill shipping information
    await page.fill('[data-testid="shipping-name"]', 'John Doe');
    await page.fill('[data-testid="shipping-address"]', '123 Test St');
    await page.fill('[data-testid="shipping-phone"]', '1234567890');

    // 7. Complete order (mock payment)
    await page.click('[data-testid="place-order"]');
    await expect(page.locator('.order-confirmation')).toBeVisible();
  });
});
```

#### Admin Management Flow
```javascript
// Example: admin-management.e2e.test.js
test.describe('Admin Management Flow', () => {
  test('Admin can manage users and products', async ({ page }) => {
    // 1. Admin login
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('[data-testid="admin-username"]', 'admin');
    await page.fill('[data-testid="admin-password"]', 'adminpass');
    await page.click('[data-testid="admin-login"]');

    // 2. Navigate to user management
    await page.click('[data-testid="manage-users"]');
    await expect(page.locator('.users-table')).toBeVisible();

    // 3. View user details
    await page.click('[data-testid="user-row"]');
    await expect(page.locator('.user-details')).toBeVisible();

    // 4. Navigate to product management
    await page.click('[data-testid="manage-products"]');
    await expect(page.locator('.products-table')).toBeVisible();

    // 5. Edit product
    await page.click('[data-testid="edit-product"]');
    await page.fill('[data-testid="product-name"]', 'Updated Product Name');
    await page.click('[data-testid="save-product"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

#### Seller Dashboard Flow
```javascript
// Example: seller-dashboard.e2e.test.js
test.describe('Seller Dashboard Flow', () => {
  test('Seller can manage products and orders', async ({ page }) => {
    // 1. Seller login
    await page.goto('http://localhost:3000/seller/login');
    await page.fill('[data-testid="seller-email"]', 'seller@test.com');
    await page.fill('[data-testid="seller-password"]', 'sellerpass');
    await page.click('[data-testid="seller-login"]');

    // 2. View dashboard
    await expect(page.locator('.seller-dashboard')).toBeVisible();

    // 3. Add new product
    await page.click('[data-testid="add-product"]');
    await page.fill('[data-testid="product-name"]', 'New Product');
    await page.fill('[data-testid="product-price"]', '99.99');
    await page.fill('[data-testid="product-description"]', 'Test description');
    await page.click('[data-testid="save-product"]');

    // 4. View orders
    await page.click('[data-testid="view-orders"]');
    await expect(page.locator('.orders-table')).toBeVisible();

    // 5. Update order status
    await page.click('[data-testid="order-row"]');
    await page.selectOption('[data-testid="order-status"]', 'shipped');
    await page.click('[data-testid="update-status"]');
    await expect(page.locator('.status-updated')).toBeVisible();
  });
});
```

---

## 4. ⚡ Performance Testing Strategy

### 4.1 Load Testing

```javascript
// Example: load-test.js
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
  },
};

export default function () {
  const BASE_URL = 'http://localhost:8080';

  // Test homepage
  const homeResponse = http.get(`${BASE_URL}/api/products`);
  check(homeResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Test product search
  const searchResponse = http.get(`${BASE_URL}/api/products/search?q=test`);
  check(searchResponse, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 300ms': (r) => r.timings.duration < 300,
  });
}
```

### 4.2 Frontend Performance Testing

```javascript
// Example: performance.test.js
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Homepage loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    // Wait for critical content to load
    await page.waitForSelector('[data-testid="product-grid"]');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds budget

    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint');
          const fid = entries.find(entry => entry.entryType === 'first-input');
          resolve({ lcp: lcp?.startTime, fid: fid?.processingStart });
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      });
    });

    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.fid).toBeLessThan(100);   // FID < 100ms
  });
});
```

---

## 5. 🔒 Security Testing Strategy

### 5.1 Authentication Security Tests

```javascript
// Example: security.test.js
import request from 'supertest';
import app from '../Server.js';

describe('Security Tests', () => {
  test('should prevent SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: maliciousInput,
        password: 'password'
      });

    // Should not crash and should return proper error
    expect(response.status).not.toBe(500);
  });

  test('should prevent XSS attacks', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: xssPayload,
        email: 'test@example.com',
        password: 'password',
        fullName: xssPayload
      });

    // Check that script tags are sanitized
    expect(response.body.data.user.username).not.toContain('<script>');
  });

  test('should enforce password complexity', async () => {
    const weakPassword = '123';
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: weakPassword,
        fullName: 'Test User'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('password');
  });

  test('should rate limit login attempts', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    // Make multiple failed login attempts
    for (let i = 0; i < 6; i++) {
      await request(app)
        .post('/api/auth/login')
        .send(loginData);
    }

    // Next attempt should be rate limited
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(429); // Too Many Requests
  });
});
```

### 5.2 Authorization Tests

```javascript
// Example: authorization.test.js
describe('Authorization Tests', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@test.com',
        password: 'TestPass123',
        fullName: 'Test User'
      });
    userToken = userResponse.body.data.token;

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'admin',
        email: 'admin@test.com',
        password: 'AdminPass123',
        fullName: 'Admin User',
        role: ['admin']
      });
    adminToken = adminResponse.body.data.token;
  });

  test('regular user cannot access admin routes', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  test('admin can access admin routes', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });

  test('unauthenticated requests are rejected', async () => {
    const response = await request(app)
      .get('/api/users/profile');

    expect(response.status).toBe(401);
  });
});
```
