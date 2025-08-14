import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

const addFlashSaleData = async () => {
  try {
    await connectDB('mongodb://127.0.0.1:27017/GoMall');
    console.log('✅ Connected to MongoDB');

    // Lấy tất cả sản phẩm
    const products = await Product.find({ isActive: true });
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    // Thêm flash sale cho một số sản phẩm
    const flashSaleProducts = products.slice(0, 8); // Lấy 8 sản phẩm đầu tiên
    
    for (let i = 0; i < flashSaleProducts.length; i++) {
      const product = flashSaleProducts[i];
      const flashSalePrice = Math.floor(product.price.original * 0.7); // Giảm 30%
      const flashSaleEndDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 giờ từ bây giờ

      await Product.findByIdAndUpdate(product._id, {
        isFlashSale: true,
        flashSalePrice: flashSalePrice,
        flashSaleEndDate: flashSaleEndDate
      });

      console.log(`✅ Added flash sale for: ${product.name} - Original: ${product.price.original.toLocaleString()}₫, Flash Sale: ${flashSalePrice.toLocaleString()}₫`);
    }

    console.log('🎉 Flash sale data added successfully');
    
    // Kiểm tra lại
    const flashSaleCount = await Product.countDocuments({ isFlashSale: true });
    console.log(`📊 Total flash sale products: ${flashSaleCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addFlashSaleData(); 