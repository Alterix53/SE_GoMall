import userFileService from '../services/userFileService.js';
import ResponseHandler from '../utils/responseHandler.js';

// GET /api/users - Get all users (admin only)
export const getAllUsers = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const users = userFileService.getAllUsers();
        
        // Remove password from response
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        ResponseHandler.success(res, { users: safeUsers }, "Lấy danh sách users thành công");
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});

// GET /api/users/:id - Get user by ID
export const getUserById = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const user = userFileService.findUserById(req.params.id);
        
        if (!user) {
            return ResponseHandler.notFound(res, "User không tồn tại");
        }

        // Remove password from response
        const { password, ...safeUser } = user;

        ResponseHandler.success(res, { user: safeUser }, "Lấy thông tin user thành công");
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
});

// PUT /api/users/:id - Update user
export const updateUser = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        // Không cho phép cập nhật password qua endpoint này
        delete updateData.password;

        const updatedUser = userFileService.updateUser(userId, updateData);
        
        // Remove password from response
        const { password, ...safeUser } = updatedUser;

        ResponseHandler.success(res, { user: safeUser }, "Cập nhật user thành công");
    } catch (error) {
        console.error('Error updating user:', error);
        
        if (error.message.includes('User không tồn tại')) {
            return ResponseHandler.notFound(res, error.message);
        }
        
        throw error;
    }
});

// DELETE /api/users/:id - Delete user
export const deleteUser = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        
        userFileService.deleteUser(userId);

        ResponseHandler.success(res, null, "Xóa user thành công");
    } catch (error) {
        console.error('Error deleting user:', error);
        
        if (error.message.includes('User không tồn tại')) {
            return ResponseHandler.notFound(res, error.message);
        }
        
        throw error;
    }
});

// GET /api/users/role/:role - Get users by role
export const getUsersByRole = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const role = req.params.role;
        const users = userFileService.getUsersByRole(role);
        
        // Remove password from response
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        ResponseHandler.success(res, { users: safeUsers }, `Lấy danh sách users với role ${role} thành công`);
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
});

// POST /api/users/backup - Backup users file
export const backupUsers = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const backupPath = userFileService.backupUsers();
        
        if (backupPath) {
            ResponseHandler.success(res, { backupPath }, "Backup users file thành công");
        } else {
            throw new Error("Không thể tạo backup");
        }
    } catch (error) {
        console.error('Error backing up users:', error);
        throw error;
    }
});

