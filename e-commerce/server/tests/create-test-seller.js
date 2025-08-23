import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Seller from './models/Seller.js';

const createTestSeller = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/GoMall');
    console.log('Connected to MongoDB');

    // Tạo user test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Kiểm tra xem user đã tồn tại chưa
    let testUser = await User.findOne({ username: 'testseller' });
    if (!testUser) {
      testUser = new User({
        username: 'testseller',
        email: 'testseller@example.com',
        password: hashedPassword,
        fullName: 'Test Seller',
        phoneNumber: '0123456789',
        address: '123 Test Street, Test City',
        role: ['user', 'seller'],
        isActive: true
      });
      await testUser.save();
      console.log('Created test user:', testUser._id);
    } else {
      console.log('Using existing test user:', testUser._id);
    }

    // Tạo seller record
    let testSeller = await Seller.findOne({ userID: testUser._id });
    if (!testSeller) {
      testSeller = new Seller({
        userID: testUser._id,
        businessName: 'Test Shop',
        businessDescription: 'A test shop for testing purposes',
        businessAddress: '123 Test Street, Test City',
        businessPhone: '0123456789',
        businessEmail: 'testseller@example.com',
        businessLicense: 'TEST-LICENSE-123',
        verificationDocs: [],
        status: 'approved',
        isActive: true,
        approvedAt: new Date()
      });
      await testSeller.save();
      console.log('Created test seller:', testSeller._id);
    } else {
      console.log('Using existing test seller:', testSeller._id);
    }

    // Tạo thêm một user pending
    let pendingUser = await User.findOne({ username: 'pendingseller' });
    if (!pendingUser) {
      pendingUser = new User({
        username: 'pendingseller',
        email: 'pendingseller@example.com',
        password: hashedPassword,
        fullName: 'Pending Seller',
        phoneNumber: '0987654321',
        address: '456 Pending Street, Pending City',
        role: ['user'],
        isActive: true
      });
      await pendingUser.save();
      console.log('Created pending user:', pendingUser._id);
    } else {
      console.log('Using existing pending user:', pendingUser._id);
    }

    let pendingSeller = await Seller.findOne({ userID: pendingUser._id });
    if (!pendingSeller) {
      pendingSeller = new Seller({
        userID: pendingUser._id,
        businessName: 'Pending Shop',
        businessDescription: 'A pending shop',
        businessAddress: '456 Pending Street, Pending City',
        businessPhone: '0987654321',
        businessEmail: 'pendingseller@example.com',
        businessLicense: 'PENDING-LICENSE-456',
        verificationDocs: [],
        status: 'pending',
        isActive: true
      });
      await pendingSeller.save();
      console.log('Created pending seller:', pendingSeller._id);
    } else {
      console.log('Using existing pending seller:', pendingSeller._id);
    }

    await mongoose.connection.close();
    console.log('Test data created successfully!');
    console.log('\nTest accounts:');
    console.log('1. Approved Seller - Username: testseller, Password: password123');
    console.log('2. Pending Seller - Username: pendingseller, Password: password123');
    
  } catch (error) {
    console.error('Error creating test seller:', error);
  }
};

createTestSeller();
