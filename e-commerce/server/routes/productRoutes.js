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
import { authenticateToken, requireApprovedSeller } from '../middleware/auth.js';

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

// Seller routes (require approved seller)
router.get('/seller/my-products', requireApprovedSeller, getProductsBySeller);
router.post('/', requireApprovedSeller, handleProductImageUpload, createProduct);
router.put('/:id', requireApprovedSeller, handleProductImageUpload, updateProduct);
router.delete('/:id', requireApprovedSeller, deleteProduct);

export default router;