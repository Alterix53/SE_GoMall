import mongoose from "mongoose";
import path from "path"; // Giữ module path
import { fileURLToPath } from "url"; // Giữ module url
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Seller from "../models/Seller.js";

// Lấy đường dẫn file hiện tại trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Định nghĩa trực tiếp URI với tên database khớp (GoMall)
const MONGODB_URI = "mongodb://localhost:27017/GoMall"; // Thay đổi thành GoMall

const connectDB = async () => {
    try {
        console.log("Attempting to connect with MONGODB_URI:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI); // Loại bỏ useNewUrlParser và useUnifiedTopology
        console.log("MongoDB Connected for seeding");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

const seedCategories = async () => {
    const categoriesData = [
        { categoryName: "Điện thoại", slug: "dien-thoai", description: "Điện thoại thông minh các loại", image: "/images/categories/phone.jpg", icon: "fas fa-mobile-alt" },
        { categoryName: "Laptop", slug: "laptop", description: "Máy tính xách tay", image: "/images/categories/laptop.jpg", icon: "fas fa-laptop" },
        { categoryName: "Thời trang", slug: "thoi-trang", description: "Sản phẩm thời trang", image: "/images/categories/clothes.jpg", icon: "fas fa-tshirt" },
        { categoryName: "Gia dụng", slug: "gia-dung", description: "Đồ dùng gia đình", image: "/images/categories/gia-dung.jpg", icon: "fas fa-home" },
        { categoryName: "Mỹ phẩm", slug: "my-pham", description: "Sản phẩm làm đẹp", image: "/images/categories/my-pham.jpg", icon: "fas fa-spa" },
        { categoryName: "Sách", slug: "sach", description: "Sách và tài liệu", image: "/images/categories/book.jpg", icon: "fas fa-book" },
        { categoryName: "Thể thao", slug: "the-thao", description: "Đồ thể thao", image: "/images/categories/the-thao.jpg", icon: "fas fa-dumbbell" },
        { categoryName: "Xe cộ", slug: "xe-co", description: "Phương tiện giao thông", image: "/images/categories/xe-co.jpg", icon: "fas fa-car" },
    ];

    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categoriesData);
    console.log("Categories seeded successfully:", createdCategories.map(c => ({ categoryName: c.categoryName, slug: c.slug, _id: c._id })));
    return createdCategories;
};

const seedSellers = async () => {
    const sellersData = [{ username: "seller1", password: "pass123", shopName: "TechShop", email: "techshop@example.com" }];
    await Seller.deleteMany({});
    const createdSellers = await Seller.insertMany(sellersData);
    console.log("Sellers seeded successfully:", createdSellers.map(s => s.shopName));
    return createdSellers;
};

const seedProducts = async (createdCategories, createdSellers) => {
    if (!createdCategories || !createdCategories.length) {
        throw new Error("No categories found to seed products. Created categories:", createdCategories);
    }
    if (!createdSellers || !createdSellers.length) {
        throw new Error("No sellers found to seed products. Created sellers:", createdSellers);
    }

    const products = [
        {
            name: "iPhone 15 Pro Max 256GB",
            slug: "iphone-15-pro-max-256gb",
            description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch",
            shortDescription: "iPhone 15 Pro Max - Đỉnh cao công nghệ",
            sku: "IP15PM256",
            brand: "Apple",
            categoryID: createdCategories.find((c) => c.slug === "dien-thoai")._id,
            sellerID: createdSellers[0]._id,
            images: [{ url: "/images/iphone-15.jpg", alt: "iPhone 15 Pro Max", isPrimary: true }],
            price: { original: 34990000, sale: 29990000 },
            inventory: { quantity: 100, lowStockThreshold: 10 },
            specifications: [
                { name: "Màn hình", value: "6.7 inch Super Retina XDR" },
                { name: "Chip", value: "A17 Pro" },
                { name: "Camera", value: "48MP + 12MP + 12MP" },
                { name: "Pin", value: "4441 mAh" },
            ],
            tags: ["iphone", "apple", "smartphone", "premium"],
            rating: { average: 4.8, count: 1234 },
            sold: 5234,
            views: 15678,
            isActive: true,
            isFeatured: true,
            isFlashSale: true,
            flashSaleEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 giờ từ bây giờ
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            slug: "samsung-galaxy-s24-ultra",
            description: "Samsung Galaxy S24 Ultra với camera 200MP và bút S Pen",
            shortDescription: "Galaxy S24 Ultra - Đỉnh cao Android",
            sku: "S24U",
            brand: "Samsung",
            categoryID: createdCategories.find((c) => c.slug === "dien-thoai")._id,
            sellerID: createdSellers[0]._id,
            images: [{ url: "/images/samsung-s24.jpg", alt: "Samsung Galaxy S24 Ultra", isPrimary: true }],
            price: { original: 31990000, sale: 25990000 },
            inventory: { quantity: 50, lowStockThreshold: 5 },
            specifications: [
                { name: "Màn hình", value: "6.8 inch Dynamic AMOLED 2X" },
                { name: "Chip", value: "Snapdragon 8 Gen 3" },
                { name: "Camera", value: "200MP + 12MP + 10MP" },
                { name: "Pin", value: "5000 mAh" },
            ],
            tags: ["samsung", "smartphone", "premium"],
            rating: { average: 4.7, count: 890 },
            sold: 3456,
            views: 12345,
            isActive: true,
            isFlashSale: true,
            flashSaleEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    ];

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(products);
    console.log("Products seeded successfully:", createdProducts.map(p => p.name));
    return createdProducts;
};

const seedData = async () => {
    try {
        await connectDB();

        console.log("Seeding categories...");
        const createdCategories = await seedCategories();

        console.log("Seeding sellers...");
        const createdSellers = await seedSellers();

        console.log("Seeding products...");
        await seedProducts(createdCategories, createdSellers);

        console.log("Data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();