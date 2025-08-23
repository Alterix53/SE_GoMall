import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Seller from "../models/Seller.js";
import Category from "../models/Category.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NotificationService from "./notificationService.js";

class AdminService {
    // Hash password
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Compare password
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Generate JWT token for admin
    generateAdminToken(admin) {
        const payload = {
            adminId: admin._id,
            username: admin.username,
            email: admin.email,
            role: 'admin'
        };
        
        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });
    }

    // Authenticate admin
    async authenticateAdmin(username, password) {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            throw new Error("Username not found");
        }

        if (!admin.isActive) {
            throw new Error("Admin account is locked");
        }

        const isPasswordValid = await this.comparePassword(password, admin.password);

        if (!isPasswordValid) {
            throw new Error("Incorrect password");
        }

        // Generate token
        const token = this.generateAdminToken(admin);

        // Return admin without password
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        return {
            admin: adminResponse,
            token
        };
    }

    // Get dashboard statistics
    async getDashboardStats() {
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalSellers,
            activeUsers,
            activeProducts,
            pendingOrders,
            activeSellers
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Seller.countDocuments(),
            User.countDocuments({ isActive: true }),
            Product.countDocuments({ isActive: true }),
            // Match Order schema enum values (Pending/Processing/Shipped/Delivered/Cancelled)
            Order.countDocuments({ status: 'Pending' }),
            Seller.countDocuments({ isActive: true })
        ]);

        // Calculate revenue (assuming Order has totalAmount field)
        const revenueStats = await Order.aggregate([
            // Delivered orders are considered completed revenue
            { $match: { status: 'Delivered' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' }
                }
            }
        ]);

        const revenue = revenueStats[0] || { totalRevenue: 0, avgOrderValue: 0 };

        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                inactive: totalProducts - activeProducts
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                completed: totalOrders - pendingOrders
            },
            sellers: {
                total: totalSellers,
                active: activeSellers,
                inactive: totalSellers - activeSellers
            },
            revenue: {
                total: revenue.totalRevenue,
                average: revenue.avgOrderValue
            }
        };
    }

    // Get revenue statistics by period
    async getRevenueStats(period = 'month') {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const revenueStats = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    revenue: { $sum: '$total' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        return revenueStats;
    }

    // Get revenue distribution by product category (for pie chart)
    async getRevenueDistribution() {
        const distribution = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productID',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$category.categoryName', 'Uncategorized'] },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { revenue: -1 } },
            {
                $project: {
                    _id: 0,
                    categoryName: '$_id',
                    revenue: 1,
                    orderCount: 1
                }
            }
        ]);

        return distribution;
    }

    // Get top selling products
    async getTopSellingProducts(limit = 10) {
        const products = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $project: {
                    name: 1,
                    sold: 1,
                    revenue: { $multiply: ['$price.sale', '$sold'] },
                    categoryName: '$category.categoryName'
                }
            },
            { $sort: { sold: -1 } },
            { $limit: limit }
        ]);

        return products;
    }

    // Get trending products (by most views)
    async getTrendingProducts(limit = 10) {
        const products = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: 1,
                    sold: 1,
                    views: 1,
                    revenue: {
                        $multiply: [
                            { $ifNull: ['$price.sale', '$price.original'] },
                            { $ifNull: ['$sold', 0] }
                        ]
                    },
                    categoryName: '$category.categoryName',
                    createdAt: 1
                }
            },
            { $sort: { views: -1, createdAt: -1 } },
            { $limit: limit }
        ]);

        return products;
    }

    // Get seller statistics
    async getSellerStats() {
        const sellerStats = await Seller.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'sellerID',
                    as: 'products'
                }
            },
            {
                $project: {
                    sellerName: 1,
                    productCount: { $size: '$products' },
                    totalRevenue: {
                        $sum: {
                            $map: {
                                input: '$products',
                                as: 'product',
                                in: { $multiply: ['$$product.price.sale', '$$product.sold'] }
                            }
                        }
                    }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        return sellerStats;
    }

    // Get user activity statistics
    async getUserActivityStats() {
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    newUsers: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return userStats;
    }

    // Get system overview
    async getSystemOverview() {
        const [
            dashboardStats,
            revenueStats,
            topProducts,
            sellerStats,
            userActivity
        ] = await Promise.all([
            this.getDashboardStats(),
            this.getRevenueStats('month'),
            this.getTopSellingProducts(5),
            this.getSellerStats(),
            this.getUserActivityStats()
        ]);

        return {
            dashboard: dashboardStats,
            revenue: revenueStats,
            topProducts,
            sellers: sellerStats,
            userActivity
        };
    }

    // Create user (admin function)
    async createUser(userData) {
        const { username, email, password, fullName, phoneNumber, address } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            throw new Error("Username or email already exists");
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            address
        });

        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Update user (admin function)
    async updateUser(userId, updateData) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Remove sensitive fields from update
        const { password, username, email, ...safeUpdateData } = updateData;

        // Update user
        Object.assign(user, safeUpdateData);
        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Delete user (admin function)
    async deleteUser(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        await User.findByIdAndDelete(userId);

        return { message: "User deleted successfully" };
    }

    // User Management Services
    async getAllUsers({ page = 1, limit = 10, search = '', status = '' }) {
        const skip = (page - 1) * limit;
        const query = {};

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.isActive = status === 'active';
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments(query)
        ]);

        return {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        return user;
    }

    async updateUserStatus(userId, status) {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        user.isActive = status === 'active';
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

    // Seller Management Services
    async getAllSellers({ page = 1, limit = 10, search = '', status = '' }) {
        const skip = (page - 1) * limit;
        const query = {};

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { businessEmail: { $regex: search, $options: 'i' } },
                { businessPhone: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            // Support filtering by lifecycle status or active flag
            if (['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
                query.status = status;
            } else if (['active', 'inactive'].includes(status)) {
                query.isActive = status === 'active';
            }
        }

        const [sellers, total] = await Promise.all([
            Seller.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Seller.countDocuments(query)
        ]);

        return {
            sellers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getSellerById(sellerId) {
        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            throw new Error("Người bán không tồn tại");
        }

        return seller;
    }

    async createSeller(sellerData) {
        // Align with Seller schema: expect linkage to User and business fields
        const {
            userID,
            businessName,
            businessDescription = '',
            businessAddress = '',
            businessPhone = '',
            businessEmail = '',
            businessLicense,
            verificationDocs = [],
            taxNumber = ''
        } = sellerData;

        if (!userID) {
            throw new Error('userID is required to create a seller');
        }

        if (!businessName) {
            throw new Error('businessName is required');
        }

        if (!businessLicense) {
            throw new Error('businessLicense is required');
        }

        const existingByUser = await Seller.findOne({ userID });
        if (existingByUser) {
            throw new Error('Seller profile for this user already exists');
        }

        const seller = new Seller({
            userID,
            businessName,
            businessDescription,
            businessAddress,
            businessPhone,
            businessEmail,
            businessLicense,
            verificationDocs,
            taxNumber,
            status: 'pending',
            isActive: false
        });

        await seller.save();

        return seller;
    }

    async updateSeller(sellerId, updateData) {
        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            throw new Error("Người bán không tồn tại");
        }

        // Only allow updating known business fields and flags
        const {
            businessName,
            businessDescription,
            businessAddress,
            businessPhone,
            businessEmail,
            businessLicense,
            verificationDocs,
            taxNumber,
            isActive
        } = updateData;

        Object.assign(seller, {
            ...(businessName !== undefined && { businessName }),
            ...(businessDescription !== undefined && { businessDescription }),
            ...(businessAddress !== undefined && { businessAddress }),
            ...(businessPhone !== undefined && { businessPhone }),
            ...(businessEmail !== undefined && { businessEmail }),
            ...(businessLicense !== undefined && { businessLicense }),
            ...(verificationDocs !== undefined && { verificationDocs }),
            ...(taxNumber !== undefined && { taxNumber }),
            ...(isActive !== undefined && { isActive })
        });
        await seller.save();

        return seller;
    }

    async deleteSeller(sellerId) {
        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            throw new Error("Người bán không tồn tại");
        }

        await Seller.findByIdAndDelete(sellerId);

        return { message: "Xóa người bán thành công" };
    }

    async updateSellerStatus(sellerId, status) {
        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            throw new Error("Người bán không tồn tại");
        }

        // Support toggling both lifecycle status and active flag
        if (['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
            seller.status = status;
            // Auto-activate on approval
            if (status === 'approved') {
                seller.isActive = true;
                seller.approvedAt = new Date();
                
                // Gửi notification khi seller được chấp nhận
                try {
                    await NotificationService.createSellerApprovalNotification(seller.userID, seller);
                    // Gửi thêm notification chào mừng
                    await NotificationService.createWelcomeSellerNotification(seller.userID, seller);
                    // Gửi thêm notification hướng dẫn
                    await NotificationService.createSellerGuideNotification(seller.userID, seller);
                } catch (error) {
                    console.error('Error sending seller approval notification:', error);
                }
            } else if (status === 'rejected') {
                // Gửi notification khi seller bị từ chối
                try {
                    await NotificationService.createSellerRejectionNotification(seller.userID, seller);
                } catch (error) {
                    console.error('Error sending seller rejection notification:', error);
                }
            }
        } else if (['active', 'inactive'].includes(status)) {
            seller.isActive = status === 'active';
        }

        await seller.save();
        return seller;
    }

    async approveSeller(sellerId) {
        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            throw new Error("Người bán không tồn tại");
        }

        seller.status = 'approved';
        seller.isActive = true;
        seller.approvedAt = new Date();
        await seller.save();

        return seller;
    }

    // Product Management Services
    async getAllProducts({ page = 1, limit = 10, search = '', category = '', status = '' }) {
        const skip = (page - 1) * limit;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.categoryID = category;
        }

        if (status) {
            query.isActive = status === 'active';
        }

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('categoryID', 'categoryName')
                .populate('sellerID', 'businessName')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Product.countDocuments(query)
        ]);

        return {
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getProductById(productId) {
        const product = await Product.findById(productId)
            .populate('categoryID', 'categoryName')
            .populate('sellerID', 'businessName');
        
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        return product;
    }

    async createProduct(productData) {
        const product = new Product(productData);
        await product.save();

        return product;
    }

    async updateProduct(productId, updateData) {
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        Object.assign(product, updateData);
        await product.save();

        return product;
    }

    async deleteProduct(productId) {
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        await Product.findByIdAndDelete(productId);

        return { message: "Xóa sản phẩm thành công" };
    }

    async updateProductStatus(productId, status) {
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        product.isActive = status === 'active';
        await product.save();

        return product;
    }

    async toggleProductFeature(productId) {
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        product.isFeatured = !product.isFeatured;
        await product.save();

        return product;
    }

    // Order Management Services
    async getAllOrders({ page = 1, limit = 10, status = '', dateFrom = '', dateTo = '' }) {
        const skip = (page - 1) * limit;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
            if (dateTo) query.createdAt.$lte = new Date(dateTo);
        }

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('userID', 'username email')
                .populate('items.productID', 'name price')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Order.countDocuments(query)
        ]);

        return {
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getOrderById(orderId) {
        const order = await Order.findById(orderId)
            .populate('userID', 'username email')
            .populate('items.productID', 'name price');
        
        if (!order) {
            throw new Error("Đơn hàng không tồn tại");
        }

        return order;
    }

    async updateOrder(orderId, updateData) {
        const order = await Order.findById(orderId);
        
        if (!order) {
            throw new Error("Đơn hàng không tồn tại");
        }

        Object.assign(order, updateData);
        await order.save();

        return order;
    }

    async updateOrderStatus(orderId, status) {
        const order = await Order.findById(orderId);
        
        if (!order) {
            throw new Error("Đơn hàng không tồn tại");
        }

        order.status = status;
        await order.save();

        return order;
    }

    // Category Management Services
    async getAllCategories() {
        const categories = await Category.find().sort({ categoryName: 1 });
        return categories;
    }

    async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        
        if (!category) {
            throw new Error("Danh mục không tồn tại");
        }

        return category;
    }

    async createCategory(categoryData) {
        const category = new Category(categoryData);
        await category.save();

        return category;
    }

    async updateCategory(categoryId, updateData) {
        const category = await Category.findById(categoryId);
        
        if (!category) {
            throw new Error("Danh mục không tồn tại");
        }

        Object.assign(category, updateData);
        await category.save();

        return category;
    }

    async deleteCategory(categoryId) {
        const category = await Category.findById(categoryId);
        
        if (!category) {
            throw new Error("Danh mục không tồn tại");
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ categoryID: categoryId });
        if (productCount > 0) {
            throw new Error("Không thể xóa danh mục đang có sản phẩm");
        }

        await Category.findByIdAndDelete(categoryId);

        return { message: "Xóa danh mục thành công" };
    }

    // System Management Services
    async getSystemLogs() {
        // In a real application, you would implement proper logging
        // For now, return a mock response
        return {
            logs: [
                { timestamp: new Date(), level: 'INFO', message: 'System started' },
                { timestamp: new Date(), level: 'INFO', message: 'Admin login successful' }
            ]
        };
    }

    async createBackup() {
        // In a real application, you would implement database backup
        // For now, return a mock response
        return {
            backupId: Date.now(),
            timestamp: new Date(),
            status: 'completed',
            message: 'Backup created successfully'
        };
    }

    async toggleMaintenanceMode(enabled) {
        // In a real application, you would implement maintenance mode
        // For now, return a mock response
        return {
            maintenanceMode: enabled,
            timestamp: new Date(),
            message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`
        };
    }
}

export default new AdminService(); 