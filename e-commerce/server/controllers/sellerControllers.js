import Seller from '../models/Seller.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { uploadFileToCloudinary, saveBufferToLocal } from '../middleware/upload.js';

// [POST] User apply to become seller (authenticated user)
export const applyForSeller = async (req, res) => {
    try {
        const authUser = req.user; // from authenticateToken
        const {
            businessName,
            businessLicense,
            businessAddress,
            businessPhone,
            verificationDocs
        } = req.body;

        // TẮT VALIDATION ĐỂ TEST - COMMENT CÁC ĐOẠN NÀY ĐỂ BẬT LẠI
        /*
        // Validation chi tiết hơn
        if (!businessName || !businessLicense) {
            return res.status(400).json({
                success: false,
                message: 'Tên doanh nghiệp và số giấy phép kinh doanh là bắt buộc'
            });
        }

        if (businessName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Tên doanh nghiệp phải có ít nhất 3 ký tự'
            });
        }

        if (businessLicense.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Số giấy phép kinh doanh không hợp lệ'
            });
        }
        */

        // TẮT KIỂM TRA DUPLICATE ĐỂ TEST
        
        // Prevent duplicate active/pending applications
        const existing = await Seller.findOne({ userID: authUser._id, status: { $in: ['pending', 'approved', 'suspended'] } });
        if (existing) {
            let message = '';
            switch (existing.status) {
                case 'pending':
                    message = 'Bạn đã có hồ sơ đăng ký seller đang chờ duyệt. Vui lòng kiên nhẫn chờ admin xem xét.';
                    break;
                case 'approved':
                    message = 'Bạn đã là seller được duyệt. Không cần nộp hồ sơ mới.';
                    break;
                case 'suspended':
                    message = 'Tài khoản seller của bạn đã bị tạm ngưng. Vui lòng liên hệ admin để biết thêm chi tiết.';
                    break;
                default:
                    message = 'Bạn đã có hồ sơ đăng ký seller.';
            }
            
            return res.status(400).json({
                success: false,
                message: message,
                existingStatus: existing.status
            });
        }
        

        // Prepare verification document URLs
        // Priority: files uploaded via multipart -> upload to Cloudinary if configured
        let verificationDocUrls = [];
        const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

        if (req.files && req.files.length > 0) {
            if (hasCloudinary) {
                // Upload each file buffer to Cloudinary
                const uploads = await Promise.all(
                    req.files.map((file) => uploadFileToCloudinary(file.buffer, 'gomall/verification'))
                );
                verificationDocUrls = uploads.map(u => u.secure_url || u.url).filter(Boolean);
            } else {
                // Fallback: save buffer to local verification directory
                const saved = await Promise.all(req.files.map(async (file) => saveBufferToLocal(file)));
                verificationDocUrls = saved.filter(Boolean);
            }
        } else if (Array.isArray(verificationDocs)) {
            // Accept existing URLs or strings from body as last resort
            verificationDocUrls = verificationDocs;
        }

        // TẮT VALIDATION FILE ĐỂ TEST
        /*
        // Validate that we have at least one verification document
        if (verificationDocUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng upload ít nhất một tài liệu xác minh (giấy phép kinh doanh hoặc CMND)'
            });
        }
        */

        const seller = await Seller.create({
            userID: authUser._id,
            businessName: businessName?.trim() || 'Test Business',
            businessLicense: String(businessLicense || 'TEST123').trim(),
            businessAddress: (businessAddress || authUser.address || 'Test Address').trim(),
            businessPhone: (businessPhone || authUser.phoneNumber || '0123456789').trim(),
            businessEmail: authUser.email,
            verificationDocs: verificationDocUrls,
            status: 'pending',
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: 'Hồ sơ đăng ký seller đã được nộp thành công. Vui lòng chờ admin duyệt.',
            data: {
                sellerId: seller._id,
                businessName: seller.businessName,
                status: seller.status,
                submittedAt: seller.createdAt
            }
        });
    } catch (error) {
        console.error('Apply seller error:', error);
        
        // Log chi tiết lỗi để debug
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Dữ liệu không hợp lệ: ' + validationErrors.join(', ')
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Hồ sơ đã tồn tại cho user này'
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi server. Vui lòng thử lại sau.' 
        });
    }
};

