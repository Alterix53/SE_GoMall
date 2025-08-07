import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/:id/products", categoryController.getCategoryProducts);

export default router; 