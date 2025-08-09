// <DOCUMENT filename="Server.js">
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; // Import cart routes
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Product from './models/Product.js';
import Category from './models/Category.js';
import './models/User.js';
import './models/Order.js';
import './models/Cart.js';
import './models/Review.js';
import './models/Payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = "mongodb://localhost:27017/GoMall";
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint Flash Sale
app.get('/api/products/flash-sale', async (req, res) => {
    try {
        const currentDate = new Date('2025-07-23T23:59:00+07:00'); // Thời gian hiện tại: 23/07/2025 11:59 PM +07
        console.log("Current date for flash sale:", currentDate.toISOString());
        const products = await Product.find({
            isFlashSale: true,
            flashSaleEndDate: { $gte: currentDate }
        }).sort({ createdAt: 1 });
        console.log("Flash sale products from DB raw:", products.map(p => ({
            name: p.name,
            flashSaleEndDate: p.flashSaleEndDate ? p.flashSaleEndDate.toISOString() : null,
            isActive: p.isActive,
            _id: p._id
        })));
        if (products.length === 0) {
            console.warn("No flash sale products found, checking DB or date filter");
            await Product.find().then(all => console.log("All products in DB:", all.map(p => ({
                name: p.name,
                isFlashSale: p.isFlashSale,
                flashSaleEndDate: p.flashSaleEndDate ? p.flashSaleEndDate.toISOString() : null
            }))));
        }
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    current: 1,
                    pages: Math.ceil(products.length / 12),
                    total: products.length,
                    limit: 12
                }
            }
        });
    } catch (error) {
        console.error("Error fetching flash sale products:", error.stack);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Endpoint để lấy sản phẩm theo danh mục
app.get('/api/products/category/:categoryName', async (req, res) => {
    try {
        const categoryName = decodeURIComponent(req.params.categoryName);
        console.log("Requested category:", categoryName);
        const category = await Category.findOne({ categoryName });
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }
        const products = await Product.find({ categoryID: category._id, isActive: true }).sort({ createdAt: 1 });
        console.log(`Products for category ${categoryName}:`, products.map(p => p.name));
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    current: 1,
                    pages: Math.ceil(products.length / 12),
                    total: products.length,
                    limit: 12
                }
            }
        });
    } catch (error) {
        console.error("Error fetching products by category:", error.stack);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Simple categories endpoint for testing
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ categoryName: 1 });
        res.json({
            success: true,
            data: { categories },
            message: "Get categories list successfully"
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Test route for debugging
app.post('/api/test-register', express.json(), async (req, res) => {
    console.log('Test register endpoint hit');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.json({ success: true, message: 'Test endpoint working' });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);  // Thêm prefix /api/cart
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// app.use("/api/auth", userRoutes); // Mount auth routes trước



app.use((err, req, res, next) => {
    console.error("Error middleware:", err.stack);
    res.status(500).json({
        success: false,
        message: "An error occurred!",
        error: process.env.NODE_ENV === "development" ? err.message : {},
    });
});

app.use((req, res) => {
    console.log("404 Not Found for path:", req.path);
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

const startServer = async () => {
    try {
        await connectDB(MONGODB_URI);
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.stack);
        process.exit(1);
    }
};

startServer();
// </DOCUMENT>