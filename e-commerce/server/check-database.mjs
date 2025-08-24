import mongoose from 'mongoose';
import Category from './models/Category.js';
import Product from './models/Product.js';

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GoMall');
    console.log('Connected to database');
    
    // Check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(col => console.log(col.name));
    
    // Check categories count
    const categoryCount = await Category.countDocuments();
    console.log(`\nCategories count: ${categoryCount}`);
    
    // Check products count
    const productCount = await Product.countDocuments();
    console.log(`Products count: ${productCount}`);
    
    // Show some sample data
    if (categoryCount > 0) {
      const sampleCategories = await Category.find({}).limit(5);
      console.log('\nSample categories:');
      sampleCategories.forEach(cat => console.log(`${cat._id}: ${cat.categoryName}`));
    }
    
    if (productCount > 0) {
      const sampleProducts = await Product.find({}).limit(5);
      console.log('\nSample products:');
      sampleProducts.forEach(product => console.log(`${product.name} - Brand: ${product.brand}`));
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
