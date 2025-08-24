import express from "express";
import * as cartController from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Check product inventory (public route - no auth required)
router.get("/inventory/:productID", cartController.checkProductInventory);

// Apply authentication middleware to all other cart routes
router.use(authenticateToken);

// Get user's cart
router.get("/me", cartController.getUserCart);

// Add item to cart
router.post("/add", cartController.addToCart);

// Update cart item quantity
router.put("/update", cartController.updateCartItem);

// Remove item from cart
router.delete("/remove", cartController.removeFromCart);

// Clear cart
router.delete("/clear", cartController.clearCart);

export default router; 