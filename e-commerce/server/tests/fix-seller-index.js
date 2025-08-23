import mongoose from 'mongoose';

const fixSellerIndex = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const sellerCollection = db.collection('sellers');

    // Lấy danh sách indexes hiện tại
    const indexes = await sellerCollection.indexes();
    console.log('Current indexes:', indexes);

    // Xóa index username nếu tồn tại
    try {
      await sellerCollection.dropIndex('username_1');
      console.log('Dropped username_1 index');
    } catch (error) {
      console.log('Username index not found or already dropped');
    }

    // Tạo lại indexes cần thiết
    await sellerCollection.createIndex({ userID: 1 });
    await sellerCollection.createIndex({ status: 1 });
    await sellerCollection.createIndex({ isActive: 1 });
    console.log('Created required indexes');

    await mongoose.connection.close();
    console.log('Index fix completed!');
    
  } catch (error) {
    console.error('Error fixing seller index:', error);
  }
};

fixSellerIndex();
