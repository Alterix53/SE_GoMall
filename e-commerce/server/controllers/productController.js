import productService from "../services/productService.js";
import Category from "../models/Category.js";
import ResponseHandler from "../utils/responseHandler.js";
import { uploadProductImages, handleUploadError } from "../middleware/upload.js";

// Get all products with filtering and pagination
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products received:", req.query);
    const result = await productService.getAllProducts(req.query);
    console.log("Responding with products:", result.products);
    ResponseHandler.success(res, result, "Get product list successfully");
});

// Get flash sale products
export const getFlashSaleProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/flash-sale received:", req.query);
    const result = await productService.getFlashSaleProducts(req.query);
    console.log("Responding with flash sale products:", result.products);
    ResponseHandler.success(res, result, "Get flash sale list successfully");
});

// Get top products by type
export const getTopProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/top-products received:", req.query);
    const result = await productService.getTopProducts(req.query);
    console.log("Responding with top products:", result.products);
    ResponseHandler.success(res, result, "Get featured products list successfully");
});

// Get product statistics
export const getProductStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/stats received");
    const result = await productService.getProductStats();
    ResponseHandler.success(res, result, "Get product statistics successfully");
});

// Search products
export const searchProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to search products:", req.query);
    try {
        const { keyword, sortBy, page = 1, limit = 12 } = req.query;
        // Start from generic filter to support price/category/rating, etc.
        let query = productService.buildFilter(req.query);
        // Keyword search
        if (keyword) {
            console.log('Searching for keyword:', keyword);
            const words = keyword.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length > 0) {
                query.$and = words.map(word => ({
                    $or: [
                        { name: { $regex: word, $options: 'i' } },
                        { description: { $regex: word, $options: 'i' } },
                        { brand: { $regex: word, $options: 'i' } }
                    ]
                }));
            }
            console.log('Search query:', JSON.stringify(query));
        }
        // Optional category/brand helpers (accept CSV and map to ObjectIds)
        if (req.query.category) {
            const values = String(req.query.category).split(',').map(s => s.trim()).filter(Boolean);
            if (values.length) {
                const categories = await Category.find({
                    $or: [
                        { _id: { $in: values } },
                        { categoryName: { $in: values } },
                        { slug: { $in: values } }
                    ]
                }).distinct('_id');
                if (categories.length) {
                    query.categoryID = { $in: categories };
                }
            }
        }
        // Execute search
        const products = await productService.searchProducts(query, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: sortBy || 'createdAt',
            sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc'
        });
        console.log(`Found ${products.products.length} products for keyword: ${keyword}`);
        ResponseHandler.success(res, products, "Search products successfully");
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
});

// =================== ENHANCED GET PRODUCT BY ID ===================
// Get product by ID with detailed information for ProductDetail page
export const getProductById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get product by ID:", req.params.id);
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return ResponseHandler.notFound(res, "Sản phẩm không tồn tại");
        }
        
        // Normalize product data for frontend compatibility
        const normalizedProduct = {
            id: product._id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: {
                // Kiểm tra xem bạn có field nào cho giá gốc và giá sale
                original: product.originalPrice || product.price,
                sale: product.salePrice || product.price,
            },
            // Chuyển đổi images format
            images: product.images?.map(img => typeof img === 'string' ? img : img.url) || [],
            rating: {
                average: product.rating || 0,
                count: product.reviewCount || 0,
            },
            sold: product.sold || 0,
            inventory: {
                quantity: product.inventory || product.stock || 0,
                status: (product.inventory || product.stock || 0) > 0 ? 'in_stock' : 'out_of_stock'
            },
            // Các thuộc tính khác
            sizes: product.sizes || [],
            colors: product.colors || [],
            category: product.categoryID || {},
            brand: product.brand || '',
            features: product.features || [],
            specifications: product.specifications || {},
            tags: product.tags || [],
            seller: {
                id: product.sellerID,
                name: product.sellerName || 'Shop'
            },
            status: product.isActive ? 'active' : 'inactive',
            created_at: product.createdAt,
            updated_at: product.updatedAt
        };
        
        ResponseHandler.success(res, { product: normalizedProduct }, "Get product information successfully");
        
    } catch (error) {
        console.error("Error getting product by ID:", error);
        if (error.message === "Product not found") {
            ResponseHandler.notFound(res, error.message);
        } else {
            throw error;
        }
    }
});

