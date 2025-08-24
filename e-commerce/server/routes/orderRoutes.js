import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.put('/:id/delivered', authenticateToken, orderController.markOrderAsDelivered);
router.delete('/:id', authenticateToken, orderController.cancelOrder);

export default router;