import mongoose from 'mongoose';

const checkCollections = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB GoMall');

    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n=== Collections in GoMall database ===');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Kiểm tra số lượng documents trong mỗi collection
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`  ${collection.name}: ${count} documents`);
    }

    await mongoose.connection.close();
    console.log('\nConnection closed');
    
  } catch (error) {
    console.error('Error checking collections:', error);
  }
};

checkCollections();
