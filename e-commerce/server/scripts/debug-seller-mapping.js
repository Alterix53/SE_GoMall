import mongoose from 'mongoose';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const debugSellerMapping = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall');
    console.log('✅ Connected to MongoDB');

    // Get alterix1 user
    const alterixUser = await User.findOne({ username: 'alterix1' });
    if (!alterixUser) {
      console.log('❌ User alterix1 not found');
      return;
    }
    
    console.log(`👤 User alterix1:`);
    console.log(`   - ID: ${alterixUser._id}`);
    console.log(`   - Username: ${alterixUser.username}`);
    console.log(`   - Email: ${alterixUser.email}`);
    console.log(`   - Role: ${alterixUser.role}`);

    // Get seller for alterix1
    const alterixSeller = await Seller.findOne({ userID: alterixUser._id });
    if (!alterixSeller) {
      console.log('❌ Seller not found for alterix1');
      return;
    }
    
    console.log(`\n🏪 Seller for alterix1:`);
    console.log(`   - ID: ${alterixSeller._id}`);
    console.log(`   - Business Name: ${alterixSeller.businessName}`);
    console.log(`   - User ID: ${alterixSeller.userID}`);
    console.log(`   - Status: ${alterixSeller.status}`);
    console.log(`   - Is Active: ${alterixSeller.isActive}`);

    // Check if user ID matches
    console.log(`\n🔍 ID Comparison:`);
    console.log(`   - User ID: ${alterixUser._id}`);
    console.log(`   - Seller User ID: ${alterixSeller.userID}`);
    console.log(`   - Match: ${alterixUser._id.toString() === alterixSeller.userID.toString()}`);

    // Get products for this seller
    const products = await Product.find({ sellerID: alterixSeller._id });
    console.log(`\n📦 Products for seller ${alterixSeller._id}:`);
    console.log(`   - Count: ${products.length}`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (Seller ID: ${product.sellerID})`);
    });

    // Check if there are any products with user ID as seller ID (wrong mapping)
    const productsWithUserID = await Product.find({ sellerID: alterixUser._id });
    console.log(`\n⚠️ Products with User ID as Seller ID:`);
    console.log(`   - Count: ${productsWithUserID.length}`);
    productsWithUserID.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (Seller ID: ${product.sellerID})`);
    });

    // Check all products to see the distribution
    const allProducts = await Product.find({});
    console.log(`\n📊 All Products Seller Distribution:`);
    const sellerDistribution = {};
    allProducts.forEach(product => {
      const sellerId = product.sellerID?.toString() || 'No Seller';
      sellerDistribution[sellerId] = (sellerDistribution[sellerId] || 0) + 1;
    });
    
    for (const [sellerId, count] of Object.entries(sellerDistribution)) {
      const seller = await Seller.findById(sellerId);
      const sellerName = seller ? seller.businessName : 'Unknown Seller';
      console.log(`   - ${sellerName} (${sellerId}): ${count} products`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

debugSellerMapping();
