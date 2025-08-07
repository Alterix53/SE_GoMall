import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticateToken as requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', requireAuth, paymentController.processPayment);
router.get('/:id', requireAuth, paymentController.getPaymentById);
router.post('/refund', requireAuth, paymentController.refundPayment);
router.put('/:id/status', requireAuth, paymentController.updatePaymentStatus);

export default router;