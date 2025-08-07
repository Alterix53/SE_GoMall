import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import '../models/Order.js';
import '../models/Cart.js';
import '../models/Review.js';
import '../models/Payment.js';

const MONGODB_URI = "mongodb://localhost:27017/GoMall";

const connectDB = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

const readJSON = (fileName) => {
    const filePath = path.join(__dirname, '../../data/', fileName);
    console.log(`📁 Reading file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return [];
    }
    
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`❌ Error reading ${fileName}:`, error);
        return [];
    }
};

const seedCategories = async () => {
    console.log("📂 Seeding categories...");
    const categoriesData = readJSON('Categories.json');
    
    if (!categoriesData.length) {
        console.warn("⚠️ No categories data found in Categories.json");
        return [];
    }

    // Clear existing categories
    await Category.deleteMany({});
    
    // Create categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Log category names
    createdCategories.forEach(cat => {
        console.log(`   - ${cat.categoryName}`);
    });
    
    return createdCategories;
};

const seedUsers = async () => {
    console.log("👥 Seeding users...");
    const usersData = readJSON('users.json');
    
    if (!usersData.length) {
        console.warn("⚠️ No users data found in users.json, creating default users");
        
        // Create default users if no data exists
        const defaultUsers = [
            {
                username: 'admin',
                password: 'admin123',
                email: 'admin@gomall.com',
                role: 'admin',
                fullName: 'Admin User',
                isActive: true
            },
            {
                username: 'seller1',
                password: 'seller123',
                email: 'seller1@gomall.com',
                role: 'seller',
                fullName: 'Seller One',
                shop: {
                    name: 'Tech Store',
                    address: '123 Tech Street',
                    isActive: true
                },
                isActive: true
            },
            {
                username: 'user1',
                password: 'user123',
                email: 'user1@gomall.com',
                role: 'user',
                fullName: 'Regular User',
                isActive: true
            }
        ];
        
        await User.deleteMany({});
        const createdUsers = await User.insertMany(defaultUsers);
        console.log(`✅ Created ${createdUsers.length} default users`);
        return { allUsers: createdUsers, sellers: createdUsers.filter(u => u.role === 'seller') };
    }

    // Clear existing users
    await User.deleteMany({});
    
    // Create users from data
    const createdUsers = await User.insertMany(usersData);
    const sellers = createdUsers.filter(u => u.role.includes('seller'));
    
    console.log(`✅ Created ${createdUsers.length} users (${sellers.length} sellers)`);
    return { allUsers: createdUsers, sellers };
};

const seedProducts = async (createdCategories, createdSellers) => {
    console.log("📦 Seeding products...");
    const productsData = readJSON('products.json');
    
    if (!productsData.length) {
        console.warn("⚠️ No products data found in products.json");
        return [];
    }

    // Clear existing products
    await Product.deleteMany({});
    
    // Create category map
    const categoryMap = {};
    createdCategories.forEach((cat, index) => {
        categoryMap[index + 1] = cat._id;
    });

    // Transform products data
    console.log("🔄 Transforming products data...");
    const transformedProducts = productsData.map((product, index) => {
        const categoryID = categoryMap[product.categoryID] || createdCategories[0]?._id || new mongoose.Types.ObjectId();
        const sellerID = createdSellers.length > 0 
            ? createdSellers[Math.floor(Math.random() * createdSellers.length)]._id 
            : new mongoose.Types.ObjectId();

        return {
            name: product.name,
            slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + `-${index + 1}`,
            sku: `SKU-${String(index + 1).padStart(6, '0')}`,
            price: {
                original: product.price_original || 0,
                sale: product.price_sale || product.price_original || 0
            },
            description: product.description || `${product.name} - High quality product`,
            categoryID: categoryID,
            sellerID: sellerID,
            images: [{
                url: product.images_url || `/images/default-product.jpg`,
                isPrimary: true
            }],
            inventory: {
                quantity: product.inventory_quantity || 100,
                lowStockThreshold: product.inventory_lowStockThreshold || 10
            },
            tags: product.tags ? product.tags.split(', ') : [],
            rating: {
                average: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                count: product.rating_count || 0
            },
            sold: product.sold || 0,
            views: product.views || 0,
            isActive: product.isActive !== false,
            isFeatured: product.isFeatured || false,
            isFlashSale: product.isFlashSale || false,
            flashSalePrice: product.flashSalePrice || null,
            flashSaleEndDate: product.flashSaleEndDate ? new Date(product.flashSaleEndDate) : null
        };
    });

    // Create products in batches
    console.log("📦 Creating products...");
    const batchSize = 100;
    let createdProducts = 0;

    for (let i = 0; i < transformedProducts.length; i += batchSize) {
        const batch = transformedProducts.slice(i, i + batchSize);
        await Product.insertMany(batch);
        createdProducts += batch.length;
        console.log(`✅ Created ${createdProducts}/${transformedProducts.length} products`);
    }

    console.log(`✅ Created ${createdProducts} products successfully`);
    return createdProducts;
};

const seedData = async () => {
    try {
        console.log("🚀 Starting database seeding...");
        
        // Connect to database
        await connectDB();

        // Seed categories
        const createdCategories = await seedCategories();

        // Seed users
        const { sellers: createdSellers } = await seedUsers();

        // Seed products
        const createdProducts = await seedProducts(createdCategories, createdSellers);

        // Show summary
        console.log("\n🎉 Database seeding completed successfully!");
        console.log("📊 Summary:");
        console.log(`   - Categories: ${createdCategories.length}`);
        console.log(`   - Users: ${createdSellers.length} sellers`);
        console.log(`   - Products: ${createdProducts}`);

        // Show sample products
        const sampleProducts = await Product.find().limit(5).populate('categoryID', 'categoryName');
        console.log('\n📋 Sample products:');
        sampleProducts.forEach(product => {
            console.log(`   - ${product.name} (${product.categoryID?.categoryName || 'Unknown'}) - ${product.price.original.toLocaleString()}₫`);
        });

        console.log("\n✅ All data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

// Run the seeding process
seedData();