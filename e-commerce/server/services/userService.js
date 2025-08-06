import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
    // Hash password
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Compare password
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Generate JWT token
    generateToken(user) {
        const payload = {
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
        };
        
        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });
    }

    // Create new user
    async createUser(userData) {
        const { username, email, password, fullName, phoneNumber, address } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            throw new Error("Tên đăng nhập hoặc email đã tồn tại");
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            address
        });

        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Authenticate user
    async authenticateUser(username, password) {
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error("Tên đăng nhập không tồn tại");
        }

        if (!user.isActive) {
            throw new Error("Tài khoản đã bị khóa");
        }

        const isPasswordValid = await this.comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }

        // Generate token
        const token = this.generateToken(user);

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return {
            user: userResponse,
            token
        };
    }

    // Get user by ID
    async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        return user;
    }

    // Update user profile
    async updateUserProfile(userId, updateData) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        // Remove sensitive fields from update
        const { password, username, email, ...safeUpdateData } = updateData;

        // Update user
        Object.assign(user, safeUpdateData);
        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        // Verify current password
        const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new Error("Mật khẩu hiện tại không đúng");
        }

        // Hash new password
        const hashedNewPassword = await this.hashPassword(newPassword);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        return { message: "Đổi mật khẩu thành công" };
    }

    // Get all users (for admin)
    async getAllUsers(query = {}) {
        const { page = 1, limit = 10, search = "" } = query;
        
        const filter = { isActive: true };
        
        if (search) {
            filter.$or = [
                { username: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
                { fullName: new RegExp(search, "i") }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await User.countDocuments(filter);

        return {
            users,
            pagination: {
                current: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
                limit: Number(limit),
            },
        };
    }

    // Deactivate user (for admin)
    async deactivateUser(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        user.isActive = false;
        await user.save();

        return { message: "Đã khóa tài khoản người dùng" };
    }

    // Activate user (for admin)
    async activateUser(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        user.isActive = true;
        await user.save();

        return { message: "Đã mở khóa tài khoản người dùng" };
    }
}

export default new UserService(); 