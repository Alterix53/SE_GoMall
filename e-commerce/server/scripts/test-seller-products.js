import mongoose from 'mongoose';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const testSellerProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall');
    console.log('✅ Connected to MongoDB');

    // Get all sellers
    const sellers = await Seller.find({}).populate('userID', 'username email');
    console.log(`📊 Found ${sellers.length} sellers:`);
    
    sellers.forEach(seller => {
      console.log(`   - ${seller.businessName} (${seller.userID?.username}) - Status: ${seller.status}`);
    });

    // Test each seller's products
    for (const seller of sellers) {
      console.log(`\n🔍 Testing products for seller: ${seller.businessName}`);
      
      // Get products for this seller
      const products = await Product.find({ sellerID: seller._id });
      
      console.log(`   📦 Found ${products.length} products:`);
      products.forEach(product => {
        console.log(`      - ${product.name} (Category ID: ${product.categoryID})`);
      });
    }

    // Test with a specific seller (alterix1)
    console.log('\n🧪 Testing specific seller (alterix1):');
    const alterixUser = await User.findOne({ username: 'alterix1' });
    if (alterixUser) {
      const alterixSeller = await Seller.findOne({ userID: alterixUser._id });
      if (alterixSeller) {
        const alterixProducts = await Product.find({ sellerID: alterixSeller._id });
        console.log(`   Found ${alterixProducts.length} products for alterix1`);
        alterixProducts.forEach(product => {
          console.log(`      - ${product.name}`);
        });
      } else {
        console.log('   ❌ No seller found for alterix1');
      }
    } else {
      console.log('   ❌ User alterix1 not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testSellerProducts();
