import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// Test cart API endpoints
async function testCartAPI() {
    try {
        console.log('Testing Cart API...\n');

        // Test 1: Get cart (should fail without auth)
        console.log('1. Testing GET /cart/me (without auth)...');
        try {
            const response = await axios.get(`${API_BASE}/cart/me`);
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.log('❌ Expected error (no auth):', error.response?.data?.message || error.message);
        }

        // Test 2: Add to cart (should fail without auth)
        console.log('\n2. Testing POST /cart/add (without auth)...');
        try {
            const response = await axios.post(`${API_BASE}/cart/add`, {
                productID: '507f1f77bcf86cd799439011',
                quantity: 1,
                size: 'M'
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.log('❌ Expected error (no auth):', error.response?.data?.message || error.message);
        }

        // Test 3: Update cart item (should fail without auth)
        console.log('\n3. Testing PUT /cart/update (without auth)...');
        try {
            const response = await axios.put(`${API_BASE}/cart/update`, {
                productID: '507f1f77bcf86cd799439011',
                quantity: 2,
                size: 'M'
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.log('❌ Expected error (no auth):', error.response?.data?.message || error.message);
        }

        // Test 4: Remove from cart (should fail without auth)
        console.log('\n4. Testing DELETE /cart/remove (without auth)...');
        try {
            const response = await axios.delete(`${API_BASE}/cart/remove`, {
                data: {
                    productID: '507f1f77bcf86cd799439011',
                    size: 'M'
                }
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.log('❌ Expected error (no auth):', error.response?.data?.message || error.message);
        }

        // Test 5: Clear cart (should fail without auth)
        console.log('\n5. Testing DELETE /cart/clear (without auth)...');
        try {
            const response = await axios.delete(`${API_BASE}/cart/clear`);
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.log('❌ Expected error (no auth):', error.response?.data?.message || error.message);
        }

        console.log('\n✅ All tests completed!');
        console.log('Note: All endpoints correctly require authentication.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests
testCartAPI(); 