// =================== NEW: GET RELATED PRODUCTS ===================
// Get related products based on category and tags
export const getRelatedProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get related products for:", req.params.id);
    
    try {
        const { id } = req.params;
        const { limit = 8 } = req.query;
        
        // Get current product to find related ones
        const currentProduct = await productService.getProductById(id);
        
        if (!currentProduct) {
            return ResponseHandler.notFound(res, "Sản phẩm không tồn tại");
        }
        
        // Build query for related products
        const query = {
            isActive: true,
            _id: { $ne: id }, // Exclude current product
            $or: [
                { categoryID: currentProduct.categoryID },
                { brand: currentProduct.brand },
                { tags: { $in: currentProduct.tags || [] } }
            ]
        };
        
        const relatedProducts = await productService.getRelatedProducts(query, {
            limit: parseInt(limit),
            sortBy: 'sold' // Sort by popularity
        });
        
        // Normalize related products
        const normalizedRelated = relatedProducts.map(product => ({
            id: product._id,
            name: product.name,
            slug: product.slug,
            price: {
                original: product.originalPrice || product.price,
                sale: product.salePrice || product.price,
            },
            images: product.images?.map(img => typeof img === 'string' ? img : img.url) || [],
            rating: {
                average: product.rating || 0
            },
            sold: product.sold || 0
        }));
        
        ResponseHandler.success(res, { 
            products: normalizedRelated,
            total: normalizedRelated.length 
        }, "Get related products successfully");
        
    } catch (error) {
        console.error("Error getting related products:", error);
        throw error;
    }
});

// =================== NEW: GET PRODUCT REVIEWS ===================
// Get product reviews with pagination
export const getProductReviews = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get product reviews:", req.params.id);
    
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, rating } = req.query;
        
        // Check if product exists
        const product = await productService.getProductById(id);
        if (!product) {
            return ResponseHandler.notFound(res, "Sản phẩm không tồn tại");
        }
        
        // Get reviews from service
        const reviewsData = await productService.getProductReviews(id, {
            page: parseInt(page),
            limit: parseInt(limit),
            rating: rating ? parseInt(rating) : null
        });
        
        // Normalize reviews data
        const normalizedReviews = reviewsData.reviews.map(review => ({
            id: review._id,
            user: {
                name: review.userName || review.user?.name || 'Ẩn danh',
                avatar: review.userAvatar || review.user?.avatar || null
            },
            rating: review.rating,
            comment: review.comment,
            images: review.images || [],
            helpful_count: review.helpfulCount || 0,
            created_at: review.createdAt,
            verified_purchase: review.verifiedPurchase || false
        }));
        
        ResponseHandler.success(res, {
            reviews: normalizedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: reviewsData.total,
                pages: Math.ceil(reviewsData.total / limit)
            }
        }, "Get product reviews successfully");
        
    } catch (error) {
        console.error("Error getting product reviews:", error);
        throw error;
    }
});

// =================== NEW: UPDATE PRODUCT VIEW COUNT ===================
// Update product view count (for analytics)
export const updateProductView = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        // Update view count in background
        productService.updateProductView(id).catch(err => {
            console.error("Error updating product view:", err);
        });
        
        ResponseHandler.success(res, null, "Product view updated");
        
    } catch (error) {
        console.error("Error updating product view:", error);
        // Don't throw error for view tracking
        ResponseHandler.success(res, null, "Product view tracking failed");
    }
});

// =================== EXISTING FUNCTIONS (UNCHANGED) ===================
// Create new product with image upload
export const createProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create product received:", req.body);
    console.log("Uploaded files:", req.files);
    try {
        // Xử lý upload ảnh
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach((file, index) => {
                uploadedImages.push({
                    url: `/uploads/products/${file.filename}`,
                    alt: req.body.imageAlts?.[index] || `Ảnh sản phẩm ${index + 1}`,
                    isPrimary: index === 0
                });
            });
        }
        // Tạo dữ liệu sản phẩm
        const productData = {
            ...req.body,
            sellerID: req.user._id, // Lấy từ middleware auth
            images: uploadedImages.length > 0 ? uploadedImages : [{
                url: '/images/default-product.jpg',
                alt: 'Ảnh mặc định',
                isPrimary: true
            }]
        };
        const product = await productService.createProduct(productData);
        ResponseHandler.success(res, { product }, "Tạo sản phẩm thành công");
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
});

