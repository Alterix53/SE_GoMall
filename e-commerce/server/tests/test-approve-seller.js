import mongoose from 'mongoose';
import adminService from './services/adminService.js';
import Seller from './models/Seller.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testApproveSeller() {
  try {
    // Find a pending seller
    const pendingSeller = await Seller.findOne({ status: 'pending' });
    
    if (!pendingSeller) {
      console.log('No pending sellers found in database');
      return;
    }
    
    console.log('Found pending seller:', {
      id: pendingSeller._id,
      businessName: pendingSeller.businessName,
      status: pendingSeller.status
    });
    
    console.log('Testing approveSeller with ID:', pendingSeller._id);
    
    const result = await adminService.approveSeller(pendingSeller._id);
    console.log('Success:', {
      id: result._id,
      businessName: result.businessName,
      status: result.status,
      isActive: result.isActive,
      approvedAt: result.approvedAt
    });
    
  } catch (error) {
    console.error('Error testing approveSeller:', error.message);
    console.error('Full error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testApproveSeller();
