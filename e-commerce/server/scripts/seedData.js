// <DOCUMENT filename="seedData.js">
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

// ESM replacements for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (prefer server/.env if present)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Resolve Mongo URI with safe fallback - keep Develop's improved connection logic
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/GoMall";

const connectForSeeding = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect with MONGODB_URI (attempt ${i + 1}/${retries}):`, MONGODB_URI);
            
            // Add connection options to prevent timeout
            const options = {
                serverSelectionTimeoutMS: 60000, // 60 seconds
                socketTimeoutMS: 120000, // 120 seconds
                maxPoolSize: 5,
                minPoolSize: 1,
                connectTimeoutMS: 60000,
                bufferCommands: false // Disable buffering to prevent timeout
            };
            
            await mongoose.connect(MONGODB_URI, options);
            console.log("MongoDB Connected for seeding");
            
            // Wait for connection to be ready and stable
            await mongoose.connection.db.admin().ping();
            console.log("MongoDB connection verified and ready");
            
            // Additional wait to ensure MongoDB is fully ready
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            return;
        } catch (error) {
            console.error(`Database connection attempt ${i + 1} failed:`, error.message);
            
            if (i < retries - 1) {
                console.log(`Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.error("All connection attempts failed");
                throw error;
            }
        }
    }
};

const disconnectDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log("MongoDB Disconnected");
        }
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
};

const readJSON = (fileName) => {
    const filePath = path.join(__dirname, '../../data/', fileName);
    console.log(`Debug: Looking for file at: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error(`Debug: File not found at: ${filePath}`);
        return [];
    }
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return [];
    }
};

const processImageUrl = async (url, filename) => {
    if (!url) {
        console.log("No URL provided, using fallback image");
        return 'https://source.unsplash.com/random/400x300';
    }
    if (url.includes('amazon.de') || url.includes('mlb.com') || url.includes('comsenz.com') || url.includes('naver.com') || url.includes('ebay.co.uk') || url.includes('huffingtonpost.com')) {
        console.log(`Replaced fake URL with fallback: https://source.unsplash.com/random/400x300`);
        return 'https://source.unsplash.com/random/400x300';
    }
    return url;
};

const seedCategories = async () => {
    const categoriesData = readJSON('Categories.json');
    console.log("Raw categories data:", categoriesData);
    if (!categoriesData.length) {
        console.warn("No categories data found in Categories.json");
        return [];
    }

    const mappedCategories = await Promise.all(categoriesData.map(async cat => {
        const imagePath = cat.image ? await processImageUrl(cat.image, `category_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`) : 'https://source.unsplash.com/random/400x300';
        return {
            categoryName: cat.categoryName || 'Default Category',
            slug: cat.slug || `default-slug-${Math.random().toString(36).slice(2)}`,
            description: cat.description || '',
            image: imagePath,
            icon: cat.icon || 'fas fa-default-icon',
            parentID: null
        };
    }));

    try {
        console.log("Checking existing categories...");
        
        // Ensure connection is ready before querying
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready");
        }
        
        // Use MongoDB driver directly to avoid Mongoose timeout issues
        const db = mongoose.connection.db;
        const collection = db.collection('categories');
        
        const existingCategory = await collection.findOne({});
        
        if (existingCategory) {
            console.log(`Found existing categories. Skipping category seeding.`);
            const existingCategories = await collection.find({}).toArray();
            return existingCategories;
        }
        
        console.log("No existing categories found. Inserting new categories...");
        const result = await collection.insertMany(mappedCategories);
        
        // Handle different MongoDB driver versions
        let createdCategories;
        if (result.ops) {
            // MongoDB driver v3.x
            createdCategories = result.ops;
        } else if (result.insertedIds) {
            // MongoDB driver v4.x+
            const insertedIds = Object.values(result.insertedIds);
            createdCategories = mappedCategories.map((category, index) => ({
                ...category,
                _id: insertedIds[index]
            }));
        } else {
            // Fallback
            createdCategories = mappedCategories;
        }
        
        // Update parent relationships
        for (let i = 0; i < categoriesData.length; i++) {
            if (categoriesData[i].parentID) {
                const parentIndex = categoriesData[i].parentID - 1;
                if (parentIndex >= 0 && parentIndex < createdCategories.length) {
                    await collection.updateOne(
                        { _id: createdCategories[i]._id },
                        { $set: { parentID: createdCategories[parentIndex]._id } }
                    );
                }
            }
        }

        console.log("Categories seeded successfully:", createdCategories.map(c => ({ categoryName: c.categoryName, slug: c.slug, _id: c._id })));
        return createdCategories;
    } catch (error) {
        console.error("Error seeding categories:", error);
        throw error;
    }
};

