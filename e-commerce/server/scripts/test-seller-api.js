import fetch from 'node-fetch';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'http://localhost:8080/api';

const testSellerAPI = async () => {
  try {
    console.log('🧪 Testing Seller Products API...\n');

    // Test with alterix1 user
    console.log('1️⃣ Testing with alterix1 user:');
    
    // First, get the user and seller info
    const mongoose = await import('mongoose');
    await mongoose.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall');
    
    const alterixUser = await User.findOne({ username: 'alterix1' });
    if (!alterixUser) {
      console.log('❌ User alterix1 not found');
      return;
    }
    
    const alterixSeller = await Seller.findOne({ userID: alterixUser._id });
    if (!alterixSeller) {
      console.log('❌ Seller not found for alterix1');
      return;
    }
    
    console.log(`   User: ${alterixUser.username} (${alterixUser.email})`);
    console.log(`   Seller: ${alterixSeller.businessName} (${alterixSeller._id})`);
    
    // Get JWT token (you'll need to login first)
    console.log('\n2️⃣ Getting JWT token...');
    
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'alterix1',
        password: 'Alterix050305'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      const errorText = await loginResponse.text();
      console.log('Error:', errorText);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 50)}...`);
    
    // Test the seller products API
    console.log('\n3️⃣ Testing seller products API...');
    
    const productsResponse = await fetch(`${API_BASE_URL}/products/seller/my-products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!productsResponse.ok) {
      console.log('❌ API call failed');
      const errorText = await productsResponse.text();
      console.log('Error:', errorText);
      return;
    }
    
    const productsData = await productsResponse.json();
    
    console.log('✅ API call successful');
    console.log(`   Found ${productsData.data.products.length} products:`);
    
    productsData.data.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price?.original || product.price} VND`);
    });
    
    console.log('\n📊 API Response Summary:');
    console.log(`   - Success: ${productsData.success}`);
    console.log(`   - Message: ${productsData.message}`);
    console.log(`   - Total Products: ${productsData.data.products.length}`);
    console.log(`   - Pagination: ${JSON.stringify(productsData.data.pagination)}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

testSellerAPI();
