import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function fixSellerIndex() {
  try {
    const db = mongoose.connection.db;
    
    // Drop the problematic index
    console.log('Dropping username index from sellers collection...');
    await db.collection('sellers').dropIndex('username_1');
    console.log('Username index dropped successfully');
    
  } catch (error) {
    console.error('Error fixing seller index:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

fixSellerIndex();
