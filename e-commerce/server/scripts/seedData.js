import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Seller from '../models/Seller.js';

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
        
        // Kiểm tra categories đã tồn tại
        const existingCategories = await db.collection('categories').find({}).toArray();
        console.log(`Found ${existingCategories.length} existing categories in database`);
        
        if (existingCategories.length > 0) {
            console.log('Categories already exist. Skipping category seeding to preserve existing data.');
            return existingCategories;
        }
        
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
        
        // Check existing users to avoid duplicates
        const existingUsers = await db.collection('users').find({}).toArray();
        console.log(`Found ${existingUsers.length} existing users in database`);
        
        if (existingUsers.length > 0) {
            console.log('Users already exist. Skipping user seeding to preserve existing data.');
            return existingUsers;
        }
        
        // Prepare users data for new insertion
        const users = usersData.map(user => ({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role ? [user.role] : ['user'],
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            isActive: user.isActive !== false,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        // Insert new users using native driver
        const insertResult = await db.collection('users').insertMany(users);
        console.log(`✅ Inserted ${insertResult.insertedCount} new users`);
        
        return users;
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
};

const seedSellers = async (users) => {
    try {
        console.log('Seeding sellers...');
        
        const db = mongoose.connection.db;
        
        // Check existing sellers
        const existingSellers = await db.collection('sellers').find({}).toArray();
        console.log(`Found ${existingSellers.length} existing sellers in database`);
        
        if (existingSellers.length > 0) {
            console.log('Sellers already exist. Skipping seller seeding to preserve existing data.');
            return existingSellers;
        }
        
        // Create sellers for users with seller role
        const sellers = users
            .filter(user => Array.isArray(user.role) ? user.role.includes('seller') : user.role === 'seller')
            .map(user => ({
                userID: user._id,
                shopName: user.fullName ? `${user.fullName}'s Shop` : 'Default Shop',
                description: 'Welcome to our shop!',
                address: user.address || '',
                phone: user.phoneNumber || '',
                email: user.email,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        
        if (sellers.length === 0) {
            console.log('No users with seller role found');
            return [];
        }
        
        const insertResult = await db.collection('sellers').insertMany(sellers);
        console.log(`✅ Inserted ${insertResult.insertedCount} sellers`);
        
        return sellers;
        
    } catch (error) {
        console.error('❌ Error seeding sellers:', error);
        throw error;
    }
};

const sevenDaysLater = () => new Date(Date.now() + 7*24*60*60*1000);

const seedProducts = async (createdCategories, createdUsers, createdSellers) => {
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
        
        // Check existing products to determine what needs to be updated or added
        const existingProducts = await db.collection('products').find({}).toArray();
        console.log(`Found ${existingProducts.length} existing products in database`);
        
        // Get sellers from created sellers
        const sellers = createdSellers || [];
        
        // Prepare products data for comparison and insertion
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
                isFeatured: product.isFeatured || false,
                isFlashSale: product.isFlashSale === true,
                flashSalePrice: product.flashSalePrice || (product.isFlashSale === true ? Math.round(product.price_sale * 0.9) : null),
                flashSaleEndDate: product.isFlashSale === true ? (product.isFlashSaleEndDate ? new Date(product.isFlashSaleEndDate) : sevenDaysLater()) : null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });
        
        // Separate products into new, existing, and unchanged
        const existingProductNames = existingProducts.map(p => p.name);
        const newProducts = products.filter(product => !existingProductNames.includes(product.name));
        const existingProductsToUpdate = products.filter(product => existingProductNames.includes(product.name));
        
        console.log(`Found ${newProducts.length} new products to insert`);
        console.log(`Found ${existingProductsToUpdate.length} existing products to check for updates`);
        
        let insertedProducts = [];
        let updatedProducts = [];
        
        // Insert new products
        if (newProducts.length > 0) {
            const insertResult = await db.collection('products').insertMany(newProducts);
            console.log(`✅ Inserted ${insertResult.insertedCount} new products`);
            insertedProducts = newProducts;
        }
        
        // Check and update existing products if needed
        if (existingProductsToUpdate.length > 0) {
            for (const product of existingProductsToUpdate) {
                const existingProduct = existingProducts.find(ep => ep.name === product.name);
                
                // Check if product needs update (compare key fields)
                const needsUpdate = 
                    existingProduct.price.original !== product.price.original ||
                    existingProduct.price.sale !== product.price.sale ||
                    existingProduct.inventory.quantity !== product.inventory.quantity ||
                    existingProduct.isFlashSale !== product.isFlashSale ||
                    existingProduct.flashSalePrice !== product.flashSalePrice;
                
                if (needsUpdate) {
                    const updateResult = await db.collection('products').updateOne(
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
                                updatedAt: new Date()
                            }
                        }
                    );
                    
                    if (updateResult.modifiedCount > 0) {
                        updatedProducts.push(product);
                        console.log(`🔄 Updated product: ${product.name}`);
                    }
                } else {
                    console.log(`⏭️  Product unchanged, skipping: ${product.name}`);
                }
            }
        }
        
        console.log(`📊 Summary: ${insertedProducts.length} new products inserted, ${updatedProducts.length} existing products updated`);
        return [...insertedProducts, ...updatedProducts];
        
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
};

const seedReviews = async (products, users) => {
    try {
        console.log('Seeding reviews...');
        
        const reviewsData = readJSON('reviews.json');
        if (!reviewsData.length) {
            console.warn('No reviews data found');
            return [];
        }
        
        console.log(`Found ${reviewsData.length} reviews to seed`);
        
        const db = mongoose.connection.db;
        
        // Kiểm tra reviews đã tồn tại
        const existingReviews = await db.collection('reviews').find({}).toArray();
        console.log(`Found ${existingReviews.length} existing reviews in database`);
        
        if (existingReviews.length > 0) {
            console.log('Reviews already exist. Skipping review seeding to preserve existing data.');
            return existingReviews;
        }
        
        // Map reviews data to actual product and user IDs
        const reviews = reviewsData.map(reviewData => {
            // Tìm product thực tế
            const product = products.find(p => p.name.includes(reviewData.productID.replace('product_', '')) || 
                                              p._id.toString().includes(reviewData.productID.replace('product_', '')));
            
            // Tìm user thực tế
            const user = users.find(u => u.username.includes(reviewData.userID.replace('user_', '')) || 
                                        u._id.toString().includes(reviewData.userID.replace('user_', '')));
            
            if (!product || !user) {
                console.warn(`Skipping review: product or user not found for ${reviewData.productID} - ${reviewData.userID}`);
                return null;
            }
            
            return {
                productID: product._id,
                userID: user._id,
                rating: reviewData.rating,
                comment: reviewData.comment,
                createdAt: new Date(reviewData.createdAt),
                updatedAt: new Date(reviewData.createdAt)
            };
        }).filter(review => review !== null);
        
        if (reviews.length === 0) {
            console.warn('No valid reviews to insert');
            return [];
        }
        
        // Insert reviews
        const insertResult = await db.collection('reviews').insertMany(reviews);
        console.log(`✅ Inserted ${insertResult.insertedCount} reviews`);
        
        // Cập nhật rating trung bình cho các sản phẩm
        console.log('Updating product ratings...');
        for (const product of products) {
            const productReviews = reviews.filter(r => r.productID.toString() === product._id.toString());
            if (productReviews.length > 0) {
                const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
                const roundedRating = Math.round(avgRating * 10) / 10;
                
                await db.collection('products').updateOne(
                    { _id: product._id },
                    { 
                        $set: { 
                            averageRating: roundedRating,
                            totalReviews: productReviews.length
                        }
                    }
                );
                console.log(`📊 Updated product ${product.name}: ${roundedRating}⭐ (${productReviews.length} reviews)`);
            }
        }
        
        return reviews;
        
    } catch (error) {
        console.error('❌ Error seeding reviews:', error);
        throw error;
    }
};

const seedData = async () => {
    try {
        await connectForSeeding();
        
        const createdCategories = await seedCategories();
        const createdUsers = await seedUsers();
        const createdSellers = await seedSellers(createdUsers);
        const createdProducts = await seedProducts(createdCategories, createdUsers, createdSellers);
        await seedReviews(createdProducts, createdUsers);
        
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