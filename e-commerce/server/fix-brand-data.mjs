import mongoose from 'mongoose';
import Product from './models/Product.js';

// Connect to database
await mongoose.connect('mongodb://127.0.0.1:27017/GoMall');

console.log('🔧 Fixing brand data in database...\n');

try {
    // Get all products
    const products = await Product.find({});
    
    console.log(`📊 Found ${products.length} products to check\n`);
    
    const updates = [];
    
    products.forEach(product => {
        const name = product.name.toLowerCase();
        let correctBrand = null;
        
        // Determine correct brand based on product name
        if (name.includes('nike')) {
            correctBrand = 'Nike';
        } else if (name.includes('adidas')) {
            correctBrand = 'Adidas';
        } else if (name.includes('apple') || name.includes('iphone') || name.includes('macbook') || name.includes('airpods')) {
            correctBrand = 'Apple';
        } else if (name.includes('samsung') || name.includes('galaxy')) {
            correctBrand = 'Samsung';
        } else if (name.includes('gucci')) {
            correctBrand = 'Gucci';
        }
        
        if (correctBrand && product.brand !== correctBrand) {
            updates.push({
                productId: product._id,
                oldBrand: product.brand,
                newBrand: correctBrand,
                name: product.name
            });
        }
    });
    
    if (updates.length === 0) {
        console.log('✅ All brand data is already correct!');
    } else {
        console.log(`🔧 Found ${updates.length} products with incorrect brands:\n`);
        
        updates.forEach(update => {
            console.log(`   - ${update.name}`);
            console.log(`     Old brand: ${update.oldBrand} → New brand: ${update.newBrand}`);
        });
        
        console.log('\n🔄 Updating brands...');
        
        // Update each product
        for (const update of updates) {
            await Product.findByIdAndUpdate(update.productId, { brand: update.newBrand });
            console.log(`   ✅ Updated: ${update.name}`);
        }
        
        console.log('\n🎉 Brand data fixed successfully!');
    }
    
} catch (error) {
    console.error('Error:', error);
} finally {
    await mongoose.disconnect();
}
