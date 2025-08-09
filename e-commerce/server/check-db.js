import connectDB from './config/database.js';
import Product from './models/Product.js';

const MONGODB_URI = "mongodb://localhost:27017/GoMall";

async function checkDatabase() {
  try {
    await connectDB(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Check all products
    const allProducts = await Product.find({});
    console.log(`Total products in DB: ${allProducts.length}`);
    
    // Check active products
    const activeProducts = await Product.find({ isActive: true });
    console.log(`Active products: ${activeProducts.length}`);
    
    // Check flash sale products
    const flashSaleProducts = await Product.find({ 
      isActive: true, 
      isFlashSale: true,
      flashSaleEndDate: { $gt: new Date() }
    });
    console.log(`Flash sale products: ${flashSaleProducts.length}`);
    
    // Show some sample products
    if (activeProducts.length > 0) {
      console.log("\nSample active products:");
      activeProducts.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ${JSON.stringify(product.price)}`);
        console.log(`   Flash Sale: ${product.isFlashSale}`);
        console.log(`   Flash Sale End: ${product.flashSaleEndDate}`);
        console.log(`   Images: ${product.images?.length || 0}`);
        console.log('');
      });
    }
    
    if (flashSaleProducts.length > 0) {
      console.log("\nFlash sale products:");
      flashSaleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ${JSON.stringify(product.price)}`);
        console.log(`   Flash Sale End: ${product.flashSaleEndDate}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking database:", error);
    process.exit(1);
  }
}

checkDatabase(); 