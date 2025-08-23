import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkSellers() {
  try {
    // Get all sellers
    const allSellers = await Seller.find({});
    console.log('Total sellers in database:', allSellers.length);
    
    if (allSellers.length === 0) {
      console.log('No sellers found in database');
      return;
    }
    
    // Group by status
    const sellersByStatus = {};
    allSellers.forEach(seller => {
      const status = seller.status || 'unknown';
      if (!sellersByStatus[status]) {
        sellersByStatus[status] = [];
      }
      sellersByStatus[status].push({
        id: seller._id,
        businessName: seller.businessName,
        status: seller.status,
        isActive: seller.isActive
      });
    });
    
    console.log('Sellers by status:');
    Object.keys(sellersByStatus).forEach(status => {
      console.log(`  ${status}: ${sellersByStatus[status].length} sellers`);
      sellersByStatus[status].forEach(seller => {
        console.log(`    - ${seller.businessName} (${seller.id})`);
      });
    });
    
  } catch (error) {
    console.error('Error checking sellers:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkSellers();
