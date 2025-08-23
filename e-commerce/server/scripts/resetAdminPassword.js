import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GoMall';

async function resetAdminPassword() {
    const username = process.argv[2] || 'admin';
    const newPassword = process.argv[3] || 'admin123';

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.error(`Admin '${username}' not found`);
            process.exitCode = 1;
            return;
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        admin.password = hashed;
        admin.isActive = true;
        await admin.save();

        console.log(`Password for admin '${username}' has been reset.`);
    } catch (err) {
        console.error('Error resetting admin password:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

resetAdminPassword();


