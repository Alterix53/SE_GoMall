import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/GoMall";

// Đọc products.json
const readProductsJson = () => {
  const filePath = path.join(__dirname, '../../data/products.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
};

// Đọc categories.json
const readCategoriesJson = () => {
  const filePath = path.join(__dirname, '../../data/Categories.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Categories.json:', error);
    return [];
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for data reset and reload');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearAllData = async (force = false) => {
  const db = mongoose.connection.db;
  if (!force) {
    console.log('🔄 Skipping data clearing (use force=true to clear all data)');
    return;
  }
  
  console.log('🗑️ Clearing all existing data...');
  const collections = ['products', 'categories'];
  for (const collectionName of collections) {
    try {
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`✅ Cleared ${collectionName}: ${result.deletedCount} documents`);
    } catch (error) {
      console.log(`⚠️ Collection ${collectionName} not found or already empty`);
    }
  }
};

const seedCategories = async () => {
  const categoriesData = readCategoriesJson();
  console.log(`📂 Found ${categoriesData.length} categories in JSON`);
  if (categoriesData.length === 0) return [];
  const mappedCategories = categoriesData.map((cat, index) => ({
    id: index + 1,
    categoryName: cat.categoryName,
    description: cat.description || '',
    image: cat.image || '',
    isActive: true
  }));
  const db = mongoose.connection.db;
  const collection = db.collection('categories');
  const result = await collection.insertMany(mappedCategories);
  let createdCategories;
  if (result.ops) createdCategories = result.ops; else if (result.insertedIds) {
    const insertedIds = Object.values(result.insertedIds);
    createdCategories = mappedCategories.map((category, index) => ({ ...category, _id: insertedIds[index] }));
  } else createdCategories = mappedCategories;
  console.log("✅ Categories seeded successfully:", createdCategories.map(c => `${c.id}: ${c.categoryName}`));
  return createdCategories;
};

const seedProducts = async (categories) => {
  const productsData = readProductsJson();
  console.log(`📦 Found ${productsData.length} products in JSON`);
  if (productsData.length === 0) return [];

  const sevenDaysLater = () => new Date(Date.now() + 7*24*60*60*1000);

  const mappedProducts = productsData.map(p => {
    const category = categories.find(c => c.id === p.categoryID);
    if (!category) {
      console.warn(`Category with ID ${p.categoryID} not found for product ${p.name}`);
      return null;
    }
    return {
      name: p.name,
      slug: `default-slug-${Math.random().toString(36).substring(2, 15)}`,
      description: p.description,
      shortDescription: '',
      sku: `SKU-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      brand: '',
      categoryID: category._id,
      sellerID: null, // Không yêu cầu seller
      images: [{ url: p.images_url, alt: p.name, isPrimary: p.images_isPrimary || true }],
      price: { original: p.price_original, sale: p.price_sale },
      inventory: { quantity: p.inventory_quantity, lowStockThreshold: p.inventory_lowStockThreshold },
      specifications: [],
      tags: p.tags ? p.tags.split(',').map(tag => tag.trim()) : [],
      rating: { average: 0, count: p.rating_count || 0 },
      sold: p.sold || 0,
      views: p.views || 0,
      isActive: p.isActive !== false,
      isFeatured: p.isFeatured || false,
      isFlashSale: p.isFlashSale === true,
      flashSalePrice: p.flashSalePrice || (p.isFlashSale === true ? Math.round(p.price_sale * 0.9) : null),
      flashSaleEndDate: p.isFlashSale === true ? (p.flashSaleEndDate ? new Date(p.flashSaleEndDate) : sevenDaysLater()) : null,
      createdAt: new Date()
    };
  }).filter(Boolean);

  const db = mongoose.connection.db;
  const collection = db.collection('products');
  
  // Get existing products to check what's new
  const existingProducts = await collection.find({}).toArray();
  const existingProductNames = existingProducts.map(p => p.name);
  
  console.log(`📊 Found ${existingProducts.length} existing products`);
  
  // Filter out products that already exist
  const newProducts = mappedProducts.filter(product => !existingProductNames.includes(product.name));
  const existingProductsToUpdate = mappedProducts.filter(product => existingProductNames.includes(product.name));
  
  console.log(`🆕 Found ${newProducts.length} new products to insert`);
  console.log(`🔄 Found ${existingProductsToUpdate.length} existing products to update`);
  
  let createdProducts = [];
  let updatedProducts = [];
  
  // Insert new products
  if (newProducts.length > 0) {
    console.log("📥 Inserting new products...");
    const result = await collection.insertMany(newProducts);
    
    // Handle different MongoDB driver versions
    if (result.ops) {
      createdProducts = result.ops;
    } else if (result.insertedIds) {
      const insertedIds = Object.values(result.insertedIds);
      createdProducts = newProducts.map((product, index) => ({
        ...product,
        _id: insertedIds[index]
      }));
    } else {
      createdProducts = newProducts;
    }
    
    console.log("✅ New products inserted successfully:", createdProducts.length);
  }
  
  // Update existing products
  if (existingProductsToUpdate.length > 0) {
    console.log("🔄 Updating existing products...");
    for (const product of existingProductsToUpdate) {
      const result = await collection.updateOne(
        { name: product.name },
        { 
          $set: {
            price: product.price,
            inventory: product.inventory,
            isFlashSale: product.isFlashSale,
            flashSalePrice: product.flashSalePrice,
            flashSaleEndDate: product.flashSaleEndDate,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            // Ensure category mapping stays in sync with current categories
            categoryID: product.categoryID,
            updatedAt: new Date()
          }
        }
      );
      if (result.modifiedCount > 0) {
        updatedProducts.push(product);
      }
    }
    console.log("✅ Updated products:", updatedProducts.length);
  }
  
  // Get final count
  const finalProductCount = await collection.countDocuments();
  console.log(`📊 Total products in database: ${finalProductCount}`);
  
  return [...createdProducts, ...updatedProducts];
};

const resetAndReloadData = async (force = false) => {
  try {
    await connectDB();
    
    // Only clear data if force=true
    if (force) {
      await clearAllData(true);
    } else {
      await clearAllData(false); // This will skip clearing
    }
    
    console.log("\n🌱 Seeding categories...");
    const createdCategories = await seedCategories();
    console.log("\n📦 Seeding products...");
    const createdProducts = await seedProducts(createdCategories);
    console.log("\n🎉 Data seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
  } catch (error) {
    console.error("❌ Error during data seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  }
};

// Check if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const force = process.argv.includes('--force');
  resetAndReloadData(force);
}

export default resetAndReloadData;
