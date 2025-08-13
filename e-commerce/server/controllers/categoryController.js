import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ResponseHandler from "../utils/responseHandler.js";

// Get all categories
export const getAllCategories = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to /api/categories received");
    
    const categories = await Category.find({}).sort({ categoryName: 1 });
    
    console.log("Responding with categories:", categories.length);
    ResponseHandler.success(res, { categories }, "Get categories list successfully");
});

// Get category by ID
export const getCategoryById = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get category by ID:", req.params.id);
    
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return ResponseHandler.notFound(res, "Category not found");
        }
        ResponseHandler.success(res, { category }, "Get category information successfully");
    } catch (error) {
        if (error.message === "Category not found") {
            ResponseHandler.notFound(res, error.message);
        } else {
            throw error;
        }
    }
});

// Get products by category
export const getCategoryProducts = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get products by category:", req.params.id);
    
    try {
        const { page = 1, limit = 12 } = req.query;
        
        const category = await Category.findById(req.params.id);
        if (!category) {
            return ResponseHandler.notFound(res, "Category not found");
        }
        
        const products = await Product.find({ 
            categoryID: req.params.id,
            isActive: true 
        })
        .populate("categoryID", "categoryName slug")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
        const total = await Product.countDocuments({ 
            categoryID: req.params.id,
            isActive: true 
        });
        
        ResponseHandler.success(res, {
            products,
            pagination: {
                current: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
                limit: Number(limit),
            },
            category
        }, "Get category products successfully");
    } catch (error) {
        if (error.message === "Category not found") {
            ResponseHandler.notFound(res, error.message);
        } else {
            throw error;
        }
    }
}); 