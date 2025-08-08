# User/Seller Model Separation Migration

## Overview
This document describes the migration from a single User model to separate User and Seller models to better handle the different requirements for customers and sellers.

## Changes Made

### 1. User Model Updates
- **Removed**: `role: 'seller'` option
- **Removed**: `shopID` field
- **Kept**: Basic user information (username, email, password, fullName, phoneNumber, address)
- **Roles**: Now only supports `['user', 'admin']`

### 2. Seller Model Updates
- **Removed**: Duplicate fields (username, password, email)
- **Added**: `userID` reference to User model (required, unique)
- **Added**: `businessLicense` field (required)
- **Kept**: Seller-specific fields (storeName, address, phoneNumber, verificationDocs, status)
- **Status**: `['pending', 'approved', 'rejected']`

### 3. Product Model Updates
- **Changed**: `sellerID` now references `Seller` model instead of `User`

### 4. Authentication Updates
- **Added**: `registerSeller` endpoint for seller registration
- **Updated**: Login response includes seller information if user is a seller
- **Added**: `requireSeller` middleware for seller-only routes

## API Endpoints

### User Registration
```http
POST /api/auth/register
```

### Seller Registration
```http
POST /api/auth/register-seller
Content-Type: application/json

{
  "username": "selleruser",
  "email": "seller@example.com",
  "password": "SecurePass123",
  "fullName": "Seller Name",
  "phoneNumber": "1234567890",
  "address": "User Address",
  "storeName": "My Store",
  "businessLicense": "LICENSE123",
  "sellerPhoneNumber": "0987654321",
  "sellerAddress": "Store Address",
  "verificationDocs": ["doc1.pdf", "doc2.pdf"]
}
```

### Seller Management (Admin Only)
```http
GET /api/sellers                    # Get all sellers
GET /api/sellers/:id               # Get seller by ID
PATCH /api/sellers/:id/approve     # Approve seller
PATCH /api/sellers/:id/reject      # Reject seller
PATCH /api/sellers/:id             # Update seller
DELETE /api/sellers/:id            # Deactivate seller
```

## Migration Process

### 1. Run Migration Script
```bash
cd e-commerce/server
node scripts/migrateUserSeller.js
```

### 2. Migration Steps
1. Find all users with `role: 'seller'`
2. Create Seller records for each seller user
3. Remove 'seller' from user roles
4. Update Product references to point to Seller records

### 3. Data Structure After Migration

**User Collection:**
```json
{
  "_id": "user_id",
  "username": "selleruser",
  "email": "seller@example.com",
  "password": "hashed_password",
  "fullName": "Seller Name",
  "phoneNumber": "1234567890",
  "address": "User Address",
  "role": ["user"],  // No longer includes 'seller'
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Seller Collection:**
```json
{
  "_id": "seller_id",
  "userID": "user_id",  // Reference to User
  "storeName": "My Store",
  "businessLicense": "LICENSE123",
  "address": "Store Address",
  "phoneNumber": "0987654321",
  "verificationDocs": ["doc1.pdf", "doc2.pdf"],
  "status": "approved",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Benefits

### 1. Separation of Concerns
- User model handles authentication and basic user info
- Seller model handles business-specific information
- Clear distinction between customer and seller data

### 2. Scalability
- Easy to add more seller-specific fields
- No need to modify User model for seller features
- Better performance for queries

### 3. Security
- Seller information is isolated
- Easier to implement role-based access control
- Better audit trail

### 4. Maintainability
- Cleaner code structure
- Easier to understand and modify
- Better database design

## Breaking Changes

### 1. Authentication Response
Login response now includes seller information:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "selleruser",
      "email": "seller@example.com",
      "role": ["user"],
      "sellerInfo": {
        "_id": "seller_id",
        "storeName": "My Store",
        "status": "approved"
      }
    },
    "token": "jwt_token"
  }
}
```

### 2. Product References
Products now reference Seller model instead of User model.

### 3. Role Management
- Users no longer have 'seller' in their role array
- Seller status is managed through Seller model
- Admin approval process is separate from user registration

## Testing

### 1. Test User Registration
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

### 2. Test Seller Registration
```bash
curl -X POST http://localhost:8080/api/auth/register-seller \
  -H "Content-Type: application/json" \
  -d '{
    "username": "selleruser",
    "email": "seller@example.com",
    "password": "TestPass123",
    "fullName": "Seller Name",
    "storeName": "My Store",
    "businessLicense": "LICENSE123"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "TestPass123"
  }'
```

## Rollback Plan

If migration fails, you can rollback by:

1. Restore User model to include 'seller' role
2. Update Product model to reference User instead of Seller
3. Delete Seller collection
4. Update authentication logic

## Future Considerations

1. **Seller Dashboard**: Implement seller-specific dashboard
2. **Approval Workflow**: Add email notifications for approval/rejection
3. **Document Upload**: Implement file upload for verification documents
4. **Seller Analytics**: Add seller-specific analytics and reporting
5. **Multi-store Support**: Allow sellers to have multiple stores
