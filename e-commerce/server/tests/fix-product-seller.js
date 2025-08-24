import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';

const MONGODB_URI = 'mongodb://localhost:27017/GoMall';

async function fixProductSeller() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB GoMall');

    // Lấy seller đầu tiên
    const seller = await Seller.findOne();
    if (!seller) {
      console.log('No sellers found');
      return;
    }

    console.log(`Using seller: ${seller.businessName} (ID: ${seller._id})`);

    // Cập nhật tất cả sản phẩm không có sellerID hoặc sellerID không hợp lệ
    const result = await Product.updateMany(
      { 
        $or: [
          { sellerID: { $exists: false } },
          { sellerID: null },
          { sellerID: { $nin: [seller._id] } }
        ]
      },
      { $set: { sellerID: seller._id } }
    );

    console.log(`Updated ${result.modifiedCount} products`);

    // Kiểm tra lại
    const products = await Product.find().limit(5);
    console.log('\n=== Products after update ===');
    products.forEach(product => {
      console.log(`- ${product.name}: sellerID = ${product.sellerID}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nConnection closed');
  }
}

fixProductSeller();
