import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole,
    backupUsers
} from '../controllers/userController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Admin routes (admin token required)
router.get('/', authenticateAdmin, getAllUsers);
router.get('/role/:role', authenticateAdmin, getUsersByRole);
router.post('/backup', authenticateAdmin, backupUsers);

// User routes (có thể là admin hoặc chính user đó)
router.get('/:id', (req, res, next) => {
    // Allow owner; admins handled via separate admin token routes
    const isOwner = req.user?._id?.toString?.() === req.params.id;
    if (isOwner) return next();
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
}, getUserById);

router.put('/:id', (req, res, next) => {
    // Allow owner only; admins handled via separate admin token routes
    const isOwner = req.user?._id?.toString?.() === req.params.id;
    if (isOwner) return next();
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
}, updateUser);

// Delete user: admin-only via admin token
router.delete('/:id', authenticateAdmin, deleteUser);

export default router;