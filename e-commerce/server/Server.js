import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env file. Please create .env from .env.example.");
    process.exit(1);
}

const app = express();

// Middleware CORS
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

const startServer = async () => {
    try {
        await connectDB();
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

        const PORT = process.env.PORT || 8080; // Sử dụng cổng an toàn
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();