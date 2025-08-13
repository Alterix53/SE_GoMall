import mongoose from 'mongoose';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import connectDB from '../config/database.js';

const MONGODB_URI = "mongodb://localhost:27017/GoMall";

async function migrateUserSeller() {
    try {
        console.log('🔄 Starting User/Seller migration...');
        
        // Connect to database
        await connectDB(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all users with seller role
        const sellerUsers = await User.find({ role: { $in: ['seller'] } });
        console.log(`📊 Found ${sellerUsers.length} users with seller role`);

        for (const user of sellerUsers) {
            console.log(`🔄 Processing user: ${user.username}`);

            // Check if seller record already exists
            const existingSeller = await Seller.findOne({ userID: user._id });
            if (existingSeller) {
                console.log(`⚠️  Seller record already exists for user: ${user.username}`);
                continue;
            }

            // Create seller record
            const sellerData = {
                userID: user._id,
                businessName: user.fullName || `${user.username}'s Store`,
                businessLicense: 'MIGRATED_' + Date.now(), // Placeholder
                businessAddress: user.address || 'Address not provided',
                businessPhone: user.phoneNumber || 'Phone not provided',
                businessEmail: user.email,
                verificationDocs: [],
                status: 'approved', // Assume approved for existing sellers
                isActive: true
            };

            const seller = new Seller(sellerData);
            await seller.save();

            console.log(`✅ Created seller record for user: ${user.username}`);
        }

        // Update user roles to remove 'seller' from role array
        const updateResult = await User.updateMany(
            { role: { $in: ['seller'] } },
            { $pull: { role: 'seller' } }
        );

        console.log(`✅ Updated ${updateResult.modifiedCount} user roles`);

        console.log('🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateUserSeller().catch(console.error);
}

export { migrateUserSeller };
