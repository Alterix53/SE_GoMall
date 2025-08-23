import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createSellerForDuy() {
  try {
    // Find user duy
    const user = await User.findOne({ username: 'duy' });
    if (!user) {
      console.log('User duy not found');
      return;
    }
    
    console.log('Found user duy:', {
      id: user._id,
      username: user.username,
      email: user.email
    });
    
    // Check if user already has seller application
    const existingSeller = await Seller.findOne({ userID: user._id });
    if (existingSeller) {
      console.log('User duy already has seller application:', {
        id: existingSeller._id,
        businessName: existingSeller.businessName,
        status: existingSeller.status
      });
      return;
    }
    
    // Create seller application for duy
    const seller = new Seller({
      userID: user._id,
      businessName: 'Duy Shop',
      businessLicense: 'DUY123456',
      businessAddress: '123 Duy Street, Ho Chi Minh City',
      businessPhone: '0123456789',
      businessEmail: user.email,
      verificationDocs: [],
      status: 'approved', // Set to approved so duy can access seller dashboard
      isActive: true,
      approvedAt: new Date()
    });
    
    await seller.save();
    console.log('Created seller application for duy:', {
      id: seller._id,
      businessName: seller.businessName,
      status: seller.status
    });
    
    // Update user role to include seller
    user.role = user.role || [];
    if (Array.isArray(user.role)) {
      if (!user.role.includes('seller')) {
        user.role.push('seller');
      }
    } else {
      user.role = [user.role, 'seller'];
    }
    await user.save();
    
    console.log('Updated user role:', user.role);
    console.log('✅ Seller application created successfully for duy!');
    
  } catch (error) {
    console.error('Error creating seller for duy:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createSellerForDuy();
