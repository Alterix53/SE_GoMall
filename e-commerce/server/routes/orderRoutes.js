import express from 'express';
import * as orderController from '../controllers/orderController.js';
<<<<<<< HEAD
import { authenticateToken } from '../middleware/auth.js';
=======
import { authenticateToken as requireAuth } from '../middleware/auth.js';
>>>>>>> origin/Develop

const router = express.Router();

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.delete('/:id', authenticateToken, orderController.cancelOrder);

export default router;