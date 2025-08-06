import productService from "../services/productService.js";
import ResponseHandler from "../utils/responseHandler.js";
import { uploadProductImages, handleUploadError } from "../middleware/upload.js";

// Get all products with filtering and pagination
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products received:", req.query);
    
    const result = await productService.getAllProducts(req.query);
    
    console.log("Responding with products:", result.products);
    ResponseHandler.success(res, result, "Lấy danh sách sản phẩm thành công");
});

// Get flash sale products
export const getFlashSaleProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/flash-sale received:", req.query);
    
    const result = await productService.getFlashSaleProducts(req.query);
    
    console.log("Responding with flash sale products:", result.products);
    ResponseHandler.success(res, result, "Lấy danh sách flash sale thành công");
});

// Get top products by type
export const getTopProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/top-products received:", req.query);
    
    const result = await productService.getTopProducts(req.query);
    
    console.log("Responding with top products:", result.products);
    ResponseHandler.success(res, result, "Lấy danh sách sản phẩm nổi bật thành công");
});

// Get product statistics
export const getProductStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/products/stats received");
    
    const result = await productService.getProductStats();
    
    ResponseHandler.success(res, result, "Lấy thống kê sản phẩm thành công");
});

// Get product by ID
export const getProductById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get product by ID:", req.params.id);
    
    try {
        const product = await productService.getProductById(req.params.id);
        ResponseHandler.success(res, { product }, "Lấy thông tin sản phẩm thành công");
    } catch (error) {
        if (error.message === "Sản phẩm không tồn tại") {
            ResponseHandler.notFound(res, error.message);
        } else {
            throw error;
        }
    }
});

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

// Middleware để xử lý upload ảnh
export const handleProductImageUpload = (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res, next);
        }
        next();
    });
}; 