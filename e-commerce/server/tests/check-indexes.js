import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkIndexes() {
  try {
    const db = mongoose.connection.db;
    const indexes = await db.collection('sellers').indexes();
    
    console.log('Indexes on sellers collection:');
    indexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${JSON.stringify(index)}`);
    });
    
  } catch (error) {
    console.error('Error checking indexes:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkIndexes();
