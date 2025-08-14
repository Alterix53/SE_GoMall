import Seller from '../models/Seller.js';
import User from '../models/User.js';

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
