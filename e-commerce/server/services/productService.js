import Product from "../models/Product.js";
import Category from "../models/Category.js";

class ProductService {
    // Build filter object from query parameters
    async buildFilter(query) {
        const filter = { isActive: true };
        const andConditions = [];

        // Category filtering: accept either category id (ObjectId string) or category name
        if (query.category) {
            const raw = Array.isArray(query.category)
                ? query.category
                : String(query.category).split(",");
            const values = raw.map((v) => String(v).trim()).filter(Boolean);
            const objectIdRegex = /^[a-fA-F0-9]{24}$/;
            const idValues = values.filter((v) => objectIdRegex.test(v));
            const nameValues = values.filter((v) => !objectIdRegex.test(v));

            let categoryIds = [...idValues];
            if (nameValues.length > 0) {
                const regexes = nameValues.map((n) => new RegExp(n, "i"));
                const categories = await Category.find(
                    { categoryName: { $in: regexes } },
                    "_id"
                ).lean();
                categoryIds.push(...categories.map((c) => c._id));
            }
            
            // Use OR logic for categories since products typically belong to only one category
            if (categoryIds.length > 0) {
                andConditions.push({ categoryID: { $in: categoryIds } });
            }
        }

        // Brand filter - only filter on brand field with OR logic
        if (query.brand) {
            const raw = Array.isArray(query.brand)
                ? query.brand
                : String(query.brand).split(",");
            const values = raw.map((v) => String(v).trim()).filter(Boolean);
            if (values.length > 0) {
                // Use OR logic for brands since products typically have only one brand
                // Only filter on the brand field, not tags or name
                const brandConditions = values.map((v) => ({
                    brand: { $regex: v, $options: 'i' }
                }));
                
                andConditions.push({ $or: brandConditions });
            }
        }

        // Price range: match either sale or original price
        if (query.minPrice || query.maxPrice) {
            const priceFilter = {};
            if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
            if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);
            andConditions.push({ $or: [
                { "price.sale": priceFilter },
                { "price.original": priceFilter },
            ]});
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

        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }
        return filter;
    }

    // Build sort object from query parameters
    buildSort(query) {
        const sort = {};
        if (query.search) sort.score = { $meta: "textScore" };
        sort[query.sortBy || "createdAt"] = query.sortOrder === "asc" ? 1 : -1;
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

    // Search products
    async searchProducts(query, options = {}) {
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const numericPage = Number(page);
        const numericLimit = Number(limit);

        // Special handling for price sort using computed effectivePrice
        if (sortBy === 'price' || sortBy === '-price') {
            const order = sortBy === 'price' ? 1 : -1;
            const pipeline = [
                { $match: query },
                { $addFields: { effectivePrice: { $ifNull: ["$price.sale", "$price.original"] } } },
                { $sort: { effectivePrice: order } },
                { $skip: (numericPage - 1) * numericLimit },
                { $limit: numericLimit },
            ];
            const [products, totalArr] = await Promise.all([
                Product.aggregate(pipeline),
                Product.aggregate([{ $match: query }, { $count: 'total' }])
            ]);
            const total = totalArr[0]?.total || 0;
            const populated = await Product.populate(products, [
                { path: 'categoryID', select: 'categoryName slug' },
                { path: 'sellerID', select: 'name businessName rating followers' }
            ]);
            return {
                products: this.addDiscountToProducts(populated),
                pagination: {
                    current: numericPage,
                    pages: Math.ceil(total / numericLimit),
                    total,
                    limit: numericLimit,
                },
            };
        }

        // Default: simple find with sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const products = await Product.find(query)
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "name businessName rating followers")
            .sort(sort)
            .limit(numericLimit)
            .skip((numericPage - 1) * numericLimit)
            .lean();

        const total = await Product.countDocuments(query);

        return {
            products: this.addDiscountToProducts(products),
            pagination: {
                current: numericPage,
                pages: Math.ceil(total / numericLimit),
                total,
                limit: numericLimit,
            },
        };
    }

    // Get all products with filtering and pagination
    async getAllProducts(query) {
        const { page = 1, limit = 12 } = query;
        const filter = await this.buildFilter(query);
        const sort = this.buildSort(query);

        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .populate("sellerID", "name businessName rating followers")
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
            .populate("sellerID", "name businessName rating followers")
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
            .populate("sellerID", "name businessName rating followers")
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
                    flashSaleCount: { $sum: { $cond: [{ $eq: ["$isFlashSale", true] }, 1, 0] } },
                    featuredCount: { $sum: { $cond: [{ $eq: ["$isFeatured", true] }, 1, 0] } }
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
            .populate("sellerID", "name businessName rating followers")
            .lean();

        if (!product) {
            throw new Error("Product not found");
        }

        return {
            ...product,
            discount: this.calculateDiscount(product),
        };
    }

    // Create product
    async createProduct(productData) {
        
        if (!productData.name || !productData.categoryID || !productData.sellerID) {
            throw new Error("Thiếu thông tin bắt buộc: tên sản phẩm, danh mục, người bán");
        }
        if (!productData.sku) {
            productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        }
        if (!productData.slug) {
            productData.slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
        }
        
        // Fix: Only process price and inventory if they haven't been processed yet
        // (Controller should have already processed FormData bracket notation)
        if (productData.price && typeof productData.price === 'object') {
            // Price already processed by controller
            productData.price = {
                original: Number(productData.price.original || 0),
                sale: Number(productData.price.sale || 0)
            };
        }
        
        if (productData.inventory && typeof productData.inventory === 'object') {
            // Inventory already processed by controller
            productData.inventory = {
                quantity: Number(productData.inventory.quantity || 0),
                lowStockThreshold: Number(productData.inventory.lowStockThreshold || 10)
            };
        }
        
        productData.rating = {
            average: Number(productData.rating?.average || 0),
            count: Number(productData.rating?.count || 0)
        };
        
        const product = new Product(productData);
        await product.save();
        return product.populate("categoryID", "categoryName slug");
    }

    // Update product
    async updateProduct(productId, updateData, sellerId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        if (product.sellerID.toString() !== sellerId.toString()) {
            throw new Error("Không có quyền cập nhật sản phẩm này");
        }
        
        // Fix: Only process price and inventory if they haven't been processed yet
        // (Controller should have already processed FormData bracket notation)
        if (updateData.price && typeof updateData.price === 'object') {
            // Price already processed by controller
            updateData.price = {
                original: Number(updateData.price.original || 0),
                sale: Number(updateData.price.sale || 0)
            };
        }
        
        if (updateData.inventory && typeof updateData.inventory === 'object') {
            // Inventory already processed by controller
            updateData.inventory = {
                quantity: Number(updateData.inventory.quantity || 0),
                lowStockThreshold: Number(updateData.inventory.lowStockThreshold || 10)
            };
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        ).populate("categoryID", "categoryName slug");
        
        return updatedProduct;
    }

    // Delete product
    async deleteProduct(productId, sellerId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        if (product.sellerID.toString() !== sellerId.toString()) {
            throw new Error("Không có quyền xóa sản phẩm này");
        }
        await Product.findByIdAndDelete(productId);
        return true;
    }

    // Get products by seller
    async getProductsBySeller(sellerId, query = {}) {
        const { page = 1, limit = 12 } = query;
        const filter = { sellerID: sellerId };
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true';
        }
        const products = await Product.find(filter)
            .populate("categoryID", "categoryName slug")
            .sort({ createdAt: -1 })
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
}

export default new ProductService(); 