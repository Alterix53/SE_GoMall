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
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';
=======
import { authenticateToken, requireRole } from '../middleware/auth.js';
>>>>>>> testUI

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

<<<<<<< HEAD
// Admin routes (admin token required)
router.get('/', authenticateAdmin, getAllUsers);
router.get('/role/:role', authenticateAdmin, getUsersByRole);
router.post('/backup', authenticateAdmin, backupUsers);
=======
// Admin routes
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/role/:role', requireRole(['admin']), getUsersByRole);
router.post('/backup', requireRole(['admin']), backupUsers);
>>>>>>> testUI

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

<<<<<<< HEAD
// Delete user: admin-only via admin token
router.delete('/:id', authenticateAdmin, deleteUser);
=======
// Chỉ admin mới có thể xóa user
router.delete('/:id', requireRole(['admin']), deleteUser);
>>>>>>> testUI

export default router;