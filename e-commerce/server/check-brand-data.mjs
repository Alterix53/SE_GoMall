import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';

// Connect to database
await mongoose.connect('mongodb://127.0.0.1:27017/GoMall');

console.log('🔍 Checking brand data in database...\n');

try {
    // Get all products with brand info
    const products = await Product.find({}, 'name brand categoryID').populate('categoryID', 'categoryName');
    
    console.log(`📊 Total products: ${products.length}\n`);
    
    // Group by brand
    const brandStats = {};
    products.forEach(product => {
        const brand = product.brand || 'No Brand';
        if (!brandStats[brand]) {
            brandStats[brand] = [];
        }
        brandStats[brand].push({
            name: product.name,
            category: product.categoryID?.categoryName || 'Unknown'
        });
    });
    
    // Display brand statistics
    Object.entries(brandStats).forEach(([brand, products]) => {
        console.log(`🏷️  Brand: ${brand} (${products.length} products)`);
        products.slice(0, 3).forEach(product => {
            console.log(`   - ${product.name} (${product.category})`);
        });
        if (products.length > 3) {
            console.log(`   ... and ${products.length - 3} more`);
        }
        console.log('');
    });
    
    // Check for inconsistencies
    console.log('🔍 Checking for brand inconsistencies...\n');
    const inconsistencies = products.filter(product => {
        const name = product.name.toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        
        // Check if brand name appears in product name but brand field doesn't match
        if (name.includes('nike') && brand !== 'nike') {
            return true;
        }
        if (name.includes('adidas') && brand !== 'adidas') {
            return true;
        }
        if (name.includes('apple') && brand !== 'apple') {
            return true;
        }
        if (name.includes('samsung') && brand !== 'samsung') {
            return true;
        }
        if (name.includes('gucci') && brand !== 'gucci') {
            return true;
        }
        return false;
    });
    
    if (inconsistencies.length > 0) {
        console.log('❌ Found brand inconsistencies:');
        inconsistencies.forEach(product => {
            console.log(`   - ${product.name} (Brand field: ${product.brand})`);
        });
    } else {
        console.log('✅ No brand inconsistencies found');
    }
    
} catch (error) {
    console.error('Error:', error);
} finally {
    await mongoose.disconnect();
}
