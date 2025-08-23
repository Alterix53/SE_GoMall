import express from 'express';
import * as momoPaymentController from '../controllers/momoPaymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints (không cần authentication)
router.post('/callback', momoPaymentController.handleMomoCallback);
router.post('/ipn', momoPaymentController.handleIpn);
router.get('/health', momoPaymentController.healthCheck);

// Protected endpoints (cần authentication)
router.post('/create', authenticateToken, momoPaymentController.createMomoPayment);
router.get('/status/:requestId', authenticateToken, momoPaymentController.checkPaymentStatus);
router.get('/user', authenticateToken, momoPaymentController.getUserPayments);
router.delete('/cancel/:requestId', authenticateToken, momoPaymentController.cancelPayment);
router.get('/:id', authenticateToken, momoPaymentController.getPaymentById);

// Testing endpoints (có thể remove trong production)
router.post('/simulate', momoPaymentController.simulateMoMoResponse);
router.post('/test-create', momoPaymentController.createTestPayment);

export default router;
