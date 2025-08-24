import adminService from "../services/adminService.js";
import ResponseHandler from "../utils/responseHandler.js";

// Admin login
export const adminLogin = async (req, res) => {
    try {
        console.log("Request to admin login:", req.body);
        const { username, password } = req.body;
        const result = await adminService.authenticateAdmin(username, password);
        return ResponseHandler.success(res, result, "Đăng nhập admin thành công");
    } catch (error) {
        const message = error?.message || 'Đăng nhập admin thất bại';
        const status =
            message === 'Username not found' ? 401 :
            message === 'Incorrect password' ? 401 :
            message === 'Admin account is locked' ? 403 : 500;
        return ResponseHandler.error(res, message, status);
    }
};

// Admin logout
export const adminLogout = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to admin logout");
    
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the token. However, we can implement additional security measures here.
    
    // You could implement token blacklisting here if needed
    // For now, we'll just return success as the client will handle token removal
    
    ResponseHandler.success(res, {}, "Đăng xuất admin thành công");
});

// Get dashboard statistics
export const getDashboardStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get dashboard stats");
    
    const stats = await adminService.getDashboardStats();
    ResponseHandler.success(res, stats, "Lấy thống kê dashboard thành công");
});

// Get revenue statistics
export const getRevenueStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get revenue stats:", req.query);
    
    const { period = 'month' } = req.query;
    const stats = await adminService.getRevenueStats(period);
    ResponseHandler.success(res, stats, "Lấy thống kê doanh thu thành công");
});

// Get revenue distribution for chart
export const getRevenueDistribution = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get revenue distribution");
    const data = await adminService.getRevenueDistribution();
    ResponseHandler.success(res, data, "Lấy phân bổ doanh thu theo danh mục thành công");
});

// Get top selling products
export const getTopSellingProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get top selling products:", req.query);
    
    const { limit = 10 } = req.query;
    const products = await adminService.getTopSellingProducts(Number(limit));
    ResponseHandler.success(res, products, "Lấy danh sách sản phẩm bán chạy thành công");
});

// Get trending products (by views)
export const getTrendingProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get trending products:", req.query);
    
    const { limit = 10 } = req.query;
    const products = await adminService.getTrendingProducts(Number(limit));
    ResponseHandler.success(res, products, "Lấy danh sách sản phẩm thịnh hành thành công");
});

// Get seller statistics
export const getSellerStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get seller stats");
    
    const stats = await adminService.getSellerStats();
    ResponseHandler.success(res, stats, "Lấy thống kê người bán thành công");
});

// Get user activity statistics
export const getUserActivityStats = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get user activity stats");
    
    const stats = await adminService.getUserActivityStats();
    ResponseHandler.success(res, stats, "Lấy thống kê hoạt động người dùng thành công");
});

// Get system overview
export const getSystemOverview = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get system overview");
    
    const overview = await adminService.getSystemOverview();
    ResponseHandler.success(res, overview, "Lấy tổng quan hệ thống thành công");
});

// User Management Controllers
export const getAllUsers = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all users:", req.query);
    
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const users = await adminService.getAllUsers({ page, limit, search, status });
    
    ResponseHandler.success(res, users, "Lấy danh sách người dùng thành công");
});

export const getUserById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get user by id:", req.params.id);
    
    const user = await adminService.getUserById(req.params.id);
    ResponseHandler.success(res, user, "Lấy thông tin người dùng thành công");
});

export const createUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create user:", req.body);
    
    const userData = req.body;
    const user = await adminService.createUser(userData);
    
    ResponseHandler.success(res, { user }, "Tạo người dùng thành công", 201);
});

export const updateUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update user:", req.params.id);
    
    const userId = req.params.id;
    const updateData = req.body;
    const user = await adminService.updateUser(userId, updateData);
    
    ResponseHandler.success(res, { user }, "Cập nhật người dùng thành công");
});

export const deleteUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete user:", req.params.id);
    
    const userId = req.params.id;
    await adminService.deleteUser(userId);
    
    ResponseHandler.success(res, null, "Xóa người dùng thành công");
});

export const updateUserStatus = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update user status:", req.params.id);
    
    const userId = req.params.id;
    const { status } = req.body;
    const user = await adminService.updateUserStatus(userId, status);
    
    ResponseHandler.success(res, { user }, "Cập nhật trạng thái người dùng thành công");
});

// Seller Management Controllers
export const getAllSellers = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all sellers:", req.query);
    
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const sellers = await adminService.getAllSellers({ page, limit, search, status });
    
    ResponseHandler.success(res, sellers, "Lấy danh sách người bán thành công");
});

export const createSeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create seller:", req.body);
    
    const sellerData = req.body;
    const seller = await adminService.createSeller(sellerData);
    
    ResponseHandler.success(res, { seller }, "Tạo người bán thành công", 201);
});

export const updateSeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update seller:", req.params.id);
    
    const sellerId = req.params.id;
    const updateData = req.body;
    const seller = await adminService.updateSeller(sellerId, updateData);
    
    ResponseHandler.success(res, { seller }, "Cập nhật người bán thành công");
});

export const deleteSeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete seller:", req.params.id);
    
    const sellerId = req.params.id;
    await adminService.deleteSeller(sellerId);
    
    ResponseHandler.success(res, null, "Xóa người bán thành công");
});

export const updateSellerStatus = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update seller status:", req.params.id);
    
    const sellerId = req.params.id;
    const { status } = req.body;
    const seller = await adminService.updateSellerStatus(sellerId, status);
    
    ResponseHandler.success(res, { seller }, "Cập nhật trạng thái người bán thành công");
});

