import adminService from "../services/adminService.js";
import ResponseHandler from "../utils/responseHandler.js";

// Admin login
export const adminLogin = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to admin login:", req.body);
    
    const { username, password } = req.body;
    const result = await adminService.authenticateAdmin(username, password);
    
    ResponseHandler.success(res, result, "Đăng nhập admin thành công");
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

// Get top selling products
export const getTopSellingProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get top selling products:", req.query);
    
    const { limit = 10 } = req.query;
    const products = await adminService.getTopSellingProducts(Number(limit));
    ResponseHandler.success(res, products, "Lấy danh sách sản phẩm bán chạy thành công");
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

// Create user (admin function)
export const createUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to create user:", req.body);
    
    const userData = req.body;
    const user = await adminService.createUser(userData);
    
    ResponseHandler.success(res, { user }, "Tạo người dùng thành công", 201);
});

// Update user (admin function)
export const updateUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update user:", req.params.id);
    
    const userId = req.params.id;
    const updateData = req.body;
    const user = await adminService.updateUser(userId, updateData);
    
    ResponseHandler.success(res, { user }, "Cập nhật người dùng thành công");
});

// Delete user (admin function)
export const deleteUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to delete user:", req.params.id);
    
    const userId = req.params.id;
    await adminService.deleteUser(userId);
    
    ResponseHandler.success(res, null, "Xóa người dùng thành công");
});