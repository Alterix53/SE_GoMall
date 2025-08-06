import express from "express";
import * as adminController from "../controllers/adminController.js";
<<<<<<< HEAD

const router = express.Router();

router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);


=======
import { authenticateAdmin, adminRateLimit } from "../middleware/auth.js";

const router = express.Router();

// Apply rate limiting to all admin routes
router.use(adminRateLimit);

// Admin authentication
router.post("/login", adminController.adminLogin);

// Dashboard & Statistics APIs
router.get("/dashboard/stats", authenticateAdmin, adminController.getDashboardStats);
router.get("/dashboard/revenue", authenticateAdmin, adminController.getRevenueStats);
router.get("/dashboard/top-products", authenticateAdmin, adminController.getTopSellingProducts);
router.get("/dashboard/seller-stats", authenticateAdmin, adminController.getSellerStats);
router.get("/dashboard/user-activity", authenticateAdmin, adminController.getUserActivityStats);
router.get("/dashboard/overview", authenticateAdmin, adminController.getSystemOverview);

// User Management APIs
router.get("/users", authenticateAdmin, adminController.getAllUsers);
router.get("/users/:id", authenticateAdmin, adminController.getUserById);
router.post("/users", authenticateAdmin, adminController.createUser);
router.put("/users/:id", authenticateAdmin, adminController.updateUser);
router.delete("/users/:id", authenticateAdmin, adminController.deleteUser);
router.patch("/users/:id/status", authenticateAdmin, adminController.updateUserStatus);

// Seller Management APIs
router.get("/sellers", authenticateAdmin, adminController.getAllSellers);
router.get("/sellers/:id", authenticateAdmin, adminController.getSellerById);
router.post("/sellers", authenticateAdmin, adminController.createSeller);
router.put("/sellers/:id", authenticateAdmin, adminController.updateSeller);
router.delete("/sellers/:id", authenticateAdmin, adminController.deleteSeller);
router.patch("/sellers/:id/status", authenticateAdmin, adminController.updateSellerStatus);
router.patch("/sellers/:id/approve", authenticateAdmin, adminController.approveSeller);

// Product Management APIs
router.get("/products", authenticateAdmin, adminController.getAllProducts);
router.get("/products/:id", authenticateAdmin, adminController.getProductById);
router.post("/products", authenticateAdmin, adminController.createProduct);
router.put("/products/:id", authenticateAdmin, adminController.updateProduct);
router.delete("/products/:id", authenticateAdmin, adminController.deleteProduct);
router.patch("/products/:id/status", authenticateAdmin, adminController.updateProductStatus);
router.patch("/products/:id/feature", authenticateAdmin, adminController.toggleProductFeature);

// Order Management APIs
router.get("/orders", authenticateAdmin, adminController.getAllOrders);
router.get("/orders/:id", authenticateAdmin, adminController.getOrderById);
router.put("/orders/:id", authenticateAdmin, adminController.updateOrder);
router.patch("/orders/:id/status", authenticateAdmin, adminController.updateOrderStatus);

// Category Management APIs
router.get("/categories", authenticateAdmin, adminController.getAllCategories);
router.get("/categories/:id", authenticateAdmin, adminController.getCategoryById);
router.post("/categories", authenticateAdmin, adminController.createCategory);
router.put("/categories/:id", authenticateAdmin, adminController.updateCategory);
router.delete("/categories/:id", authenticateAdmin, adminController.deleteCategory);

// System Management APIs
router.get("/system/logs", authenticateAdmin, adminController.getSystemLogs);
router.get("/system/backup", authenticateAdmin, adminController.createBackup);
router.post("/system/maintenance", authenticateAdmin, adminController.toggleMaintenanceMode);
>>>>>>> Admin_Dashboard

export default router;