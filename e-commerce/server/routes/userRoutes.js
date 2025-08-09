import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole,
    backupUsers
} from '../controllers/userController.js';
<<<<<<< HEAD
import { authenticateToken, requireRole } from '../middleware/auth.js';
=======
import { authenticateToken, requireRole as checkRole } from '../middleware/auth.js';
>>>>>>> origin/Develop

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Admin routes
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/role/:role', requireRole(['admin']), getUsersByRole);
router.post('/backup', requireRole(['admin']), backupUsers);

// User routes (có thể là admin hoặc chính user đó)
router.get('/:id', (req, res, next) => {
    // Cho phép admin hoặc chính user đó xem thông tin
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
        });
    }
}, getUserById);

router.put('/:id', (req, res, next) => {
    // Cho phép admin hoặc chính user đó cập nhật thông tin
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
        });
    }
}, updateUser);

// Chỉ admin mới có thể xóa user
router.delete('/:id', requireRole(['admin']), deleteUser);

export default router;