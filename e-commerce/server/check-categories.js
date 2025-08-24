const mongoose = require('mongoose');
const Category = require('./models/Category.js');
const Product = require('./models/Product.js');

async function checkCategories() {
  try {
    await mongoose.connect('mongodb://localhost:27017/gomall');
    console.log('Connected to database');
    
    // Check categories
    const categories = await Category.find({});
    console.log('\nCategories:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.categoryName}`);
    });
    
    // Check products with Adidas brand
    const adidasProducts = await Product.find({ brand: { $regex: 'adidas', $options: 'i' } }).populate('categoryID');
    console.log('\nAdidas products:');
    adidasProducts.forEach(product => {
      console.log(`${product.name} - Category: ${product.categoryID?.categoryName} (ID: ${product.categoryID?._id})`);
    });
    
    // Check products in Sports category
    const sportsCategory = await Category.findOne({ categoryName: 'Sports' });
    if (sportsCategory) {
      const sportsProducts = await Product.find({ categoryID: sportsCategory._id });
      console.log(`\nProducts in Sports category (${sportsCategory._id}):`);
      sportsProducts.forEach(product => {
        console.log(`${product.name} - Brand: ${product.brand}`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();