const seedUsers = async () => {
    const usersData = readJSON('users.json');
    console.log("Raw users data:", usersData);
    if (!usersData.length) {
        console.warn("No users data found in users.json");
        return { allUsers: [], sellers: [] };
    }

    const mappedUsers = usersData.map(user => ({
        username: user.username || `default_user_${Math.random().toString(36).slice(2)}`,
        password: user.password || 'defaultpassword123',
        email: user.email || `default_${Math.random().toString(36).slice(2)}@example.com`,
        role: user.role || 'user',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        shop: user.role.includes('seller') ? {
            shopID: user.shop?.shopID || new mongoose.Types.ObjectId(),
            name: user.shop?.name || 'Default Shop',
            address: user.shop?.address || '',
            isActive: user.shop?.isActive !== false
        } : null,
        isActive: user.isActive !== false,
        profile_image: user.profile_image || 'https://source.unsplash.com/random/400x300'
    }));

    try {
        console.log("Checking existing users...");
        
        // Ensure connection is ready before querying
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready");
        }
        
        // Use MongoDB driver directly to avoid Mongoose timeout issues
        const db = mongoose.connection.db;
        const collection = db.collection('users');
        
        const existingUser = await collection.findOne({});
        
        if (existingUser) {
            console.log(`Found existing users. Skipping user seeding.`);
            const existingUsers = await collection.find({}).toArray();
            const existingSellers = existingUsers.filter(u => u.role.includes('seller'));
            return { allUsers: existingUsers, sellers: existingSellers };
        }
        
        console.log("No existing users found. Inserting new users...");
        const result = await collection.insertMany(mappedUsers);
        
        // Handle different MongoDB driver versions
        let createdUsers;
        if (result.ops) {
            // MongoDB driver v3.x
            createdUsers = result.ops;
        } else if (result.insertedIds) {
            // MongoDB driver v4.x+
            const insertedIds = Object.values(result.insertedIds);
            createdUsers = mappedUsers.map((user, index) => ({
                ...user,
                _id: insertedIds[index]
            }));
        } else {
            // Fallback
            createdUsers = mappedUsers;
        }
        
        const createdSellers = createdUsers.filter(u => u.role.includes('seller'));
        console.log("Users seeded successfully (including sellers):", createdUsers.map(u => ({ username: u.username, role: u.role, _id: u._id, shop: u.shop })));
        console.log("Sellers extracted:", createdSellers.map(s => ({ username: s.username, _id: s._id, shop: s.shop })));
        return { allUsers: createdUsers, sellers: createdSellers };
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
};

