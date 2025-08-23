import mongoose from 'mongoose';
import Seller from './models/Seller.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createTestSeller() {
  try {
    // Find or create a test user
    let testUser = await User.findOne({ username: 'testuser2' });
    
    if (!testUser) {
      console.log('Creating test user...');
      testUser = new User({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123',
        role: 'user'
      });
      await testUser.save();
      console.log('Test user created:', testUser._id);
    } else {
      console.log('Using existing test user:', testUser._id);
    }
    
    // Check if seller already exists for this user
    const existingSeller = await Seller.findOne({ userID: testUser._id });
    if (existingSeller) {
      console.log('Seller already exists for this user, updating status to pending...');
      existingSeller.status = 'pending';
      existingSeller.isActive = false;
      existingSeller.approvedAt = null;
      await existingSeller.save();
      console.log('Seller updated to pending:', existingSeller._id);
      return;
    }
    
    // Create a test seller
    const testSeller = new Seller({
      userID: testUser._id,
      businessName: 'Test Business 2',
      businessDescription: 'A test business for testing',
      businessAddress: '123 Test Street',
      businessPhone: '1234567890',
      businessEmail: 'test2@business.com',
      businessLicense: 'TEST123457',
      verificationDocs: ['test-doc1.pdf'],
      taxNumber: 'TAX123457',
      status: 'pending',
      isActive: false
    });
    
    await testSeller.save();
    console.log('Test seller created:', {
      id: testSeller._id,
      businessName: testSeller.businessName,
      status: testSeller.status
    });
    
  } catch (error) {
    console.error('Error creating test seller:', error.message);
    console.error('Full error:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestSeller();
