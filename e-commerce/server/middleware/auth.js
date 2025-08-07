import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
        const hasRequiredRole = userRoles.some(role => roles.includes(role));

        if (!hasRequiredRole) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Middleware to check if user is a seller
export const requireSeller = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
        
        if (!userRoles.includes('seller')) {
            return res.status(403).json({
                success: false,
                message: 'Seller access required'
            });
        }

        // You can also check if the seller is approved here if needed
        // const seller = await Seller.findOne({ userID: req.user._id });
        // if (!seller || seller.status !== 'approved') {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Seller account not approved'
        //     });
        // }

        next();
    } catch (error) {
        console.error('Require seller middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}; 