import mongoose from 'mongoose';
import Product from '../models/Product.js';

const checkProducts = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gomall');
    console.log('Connected to MongoDB');

    const products = await Product.find({isFlashSale: true});
    console.log('Flash sale products:');
    products.forEach(p => console.log('- ' + p.name));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProducts(); 