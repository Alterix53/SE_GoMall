import express from 'express';
import {
    getAllProducts,
    getFlashSaleProducts,
    getTopProducts,
    getProductStats,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySeller,
    handleProductImageUpload
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/top-products', getTopProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Seller routes (require seller role)
router.get('/seller/my-products', checkRole(['seller']), getProductsBySeller);
router.post('/', checkRole(['seller']), handleProductImageUpload, createProduct);
router.put('/:id', checkRole(['seller']), handleProductImageUpload, updateProduct);
router.delete('/:id', checkRole(['seller']), deleteProduct);

export default router;