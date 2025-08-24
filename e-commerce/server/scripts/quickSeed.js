import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Simple connection without complex options
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GoMall', {
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 2000
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Brand mapping for different categories
const brandMapping = {
  'Phones': ['Apple', 'Samsung', 'iPhone'],
  'Laptops': ['Apple', 'Dell', 'MacBook'],
  'Fashion': ['Nike', 'Adidas', 'Gucci'],
  'Sports': ['Nike', 'Adidas'],
  'Home & Garden': ['Philips', 'Sony'],
  'Beauty & Cosmetics': ['Gucci'],
  'Accessories': ['Gucci', 'Nike', 'Adidas'],
  'Books': ['Apple', 'Samsung'], // For tech books
  'Vehicles': ['Sony', 'Philips'], // For car electronics
  'Electronics': ['Apple', 'Samsung', 'Sony', 'Philips']
};

// Quick seed function
const quickSeed = async () => {
  try {
    console.log('🚀 Starting Quick Seed...');
    
    await connectDB();
    
    // Clear existing data - COMMENTED OUT TO PRESERVE EXISTING DATA
    // console.log('🗑️ Clearing existing data...');
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    
    // Create categories - only if they don't exist
    console.log('🌱 Creating categories...');
    const categoryData = [
      {
        categoryName: 'Phones',
        slug: 'phones',
        description: 'Smartphones from leading brands with latest technology.',
        image: '/images/Phone.png',
        icon: 'fas fa-mobile-alt',
        parentID: null
      },
      {
        categoryName: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and entertainment.',
        image: '/images/Laptop.png',
        icon: 'fas fa-laptop',
        parentID: null
      },
      {
        categoryName: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories for men and women.',
        image: '/images/Clothes.png',
        icon: 'fas fa-tshirt',
        parentID: null
      },
      {
        categoryName: 'Sports',
        slug: 'sports',
        description: 'Professional sports equipment and athletic wear.',
        image: '/images/TheThao.png',
        icon: 'fas fa-dumbbell',
        parentID: null
      },
      {
        categoryName: 'Home & Garden',
        slug: 'home-garden',
        description: 'Modern home appliances and garden tools.',
        image: '/images/DoGiaDung.png',
        icon: 'fas fa-home',
        parentID: null
      },
      {
        categoryName: 'Beauty & Cosmetics',
        slug: 'beauty-cosmetics',
        description: 'High-quality skincare and beauty products.',
        image: '/images/MyPham.png',
        icon: 'fas fa-spa',
        parentID: null
      },
      {
        categoryName: 'Accessories',
        slug: 'accessories',
        description: 'Premium fashion accessories and bags.',
        image: '/images/Gucci.jpg',
        icon: 'fas fa-bag-shopping',
        parentID: null
      },
      {
        categoryName: 'Books',
        slug: 'books',
        description: 'Books across all genres and educational materials.',
        image: '/images/Book.png',
        icon: 'fas fa-book',
        parentID: null
      },
      {
        categoryName: 'Vehicles',
        slug: 'vehicles',
        description: 'Cars, motorcycles, and vehicle accessories.',
        image: '/images/Xe.png',
        icon: 'fas fa-car',
        parentID: null
      },
      {
        categoryName: 'Electronics',
        slug: 'electronics',
        description: 'Consumer electronics and gadgets.',
        image: '/images/Phone.png',
        icon: 'fas fa-tv',
        parentID: null
      }
    ];

    const existingCategories = await Category.find({ categoryName: { $in: categoryData.map(c => c.categoryName) } });
    const newCategories = categoryData.filter(category => !existingCategories.some(c => c.categoryName === category.categoryName));

    if (newCategories.length > 0) {
      const createdCategories = await Category.insertMany(newCategories);
      console.log(`✅ Created ${createdCategories.length} new categories`);
    } else {
      console.log('🔄 No new categories to create.');
    }
    
    // Create products with brands
    console.log('🌱 Creating products with brands...');
    const products = [];
    
    // Re-fetch categories to get their IDs for products
    const allCategories = await Category.find({});

    allCategories.forEach((category, index) => {
      const availableBrands = brandMapping[category.categoryName] || ['Generic'];
      
      for (let i = 1; i <= 5; i++) {
        const price = Math.floor(Math.random() * 5000000) + 500000;
        const originalPrice = price + Math.floor(Math.random() * 1000000);
        const randomBrand = availableBrands[Math.floor(Math.random() * availableBrands.length)];
        
        products.push({
          name: `${randomBrand} ${category.categoryName} Product ${i}`,
          slug: `${randomBrand.toLowerCase()}-${category.categoryName.toLowerCase()}-product-${i}`,
          description: `High-quality ${category.categoryName.toLowerCase()} product ${i} from ${randomBrand}`,
          shortDescription: `${randomBrand} ${category.categoryName} - Premium quality`,
          sku: `SKU-${randomBrand.toUpperCase()}-${category.categoryName.toUpperCase()}-${i}`,
          brand: randomBrand,
          categoryID: category._id,
          sellerID: new mongoose.Types.ObjectId(), // Temporary seller ID
          images: [{
            url: 'https://source.unsplash.com/random/400x300',
            alt: `${randomBrand} ${category.categoryName} Product ${i}`,
            isPrimary: true
          }],
          price: {
            original: originalPrice,
            sale: price
          },
          inventory: {
            quantity: Math.floor(Math.random() * 100) + 10,
            lowStockThreshold: 10
          },
          specifications: [
            { name: 'Brand', value: randomBrand },
            { name: 'Category', value: category.categoryName },
            { name: 'Model', value: `Model-${i}` }
          ],
          tags: [randomBrand.toLowerCase(), category.categoryName.toLowerCase(), 'premium'],
          rating: {
            average: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            count: Math.floor(Math.random() * 1000) + 50
          },
          sold: Math.floor(Math.random() * 500) + 10,
          views: Math.floor(Math.random() * 2000) + 100,
          isActive: true,
          isFeatured: Math.random() > 0.8,
          isFlashSale: Math.random() > 0.7,
          flashSalePrice: Math.random() > 0.7 ? price * 0.8 : null,
          flashSaleEndDate: Math.random() > 0.7 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
        });
      }
    });
    
    // Check for existing products and only add new ones
    const existingProducts = await Product.find({ 
      name: { $in: products.map(p => p.name) },
      categoryID: { $in: products.map(p => p.categoryID) }
    });
    
    const newProducts = products.filter(product => 
      !existingProducts.some(existing => 
        existing.name === product.name && 
        existing.categoryID.toString() === product.categoryID.toString()
      )
    );
    
    if (newProducts.length > 0) {
      const createdProducts = await Product.insertMany(newProducts);
      console.log(`✅ Created ${createdProducts.length} new products with brands`);
    } else {
      console.log('🔄 No new products to create.');
    }
    
    console.log('\n🎉 Quick Seed completed successfully!');
    console.log('📊 Summary:');
    console.log(`- Categories: ${allCategories.length}`);
    console.log(`- Total Products: ${await Product.countDocuments()}`);
    
    // Show brand distribution
    const brandStats = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\n📈 Brand Distribution:');
    brandStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} products`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Quick Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

quickSeed();