// Update product with image upload
export const updateProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update product:", req.params.id);
    console.log("Uploaded files:", req.files);
    try {
        const productId = req.params.id;
        const updateData = { ...req.body };
        // Xử lý upload ảnh mới
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: `/uploads/products/${file.filename}`,
                alt: req.body.imageAlts?.[index] || `Ảnh sản phẩm ${index + 1}`,
                isPrimary: index === 0
            }));
            // Nếu có ảnh cũ, giữ lại và thêm ảnh mới
            if (req.body.existingImages) {
                const existingImages = JSON.parse(req.body.existingImages);
                updateData.images = [...existingImages, ...newImages];
            } else {
                updateData.images = newImages;
            }
        }
        const product = await productService.updateProduct(productId, updateData, req.user._id);
        ResponseHandler.success(res, { product }, "Cập nhật sản phẩm thành công");
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
});

// Delete product
export const deleteProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete product:", req.params.id);
    try {
        await productService.deleteProduct(req.params.id, req.user._id);
        ResponseHandler.success(res, null, "Xóa sản phẩm thành công");
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
});

// Get products by seller
export const getProductsBySeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get products by seller:", req.user._id);
    try {
        const products = await productService.getProductsBySeller(req.user._id, req.query);
        ResponseHandler.success(res, products, "Lấy danh sách sản phẩm của người bán thành công");
    } catch (error) {
        console.error("Error getting seller products:", error);
        throw error;
    }
});

// =================== NEW: BULK OPERATIONS ===================
// Bulk update product status
export const bulkUpdateProductStatus = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to bulk update product status:", req.body);
    
    try {
        const { productIds, status } = req.body;
        
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return ResponseHandler.badRequest(res, "Product IDs are required");
        }
        
        if (!['active', 'inactive', 'out_of_stock'].includes(status)) {
            return ResponseHandler.badRequest(res, "Invalid status");
        }
        
        const result = await productService.bulkUpdateStatus(productIds, status, req.user._id);
        
        ResponseHandler.success(res, result, "Bulk update product status successfully");
        
    } catch (error) {
        console.error("Error bulk updating product status:", error);
        throw error;
    }
});

// =================== MIDDLEWARE ===================
// Middleware để xử lý upload ảnh
export const handleProductImageUpload = (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res, next);
        }
        next();
    });
};

// =================== VALIDATION MIDDLEWARE ===================
// Validate product ID parameter
export const validateProductId = (req, res, next) => {
    const { id } = req.params;
    
    // Check if ID is valid MongoDB ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return ResponseHandler.badRequest(res, "Invalid product ID format");
    }
    
    next();
};

// Rate limiting for product views (prevent spam)
const viewCounts = new Map();
export const rateLimitProductView = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const productId = req.params.id;
    const key = `${clientIp}:${productId}`;
    
    const now = Date.now();
    const lastView = viewCounts.get(key);
    
    // Allow one view per minute per IP per product
    if (lastView && (now - lastView) < 60000) {
        return ResponseHandler.success(res, null, "View already counted");
    }
    
    viewCounts.set(key, now);
    
    // Clean up old entries
    if (viewCounts.size > 10000) {
        const cutoff = now - 3600000; // 1 hour
        for (const [k, v] of viewCounts.entries()) {
            if (v < cutoff) {
                viewCounts.delete(k);
            }
        }
    }
    
    next();
};

// =================== EXPORT ALL FUNCTIONS ===================
export {
    // Existing exports stay the same
    getAllProducts,
    getFlashSaleProducts,
    getTopProducts,
    getProductStats,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySeller,
    handleProductImageUpload,
    
    // New exports for ProductDetail
    getRelatedProducts,
    getProductReviews,
    updateProductView,
    bulkUpdateProductStatus,
    validateProductId,
    rateLimitProductView
};