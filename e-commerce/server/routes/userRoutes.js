import express from 'express';
import * as userController from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// KHÔNG middleware cho login/register
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

// Các route dưới đây mới cần middleware
router.get('/profile/:id', authenticateToken, userController.getUserProfile);
router.put('/profile/:id', authenticateToken, userController.updateUserProfile);
router.put('/profile/:id/password', authenticateToken, userController.changePassword);

router.get('/users', authenticateToken, userController.getAllUsers);
router.put('/users/:id/deactivate', authenticateToken, userController.deactivateUser);
router.put('/users/:id/activate', authenticateToken, userController.activateUser);

export default router;