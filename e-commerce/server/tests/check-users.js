import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/GoMall';

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}, 'username email fullName');
    console.log('Existing users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Name: ${user.fullName}`);
    });

    if (users.length === 0) {
      console.log('No users found. Creating a test user...');
      const testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
        fullName: 'Test User'
      });
      await testUser.save();
      console.log('Test user created with email: test@example.com, password: testpassword123');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkUsers();
