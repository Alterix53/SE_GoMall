import express from 'express';
import { body, oneOf } from 'express-validator';
import {
    register,
    registerSeller,
    login,
    logout,
    getCurrentUser,
    updateCurrentUser,
    refreshToken
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('phoneNumber')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
];

const sellerRegisterValidation = [
    ...registerValidation,
    body('storeName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Store name must be between 2 and 100 characters'),
    body('businessLicense')
        .trim()
        .notEmpty()
        .withMessage('Business license is required'),
    body('sellerPhoneNumber')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid seller phone number'),
    body('sellerAddress')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Seller address must not exceed 500 characters'),
    body('verificationDocs')
        .optional()
        .isArray()
        .withMessage('Verification documents must be an array')
];

const loginValidation = [
    // Yêu cầu password
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    // Bắt buộc CÓ email hợp lệ HOẶC username hợp lệ
    oneOf([
        body('email')
            .exists({ checkFalsy: true })
            .bail()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid username or email'),
        body('username')
            .exists({ checkFalsy: true })
            .bail()
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters'),
    ], 'Please provide a valid username or email')
];

const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
];

// Auth routes
router.post('/register', registerValidation, register);
router.post('/register-seller', sellerRegisterValidation, registerSeller);
router.post('/login', loginValidation, login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateCurrentUser);
router.post('/refresh', refreshTokenValidation, refreshToken);

export default router; 