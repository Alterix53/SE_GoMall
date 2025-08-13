import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
export const getUserCart = async (req, res) => {
    try {
        const userID = req.user._id;
        
        let cart = await Cart.findOne({ userID }).populate({
            path: 'items.productID',
            select: 'name price images rating sold'
        });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({ userID, items: [], totalAmount: 0 });
            await cart.save();
        }

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount
            }
        });
    } catch (error) {
        console.error("Error in getUserCart:", error.message);
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userID = req.user._id;
        const { productID, quantity = 1, size } = req.body;

        // Validate product exists
        const product = await Product.findById(productID);
        if (!product) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userID });
        if (!cart) {
            cart = new Cart({ userID, items: [], totalAmount: 0 });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productID.toString() === productID && item.size === size
        );

        if (existingItemIndex !== -1) {
            // Update quantity if product already exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                productID,
                quantity,
                size: size || 'default'
            });
        }

        // Calculate total amount
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const itemProduct = await Product.findById(item.productID);
            const productPrice = itemProduct.price?.sale || itemProduct.price?.original || 0;
            cart.totalAmount += productPrice * item.quantity;
        }

        await cart.save();

        // Populate product details for response
        await cart.populate({
            path: 'items.productID',
            select: 'name price images rating sold'
        });

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã thêm vào giỏ hàng",
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount
            }
        });
    } catch (error) {
        console.error("Error in addToCart:", error.message);
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userID = req.user._id;
        const { productID, quantity, size } = req.body;

        if (quantity < 1) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Số lượng phải lớn hơn 0"
            });
        }

        const cart = await Cart.findOne({ userID });
        if (!cart) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        // Find and update item
        const itemIndex = cart.items.findIndex(
            item => item.productID.toString() === productID && item.size === size
        );

        if (itemIndex === -1) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không có trong giỏ hàng"
            });
        }

        cart.items[itemIndex].quantity = quantity;

        // Recalculate total amount
        const product = await Product.findById(productID);
        cart.totalAmount = cart.items.reduce((total, item) => {
            const productPrice = product.price?.sale || product.price?.original || 0;
            return total + (productPrice * item.quantity);
        }, 0);

        await cart.save();
        await cart.populate({
            path: 'items.productID',
            select: 'name price images rating sold'
        });

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã cập nhật giỏ hàng",
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount
            }
        });
    } catch (error) {
        console.error("Error in updateCartItem:", error.message);
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userID = req.user._id;
        const { productID, size } = req.body;

        const cart = await Cart.findOne({ userID });
        if (!cart) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        // Remove item
        cart.items = cart.items.filter(
            item => !(item.productID.toString() === productID && item.size === size)
        );

        // Recalculate total amount
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.productID);
            const productPrice = product.price?.sale || product.price?.original || 0;
            cart.totalAmount += productPrice * item.quantity;
        }

        await cart.save();
        await cart.populate({
            path: 'items.productID',
            select: 'name price images rating sold'
        });

        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng",
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount
            }
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error.message);
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userID = req.user._id;

        const cart = await Cart.findOne({ userID });
        if (!cart) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng",
            data: {
                cart: cart,
                totalItems: 0,
                totalAmount: 0
            }
        });
    } catch (error) {
        console.error("Error in clearCart:", error.message);
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
}; 