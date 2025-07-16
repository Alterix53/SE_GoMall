import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Định nghĩa trực tiếp URI và PORT với giá trị mặc định
const MONGODB_URI = "mongodb://localhost:27017/GoMall"; // Đảm bảo khớp với seedData.js
const PORT = 8080;

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:8080',
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

        const productRoutes = await import("./routes/productRoutes.js");
        app.use("/api/products", productRoutes.default);

        app.use((err, req, res, next) => {
            console.error("Error middleware:", err.stack);
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra!",
                error: process.env.NODE_ENV === "development" ? err.message : {},
            });
        });

        app.use((req, res) => {
            console.log("404 Not Found for path:", req.path);
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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