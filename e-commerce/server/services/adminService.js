import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
            throw new Error("Tên đăng nhập không tồn tại");
        }

        if (!admin.isActive) {
            throw new Error("Tài khoản admin đã bị khóa");
        }

        const isPasswordValid = await this.comparePassword(password, admin.password);

        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
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
            Order.countDocuments({ status: 'pending' }),
            Seller.countDocuments({ isActive: true })
        ]);

        // Calculate revenue (assuming Order has totalAmount field)
        const revenueStats = await Order.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    avgOrderValue: { $avg: '$totalAmount' }
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
                    status: 'completed',
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
                    revenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        return revenueStats;
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
            throw new Error("Tên đăng nhập hoặc email đã tồn tại");
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
            throw new Error("Người dùng không tồn tại");
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
            throw new Error("Người dùng không tồn tại");
        }

        await User.findByIdAndDelete(userId);

        return { message: "Xóa người dùng thành công" };
    }
}

export default new AdminService(); 