import mongoose from 'mongoose';
import Seller from '../models/Seller.js';

const MONGODB_URI = 'mongodb://localhost:27017/GoMall';

async function checkSellers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB GoMall');

    // Kiểm tra tất cả sellers
    const sellers = await Seller.find();
    console.log(`\nTotal sellers: ${sellers.length}`);
    
    if (sellers.length > 0) {
      console.log('\n=== Sellers ===');
      sellers.forEach(seller => {
        console.log(`- ID: ${seller._id}`);
        console.log(`  Business Name: ${seller.businessName}`);
        console.log(`  Status: ${seller.status}`);
        console.log(`  User ID: ${seller.userID}`);
        console.log('---');
      });
    } else {
      console.log('No sellers found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nConnection closed');
  }
}

checkSellers();
