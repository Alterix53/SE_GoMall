import mongoose from 'mongoose';

const fixAllIndexes = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const sellerCollection = db.collection('sellers');

    // Lấy danh sách indexes hiện tại
    const indexes = await sellerCollection.indexes();
    console.log('Current indexes:', indexes);

    // Xóa tất cả index không cần thiết
    const indexesToDrop = ['username_1', 'email_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await sellerCollection.dropIndex(indexName);
        console.log(`Dropped ${indexName} index`);
      } catch (error) {
        console.log(`${indexName} index not found or already dropped`);
      }
    }

    // Tạo lại chỉ những index cần thiết theo model Seller
    await sellerCollection.createIndex({ userID: 1 });
    await sellerCollection.createIndex({ status: 1 });
    await sellerCollection.createIndex({ isActive: 1 });
    console.log('Created required indexes');

    // Kiểm tra lại indexes sau khi sửa
    const finalIndexes = await sellerCollection.indexes();
    console.log('Final indexes:', finalIndexes);

    await mongoose.connection.close();
    console.log('All index fixes completed!');
    
  } catch (error) {
    console.error('Error fixing indexes:', error);
  }
};

fixAllIndexes();
