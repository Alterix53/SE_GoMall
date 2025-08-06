import jwt from 'jsonwebtoken';
import User from '../models/User.js';
<<<<<<< HEAD
=======
import Admin from '../models/Admin.js';
>>>>>>> Admin_Dashboard

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

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
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
<<<<<<< HEAD
=======
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
>>>>>>> Admin_Dashboard
}; 