import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import '../models/Order.js';
import '../models/Cart.js';
import '../models/Review.js';
import '../models/Payment.js';

// Lấy đường dẫn file hiện tại trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Current script directory:", __dirname); // Debug log

// Định nghĩa URI với tên database
const MONGODB_URI = "mongodb://localhost:27017/GoMall";

const connectDB = async () => {
    try {
        console.log("Attempting to connect with MONGODB_URI:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected for seeding");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

// Hàm đọc và parse JSON
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

// Hàm xử lý URL ảnh (sử dụng trực tiếp, không tải về)
const processImageUrl = async (url, filename) => {
    if (!url) {
        console.log("No URL provided, using fallback image");
        return 'https://source.unsplash.com/random/400x300';
    }
    // Thay thế URL không đáng tin cậy bằng fallback
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

    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(mappedCategories);

    for (let i = 0; i < categoriesData.length; i++) {
        if (categoriesData[i].parentID) {
            const parentIndex = categoriesData[i].parentID - 1;
            if (parentIndex >= 0 && parentIndex < createdCategories.length) {
                await Category.updateOne(
                    { _id: createdCategories[i]._id },
                    { parentID: createdCategories[parentIndex]._id }
                );
            }
        }
    }

    console.log("Categories seeded successfully:", createdCategories.map(c => ({ categoryName: c.categoryName, slug: c.slug, _id: c._id })));
    return createdCategories;
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
        shopName: user.shopName || (user.role === 'seller' ? 'Default Shop' : ''),
        isActive: user.isActive !== false,
        profile_image: user.profile_image || 'https://source.unsplash.com/random/400x300'
    }));

    await User.deleteMany({});
    const createdUsers = await User.insertMany(mappedUsers);
    const createdSellers = createdUsers.filter(u => u.role === 'seller'); // Lọc seller dựa trên role
    console.log("Users seeded successfully (including sellers):", createdUsers.map(u => ({ username: u.username, role: u.role, _id: u._id })));
    console.log("Sellers extracted:", createdSellers.map(s => ({ username: s.username, _id: s._id })));
    return { allUsers: createdUsers, sellers: createdSellers };
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
        const categoryID = createdCategories.length > 0 ? createdCategories[Math.floor(Math.random() * createdCategories.length)]._id : new mongoose.Types.ObjectId();
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
            flashSalePrice: Number(product.flashSalePrice || (product.price_sale * 0.9) || 0), // Fallback nếu price_sale undefined
            flashSaleEndDate: product.flashSaleEndDate && !isNaN(new Date(product.flashSaleEndDate)) ? new Date(product.flashSaleEndDate) : null
        };
    }));
    console.log("Mapped products:", mappedProducts);
    const validProducts = mappedProducts; // Bỏ filter tạm thời để đảm bảo tất cả sản phẩm được lưu
    console.log("Valid products after filter:", validProducts);
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(validProducts);
    console.log("Products seeded successfully:", createdProducts.map(p => ({ name: p.name, _id: p._id })));
    return createdProducts;
};

const seedData = async () => {
    try {
        await connectDB();

        console.log("Seeding categories from JSON...");
        const createdCategories = await seedCategories();

        console.log("Seeding users (including sellers) from JSON...");
        const { sellers: createdSellers } = await seedUsers();

        console.log("Seeding products from JSON...");
        await seedProducts(createdCategories, createdSellers);

        console.log("Data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();