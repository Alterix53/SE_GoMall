import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register - User registration
export const register = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { username, email, password, fullName, phoneNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists. Please use different email/username or try logging in instead.'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password, // Will be hashed by pre-save middleware
            fullName,
            phoneNumber,
            address,
            role: ['user'] // Default role
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return user data (without password) and token
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

// POST /api/auth/register-seller - Seller registration
export const registerSeller = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password,
            fullName,
            phoneNumber,
            address,
            storeName, // legacy from frontend
            businessName, // preferred
            businessLicense,
            sellerPhoneNumber, // legacy
            businessPhone, // preferred
            sellerAddress, // legacy
            businessAddress, // preferred
            verificationDocs
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists. Please use different email/username or try logging in instead.'
            });
        }

        // Note: multiple seller applications could be allowed across time if previous was rejected.
        // We only block if a PENDING/APPROVED/ACTIVE record exists.
        const existingSeller = await Seller.findOne({ userID: existingUser?._id, status: { $in: ['pending', 'approved', 'suspended'] } });
        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: 'A seller application already exists for this user'
            });
        }

        // Create new user first
        const user = new User({
            username,
            email,
            password,
            fullName,
            phoneNumber,
            address,
            role: ['user'] // Start as user, will be updated when seller is approved
        });

        await user.save();

        // Create seller record
        const seller = new Seller({
            userID: user._id,
            businessName: (businessName || storeName || fullName || `${username}'s Store`).trim(),
            businessLicense,
            businessAddress: (businessAddress || sellerAddress || address || '').trim(),
            businessPhone: (businessPhone || sellerPhoneNumber || phoneNumber || '').trim(),
            businessEmail: email,
            verificationDocs: Array.isArray(verificationDocs) ? verificationDocs : [],
            status: 'pending'
        });

        await seller.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return user data and token
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive,
            sellerInfo: {
                _id: seller._id,
                businessName: seller.businessName,
                status: seller.status
            }
        };

        res.status(201).json({
            success: true,
            message: 'Seller registration submitted successfully. Pending approval.',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Seller registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during seller registration',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

// POST /api/auth/login - User login
export const login = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { email, username, password } = req.body;
        const identifier = (email || username || '').trim();
      
        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }]
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is a seller and get seller info
        let sellerInfo = null;
        if (user.role.includes('seller')) {
            const seller = await Seller.findOne({ userID: user._id });
            if (seller) {
                sellerInfo = {
                    _id: seller._id,
                    businessName: seller.businessName,
                    status: seller.status
                };
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return user data (without password) and token
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive,
            sellerInfo
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

// POST /api/auth/logout - User logout
export const logout = async (req, res) => {
    try {
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Server error during logout', error: process.env.NODE_ENV === 'development' ? error.message : {} });
    }
};

// GET /api/auth/me - Get current user
export const getCurrentUser = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        const user = req.user;

        // Check if user is a seller and get seller info
        let sellerInfo = null;
        if (user.role.includes('seller')) {
            const seller = await Seller.findOne({ userID: user._id });
            if (seller) {
                sellerInfo = {
                    _id: seller._id,
                    businessName: seller.businessName,
                    status: seller.status
                };
            }
        }

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive,
            sellerInfo
        };

        res.json({ success: true, data: { user: userResponse } });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching user data', error: process.env.NODE_ENV === 'development' ? error.message : {} });
    }
};

// PUT /api/auth/me - Update current user profile (MongoDB)
export const updateCurrentUser = async (req, res) => {
    try {
        const user = req.user; // from authenticateToken middleware

        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        console.log('Update user request:', {
            userId: user._id,
            body: req.body,
            currentUser: {
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                address: user.address
            }
        });

        const { fullName, phoneNumber, address } = req.body || {};

        // Update only if values are provided
        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (address !== undefined) user.address = address;

        console.log('Saving user with updated data:', {
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address
        });

        await user.save();

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive
        };

        res.json({ success: true, message: 'Cập nhật thông tin thành công', data: { user: userResponse } });
    } catch (error) {
        console.error('Update current user error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ success: false, message: 'Server error while updating user', error: process.env.NODE_ENV === 'development' ? error.message : {} });
    }
};

// POST /api/auth/refresh - Refresh token (optional)
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({ success: true, message: 'Token refreshed successfully', data: { token: newToken } });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};

// POST /api/auth/change-password - Change user password
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash new password and save
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password change', error: process.env.NODE_ENV === 'development' ? error.message : {} });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email là bắt buộc' });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo reset token (có thể sử dụng crypto hoặc uuid)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 giờ

    // Lưu reset token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Tạo reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    console.log('Reset URL:', resetUrl);

    res.json({ success: true, message: 'Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xử lý yêu cầu' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token và mật khẩu mới là bắt buộc' });
    }

    // Tìm user với reset token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cập nhật mật khẩu và xóa reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Mật khẩu đã được đặt lại thành công' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
  }
}; 