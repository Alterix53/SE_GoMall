import express from 'express';
import {
    getAllProducts,
    getFlashSaleProducts,
    getTopProducts,
    getProductStats,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySeller,
    handleProductImageUpload
} from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/top-products', getTopProducts);
router.get('/stats', getProductStats);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Seller routes (require seller role)
router.get('/seller/my-products', requireRole(['seller']), getProductsBySeller);
router.post('/', requireRole(['seller']), handleProductImageUpload, createProduct);
router.put('/:id', requireRole(['seller']), handleProductImageUpload, updateProduct);
router.delete('/:id', requireRole(['seller']), deleteProduct);

export default router;