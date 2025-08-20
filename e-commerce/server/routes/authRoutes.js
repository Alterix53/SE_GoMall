import express from 'express';
import { body, oneOf } from 'express-validator';
import {
    register,
    registerSeller,
    login,
    logout,
    getCurrentUser,
    updateCurrentUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
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
    // Accept businessName or legacy storeName
    oneOf([
        body('businessName').exists({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }),
        body('storeName').exists({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 })
    ], 'Business/store name must be between 2 and 100 characters'),
    body('businessLicense')
        .trim()
        .notEmpty()
        .withMessage('Business license is required'),
    // Accept businessPhone or legacy sellerPhoneNumber
    oneOf([
        body('businessPhone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/),
        body('sellerPhoneNumber').optional().matches(/^[\+]?[1-9][\d]{0,15}$/)
    ], 'Please provide a valid seller phone number'),
    // Accept businessAddress or legacy sellerAddress
    oneOf([
        body('businessAddress').optional().trim().isLength({ max: 500 }),
        body('sellerAddress').optional().trim().isLength({ max: 500 })
    ], 'Seller address must not exceed 500 characters'),
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

const changePasswordValidation = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
];

const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Auth routes
router.post('/register', registerValidation, register);
router.post('/register-seller', sellerRegisterValidation, registerSeller);
router.post('/login', loginValidation, login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateCurrentUser);
router.post('/refresh', refreshTokenValidation, refreshToken);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router; 