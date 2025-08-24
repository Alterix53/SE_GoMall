import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GoMall";

// Tắt buffering globally cho Mongoose
mongoose.set('bufferCommands', false);

const connectForSeeding = async () => {
    try {
        console.log('Connecting to MongoDB...');
        
        // Sử dụng connection đơn giản nhất
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ MongoDB Connected');
        
        // Đợi connection hoàn toàn sẵn sàng
        await mongoose.connection.db.admin().ping();
        console.log('✅ MongoDB connection verified');
        
        return;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        throw error;
    }
};

const readJSON = (fileName) => {
    const filePath = path.join(__dirname, '../../data/', fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
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

const seedCategories = async () => {
    try {
        console.log('Seeding categories...');
        
        const categoriesData = readJSON('Categories.json');
        if (!categoriesData.length) {
            console.warn('No categories data found');
            return [];
        }
        
        console.log(`Found ${categoriesData.length} categories to seed`);
        
        // Sử dụng native MongoDB driver thông qua mongoose connection
        const db = mongoose.connection.db;
        
        // Clear existing categories
        const deleteResult = await db.collection('categories').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing categories`);
        
        // Prepare categories data
        const categories = categoriesData.map(cat => ({
            categoryName: cat.categoryName,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            icon: cat.icon,
            parentID: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        // Insert categories using native driver
        const insertResult = await db.collection('categories').insertMany(categories);
        console.log(`✅ Inserted ${insertResult.insertedCount} categories`);
        
        return categories;
        
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        throw error;
    }
};

const seedUsers = async () => {
    try {
        console.log('Seeding users...');
        
        const usersData = readJSON('users.json');
        if (!usersData.length) {
            console.warn('No users data found');
            return [];
        }
        
        console.log(`Found ${usersData.length} users to seed`);
        
        // Sử dụng native MongoDB driver thông qua mongoose connection
        const db = mongoose.connection.db;
        
        // Clear existing users
        const deleteResult = await db.collection('users').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing users`);
        
        // Prepare users data
        const users = usersData.map(user => ({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role,
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            shop: user.role?.includes('seller') ? {
                name: user.shop?.name || 'Default Shop',
                address: user.shop?.address || '',
                isActive: user.shop?.isActive !== false
            } : null,
            isActive: user.isActive !== false,
            profile_image: user.profile_image || 'https://source.unsplash.com/random/400x300',
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        // Insert users using native driver
        const insertResult = await db.collection('users').insertMany(users);
        console.log(`✅ Inserted ${insertResult.insertedCount} users`);
        
        return users;
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
};

const seedProducts = async (createdCategories, createdUsers) => {
    try {
        console.log('Seeding products...');
        
        const productsData = readJSON('products.json');
        if (!productsData.length) {
            console.warn('No products data found');
            return [];
        }
        
        console.log(`Found ${productsData.length} products to seed`);
        
        // Sử dụng native MongoDB driver thông qua mongoose connection
        const db = mongoose.connection.db;
        
        // Clear existing products
        const deleteResult = await db.collection('products').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing products`);
        
        // Get sellers from users
        const sellers = createdUsers.filter(user => 
            Array.isArray(user.role) ? user.role.includes('seller') : user.role === 'seller'
        );
        
        // Prepare products data
        const products = productsData.map((product, index) => {
            // Get category ID (single category)
            const categoryIndex = product.categoryID - 1;
            const categoryID = createdCategories.length > 0 && categoryIndex >= 0 && categoryIndex < createdCategories.length 
                ? createdCategories[categoryIndex]._id 
                : null;
            
            // Get seller ID
            const sellerID = sellers.length > 0 ? sellers[Math.floor(Math.random() * sellers.length)]._id : null;
            
            // Process images
            const images = product.images_url ? product.images_url.split(',').map((url, imgIndex) => ({
                url: url.trim() || 'https://source.unsplash.com/random/400x300',
                alt: product.images_alt || 'Product Image',
                isPrimary: imgIndex === 0
            })) : [{ 
                url: 'https://source.unsplash.com/random/400x300', 
                alt: 'Default Product Image', 
                isPrimary: true 
            }];
            
            return {
                name: product.name || `Product ${index + 1}`,
                slug: product.slug || `product-${index + 1}`,
                description: product.description || 'Product description',
                shortDescription: product.shortDescription || 'Short product description',
                sku: product.sku || `SKU-${index + 1}`,
                brand: product.brand || 'Default Brand',
                categoryID: categoryID,
                sellerID: sellerID,
                images: images,
                price: {
                    original: Number(product.price_original || 100000),
                    sale: Number(product.price_sale || 80000)
                },
                inventory: {
                    quantity: Number(product.inventory_quantity || 100),
                    lowStockThreshold: Number(product.inventory_lowStockThreshold || 10)
                },
                specifications: product.specifications || [],
                tags: product.tags ? product.tags.split(',').map(tag => tag.trim()) : [],
                rating: {
                    average: Number(product.rating_average || 4.5),
                    count: Number(product.rating_count || 25)
                },
                sold: Number(product.sold || Math.floor(Math.random() * 100)),
                views: Number(product.views || Math.floor(Math.random() * 500)),
                isActive: true,
                isFeatured: Math.random() > 0.7, // 30% chance to be featured
                isFlashSale: Math.random() > 0.8, // 20% chance to be flash sale
                flashSalePrice: Number(product.flashSalePrice || 60000),
                flashSaleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });
        
        // Insert products using native driver
        const insertResult = await db.collection('products').insertMany(products);
        console.log(`✅ Inserted ${insertResult.insertedCount} products`);
        
        return products;
        
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
};

const seedData = async () => {
    try {
        await connectForSeeding();
        
        const createdCategories = await seedCategories();
        const createdUsers = await seedUsers();
        await seedProducts(createdCategories, createdUsers);
        
        console.log('🎉 Data seeded successfully!');
        
    } catch (error) {
        console.error('❌ Seeding failed:', error.stack);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('✅ Disconnected from MongoDB');
        }
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT. Disconnecting...');
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    process.exit(0);
});

seedData();