import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample business names for sellers
const businessNames = [
  'TechMart Solutions',
  'Fashion Forward Store',
  'Home & Garden Plus',
  'Electronics Hub',
  'Beauty & Wellness Shop',
  'Sports & Fitness Center',
  'Bookworm Paradise',
  'Kitchen Essentials Pro'
];

// Sample business descriptions
const businessDescriptions = [
  'Your one-stop shop for all tech needs. We provide quality electronics and gadgets with excellent customer service.',
  'Trendy fashion items for the modern individual. Stay stylish with our curated collection.',
  'Everything you need for your home and garden. Quality products at affordable prices.',
  'Premium electronics and gadgets. We bring you the latest technology at competitive prices.',
  'Beauty and wellness products for your daily routine. Enhance your natural beauty with our products.',
  'Sports equipment and fitness gear for active lifestyles. Achieve your fitness goals with us.',
  'A paradise for book lovers. Discover new worlds through our extensive collection.',
  'Professional kitchen equipment and essentials. Cook like a chef with our premium products.'
];

// Sample business addresses
const businessAddresses = [
  '123 Tech Street, District 1, Ho Chi Minh City',
  '456 Fashion Avenue, District 3, Ho Chi Minh City',
  '789 Garden Road, District 7, Ho Chi Minh City',
  '321 Electronics Boulevard, District 1, Ho Chi Minh City',
  '654 Beauty Lane, District 2, Ho Chi Minh City',
  '987 Sports Way, District 5, Ho Chi Minh City',
  '147 Book Street, District 1, Ho Chi Minh City',
  '258 Kitchen Road, District 3, Ho Chi Minh City'
];

// Sample business phones
const businessPhones = [
  '0901234567',
  '0902345678',
  '0903456789',
  '0904567890',
  '0905678901',
  '0906789012',
  '0907890123',
  '0908901234'
];

// Sample business licenses
const businessLicenses = [
  'BL-2024-001234',
  'BL-2024-002345',
  'BL-2024-003456',
  'BL-2024-004567',
  'BL-2024-005678',
  'BL-2024-006789',
  'BL-2024-007890',
  'BL-2024-008901'
];

// Sample tax numbers
const taxNumbers = [
  'TAX-2024-001234',
  'TAX-2024-002345',
  'TAX-2024-003456',
  'TAX-2024-004567',
  'TAX-2024-005678',
  'TAX-2024-006789',
  'TAX-2024-007890',
  'TAX-2024-008901'
];

// Verification documents (3 images as requested)
const verificationDocs = [
  '/uploads/verification/1.png',
  '/uploads/verification/1 - Copy.png',
  '/uploads/verification/1 - Copy (2).png'
];

// Create users and sellers
const createUsersAndSellers = async () => {
  try {
    console.log('🚀 Starting to create users and sellers...');

    for (let i = 1; i <= 3; i++) {
      const username = `alterix${i}`;
      const password = 'Alterix050305';
      const email = `alterix${i}@example.com`;
      const fullName = `Alterix User ${i}`;
      const phoneNumber = `090${String(i).padStart(7, '0')}`;
      const address = `Address ${i}, Ho Chi Minh City`;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log(`⚠️ User ${username} already exists, skipping...`);
        continue;
      }

      // Create user
      console.log(`📝 Creating user: ${username}`);
      const user = new User({
        username,
        password, // Will be hashed automatically by pre-save hook
        email,
        role: ['user', 'seller'],
        fullName,
        phoneNumber,
        address,
        isActive: true
      });

      await user.save();
      console.log(`✅ User ${username} created successfully`);

      // Create corresponding seller
      const businessNameIndex = i - 1;
      const businessName = businessNames[businessNameIndex];
      const businessEmail = `business${i}@${businessName.toLowerCase().replace(/\s+/g, '')}.com`;

      console.log(`🏪 Creating seller for user: ${username}`);
      const seller = new Seller({
        userID: user._id,
        businessName,
        businessDescription: businessDescriptions[businessNameIndex],
        businessAddress: businessAddresses[businessNameIndex],
        businessPhone: businessPhones[businessNameIndex],
        businessEmail,
        businessLicense: businessLicenses[businessNameIndex],
        verificationDocs,
        taxNumber: taxNumbers[businessNameIndex],
        status: 'approved', // Approved as requested
        isActive: true,
        approvedAt: new Date(),
        rating: Math.floor(Math.random() * 10) / 10 + 4.0, // Random rating between 4.0-5.0
        totalSales: Math.floor(Math.random() * 1000) + 100 // Random sales between 100-1100
      });

      await seller.save();
      console.log(`✅ Seller for ${username} created successfully`);
      console.log(`   Business Name: ${businessName}`);
      console.log(`   Status: ${seller.status}`);
      console.log(`   Rating: ${seller.rating}`);
      console.log(`   Total Sales: ${seller.totalSales}`);
      console.log('---');
    }

    console.log('🎉 All users and sellers created successfully!');
    
    // Display summary
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    console.log(`📊 Summary:`);
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Total Sellers: ${totalSellers}`);

  } catch (error) {
    console.error('❌ Error creating users and sellers:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await createUsersAndSellers();
  
  console.log('🏁 Script completed');
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
