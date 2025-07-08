import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/flash-sale", productController.getFlashSaleProducts);
router.get("/top-products", productController.getTopProducts);

export default router;