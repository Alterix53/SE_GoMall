# Authentication System Documentation

## Overview
This document describes the complete authentication system implemented for the SE_GoMall e-commerce platform. The system provides secure user registration, login, logout, and token-based authentication using JWT (JSON Web Tokens).

## Features
- ✅ User registration with validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT token generation and validation
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ Token refresh functionality
- ✅ Comprehensive input validation
- ✅ Error handling and logging

## API Endpoints

### 1. User Registration
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main Street"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "1234567890",
      "address": "123 Main Street",
      "role": ["user"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

### 2. User Login
**POST** `/api/auth/login`

Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "1234567890",
      "address": "123 Main Street",
      "role": ["user"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

### 3. Get Current User
**GET** `/api/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "1234567890",
      "address": "123 Main Street",
      "role": ["user"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  }
}
```

### 4. User Logout
**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 5. Refresh Token
**POST** `/api/auth/refresh`

Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

## Validation Rules

### Registration Validation
- **username**: 3-30 characters, alphanumeric + underscore only
- **email**: Valid email format
- **password**: Minimum 6 characters, must contain uppercase, lowercase, and number
- **fullName**: 2-100 characters (optional)
- **phoneNumber**: Valid phone number format (optional)
- **address**: Maximum 500 characters (optional)

### Login Validation
- **email**: Valid email format
- **password**: Required field

## Authentication Middleware

### Usage
```javascript
import { authenticateToken, requireRole } from '../middleware/auth.js';

// Protect route with authentication
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});

// Protect route with role-based access
router.get('/admin', authenticateToken, requireRole(['admin']), (req, res) => {
  // Only admin users can access
  res.json({ message: 'Admin access granted' });
});
```

### Available Roles
- `user`: Regular user
- `admin`: Administrator
- `seller`: Seller/Shop owner

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Password validation requires complexity (uppercase, lowercase, number)
- Passwords are never returned in API responses

### JWT Security
- Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- Secret key should be set via environment variable `JWT_SECRET`
- Token validation includes user existence and active status checks

### Input Validation
- All inputs are validated using express-validator
- Email addresses are normalized
- Username format is restricted to prevent injection
- Phone numbers are validated for proper format

## Error Handling

### Common Error Responses

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**401 Unauthorized (Token Error):**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

## Testing

### Run Authentication Tests
```bash
cd server
node test-auth.js
```

The test script will:
1. Test user registration
2. Test user login
3. Test protected route access
4. Test invalid token handling
5. Test missing token handling
6. Test logout functionality

### Manual Testing with curl

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Get current user (with token):**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

Create a `.env` file in the server directory:

```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## File Structure

```
server/
├── controllers/
│   └── authController.js      # Authentication logic
├── routes/
│   └── authRoutes.js          # Authentication routes
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   └── User.js               # User model with password hashing
├── Server.js                 # Main server file (updated)
├── test-auth.js              # Authentication tests
└── AUTH_README.md            # This documentation
```

## Integration with Frontend

### Setting Authorization Header
```javascript
// Store token after login
localStorage.setItem('token', response.data.data.token);

// Use token in API calls
const token = localStorage.getItem('token');
const response = await fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Handling Token Expiration
```javascript
// Check for 401 responses and redirect to login
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

## Best Practices

1. **Never store sensitive data in localStorage** - Consider using httpOnly cookies for production
2. **Implement token refresh** - Use the refresh token endpoint to maintain sessions
3. **Validate tokens on the frontend** - Check token expiration before making requests
4. **Use HTTPS in production** - JWT tokens should only be transmitted over secure connections
5. **Implement rate limiting** - Add rate limiting to prevent brute force attacks
6. **Log authentication events** - Monitor login attempts and suspicious activities

## Troubleshooting

### Common Issues

1. **"User already exists" error**: User with same email/username already registered
2. **"Invalid token" error**: Token is expired, malformed, or user is deactivated
3. **"Validation errors"**: Check input format and required fields
4. **"Server error"**: Check server logs and database connection

### Debug Mode
Set `NODE_ENV=development` to get detailed error messages in responses. 