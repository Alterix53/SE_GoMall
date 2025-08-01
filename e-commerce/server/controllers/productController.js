import productService from "../services/productService.js";
import ResponseHandler from "../utils/responseHandler.js";

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