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

        // Validate product exists and check inventory
        const product = await Product.findById(productID);
        if (!product) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if product is active
        if (!product.isActive) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Product is not available"
            });
        }

        // Check inventory quantity
        const availableQuantity = product.inventory?.quantity || 0;
        if (availableQuantity <= 0) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Product is out of stock",
                data: { availableQuantity: 0 }
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

        let newQuantity = quantity;
        if (existingItemIndex !== -1) {
            // Update quantity if product already exists
            newQuantity = cart.items[existingItemIndex].quantity + quantity;
        }

        // Check if total quantity exceeds available inventory
        if (newQuantity > availableQuantity) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: `Số lượng đã chọn (${newQuantity}) vượt quá số lượng tồn kho (${availableQuantity})`,
                data: { 
                    availableQuantity,
                    requestedQuantity: newQuantity,
                    currentCartQuantity: existingItemIndex !== -1 ? cart.items[existingItemIndex].quantity : 0,
                    canAddQuantity: Math.max(0, availableQuantity - (existingItemIndex !== -1 ? cart.items[existingItemIndex].quantity : 0))
                }
            });
        }

        if (existingItemIndex !== -1) {
            // Update quantity if product already exists
            cart.items[existingItemIndex].quantity = newQuantity;
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
            if (itemProduct) {
                const productPrice = itemProduct.price?.sale || itemProduct.price?.original || 0;
                cart.totalAmount += productPrice * item.quantity;
            }
        }

        await cart.save();

        // Populate product details for response
        await cart.populate({
            path: 'items.productID',
            select: 'name price images rating sold inventory'
        });

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã thêm vào giỏ hàng",
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount,
                availableQuantity: availableQuantity - newQuantity
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

        // Check product inventory
        const product = await Product.findById(productID);
        if (!product) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if product is active
        if (!product.isActive) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Product is not available"
            });
        }

        // Check inventory quantity
        const availableQuantity = product.inventory?.quantity || 0;
        if (availableQuantity <= 0) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Product is out of stock",
                data: { availableQuantity: 0 }
            });
        }

        // Check if requested quantity exceeds available inventory
        if (quantity > availableQuantity) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: `Số lượng đã chọn (${quantity}) vượt quá số lượng tồn kho (${availableQuantity})`,
                data: { 
                    availableQuantity,
                    requestedQuantity: quantity,
                    canAddQuantity: availableQuantity
                }
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
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const itemProduct = await Product.findById(item.productID);
            if (itemProduct) {
                const productPrice = itemProduct.price?.sale || itemProduct.price?.original || 0;
                cart.totalAmount += productPrice * item.quantity;
            }
        }

        await cart.save();
        await cart.populate({
            path: 'items.productID',
            select: 'name price images rating sold inventory'
        });

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            message: "Đã cập nhật giỏ hàng",
            data: {
                cart: cart,
                totalItems: cart.items.length,
                totalAmount: cart.totalAmount,
                availableQuantity: availableQuantity - quantity
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
            if (product) {
                const productPrice = product.price?.sale || product.price?.original || 0;
                cart.totalAmount += productPrice * item.quantity;
            }
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

// Check product inventory
export const checkProductInventory = async (req, res) => {
    try {
        const { productID } = req.params;

        // Validate product exists
        const product = await Product.findById(productID);
        if (!product) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if product is active
        if (!product.isActive) {
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
            return res.status(400).json({
                success: false,
                message: "Product is not available"
            });
        }

        const availableQuantity = product.inventory?.quantity || 0;

        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.json({
            success: true,
            data: {
                productID,
                availableQuantity,
                isInStock: availableQuantity > 0,
                productName: product.name
            }
        });
    } catch (error) {
        console.error("Error in checkProductInventory:", error.message);
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
}; 