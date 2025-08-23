import mongoose from 'mongoose';
import User from './models/User.js';
import Seller from './models/Seller.js';

const checkAllUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB');

    // Kiểm tra tất cả users
    const allUsers = await User.find({}).limit(10);
    console.log('\n=== All users ===');
    console.log('Total users found:', allUsers.length);
    allUsers.forEach(user => {
      console.log({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    });

    // Kiểm tra tất cả sellers
    const allSellers = await Seller.find({}).populate('userID').limit(10);
    console.log('\n=== All sellers ===');
    console.log('Total sellers found:', allSellers.length);
    allSellers.forEach(seller => {
      console.log({
        id: seller._id,
        userId: seller.userID?._id,
        businessName: seller.businessName,
        status: seller.status,
        isActive: seller.isActive
      });
    });

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAllUsers();