const seedProducts = async (createdCategories, createdSellers) => {
    const productsData = readJSON('products.json');
    console.log("Raw products data:", productsData);
    if (!productsData.length) {
        console.warn("No products data found in products.json");
        return [];
    }

    const mappedProducts = await Promise.all(productsData.map(async product => {
        console.log("Processing product:", product);
        const imagePaths = product.images_url ? await Promise.all(product.images_url.split(',').map(async (url, index) => ({
            url: await processImageUrl(url, `product_${product.name}_${index}_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`),
            alt: product.images_alt || 'Product Image',
            isPrimary: index === 0
        }))) : [{ url: 'https://source.unsplash.com/random/400x300', alt: 'Default', isPrimary: true }];
        const categoryIndex = product.categoryID - 1;
        const categoryID = createdCategories.length > 0 && categoryIndex >= 0 && categoryIndex < createdCategories.length 
            ? createdCategories[categoryIndex]._id 
            : new mongoose.Types.ObjectId();
        const sellerID = createdSellers.length > 0 ? createdSellers[Math.floor(Math.random() * createdSellers.length)]._id : new mongoose.Types.ObjectId();
        return {
            name: product.name || 'Default Product Name',
            slug: product.slug || `default-slug-${Math.random().toString(36).slice(2)}`,
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            sku: product.sku || `SKU-${Math.random().toString(36).slice(2).toUpperCase()}`,
            brand: product.brand || '',
            categoryID: categoryID,
            sellerID: sellerID,
            images: imagePaths,
            price: { original: Number(product.price_original || 0), sale: Number(product.price_sale || 0) },
            inventory: { quantity: Number(product.inventory_quantity || 0), lowStockThreshold: Number(product.inventory_lowStockThreshold || 10) },
            specifications: product.specifications || [],
            tags: product.tags ? product.tags.split(',') : [],
            rating: { average: Number(product.rating_average || 0), count: Number(product.rating_count || 0) },
            sold: Number(product.sold || 0),
            views: Number(product.views || 0),
            isActive: product.isActive !== false,
            isFeatured: product.isFeatured || false,
            isFlashSale: product.isFlashSale || false,
            flashSalePrice: Number(product.flashSalePrice || (product.price_sale * 0.9) || 0),
            flashSaleEndDate: new Date(product.flashSaleEndDate) || new Date('2025-07-30'), // Đảm bảo parse Date
            createdAt: new Date()
        };
    }));
    console.log("Mapped products:", mappedProducts.map(p => ({
        name: p.name,
        categoryID: p.categoryID,
        isFlashSale: p.isFlashSale,
        flashSaleEndDate: p.flashSaleEndDate
    })));
    const validProducts = mappedProducts;
    console.log("Valid products after filter:", validProducts);
    
    try {
        console.log("Checking existing products...");
        
        // Ensure connection is ready before querying
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready");
        }
        
        // Use MongoDB driver directly to avoid Mongoose timeout issues
        const db = mongoose.connection.db;
        const collection = db.collection('products');
        
        const existingProduct = await collection.findOne({});
        
        if (existingProduct) {
            console.log(`Found existing products. Skipping product seeding.`);
            const existingProducts = await collection.find({}).toArray();
            return existingProducts;
        }
        
        console.log("No existing products found. Inserting new products...");
        const result = await collection.insertMany(validProducts);
        
        // Handle different MongoDB driver versions
        let createdProducts;
        if (result.ops) {
            // MongoDB driver v3.x
            createdProducts = result.ops;
        } else if (result.insertedIds) {
            // MongoDB driver v4.x+
            const insertedIds = Object.values(result.insertedIds);
            createdProducts = validProducts.map((product, index) => ({
                ...product,
                _id: insertedIds[index]
            }));
        } else {
            // Fallback
            createdProducts = validProducts;
        }
        
        console.log("Products seeded successfully:", createdProducts.map(p => ({
            name: p.name,
            _id: p._id,
            isFlashSale: p.isFlashSale,
            flashSaleEndDate: p.flashSaleEndDate ? p.flashSaleEndDate.toISOString() : null
        })));
        return createdProducts;
    } catch (error) {
        console.error("Error seeding products:", error);
        throw error;
    }
};

const seedData = async () => {
    try {
        await connectForSeeding();

        console.log("Seeding categories from JSON...");
        const createdCategories = await seedCategories();

        console.log("Seeding users (including sellers) from JSON...");
        const { sellers: createdSellers } = await seedUsers();

        console.log("Seeding products from JSON...");
        await seedProducts(createdCategories, createdSellers);

        console.log("Data seeded successfully!");
        
        // Properly disconnect from database
        await disconnectDB();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error.stack);
        
        // Ensure we disconnect even on error
        await disconnectDB();
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT. Disconnecting from database...');
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM. Disconnecting from database...');
    await disconnectDB();
    process.exit(0);
});

seedData();
// </DOCUMENT>