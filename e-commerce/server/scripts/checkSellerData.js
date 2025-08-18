import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GoMall";

async function checkSellerData() {
    try {
        console.log('🔍 Starting Seller Data Check...');
        
        // Connect to database
        await connectDB(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all sellers with user info
        const sellers = await Seller.find({})
            .populate('userID', 'username email fullName')
            .sort({ createdAt: -1 });

        console.log(`📊 Found ${sellers.length} seller applications`);

        if (sellers.length === 0) {
            console.log('❌ No seller applications found in database');
            return;
        }

        console.log('\n📋 Seller Applications Summary:');
        console.log('='.repeat(80));

        sellers.forEach((seller, index) => {
            console.log(`\n${index + 1}. Seller ID: ${seller._id}`);
            console.log(`   User: ${seller.userID?.username || 'N/A'} (${seller.userID?.email || 'N/A'})`);
            console.log(`   Business Name: ${seller.businessName}`);
            console.log(`   Business License: ${seller.businessLicense}`);
            console.log(`   Status: ${seller.status}`);
            console.log(`   Created: ${seller.createdAt.toLocaleDateString('vi-VN')}`);
            console.log(`   Updated: ${seller.updatedAt.toLocaleDateString('vi-VN')}`);
            console.log(`   Verification Docs: ${seller.verificationDocs.length} files`);
            console.log(`   Is Active: ${seller.isActive}`);
            
            if (seller.status === 'approved') {
                console.log(`   Approved At: ${seller.approvedAt ? seller.approvedAt.toLocaleDateString('vi-VN') : 'N/A'}`);
            }
        });

        // Statistics
        const statusStats = sellers.reduce((acc, seller) => {
            acc[seller.status] = (acc[seller.status] || 0) + 1;
            return acc;
        }, {});

        console.log('\n📈 Status Statistics:');
        console.log('='.repeat(40));
        Object.entries(statusStats).forEach(([status, count]) => {
            console.log(`${status}: ${count} applications`);
        });

        // Check for users with seller role
        const sellerUsers = await User.find({ role: { $in: ['seller'] } });
        console.log(`\n👥 Users with seller role: ${sellerUsers.length}`);

        if (sellerUsers.length > 0) {
            console.log('\nUsers with seller role:');
            sellerUsers.forEach(user => {
                console.log(`- ${user.username} (${user.email}) - Roles: ${user.role.join(', ')}`);
            });
        }

        // Check for inconsistencies
        console.log('\n🔍 Checking for inconsistencies...');
        
        const approvedSellers = sellers.filter(s => s.status === 'approved');
        const usersWithSellerRole = sellerUsers.map(u => u._id.toString());
        const approvedSellerUserIds = approvedSellers.map(s => s.userID._id.toString());

        const missingRoleUsers = approvedSellerUserIds.filter(userId => 
            !usersWithSellerRole.includes(userId)
        );

        if (missingRoleUsers.length > 0) {
            console.log('⚠️  Users with approved seller status but missing seller role:');
            missingRoleUsers.forEach(userId => {
                const seller = approvedSellers.find(s => s.userID._id.toString() === userId);
                console.log(`- ${seller.userID.username} (${seller.userID.email})`);
            });
        } else {
            console.log('✅ All approved sellers have seller role');
        }

        console.log('\n✅ Seller data check completed!');

    } catch (error) {
        console.error('❌ Error checking seller data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
checkSellerData();
