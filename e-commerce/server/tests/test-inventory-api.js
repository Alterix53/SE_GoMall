// Test script for inventory API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080/api';

async function testInventoryAPI() {
  console.log('🧪 Testing Inventory API...\n');

  try {
    // Test 1: Check inventory for a valid product
    console.log('1. Testing inventory check for valid product...');
    const response1 = await fetch(`${BASE_URL}/cart/inventory/507f1f77bcf86cd799439011`);
    const data1 = await response1.json();
    console.log('Response:', data1);
    console.log('✅ Test 1 completed\n');

    // Test 2: Check inventory for non-existent product
    console.log('2. Testing inventory check for non-existent product...');
    const response2 = await fetch(`${BASE_URL}/cart/inventory/nonexistentid`);
    const data2 = await response2.json();
    console.log('Response:', data2);
    console.log('✅ Test 2 completed\n');

    // Test 3: Check inventory for invalid product ID
    console.log('3. Testing inventory check for invalid product ID...');
    const response3 = await fetch(`${BASE_URL}/cart/inventory/invalid-id`);
    const data3 = await response3.json();
    console.log('Response:', data3);
    console.log('✅ Test 3 completed\n');

  } catch (error) {
    console.error('❌ Error testing inventory API:', error);
  }
}

// Run the test
testInventoryAPI();
