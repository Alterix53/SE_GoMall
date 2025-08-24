import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Tạo đánh giá mới
export const createReview = async (req, res) => {
    try {
        const { productID, rating, comment } = req.body;
        const userID = req.user._id; // Lấy từ middleware auth

        // Kiểm tra rating hợp lệ
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Đánh giá phải từ 1-5 sao'
            });
        }

        // Tạo đánh giá mới (cho phép nhiều đánh giá từ cùng một user)
        const review = new Review({
            productID,
            userID,
            rating,
            comment: comment || ''
        });

        await review.save();

        // Cập nhật rating trung bình của sản phẩm
        await updateProductRating(productID);

        // Lấy thông tin user để trả về
        const user = await User.findById(userID).select('username avatar');
        
        const reviewWithUser = {
            ...review.toObject(),
            userID: user
        };

        res.status(201).json({
            success: true,
            message: 'Đánh giá đã được tạo thành công',
            data: reviewWithUser
        });

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo đánh giá',
            error: error.message
        });
    }
};

// Lấy tất cả đánh giá của một sản phẩm
export const getProductReviews = async (req, res) => {
    try {
        const { productID } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Xây dựng query
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'rating_high':
                sortOption = { rating: -1 };
                break;
            case 'rating_low':
                sortOption = { rating: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        // Tính toán pagination
        const skip = (page - 1) * limit;

        // Lấy đánh giá với populate user info
        const reviews = await Review.find({ productID })
            .populate('userID', 'username avatar')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // Đếm tổng số đánh giá
        const totalReviews = await Review.countDocuments({ productID });

        // Tính toán thống kê rating
        const ratingStats = await Review.aggregate([
            { $match: { productID: new mongoose.Types.ObjectId(productID) } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        // Tạo rating distribution
        const ratingDistribution = {};
        for (let i = 5; i >= 1; i--) {
            const found = ratingStats.find(stat => stat._id === i);
            ratingDistribution[i] = found ? found.count : 0;
        }

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                },
                ratingDistribution,
                averageRating: product.averageRating || 0
            }
        });

    } catch (error) {
        console.error('Error getting product reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy đánh giá',
            error: error.message
        });
    }
};

// Cập nhật đánh giá
export const updateReview = async (req, res) => {
    try {
        const { reviewID } = req.params;
        const { rating, comment } = req.body;
        const userID = req.user._id;

        // Tìm đánh giá
        const review = await Review.findById(reviewID);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đánh giá'
            });
        }

        // Kiểm tra quyền sửa đánh giá
        if (review.userID.toString() !== userID) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền sửa đánh giá này'
            });
        }

        // Cập nhật đánh giá
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Đánh giá phải từ 1-5 sao'
                });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        review.updatedAt = new Date();
        await review.save();

        // Cập nhật rating trung bình của sản phẩm
        await updateProductRating(review.productID);

        res.json({
            success: true,
            message: 'Đánh giá đã được cập nhật thành công',
            data: review
        });

    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật đánh giá',
            error: error.message
        });
    }
};

// Xóa đánh giá
export const deleteReview = async (req, res) => {
    try {
        const { reviewID } = req.params;
        const userID = req.user._id;

        // Tìm đánh giá
        const review = await Review.findById(reviewID);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đánh giá'
            });
        }

        // Kiểm tra quyền xóa đánh giá
        if (review.userID.toString() !== userID) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa đánh giá này'
            });
        }

        const productID = review.productID;
        await Review.findByIdAndDelete(reviewID);

        // Cập nhật rating trung bình của sản phẩm
        await updateProductRating(productID);

        res.json({
            success: true,
            message: 'Đánh giá đã được xóa thành công'
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa đánh giá',
            error: error.message
        });
    }
};

// Lấy đánh giá của user
export const getUserReviews = async (req, res) => {
    try {
        const userID = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ userID })
            .populate('productID', 'name images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalReviews = await Review.countDocuments({ userID });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error getting user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy đánh giá của user',
            error: error.message
        });
    }
};

// Hàm helper để cập nhật rating trung bình của sản phẩm
const updateProductRating = async (productID) => {
    try {
        const result = await Review.aggregate([
            { $match: { productID: new mongoose.Types.ObjectId(productID) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            const { averageRating, totalReviews } = result[0];
            await Product.findByIdAndUpdate(productID, {
                averageRating: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân
                totalReviews: totalReviews
            });
        } else {
            // Không có đánh giá nào
            await Product.findByIdAndUpdate(productID, {
                averageRating: 0,
                totalReviews: 0
            });
        }
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
};
