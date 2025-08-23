import User from '../models/User.js';
import Seller from '../models/Seller.js';
import ResponseHandler from '../utils/responseHandler.js';

// GET /api/users/me - Get current user info
export const getCurrentUser = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return ResponseHandler.notFound(res, "User không tồn tại");
        }

        ResponseHandler.success(res, { user }, "Lấy thông tin user hiện tại thành công");
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
});

// GET /api/users - Get all users (admin only)
export const getAllUsers = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        ResponseHandler.success(res, { users }, "Lấy danh sách users thành công");
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});

// GET /api/users/:id - Get user by ID
export const getUserById = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return ResponseHandler.notFound(res, "User không tồn tại");
        }

        ResponseHandler.success(res, { user }, "Lấy thông tin user thành công");
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

        // Không cho phép cập nhật các trường nhạy cảm qua endpoint này
        delete updateData.password;
        delete updateData.email;
        delete updateData.username;

        const user = await User.findById(userId);
        if (!user) {
            return ResponseHandler.notFound(res, 'User không tồn tại');
        }

        Object.assign(user, updateData);
        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;

        ResponseHandler.success(res, { user: safeUser }, "Cập nhật user thành công");
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
});

// DELETE /api/users/:id - Delete user
export const deleteUser = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return ResponseHandler.notFound(res, 'User không tồn tại');
        }

        await User.findByIdAndDelete(userId);
        ResponseHandler.success(res, null, "Xóa user thành công");
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
});

// GET /api/users/role/:role - Get users by role
export const getUsersByRole = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const role = req.params.role;
        if (role === 'seller') {
            // Trả về danh sách seller từ collection Seller để tương thích hành vi cũ
            const sellers = await Seller.find({}).sort({ createdAt: -1 });
            return ResponseHandler.success(res, { users: sellers }, `Lấy danh sách sellers thành công`);
        }
        const users = await User.find({ role: role }).select('-password');
        ResponseHandler.success(res, { users }, `Lấy danh sách users với role ${role} thành công`);
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
});

// POST /api/users/backup - Backup users file
export const backupUsers = ResponseHandler.asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).lean();
        const sanitized = users.map(u => { const { password, ...rest } = u; return rest; });
        ResponseHandler.success(res, { users: sanitized }, "Export users từ DB thành công");
    } catch (error) {
        console.error('Error backing up users:', error);
        throw error;
    }
});

