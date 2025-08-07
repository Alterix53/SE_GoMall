import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const addFlashSaleData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gomall');
    console.log('Connected to MongoDB');

    // Lấy một số sản phẩm để thêm flash sale
    const products = await Product.find({ isActive: true }).limit(8);
    
    if (products.length === 0) {
      console.log('No products found');
      return;
    }

    // Thêm flash sale cho các sản phẩm
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const flashSalePrice = Math.floor(product.price.original * 0.7); // Giảm 30%
      const flashSaleEndDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 giờ từ bây giờ

      await Product.findByIdAndUpdate(product._id, {
        isFlashSale: true,
        flashSalePrice: flashSalePrice,
        flashSaleEndDate: flashSaleEndDate
      });

      console.log(`Added flash sale for product: ${product.name}`);
    }

    console.log('Flash sale data added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addFlashSaleData(); 