import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkUserSeller() {
  try {
    // Get all users
    const users = await User.find({});
    console.log('Total users in database:', users.length);
    
    // Get all sellers
    const sellers = await Seller.find({}).populate('userID', 'username email');
    console.log('Total sellers in database:', sellers.length);
    
    console.log('\nAll sellers with their users:');
    sellers.forEach(seller => {
      console.log(`- ${seller.businessName} (${seller.status})`);
      if (seller.userID) {
        console.log(`  User: ${seller.userID.username} (${seller.userID.email})`);
      } else {
        console.log(`  User: No user associated`);
      }
    });
    
    // Check if any user has seller role
    console.log('\nUsers with seller role:');
    users.forEach(user => {
      if (user.role && (user.role === 'seller' || (Array.isArray(user.role) && user.role.includes('seller')))) {
        console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
      }
    });
    
  } catch (error) {
    console.error('Error checking user seller:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkUserSeller();
