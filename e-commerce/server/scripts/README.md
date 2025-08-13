# 🗄️ Database Seeding Scripts

## 📁 Files Overview

### ✅ **seedData.js** (Unified Seeding Script)
**Main seeding script** that combines the best features from both old files:
- Seeds categories from `Categories.json`
- Seeds users from `users.json` (creates default users if no data)
- Seeds products from `products.json`
- Handles batch processing for large datasets
- Provides detailed logging and error handling

### ⚡ **addFlashSaleToProducts.js**
Adds flash sale data to existing products:
- Sets `isFlashSale: true`
- Adds `flashSalePrice` (30% discount)
- Sets `flashSaleEndDate` (24 hours from now)

### 📊 **checkStatus.js**
Checks database status and shows:
- Number of categories, users, products
- Flash sale products count
- Sample product details

## 🚀 How to Use

### 1. **Seed All Data**
```bash
cd e-commerce/server/scripts
node seedData.js
```

### 2. **Add Flash Sale Data**
```bash
node addFlashSaleToProducts.js
```

### 3. **Check Database Status**
```bash
node checkStatus.js
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
🚀 Starting database seeding...
🔌 Connecting to MongoDB...
✅ MongoDB Connected successfully
📂 Seeding categories...
✅ Created 10 categories
👥 Seeding users...
✅ Created 10 users (4 sellers)
📦 Seeding products...
✅ Created 20 products successfully

🎉 Database seeding completed successfully!
📊 Summary:
   - Categories: 10
   - Users: 4 sellers
   - Products: 20
```

## 🎯 **Migration from Old Files**

### **Before** (2 separate files):
- `seedData.js` - Complex, hard to maintain
- `seedLargeData.js` - Simple but limited features

### **After** (1 unified file):
- `seedData.js` - Best of both worlds
- Clean, maintainable code
- Better error handling
- More features

## 📝 **Notes**
- Always run `addFlashSaleToProducts.js` after seeding if you want flash sale products
- The script automatically clears existing data before seeding
- All data files should be in `e-commerce/data/` directory
- MongoDB connection uses `mongodb://localhost:27017/GoMall`

---
*Updated: August 7, 2025* 