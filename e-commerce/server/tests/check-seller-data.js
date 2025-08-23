import mongoose from 'mongoose';
import User from './models/User.js';
import Seller from './models/Seller.js';

const checkSellerData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gomall');
    console.log('Connected to MongoDB');

    // Kiểm tra users có role seller
    const usersWithSellerRole = await User.find({ role: 'seller' }).limit(5);
    console.log('\n=== Users with seller role ===');
    usersWithSellerRole.forEach(user => {
      console.log({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    });

    // Kiểm tra sellers được approve
    const approvedSellers = await Seller.find({ status: 'approved' }).populate('userID').limit(5);
    console.log('\n=== Approved sellers ===');
    approvedSellers.forEach(seller => {
      console.log({
        id: seller._id,
        userId: seller.userID._id,
        businessName: seller.businessName,
        status: seller.status,
        isActive: seller.isActive
      });
    });

    // Kiểm tra tất cả sellers
    const allSellers = await Seller.find({}).populate('userID').limit(10);
    console.log('\n=== All sellers ===');
    allSellers.forEach(seller => {
      console.log({
        id: seller._id,
        userId: seller.userID._id,
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

checkSellerData();
