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
import productService from './services/productService.js';
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

// Endpoint Flash Sale (delegate to service; use real-time date)
app.get('/api/products/flash-sale', async (req, res) => {
    try {
        // Reuse the same logic as controllers/service to avoid drift
        const result = await productService.getFlashSaleProducts(req.query);
        res.json({ success: true, data: result, message: 'Get flash sale list successfully' });
    } catch (error) {
        console.error('Error fetching flash sale products:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);  // Thêm prefix /api/cart
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);  // Thêm order routes
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