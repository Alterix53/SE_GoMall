import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
<<<<<<< HEAD
import { authenticateToken } from '../middleware/auth.js';
=======
import { authenticateToken as requireAuth } from '../middleware/auth.js';
>>>>>>> origin/Develop

const router = express.Router();

router.post('/process', authenticateToken, paymentController.processPayment);
router.get('/:id', authenticateToken, paymentController.getPaymentById);
router.post('/refund', authenticateToken, paymentController.refundPayment);
router.put('/:id/status', authenticateToken, paymentController.updatePaymentStatus);

export default router;