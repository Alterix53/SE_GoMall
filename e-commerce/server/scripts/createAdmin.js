import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GoMall';

async function createDefaultAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        // Create default admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@gomall.com',
            password: hashedPassword,
            fullName: 'System Administrator',
            phoneNumber: '0123456789',
            role: 'super_admin',
            isActive: true,
            permissions: [
                'user_management',
                'seller_management',
                'product_management',
                'order_management',
                'category_management',
                'system_management',
                'dashboard_view',
                'reports_view'
            ]
        });

        await admin.save();
        console.log('Default admin created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Email: admin@gomall.com');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
createDefaultAdmin(); 