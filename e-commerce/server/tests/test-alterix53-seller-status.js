import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testAlterix53SellerStatus() {
  try {
    // Find user Alterix53
    const user = await User.findOne({ username: 'Alterix53' });
    if (!user) {
      console.log('User Alterix53 not found');
      return;
    }
    
    console.log('Found user Alterix53:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Check seller application for Alterix53
    const seller = await Seller.findOne({ userID: user._id });
    if (seller) {
      console.log('Found seller application for Alterix53:', {
        id: seller._id,
        businessName: seller.businessName,
        status: seller.status,
        isActive: seller.isActive,
        hasApplication: true,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
      });
      
      // Test the logic that ProtectedSellerRouteV2 uses
      const hasApplication = true;
      const status = seller.status;
      
      console.log('ProtectedSellerRouteV2 logic test:');
      console.log('- hasApplication:', hasApplication);
      console.log('- status:', status);
      console.log('- should allow access to /seller:', hasApplication && status === 'approved');
      
      // Test the logic that useSellerAuthV2 uses
      console.log('useSellerAuthV2 logic test:');
      console.log('- isApprovedSeller:', hasApplication && status === 'approved');
      
    } else {
      console.log('No seller application found for Alterix53');
    }
    
  } catch (error) {
    console.error('Error testing Alterix53 seller status:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testAlterix53SellerStatus();
