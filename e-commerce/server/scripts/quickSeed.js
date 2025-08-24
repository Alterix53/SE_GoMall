import mongoose from 'mongoose';

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

// Simple Category model
const categorySchema = new mongoose.Schema({
  categoryName: String,
  slug: String,
  description: String,
  image: String,
  icon: String,
  parentID: mongoose.Schema.Types.ObjectId
});

const Category = mongoose.model('Category', categorySchema);

// Simple Product model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  categoryID: mongoose.Schema.Types.ObjectId,
  images: [String],
  isActive: Boolean,
  isFlashSale: Boolean,
  flashSalePrice: Number,
  flashSaleEndTime: Date
});

const Product = mongoose.model('Product', productSchema);

// Quick seed function
const quickSeed = async () => {
  try {
    console.log('🚀 Starting Quick Seed...');
    
    await connectDB();
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    // Create categories
    console.log('🌱 Creating categories...');
    const categories = await Category.insertMany([
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
    ]);
    
    console.log(`✅ Created ${categories.length} categories`);
    
    // Create products
    console.log('🌱 Creating products...');
    const products = [];
    
    categories.forEach((category, index) => {
      for (let i = 1; i <= 5; i++) {
        const price = Math.floor(Math.random() * 5000000) + 500000;
        const originalPrice = price + Math.floor(Math.random() * 1000000);
        
        products.push({
          name: `${category.categoryName} Product ${i}`,
          description: `High-quality ${category.categoryName.toLowerCase()} product ${i}`,
          price: price,
          originalPrice: originalPrice,
          categoryID: category._id,
          images: ['https://source.unsplash.com/random/400x300'],
          isActive: true,
          isFlashSale: Math.random() > 0.7,
          flashSalePrice: Math.random() > 0.7 ? price * 0.8 : null,
          flashSaleEndTime: Math.random() > 0.7 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
        });
      }
    });
    
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    console.log('\n🎉 Quick Seed completed successfully!');
    console.log('📊 Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    
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



