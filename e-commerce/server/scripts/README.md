# 🗄️ Database Seeding Scripts

## 📁 Files Overview

### ✅ **seedData.js** (Main Seeding Script)
**Primary seeding script** that handles all database initialization:
- Seeds categories from `Categories.json`
- Seeds users from `users.json` (creates default users if no data)
- Seeds products from `products.json`
- Handles batch processing for large datasets
- Provides detailed logging and error handling

### ✅ **seedDataKeepAlive.js** (Keep-Alive Version)
Same as `seedData.js` but keeps MongoDB connection alive:
- Useful for development and testing
- Prevents disconnection after seeding
- Same functionality as main script

### ✅ **resetAndReloadData.js** (Data Reset Script)
Comprehensive script to reset and reload all data:
- Clears existing data (optional with `--force` flag)
- Re-seeds categories, users, and products
- Uses upsert logic to avoid duplicates
- Perfect for development and testing

### ✅ **autoSetup.js** (Automatic Setup)
Automatically checks database status and runs setup if needed:
- Detects missing data
- Runs setup automatically
- Can be integrated with server startup

### ✅ **runAllScripts.js** (Master Script)
Runs all setup scripts in the correct order:
- Creates admin user
- Seeds all data
- Orchestrates the entire setup process

### ✅ **createAdmin.js** (Admin Creation)
Creates default admin user:
- Username: admin
- Password: admin123
- Full permissions

### ✅ **migrateUserSeller.js** (Migration Script)
Migrates existing user data to new User/Seller model structure:
- Separates user and seller data
- Maintains data integrity
- One-time migration script

## 🚀 How to Use

### 1. **Quick Setup (Recommended)**
```bash
cd e-commerce/server/scripts
node runAllScripts.js
```

### 2. **Seed Data Only**
```bash
node seedData.js
```

### 3. **Reset and Reload Data**
```bash
node resetAndReloadData.js
```

### 4. **Create Admin Only**
```bash
node createAdmin.js
```

### 5. **Auto Setup**
```bash
node autoSetup.js --force
```

## 📋 What Gets Seeded

### **Categories** (from `Categories.json`)
- 10 categories: Phones, Laptops, Fashion, Sports, etc.
- Each category has name, slug, description, image

### **Users** (from `users.json` or default)
- Admin users
- Seller users with shop information
- Regular users
- Creates default users if no data file exists

### **Products** (from `products.json`)
- 20 products with detailed information
- Each product has: name, price, images, category, seller
- Batch processing for large datasets

## 🔧 Features

### ✅ **Error Handling**
- Graceful handling of missing files
- Detailed error messages
- Fallback to default data

### ✅ **Batch Processing**
- Processes products in batches of 100
- Prevents memory issues with large datasets
- Progress logging

### ✅ **Data Validation**
- Validates required fields
- Generates missing fields (slug, sku, etc.)
- Ensures data integrity

### ✅ **Flexible Configuration**
- Works with or without data files
- Creates default data when needed
- Easy to customize

## 📊 Expected Output

```
🚀 Starting Database Setup Process...
This will run all scripts in the correct order

STEP 1/2: Creating default admin user
✅ createAdmin.js completed successfully

STEP 2/2: Seeding categories, users, and products
✅ seedData.js completed successfully

🎉 All scripts completed successfully in 15s!
Database is now ready for use.
``` 