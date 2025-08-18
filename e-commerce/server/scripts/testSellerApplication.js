import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GoMall";

async function testSellerApplication() {
    try {
        console.log('🧪 Starting Seller Application Test...');
        
        // Connect to database
        await connectDB(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Tìm user đầu tiên để test
        const testUser = await User.findOne({});
        
        if (!testUser) {
            console.log('❌ No users found. Please create a user first.');
            return;
        }

        console.log(`👤 Using test user: ${testUser.username} (${testUser.email})`);

        // Tạo seller application test
        const testSellerData = {
            userID: testUser._id,
            businessName: 'Test Business ' + Date.now(),
            businessLicense: 'TEST' + Date.now(),
            businessAddress: 'Test Address',
            businessPhone: '0123456789',
            businessEmail: testUser.email,
            verificationDocs: ['test-doc-1.pdf', 'test-doc-2.jpg'],
            status: 'pending',
            isActive: true
        };

        console.log('📝 Creating test seller application...');
        console.log('Data:', testSellerData);

        const seller = new Seller(testSellerData);
        await seller.save();

        console.log('✅ Test seller application created successfully!');
        console.log('Seller ID:', seller._id);
        console.log('Status:', seller.status);
        console.log('Created at:', seller.createdAt);

        // Kiểm tra lại
        const savedSeller = await Seller.findById(seller._id).populate('userID');
        console.log('\n📋 Saved seller data:');
        console.log('- ID:', savedSeller._id);
        console.log('- User:', savedSeller.userID.username);
        console.log('- Business Name:', savedSeller.businessName);
        console.log('- Status:', savedSeller.status);
        console.log('- Is Active:', savedSeller.isActive);

        console.log('\n✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the test
testSellerApplication();
