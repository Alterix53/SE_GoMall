import mongoose from 'mongoose';
import adminService from './services/adminService.js';
import Seller from './models/Seller.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testSimpleAPI() {
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
    
    // Test the service directly
    console.log('Testing adminService.approveSeller...');
    const result = await adminService.approveSeller(pendingSeller._id);
    
    console.log('Service call successful:', {
      id: result._id,
      businessName: result.businessName,
      status: result.status,
      isActive: result.isActive,
      approvedAt: result.approvedAt
    });
    
    // Reset the seller back to pending for testing
    console.log('Resetting seller back to pending...');
    result.status = 'pending';
    result.isActive = false;
    result.approvedAt = null;
    await result.save();
    
    console.log('Seller reset to pending successfully');
    
  } catch (error) {
    console.error('Error in test:', error.message);
    console.error('Full error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimpleAPI();
