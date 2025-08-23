import mongoose from 'mongoose';
import Seller from './models/Seller.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createTestSellerSimple() {
  try {
    // Just update the existing seller to pending status
    const existingSeller = await Seller.findOne({});
    
    if (existingSeller) {
      console.log('Found existing seller, updating to pending...');
      existingSeller.status = 'pending';
      existingSeller.isActive = false;
      existingSeller.approvedAt = null;
      await existingSeller.save();
      console.log('Seller updated to pending:', {
        id: existingSeller._id,
        businessName: existingSeller.businessName,
        status: existingSeller.status
      });
    } else {
      console.log('No sellers found in database');
    }
    
  } catch (error) {
    console.error('Error updating seller:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestSellerSimple();
