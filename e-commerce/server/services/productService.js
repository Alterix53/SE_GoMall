import Product from "../models/Product.js";
import Category from "../models/Category.js";

class ProductService {
    // Build filter object from query parameters
    buildFilter(query) {
        const filter = { isActive: true };

        if (query.category) {
            filter.categoryID = query.category;
        }
        if (query.brand) {
            filter.brand = new RegExp(query.brand, "i");
        }
        if (query.minPrice || query.maxPrice) {
            filter.$or = [
                { 
                    "price.sale": { 
                        ...(query.minPrice && { $gte: Number(query.minPrice) }), 
                        ...(query.maxPrice && { $lte: Number(query.maxPrice) }) 
                    } 
                },
                { 
                    "price.original": { 
                        ...(query.minPrice && { $gte: Number(query.minPrice) }), 
                        ...(query.maxPrice && { $lte: Number(query.maxPrice) }) 
                    }, 
                    "price.sale": { $exists: false } 
                },
            ];
        }
        if (query.rating) {
            filter["rating.average"] = { $gte: Number(query.rating) };
        }
        if (query.search) {
            filter.$text = { $search: query.search };
        }
        if (query.isFlashSale === "true") {
            filter.isFlashSale = true;
            filter.flashSaleEndDate = { $gt: new Date() };
        }
        if (query.isFeatured === "true") {
            filter.isFeatured = true;
        }

        return filter;
    }

    // Build sort object from query parameters
    buildSort(query) {
        const sort = {};
        if (query.search) sort.score = { $meta: "textScore" };
        sort[query.sortBy || "createdAt"] = query.sortOrder === "desc" ? -1 : 1;
        return sort;
    }

    // Calculate discount percentage
    calculateDiscount(product) {
        if (product.price.original && product.price.sale) {
            return Math.round(((product.price.original - product.price.sale) / product.price.original) * 100);
        }
        return 0;
    }

    // Add discount to products
    addDiscountToProducts(products) {
        return products.map(product => ({
            ...product,
            discount: this.calculateDiscount(product),
        }));
    }

    // Get all products with filtering and pagination
    async getAllProducts(query) {
        const { page = 1, limit = 12 } = query;
        const filter = this.buildFilter(query);
        const sort = this.buildSort(query);

        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Product.countDocuments(filter);

        return {
            products: this.addDiscountToProducts(products),
            pagination: {
                current: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
                limit: Number(limit),
            },
        };
    }

    // Get flash sale products
    async getFlashSaleProducts(query) {
        const { page = 1, limit = 12 } = query;
        const filter = {
            isActive: true,
            isFlashSale: true,
            flashSaleEndDate: { $gt: new Date() },
        };

        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .sort({ flashSaleEndDate: 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Product.countDocuments(filter);

        return {
            products: this.addDiscountToProducts(products),
            pagination: {
                current: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
                limit: Number(limit),
            },
        };
    }

    // Get top products by type
    async getTopProducts(query) {
        const { type = "bestseller", page = 1, limit = 12 } = query;
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
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Product.countDocuments({ isActive: true });

        return {
            products: this.addDiscountToProducts(products),
            pagination: {
                current: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
                limit: Number(limit),
            },
            type,
        };
    }

    // Get product statistics
    async getProductStats() {
        const stats = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalCategories: { $addToSet: "$categoryID" },
                    avgPrice: { $avg: "$price.original" },
                    avgRating: { $avg: "$rating.average" },
                    totalSold: { $sum: "$sold" },
                    totalViews: { $sum: "$views" },
                    flashSaleCount: {
                        $sum: { $cond: [{ $eq: ["$isFlashSale", true] }, 1, 0] }
                    },
                    featuredCount: {
                        $sum: { $cond: [{ $eq: ["$isFeatured", true] }, 1, 0] }
                    }
                }
            }
        ]);

        const categoryStats = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $group: {
                    _id: "$category.categoryName",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$price.original" },
                    totalSold: { $sum: "$sold" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return {
            overview: stats[0] || {
                totalProducts: 0,
                totalCategories: 0,
                avgPrice: 0,
                avgRating: 0,
                totalSold: 0,
                totalViews: 0,
                flashSaleCount: 0,
                featuredCount: 0
            },
            byCategory: categoryStats
        };
    }

    // Get product by ID
    async getProductById(productId) {
        const product = await Product.findById(productId)
            .populate("categoryID", "categoryName slug")
            .lean();

        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        return {
            ...product,
            discount: this.calculateDiscount(product),
        };
    }
}

export default new ProductService(); 