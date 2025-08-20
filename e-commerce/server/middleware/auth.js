import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Seller from '../models/Seller.js';

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

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Admin access token required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if it's an admin token
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const admin = await Admin.findById(decoded.adminId);
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is deactivated'
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid admin token'
        });
    }
};

// Rate limiting middleware for admin routes
export const adminRateLimit = (req, res, next) => {
    // Simple rate limiting - in production, use Redis or similar
    const clientIP = req.ip;
    const now = Date.now();
    
    if (!req.app.locals.adminRateLimit) {
        req.app.locals.adminRateLimit = new Map();
    }
    
    const rateLimitMap = req.app.locals.adminRateLimit;
    const clientData = rateLimitMap.get(clientIP) || { count: 0, resetTime: now + 60000 };
    
    if (now > clientData.resetTime) {
        clientData.count = 0;
        clientData.resetTime = now + 60000; // 1 minute window
    }
    
    clientData.count++;
    
    if (clientData.count > 100) { // 100 requests per minute
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.'
        });
    }
    
    rateLimitMap.set(clientIP, clientData);
    next();
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

        next();
    } catch (error) {
        console.error('Require seller middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Middleware: require approved and active seller
export const requireApprovedSeller = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
        if (!userRoles.includes('seller')) {
            return res.status(403).json({ success: false, message: 'Seller access required' });
        }

        const seller = await Seller.findOne({ userID: req.user._id }).select('status isActive');
        if (!seller || seller.status !== 'approved' || seller.isActive === false) {
            return res.status(403).json({ success: false, message: 'Seller account not approved or inactive' });
        }

        next();
    } catch (error) {
        console.error('Require approved seller middleware error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}; 