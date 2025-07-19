import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js"; // Import trực tiếp
import './models/User.js'; // Đăng ký User
import './models/Product.js';
import './models/Category.js';
import './models/Order.js';
import './models/Cart.js';
import './models/Review.js';
import './models/Payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Định nghĩa trực tiếp URI và PORT với giá trị mặc định
const MONGODB_URI = "mongodb://localhost:27017/GoMall";
const PORT = process.env.PORT || 8080; // Linh hoạt hơn

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:3000', // Thay bằng frontend port (3000 cho React)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const startServer = async () => {
    try {
        await connectDB(MONGODB_URI);
        console.log("MongoDB Connected");

        app.use("/api/products", productRoutes); // Sử dụng trực tiếp

        app.use((err, req, res, next) => {
            console.error("Error middleware:", err.stack);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra!",
                error: process.env.NODE_ENV === "development" ? err.message : {},
            });
        });

        app.use((req, res) => {
            console.log("404 Not Found for path:", req.path);
            res.status(404).json({
                success: false,
                message: "API endpoint không tồn tại",
            });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();