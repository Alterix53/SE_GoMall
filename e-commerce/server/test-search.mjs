
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Product from './models/Product.js';

async function testSearch() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GoMall');
    console.log('Connected to database');
    
    // Test 1: Search for "adidas" keyword only
    console.log('\n=== Test 1: Search for "adidas" keyword ===');
    const adidasKeywordSearch = await Product.find({
      $and: [
        {
          $or: [
            { name: { $regex: 'adidas', $options: 'i' } },
            { description: { $regex: 'adidas', $options: 'i' } },
            { brand: { $regex: 'adidas', $options: 'i' } }
          ]
        }
      ]
    }).populate('categoryID');
    
    console.log(`Found ${adidasKeywordSearch.length} products with "adidas" keyword:`);
    adidasKeywordSearch.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand}, Category: ${product.categoryID?.categoryName})`);
    });
    
    // Test 2: Search for Sports category only
    console.log('\n=== Test 2: Search for Sports category ===');
    const sportsCategory = await Category.findOne({ categoryName: 'Sports' });
    const sportsCategorySearch = await Product.find({
      categoryID: sportsCategory._id
    }).populate('categoryID');
    
    console.log(`Found ${sportsCategorySearch.length} products in Sports category:`);
    sportsCategorySearch.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand})`);
    });
    
    // Test 3: Search for "adidas" AND Sports category (the problematic case)
    console.log('\n=== Test 3: Search for "adidas" AND Sports category ===');
    const adidasAndSportsSearch = await Product.find({
      $and: [
        {
          $or: [
            { name: { $regex: 'adidas', $options: 'i' } },
            { description: { $regex: 'adidas', $options: 'i' } },
            { brand: { $regex: 'adidas', $options: 'i' } }
          ]
        },
        { categoryID: sportsCategory._id }
      ]
    }).populate('categoryID');
    
    console.log(`Found ${adidasAndSportsSearch.length} products with "adidas" AND in Sports category:`);
    adidasAndSportsSearch.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand}, Category: ${product.categoryID?.categoryName})`);
    });
    
    // Test 4: Check brand filter logic
    console.log('\n=== Test 4: Brand filter logic ===');
    const brandFilterSearch = await Product.find({
      $or: [
        { brand: { $regex: 'adidas', $options: 'i' } },
        { tags: { $regex: 'adidas', $options: 'i' } },
        { name: { $regex: 'adidas', $options: 'i' } }
      ]
    }).populate('categoryID');
    
    console.log(`Found ${brandFilterSearch.length} products with brand filter for "adidas":`);
    brandFilterSearch.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand}, Category: ${product.categoryID?.categoryName})`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testSearch();
