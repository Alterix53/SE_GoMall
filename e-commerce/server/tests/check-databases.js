import mongoose from 'mongoose';

const checkDatabases = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/');
    console.log('Connected to MongoDB');

    const adminDb = mongoose.connection.db.admin();
    const databases = await adminDb.listDatabases();
    
    console.log('\n=== Available databases ===');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });

    await mongoose.connection.close();
    console.log('\nConnection closed');
    
  } catch (error) {
    console.error('Error checking databases:', error);
  }
};

checkDatabases();
