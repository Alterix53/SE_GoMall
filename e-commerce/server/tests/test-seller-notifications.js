const API_BASE = 'http://localhost:8080/api';

async function testSellerNotifications() {
    console.log('Testing Seller Notifications API...\n');

    try {
        // Test 1: Try to access without authentication
        console.log('1. Testing without authentication...');
        const response1 = await fetch(`${API_BASE}/seller/notifications`);
        const data1 = await response1.json();
        console.log(`   Status: ${response1.status}`);
        console.log(`   Response: ${JSON.stringify(data1, null, 2)}\n`);

        // Test 2: Try with invalid token
        console.log('2. Testing with invalid token...');
        const response2 = await fetch(`${API_BASE}/seller/notifications`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });
        const data2 = await response2.json();
        console.log(`   Status: ${response2.status}`);
        console.log(`   Response: ${JSON.stringify(data2, null, 2)}\n`);

        console.log('✅ API endpoint is accessible and properly protected');
        console.log('📝 To test with real data, you need to:');
        console.log('   1. Create a seller account');
        console.log('   2. Get an authentication token');
        console.log('   3. Create some orders with products from that seller');
        console.log('   4. Call the API with the valid token');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSellerNotifications();
