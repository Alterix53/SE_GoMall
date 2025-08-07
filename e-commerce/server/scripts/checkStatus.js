import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const checkStatus = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('✅ Connected to MongoDB');

    // Check categories
    const categories = await Category.find({});
    console.log(`📂 Categories: ${categories.length}`);
    categories.forEach(cat => console.log(`   - ${cat.categoryName}`));

    // Check products
    const products = await Product.find({});
    console.log(`📦 Products: ${products.length}`);

    // Check flash sale products
    const flashSaleProducts = await Product.find({ isFlashSale: true });
    console.log(`⚡ Flash Sale Products: ${flashSaleProducts.length}`);
    flashSaleProducts.forEach(p => {
      console.log(`   - ${p.name}: ${p.price.original.toLocaleString()}₫ → ${p.flashSalePrice.toLocaleString()}₫`);
    });

    // Check products with images
    const productsWithImages = await Product.find({ 'images.0': { $exists: true } });
    console.log(`🖼️ Products with images: ${productsWithImages.length}`);

    // Sample product details
    const sampleProduct = await Product.findOne().populate('categoryID');
    if (sampleProduct) {
      console.log('\n📋 Sample Product:');
      console.log(`   Name: ${sampleProduct.name}`);
      console.log(`   Category: ${sampleProduct.categoryID?.categoryName}`);
      console.log(`   Price: ${sampleProduct.price.original.toLocaleString()}₫`);
      console.log(`   Image: ${sampleProduct.images?.[0]?.url || 'No image'}`);
      console.log(`   Flash Sale: ${sampleProduct.isFlashSale ? 'Yes' : 'No'}`);
    }

    console.log('\n🎉 Database status check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkStatus(); 