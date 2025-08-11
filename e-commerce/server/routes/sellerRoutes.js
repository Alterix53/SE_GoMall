import express from 'express';
import {
    applyForSeller,
    getAllSellers,
    getSellerById,
    approveSeller,
    rejectSeller,
    updateSeller,
    deleteSeller,
    getSellerByUserId
} from '../controllers/sellerControllers.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';
import { uploadVerificationDocs } from '../middleware/upload.js';

const router = express.Router();

// Public routes (if any)
router.get('/user/:userId', getSellerByUserId);

// Protected routes - user auth for applying (supports multipart form with verificationDocs[])
router.post('/apply', authenticateToken, uploadVerificationDocs, applyForSeller);

// Admin only routes (use admin token)
router.get('/', authenticateAdmin, getAllSellers);
router.get('/:id', authenticateAdmin, getSellerById);
router.patch('/:id/approve', authenticateAdmin, approveSeller);
router.patch('/:id/reject', authenticateAdmin, rejectSeller);
router.patch('/:id', authenticateAdmin, updateSeller);
router.delete('/:id', authenticateAdmin, deleteSeller);

export default router;
