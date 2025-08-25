import productService from "../services/productService.js";
import Category from "../models/Category.js";
import ResponseHandler from "../utils/responseHandler.js";
import { uploadProductImages, handleUploadError } from "../middleware/upload.js";

// Get all products with filtering and pagination
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    ResponseHandler.success(res, result, "Get product list successfully");
});

// Get flash sale products
export const getFlashSaleProducts = ResponseHandler.asyncHandler(async (req, res) => {
    const result = await productService.getFlashSaleProducts(req.query);
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
        let query = await productService.buildFilter(req.query);
        
        // Keyword search - integrate with existing filters using AND logic
        if (keyword) {
            console.log('Searching for keyword:', keyword);
            const words = keyword.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length > 0) {
                const keywordConditions = words.map(word => ({
                    $or: [
                        { name: { $regex: word, $options: 'i' } },
                        { description: { $regex: word, $options: 'i' } },
                        { brand: { $regex: word, $options: 'i' } }
                    ]
                }));
                
                // Add keyword conditions to existing $and or create new $and
                if (query.$and) {
                    query.$and.push(...keywordConditions);
                } else {
                    query.$and = keywordConditions;
                }
            }
            console.log('Search query:', JSON.stringify(query));
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

// Get product by ID
export const getProductById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get product by ID:", req.params.id);
    try {
        const product = await productService.getProductById(req.params.id);
        ResponseHandler.success(res, { product }, "Get product information successfully");
    } catch (error) {
        if (error.message === "Product not found") {
            ResponseHandler.notFound(res, error.message);
        } else {
            throw error;
        }
    }
});

// Create product with image upload
export const createProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create product");
    console.log("Uploaded files:", req.files);
    
    try {
        let uploadedImages = [];
        
        // Xử lý upload ảnh - Hỗ trợ tối đa 6 ảnh
        if (req.files && req.files.length > 0) {
            const maxImages = 6;
            const filesToProcess = req.files.slice(0, maxImages);
            const mainIndex = parseInt(req.body.mainIndex) || 0;
            
            filesToProcess.forEach((file, index) => {
                uploadedImages.push({
                    url: `/uploads/products/${file.filename}`,
                    alt: req.body.imageAlts?.[index] || `Ảnh sản phẩm ${index + 1}`,
                    isPrimary: index === mainIndex // Use mainIndex to determine primary image
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
        
        // Fix: Process FormData fields with bracket notation
        // Handle price fields
        if (productData['price[original]']) {
            productData.price = {
                original: Number(productData['price[original]'] || 0),
                sale: Number(productData['price[sale]'] || 0)
            };
            // Remove bracket notation fields
            delete productData['price[original]'];
            delete productData['price[sale]'];
        }
        
        // Handle inventory fields
        if (productData['inventory[quantity]']) {
            productData.inventory = {
                quantity: Number(productData['inventory[quantity]'] || 0),
                lowStockThreshold: Number(productData['inventory[lowStockThreshold]'] || 10)
            };
            // Remove bracket notation fields
            delete productData['inventory[quantity]'];
            delete productData['inventory[lowStockThreshold]'];
        }
        
        const product = await productService.createProduct(productData, req.sellerId);
        
        // Enhanced response with creation details
        const responseData = {
            product,
            creationDetails: {
                timestamp: new Date().toISOString(),
                createdBy: req.user._id,
                imagesCount: uploadedImages.length,
                hasDefaultImage: uploadedImages.length === 0,
                productFeatures: {
                    hasImages: uploadedImages.length > 0,
                    hasPrice: !!productData.price,
                    hasCategory: !!productData.categoryID,
                    hasStock: !!productData.inventory,
                    hasDescription: !!productData.description
                }
            }
        };
        
        ResponseHandler.success(res, responseData, "Tạo sản phẩm thành công");
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
        
        // Fix: Process FormData fields with bracket notation
        // Handle price fields
        if (updateData['price[original]']) {
            updateData.price = {
                original: Number(updateData['price[original]'] || 0),
                sale: Number(updateData['price[sale]'] || 0)
            };
            // Remove bracket notation fields
            delete updateData['price[original]'];
            delete updateData['price[sale]'];
        }
        
        // Handle inventory fields
        if (updateData['inventory[quantity]']) {
            updateData.inventory = {
                quantity: Number(updateData['inventory[quantity]'] || 0),
                lowStockThreshold: Number(updateData['inventory[lowStockThreshold]'] || 10)
            };
            // Remove bracket notation fields
            delete updateData['inventory[quantity]'];
            delete updateData['inventory[lowStockThreshold]'];
        }
        
        // Xử lý upload ảnh mới - Hỗ trợ tối đa 6 ảnh
        let imageUpdateInfo = null;
        if (req.files && req.files.length > 0) {
            const maxImages = 6;
            const filesToProcess = req.files.slice(0, maxImages);
            const mainIndex = parseInt(req.body.mainIndex) || 0;
            
            const newImages = filesToProcess.map((file, index) => ({
                url: `/uploads/products/${file.filename}`,
                alt: req.body.imageAlts?.[index] || `Ảnh sản phẩm ${index + 1}`,
                isPrimary: index === mainIndex
            }));
            
            // Nếu có ảnh cũ, giữ lại và thêm ảnh mới (tối đa 6 ảnh)
            if (req.body.existingImages) {
                const existingImages = JSON.parse(req.body.existingImages);
                const totalImages = [...existingImages, ...newImages];
                updateData.images = totalImages.slice(0, maxImages); // Giới hạn tối đa 6 ảnh
            } else {
                updateData.images = newImages;
            }
            
            imageUpdateInfo = {
                newImagesCount: filesToProcess.length,
                totalImagesCount: updateData.images.length,
                mainImageUpdated: true
            };
        }
        
        const product = await productService.updateProduct(productId, updateData, req.sellerId);
        
        // Enhanced response with update details
        const responseData = {
            product,
            updateDetails: {
                timestamp: new Date().toISOString(),
                updatedBy: req.user._id,
                updatedFields: Object.keys(updateData).filter(key => 
                    !['images', 'existingImages', 'imageAlts', 'mainIndex'].includes(key)
                ),
                imageUpdateInfo,
                changesSummary: {
                    nameChanged: updateData.name ? true : false,
                    priceChanged: updateData.price ? true : false,
                    categoryChanged: updateData.categoryID ? true : false,
                    stockChanged: updateData.inventory ? true : false,
                    descriptionChanged: updateData.description ? true : false,
                    imagesChanged: imageUpdateInfo ? true : false
                }
            }
        };
        
        ResponseHandler.success(res, responseData, "Cập nhật sản phẩm thành công");
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
});

// Delete product
export const deleteProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete product:", req.params.id);
    try {
        await productService.deleteProduct(req.params.id, req.sellerId);
        ResponseHandler.success(res, null, "Xóa sản phẩm thành công");
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
});

// Get products by seller
export const getProductsBySeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("🔍 Request to get products by seller:");
    console.log("   - User ID:", req.user._id);
    console.log("   - Seller ID:", req.sellerId);
    console.log("   - User roles:", req.user.role);
    
    try {
        const products = await productService.getProductsBySeller(req.sellerId, req.query);
        console.log("✅ Products found:", products.products.length);
        ResponseHandler.success(res, products, "Lấy danh sách sản phẩm của người bán thành công");
    } catch (error) {
        console.error("❌ Error getting seller products:", error);
        throw error;
    }
});

// Middleware để xử lý upload ảnh
export const handleProductImageUpload = (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res, next);
        }
        next();
    });
};
