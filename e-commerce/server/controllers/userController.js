import userService from "../services/userService.js";
import ResponseHandler from "../utils/responseHandler.js";

// Register new user
export const registerUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to register user:", req.body);
    
    const userData = req.body;
    const user = await userService.createUser(userData);
    
    ResponseHandler.success(res, { user }, "Đăng ký thành công", 201);
});

// Login user
export const loginUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to login user:", req.body);
    
    const { username, password } = req.body;
    const result = await userService.authenticateUser(username, password);
    
    ResponseHandler.success(res, result, "Đăng nhập thành công");
});

// Get user profile
export const getUserProfile = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get user profile:", req.params.id);
    
    const user = await userService.getUserById(req.params.id);
    ResponseHandler.success(res, { user }, "Lấy thông tin người dùng thành công");
});

// Update user profile
export const updateUserProfile = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to update user profile:", req.params.id);
    
    const userId = req.params.id;
    const updateData = req.body;
    const user = await userService.updateUserProfile(userId, updateData);
    
    ResponseHandler.success(res, { user }, "Cập nhật thông tin thành công");
});

// Change password
export const changePassword = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to change password:", req.params.id);
    
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(userId, currentPassword, newPassword);
    
    ResponseHandler.success(res, result, "Đổi mật khẩu thành công");
});

// Get all users (admin only)
export const getAllUsers = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get all users:", req.query);
    
    const result = await userService.getAllUsers(req.query);
    ResponseHandler.success(res, result, "Lấy danh sách người dùng thành công");
});

// Deactivate user (admin only)
export const deactivateUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to deactivate user:", req.params.id);
    
    const result = await userService.deactivateUser(req.params.id);
    ResponseHandler.success(res, result, "Khóa tài khoản thành công");
});

// Activate user (admin only)
export const activateUser = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to activate user:", req.params.id);
    
    const result = await userService.activateUser(req.params.id);
    ResponseHandler.success(res, result, "Mở khóa tài khoản thành công");
});

