import mongoose from 'mongoose';
import User from './models/User.js';
import Seller from './models/Seller.js';

const testSellerLogic = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB');

    // Test case 1: User có role seller nhưng seller record chưa được approve
    console.log('\n=== Test Case 1: User có role seller nhưng seller pending ===');
    const userWithSellerRole = await User.findOne({ role: { $in: ['seller'] } });
    if (userWithSellerRole) {
      const sellerRecord = await Seller.findOne({ userID: userWithSellerRole._id });
      console.log('User:', {
        id: userWithSellerRole._id,
        username: userWithSellerRole.username,
        role: userWithSellerRole.role
      });
      console.log('Seller Record:', sellerRecord ? {
        id: sellerRecord._id,
        status: sellerRecord.status,
        isActive: sellerRecord.isActive
      } : 'No seller record');
      
      // Logic kiểm tra
      const hasRole = userWithSellerRole.role.includes('seller');
      const hasApprovedSeller = sellerRecord && sellerRecord.status === 'approved' && sellerRecord.isActive;
      console.log('Logic check:');
      console.log('- Has seller role:', hasRole);
      console.log('- Has approved seller record:', hasApprovedSeller);
      console.log('- Should access seller pages:', hasApprovedSeller);
    }

    // Test case 2: User không có role seller nhưng có seller record approved
    console.log('\n=== Test Case 2: User không có role seller nhưng có seller approved ===');
    const approvedSeller = await Seller.findOne({ status: 'approved', isActive: true }).populate('userID');
    if (approvedSeller) {
      console.log('User:', {
        id: approvedSeller.userID._id,
        username: approvedSeller.userID.username,
        role: approvedSeller.userID.role
      });
      console.log('Seller Record:', {
        id: approvedSeller._id,
        status: approvedSeller.status,
        isActive: approvedSeller.isActive
      });
      
      // Logic kiểm tra
      const hasRole = approvedSeller.userID.role.includes('seller');
      const hasApprovedSeller = approvedSeller.status === 'approved' && approvedSeller.isActive;
      console.log('Logic check:');
      console.log('- Has seller role:', hasRole);
      console.log('- Has approved seller record:', hasApprovedSeller);
      console.log('- Should access seller pages:', hasApprovedSeller);
    }

    // Test case 3: User có role seller và seller record approved
    console.log('\n=== Test Case 3: User có role seller và seller approved ===');
    const perfectMatch = await User.findOne({ 
      role: { $in: ['seller'] } 
    });
    if (perfectMatch) {
      const sellerRecord = await Seller.findOne({ 
        userID: perfectMatch._id,
        status: 'approved',
        isActive: true
      });
      if (sellerRecord) {
        console.log('User:', {
          id: perfectMatch._id,
          username: perfectMatch.username,
          role: perfectMatch.role
        });
        console.log('Seller Record:', {
          id: sellerRecord._id,
          status: sellerRecord.status,
          isActive: sellerRecord.isActive
        });
        
        // Logic kiểm tra
        const hasRole = perfectMatch.role.includes('seller');
        const hasApprovedSeller = sellerRecord.status === 'approved' && sellerRecord.isActive;
        console.log('Logic check:');
        console.log('- Has seller role:', hasRole);
        console.log('- Has approved seller record:', hasApprovedSeller);
        console.log('- Should access seller pages:', hasApprovedSeller);
      }
    }

    await mongoose.connection.close();
    console.log('\nTest completed!');
    
  } catch (error) {
    console.error('Error testing seller logic:', error);
  }
};

testSellerLogic();
