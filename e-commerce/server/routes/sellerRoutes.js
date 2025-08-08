import express from 'express';
import {
    getAllSellers,
    getSellerById,
    approveSeller,
    rejectSeller,
    updateSeller,
    deleteSeller,
    getSellerByUserId
} from '../controllers/sellerControllers.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes (if any)
router.get('/user/:userId', getSellerByUserId);

// Protected routes - require authentication
router.use(authenticateToken);

// Admin only routes
router.get('/', requireRole(['admin']), getAllSellers);
router.get('/:id', requireRole(['admin']), getSellerById);
router.patch('/:id/approve', requireRole(['admin']), approveSeller);
router.patch('/:id/reject', requireRole(['admin']), rejectSeller);
router.patch('/:id', requireRole(['admin']), updateSeller);
router.delete('/:id', requireRole(['admin']), deleteSeller);

export default router;
