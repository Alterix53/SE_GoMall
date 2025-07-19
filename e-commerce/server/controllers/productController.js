import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getAllProducts = async (req, res) => {
    try {
        console.log("Request to /api/products received:", req.query);
        const { page = 1, limit = 12, ...query } = req.query;
        const filter = { isActive: true };

        console.log("Initial filter:", JSON.stringify(filter)); // Debug filter ban đầu
        if (query.category) {
            filter.categoryID = query.category;
            console.log("Added category filter:", filter.categoryID);
        }
        if (query.brand) {
            filter.brand = new RegExp(query.brand, "i");
            console.log("Added brand filter:", filter.brand);
        }
        if (query.minPrice || query.maxPrice) {
            filter.$or = [
                { "price.sale": { ...(query.minPrice && { $gte: Number(query.minPrice) }), ...(query.maxPrice && { $lte: Number(query.maxPrice) }) } },
                { "price.original": { ...(query.minPrice && { $gte: Number(query.minPrice) }), ...(query.maxPrice && { $lte: Number(query.maxPrice) }) }, "price.sale": { $exists: false } },
            ];
            console.log("Added price filter:", filter.$or);
        }
        if (query.rating) {
            filter["rating.average"] = { $gte: Number(query.rating) };
            console.log("Added rating filter:", filter["rating.average"]);
        }
        if (query.search) {
            filter.$text = { $search: query.search };
            console.log("Added search filter:", filter.$text);
        }
        if (query.isFlashSale === "true") {
            filter.isFlashSale = true;
            filter.flashSaleEndDate = { $gt: new Date() };
            console.log("Added flashSale filter:", filter.isFlashSale, filter.flashSaleEndDate);
        }
        if (query.isFeatured === "true") {
            filter.isFeatured = true;
            console.log("Added featured filter:", filter.isFeatured);
        }

        const sort = {};
        if (query.search) sort.score = { $meta: "textScore" };
        sort[query.sortBy || "createdAt"] = query.sortOrder === "desc" ? -1 : 1;
        console.log("Sort criteria:", sort);

        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "shopName username") // Thêm populate cho sellerID
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        console.log("Found products before mapping:", products); // Debug sản phẩm trước khi mapping
        const total = await Product.countDocuments(filter);
        console.log("Total products found:", total);

        console.log("Responding with products:", products);
        res.json({
            success: true,
            data: {
                products: products.map(product => ({
                    ...product,
                    discount: product.price.original && product.price.sale
                        ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                        : 0,
                })),
                pagination: {
                    current: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    total,
                    limit: Number(limit),
                },
            },
        });
    } catch (error) {
        console.error("Error in getAllProducts:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getFlashSaleProducts = async (req, res) => {
    try {
        console.log("Request to /api/products/flash-sale received:", req.query);
        const { page = 1, limit = 12 } = req.query;
        const filter = {
            isActive: true,
            isFlashSale: true,
            flashSaleEndDate: { $gt: new Date() },
        };

        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "shopName username") // Thêm populate cho sellerID
            .sort({ flashSaleEndDate: 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Product.countDocuments(filter);

        console.log("Responding with flash sale products:", products);
        res.json({
            success: true,
            data: {
                products: products.map(product => ({
                    ...product,
                    discount: product.price.original && product.price.sale
                        ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                        : 0,
                })),
                pagination: {
                    current: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    total,
                    limit: Number(limit),
                },
            },
        });
    } catch (error) {
        console.error("Error in getFlashSaleProducts:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        console.log("Request to /api/products/top-products received:", req.query);
        const { type = "bestseller", page = 1, limit = 12 } = req.query;
        let sort = {};
        switch (type) {
            case "bestseller":
                sort = { sold: -1 };
                break;
            case "trending":
                sort = { views: -1, createdAt: -1 };
                break;
            case "hot":
                sort = { "rating.average": -1, sold: -1 };
                break;
            default:
                sort = { sold: -1 };
        }

        const products = await Product.find({ isActive: true })
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "shopName username") // Thêm populate cho sellerID
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Product.countDocuments({ isActive: true });

        console.log("Responding with top products:", products);
        res.json({
            success: true,
            data: {
                products: products.map(product => ({
                    ...product,
                    discount: product.price.original && product.price.sale
                        ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                        : 0,
                })),
                pagination: {
                    current: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    total,
                    limit: Number(limit),
                },
                type,
            },
        });
    } catch (error) {
        console.error("Error in getTopProducts:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "shopName username") // Thêm populate cho sellerID
            .lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
        }
        res.json({
            success: true,
            data: { product },
        });
    } catch (error) {
        console.error("Error in getProductById:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};