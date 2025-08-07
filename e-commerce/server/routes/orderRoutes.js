import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken as requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, orderController.createOrder);
router.get('/', requireAuth, orderController.getUserOrders);
router.get('/:id', requireAuth, orderController.getOrderById);
router.put('/:id/status', requireAuth, orderController.updateOrderStatus);
router.delete('/:id', requireAuth, orderController.cancelOrder);

export default router;