// [GET] Lấy tất cả seller với thông tin user
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find()
            .populate('userID', 'username email fullName phoneNumber')
            .select('-__v');
        
        res.json({
            success: true,
            data: sellers
        });
    } catch (error) {
        console.error('Get all sellers error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [GET] Lấy seller theo ID
export const getSellerById = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id)
            .populate('userID', 'username email fullName phoneNumber address');
        
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        res.json({
            success: true,
            data: seller
        });
    } catch (error) {
        console.error('Get seller by ID error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [PATCH] Duyệt seller
export const approveSeller = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Update seller status
        const seller = await Seller.findByIdAndUpdate(
            id, 
            { status: 'approved' }, 
            { new: true }
        ).populate('userID');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        // Update user role to include seller
        await User.findByIdAndUpdate(
            seller.userID._id,
            { $addToSet: { role: 'seller' } }
        );

        res.json({
            success: true,
            message: 'Seller approved successfully',
            data: seller
        });
    } catch (error) {
        console.error('Approve seller error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [PATCH] Từ chối seller
export const rejectSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const seller = await Seller.findByIdAndUpdate(
            id, 
            { 
                status: 'rejected',
                rejectionReason: reason 
            }, 
            { new: true }
        ).populate('userID');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        res.json({
            success: true,
            message: 'Seller rejected successfully',
            data: seller
        });
    } catch (error) {
        console.error('Reject seller error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [PATCH] Cập nhật thông tin seller
export const updateSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.userID;
        delete updateData.status;

        const seller = await Seller.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('userID');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        res.json({
            success: true,
            message: 'Seller updated successfully',
            data: seller
        });
    } catch (error) {
        console.error('Update seller error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [DELETE] Xóa seller (soft delete)
export const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        ).populate('userID');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        // Remove seller role from user
        await User.findByIdAndUpdate(
            seller.userID._id,
            { $pull: { role: 'seller' } }
        );

        res.json({
            success: true,
            message: 'Seller deactivated successfully',
            data: seller
        });
    } catch (error) {
        console.error('Delete seller error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [GET] Lấy seller theo user ID
export const getSellerByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const seller = await Seller.findOne({ userID: userId })
            .populate('userID', 'username email fullName phoneNumber address');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found for this user'
            });
        }

        res.json({
            success: true,
            data: seller
        });
    } catch (error) {
        console.error('Get seller by user ID error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// [GET] Kiểm tra trạng thái hồ sơ seller của user hiện tại
export const checkCurrentUserSellerStatus = async (req, res) => {
    try {
        const authUser = req.user; // from authenticateToken

        const seller = await Seller.findOne({ userID: authUser._id })
            .select('status businessName createdAt updatedAt');

        if (!seller) {
            return res.json({
                success: true,
                data: {
                    hasApplication: false,
                    message: 'Bạn chưa nộp hồ sơ đăng ký seller'
                }
            });
        }

        let message = '';
        switch (seller.status) {
            case 'pending':
                message = `Hồ sơ của bạn đã được nộp vào ${new Date(seller.createdAt).toLocaleDateString('vi-VN')} và đang chờ duyệt. Vui lòng kiên nhẫn chờ admin xem xét.`;
                break;
            case 'approved':
                message = `Hồ sơ của bạn đã được duyệt thành công vào ${new Date(seller.updatedAt).toLocaleDateString('vi-VN')}. Bạn có thể bắt đầu bán hàng!`;
                break;
            case 'rejected':
                message = `Hồ sơ của bạn đã bị từ chối vào ${new Date(seller.updatedAt).toLocaleDateString('vi-VN')}. Bạn có thể nộp lại hồ sơ mới.`;
                break;
            case 'suspended':
                message = `Tài khoản seller của bạn đã bị tạm ngưng vào ${new Date(seller.updatedAt).toLocaleDateString('vi-VN')}. Vui lòng liên hệ admin để biết thêm chi tiết.`;
                break;
            default:
                message = 'Trạng thái hồ sơ không xác định.';
        }

        res.json({
            success: true,
            data: {
                hasApplication: true,
                status: seller.status,
                businessName: seller.businessName,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt,
                message: message
            }
        });
    } catch (error) {
        console.error('Check current user seller status error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};
