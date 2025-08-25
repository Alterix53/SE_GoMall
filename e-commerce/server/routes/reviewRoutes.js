import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getUserReviews
} from '../controllers/reviewController.js';

const router = express.Router();

// Tạo đánh giá mới (yêu cầu đăng nhập)
router.post('/', authenticateToken, createReview);

// Lấy tất cả đánh giá của một sản phẩm (không yêu cầu đăng nhập)
router.get('/product/:productID', getProductReviews);

// Lấy đánh giá của user hiện tại (yêu cầu đăng nhập)
router.get('/user', authenticateToken, getUserReviews);

// Cập nhật đánh giá (yêu cầu đăng nhập)
router.put('/:reviewID', authenticateToken, updateReview);

// Xóa đánh giá (yêu cầu đăng nhập)
router.delete('/:reviewID', authenticateToken, deleteReview);

export default router;
