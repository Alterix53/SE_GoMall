import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole,
    backupUsers
} from '../controllers/userController.js';
import { authenticateToken, requireRole as checkRole } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Admin routes
router.get('/', checkRole(['admin']), getAllUsers);
router.get('/role/:role', checkRole(['admin']), getUsersByRole);
router.post('/backup', checkRole(['admin']), backupUsers);

// User routes (có thể là admin hoặc chính user đó)
router.get('/:id', (req, res, next) => {
    // Cho phép admin hoặc chính user đó xem thông tin
    const isAdmin = Array.isArray(req.user.role) ? req.user.role.includes('admin') : req.user.role === 'admin';
    const isOwner = req.user?._id?.toString?.() === req.params.id;
    if (isAdmin || isOwner) return next();
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
}, getUserById);

router.put('/:id', (req, res, next) => {
    // Cho phép admin hoặc chính user đó cập nhật thông tin
    const isAdmin = Array.isArray(req.user.role) ? req.user.role.includes('admin') : req.user.role === 'admin';
    const isOwner = req.user?._id?.toString?.() === req.params.id;
    if (isAdmin || isOwner) return next();
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
}, updateUser);

// Chỉ admin mới có thể xóa user
router.delete('/:id', checkRole(['admin']), deleteUser);

export default router;