import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Test data
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPass123',
    fullName: 'Test User',
    phoneNumber: '1234567890',
    address: '123 Test Street'
};

let authToken = null;

// Test 1: Register new user
async function testRegister() {
    console.log('\n=== Testing User Registration ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        console.log('✅ Registration successful:', response.data.message);
        authToken = response.data.data.token;
        console.log('Token received:', authToken.substring(0, 20) + '...');
        return true;
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
            console.log('⚠️  User already exists, proceeding with login test');
            return false;
        }
        console.error('❌ Registration failed:', error.response?.data || error.message);
        return false;
    }
}

// Test 2: Login user
async function testLogin() {
    console.log('\n=== Testing User Login ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful:', response.data.message);
        authToken = response.data.data.token;
        console.log('Token received:', authToken.substring(0, 20) + '...');
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return false;
    }
}

// Test 3: Get current user (protected route)
async function testGetCurrentUser() {
    console.log('\n=== Testing Get Current User (Protected Route) ===');
    if (!authToken) {
        console.log('❌ No auth token available');
        return false;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Get current user successful');
        console.log('User data:', {
            username: response.data.data.user.username,
            email: response.data.data.user.email,
            role: response.data.data.user.role
        });
        return true;
    } catch (error) {
        console.error('❌ Get current user failed:', error.response?.data || error.message);
        return false;
    }
}

// Test 4: Test invalid token
async function testInvalidToken() {
    console.log('\n=== Testing Invalid Token ===');
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });
        console.log('❌ Should have failed with invalid token');
        return false;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Invalid token correctly rejected');
            return true;
        }
        console.error('❌ Unexpected error with invalid token:', error.response?.data || error.message);
        return false;
    }
}

// Test 5: Test missing token
async function testMissingToken() {
    console.log('\n=== Testing Missing Token ===');
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        console.log('❌ Should have failed with missing token');
        return false;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Missing token correctly rejected');
            return true;
        }
        console.error('❌ Unexpected error with missing token:', error.response?.data || error.message);
        return false;
    }
}

// Test 6: Logout
async function testLogout() {
    console.log('\n=== Testing Logout ===');
    if (!authToken) {
        console.log('❌ No auth token available');
        return false;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Logout successful:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Logout failed:', error.response?.data || error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting Authentication System Tests...\n');
    
    let testsPassed = 0;
    let totalTests = 6;

    // Test registration
    const registerSuccess = await testRegister();
    if (registerSuccess) testsPassed++;

    // Test login
    const loginSuccess = await testLogin();
    if (loginSuccess) testsPassed++;

    // Test get current user
    const getCurrentUserSuccess = await testGetCurrentUser();
    if (getCurrentUserSuccess) testsPassed++;

    // Test invalid token
    const invalidTokenSuccess = await testInvalidToken();
    if (invalidTokenSuccess) testsPassed++;

    // Test missing token
    const missingTokenSuccess = await testMissingToken();
    if (missingTokenSuccess) testsPassed++;

    // Test logout
    const logoutSuccess = await testLogout();
    if (logoutSuccess) testsPassed++;

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Tests passed: ${testsPassed}/${totalTests}`);
    if (testsPassed === totalTests) {
        console.log('🎉 All tests passed! Authentication system is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(console.error);
}

export { runAllTests }; 