export const approveSeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to approve seller:", req.params.id);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    
    const sellerId = req.params.id;
    console.log("Processing seller ID:", sellerId);
    
    try {
        const seller = await adminService.approveSeller(sellerId);
        console.log("Seller approved successfully:", seller._id);
        
        ResponseHandler.success(res, { seller }, "Duyệt người bán thành công");
    } catch (error) {
        console.error("Error in approveSeller controller:", error.message);
        console.error("Full error:", error);
        throw error; // Let ResponseHandler.asyncHandler handle it
    }
});

export const getSellerById = ResponseHandler.asyncHandler(async (req, res) => {
    const sellerId = req.params.id;
    
    try {
        const seller = await adminService.getSellerById(sellerId);
        ResponseHandler.success(res, seller, "Lấy thông tin seller thành công");
    } catch (error) {
        console.error("Error in getSellerById controller:", error.message);
        throw error;
    }
});

// Product Management Controllers
export const getAllProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all products:", req.query);
    
    const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
    const products = await adminService.getAllProducts({ page, limit, search, category, status });
    
    ResponseHandler.success(res, products, "Lấy danh sách sản phẩm thành công");
});

export const getProductById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get product by id:", req.params.id);
    
    const product = await adminService.getProductById(req.params.id);
    ResponseHandler.success(res, product, "Lấy thông tin sản phẩm thành công");
});

export const createProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create product:", req.body);
    
    const productData = req.body;
    const product = await adminService.createProduct(productData);
    
    ResponseHandler.success(res, { product }, "Tạo sản phẩm thành công", 201);
});

export const updateProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update product:", req.params.id);
    
    const productId = req.params.id;
    const updateData = req.body;
    const product = await adminService.updateProduct(productId, updateData);
    
    ResponseHandler.success(res, { product }, "Cập nhật sản phẩm thành công");
});

export const deleteProduct = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete product:", req.params.id);
    
    const productId = req.params.id;
    await adminService.deleteProduct(productId);
    
    ResponseHandler.success(res, null, "Xóa sản phẩm thành công");
});

export const updateProductStatus = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update product status:", req.params.id);
    
    const productId = req.params.id;
    const { status } = req.body;
    const product = await adminService.updateProductStatus(productId, status);
    
    ResponseHandler.success(res, { product }, "Cập nhật trạng thái sản phẩm thành công");
});

export const toggleProductFeature = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to toggle product feature:", req.params.id);
    
    const productId = req.params.id;
    const product = await adminService.toggleProductFeature(productId);
    
    ResponseHandler.success(res, { product }, "Cập nhật tính năng sản phẩm thành công");
});

// Order Management Controllers
export const getAllOrders = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all orders:", req.query);
    
    const { page = 1, limit = 10, status = '', dateFrom = '', dateTo = '' } = req.query;
    const orders = await adminService.getAllOrders({ page, limit, status, dateFrom, dateTo });
    
    ResponseHandler.success(res, orders, "Lấy danh sách đơn hàng thành công");
});

export const getOrderById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get order by id:", req.params.id);
    
    const order = await adminService.getOrderById(req.params.id);
    ResponseHandler.success(res, order, "Lấy thông tin đơn hàng thành công");
});

export const updateOrder = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update order:", req.params.id);
    
    const orderId = req.params.id;
    const updateData = req.body;
    const order = await adminService.updateOrder(orderId, updateData);
    
    ResponseHandler.success(res, { order }, "Cập nhật đơn hàng thành công");
});

export const updateOrderStatus = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update order status:", req.params.id);
    
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(orderId, status);
    
    ResponseHandler.success(res, { order }, "Cập nhật trạng thái đơn hàng thành công");
});

// Category Management Controllers
export const getAllCategories = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all categories");
    
    const categories = await adminService.getAllCategories();
    ResponseHandler.success(res, categories, "Lấy danh sách danh mục thành công");
});

export const getCategoryById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get category by id:", req.params.id);
    
    const category = await adminService.getCategoryById(req.params.id);
    ResponseHandler.success(res, category, "Lấy thông tin danh mục thành công");
});

export const createCategory = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create category:", req.body);
    
    const categoryData = req.body;
    const category = await adminService.createCategory(categoryData);
    
    ResponseHandler.success(res, { category }, "Tạo danh mục thành công", 201);
});

export const updateCategory = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update category:", req.params.id);
    
    const categoryId = req.params.id;
    const updateData = req.body;
    const category = await adminService.updateCategory(categoryId, updateData);
    
    ResponseHandler.success(res, { category }, "Cập nhật danh mục thành công");
});

export const deleteCategory = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete category:", req.params.id);
    
    const categoryId = req.params.id;
    await adminService.deleteCategory(categoryId);
    
    ResponseHandler.success(res, null, "Xóa danh mục thành công");
});

// System Management Controllers
export const getSystemLogs = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get system logs");
    
    const logs = await adminService.getSystemLogs();
    ResponseHandler.success(res, logs, "Lấy logs hệ thống thành công");
});

export const createBackup = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create backup");
    
    const backup = await adminService.createBackup();
    ResponseHandler.success(res, backup, "Tạo backup thành công");
});

export const toggleMaintenanceMode = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to toggle maintenance mode");
    
    const { enabled } = req.body;
    const result = await adminService.toggleMaintenanceMode(enabled);
    
    ResponseHandler.success(res, result, "Cập nhật chế độ bảo trì thành công");
});