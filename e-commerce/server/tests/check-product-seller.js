import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';

const MONGODB_URI = 'mongodb://localhost:27017/GoMall';

async function checkProductSeller() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB GoMall');

    // Kiểm tra sản phẩm
    const products = await Product.find().limit(5);
    console.log('\n=== Products ===');
    products.forEach(product => {
      console.log(`- ${product.name}: sellerID = ${product.sellerID}`);
    });

    // Kiểm tra sellers
    const sellers = await Seller.find().limit(5);
    console.log('\n=== Sellers ===');
    sellers.forEach(seller => {
      console.log(`- ${seller.businessName}: ID = ${seller._id}`);
    });

    // Kiểm tra sản phẩm có sellerID hợp lệ
    const validProducts = await Product.find({ sellerID: { $exists: true, $ne: null } });
    console.log(`\nProducts with valid sellerID: ${validProducts.length}`);

    if (validProducts.length > 0) {
      const firstProduct = validProducts[0];
      console.log(`\nFirst product: ${firstProduct.name}`);
      console.log(`SellerID: ${firstProduct.sellerID}`);
      
      // Tìm seller
      const seller = await Seller.findById(firstProduct.sellerID);
      if (seller) {
        console.log(`Seller found: ${seller.businessName}`);
      } else {
        console.log('Seller not found');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nConnection closed');
  }
}

checkProductSeller();
