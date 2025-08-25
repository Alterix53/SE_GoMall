import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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
        
        // Don't clear existing users - we'll use upsert instead
        console.log('Keeping existing users - will upsert new ones');
        
        // Prepare users data with hashed passwords
        const users = [];
        for (const user of usersData) {
            // Hash password if it's not already hashed
            let hashedPassword;
            if (user.password && user.password.startsWith('$2')) {
                // Password is already hashed
                hashedPassword = user.password;
            } else {
                // Hash the password
                const saltRounds = 10;
                hashedPassword = await bcrypt.hash(user.password || 'DefaultPass123', saltRounds);
            }
            
            users.push({
                username: user.username,
                password: hashedPassword,
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
            });
        }
        
        // Use upsert to avoid duplicates - update if exists, insert if not
        let insertedCount = 0;
        let updatedCount = 0;
        
        for (const user of users) {
            const result = await db.collection('users').updateOne(
                { 
                    $or: [
                        { email: user.email },
                        { username: user.username }
                    ]
                },
                { 
                    $setOnInsert: user,
                    $set: {
                        ...user,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            
            if (result.upsertedCount > 0) {
                insertedCount++;
            } else if (result.modifiedCount > 0) {
                updatedCount++;
            }
        }
        
        console.log(`✅ Upserted users: ${insertedCount} inserted, ${updatedCount} updated`);
        
        // Get all users (including existing ones) for product seeding
        const allUsers = await db.collection('users').find({}).toArray();
        return allUsers;
        
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
        
        // Get all sellers from sellers collection
        const sellers = await db.collection('sellers').find({}).toArray();
        console.log(`📊 Using ${sellers.length} sellers for product distribution`);
        
        if (sellers.length === 0) {
            console.warn('⚠️ No sellers found! Products will have null sellerID');
        }
        
        // Available brands for random selection
        const availableBrands = ['Apple', 'Samsung', 'Nike', 'Gucci'];
        
        // Prepare products data
        const products = productsData.map((product, index) => {
            // Get category ID (single category)
            const categoryIndex = product.categoryID - 1;
            const categoryID = createdCategories.length > 0 && categoryIndex >= 0 && categoryIndex < createdCategories.length 
                ? createdCategories[categoryIndex]._id 
                : null;
            
            // Get random seller ID from sellers collection
            const sellerID = sellers.length > 0 ? sellers[Math.floor(Math.random() * sellers.length)]._id : null;
            
            // Get random brand
            const randomBrand = availableBrands[Math.floor(Math.random() * availableBrands.length)];
            
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
                brand: randomBrand,
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
        
        // Show distribution of products across sellers
        const productDistribution = {};
        products.forEach(product => {
            const sellerId = product.sellerID?.toString() || 'No Seller';
            productDistribution[sellerId] = (productDistribution[sellerId] || 0) + 1;
        });
        
        console.log('📊 Product distribution across sellers:');
        for (const [sellerId, count] of Object.entries(productDistribution)) {
            const seller = sellers.find(s => s._id.toString() === sellerId);
            const sellerName = seller ? seller.businessName : 'No Seller';
            console.log(`   - ${sellerName}: ${count} products`);
        }
        
        return products;
        
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
};

const seedData = async () => {
    try {
        await connectForSeeding();
        
        console.log('🌱 Starting data seeding...');
        
        const createdCategories = await seedCategories();
        
        // Get all existing sellers from the database
        console.log('🔍 Getting all existing sellers...');
        const db = mongoose.connection.db;
        
        // Get all users with seller role
        const sellerUsers = await db.collection('users').find({
            $or: [
                { role: 'seller' },
                { role: { $in: ['seller'] } },
                { role: { $elemMatch: { $eq: 'seller' } } }
            ]
        }).toArray();
        
        console.log(`📊 Found ${sellerUsers.length} seller users`);
        sellerUsers.forEach(user => {
            console.log(`   - ${user.username} (${user.email})`);
        });
        
        // Get all sellers from sellers collection
        const sellers = await db.collection('sellers').find({}).toArray();
        console.log(`🏪 Found ${sellers.length} sellers in sellers collection`);
        sellers.forEach(seller => {
            const user = sellerUsers.find(u => u._id.toString() === seller.userID.toString());
            console.log(`   - ${seller.businessName} (${user?.username || 'Unknown'}) - Status: ${seller.status}`);
        });
        
        // Use all sellers for product seeding
        await seedProducts(createdCategories, sellerUsers);
        
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