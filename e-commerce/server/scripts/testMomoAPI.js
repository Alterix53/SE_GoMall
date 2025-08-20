import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:8080/api';
let authToken = null;

// Test configuration
const testConfig = {
    orderID: `TEST_${Date.now()}`,
    amount: 10000,
    orderInfo: 'Test payment for MoMo integration'
};

// Utility functions
const log = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
};

const makeRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
        }

        return data;
    } catch (error) {
        log(`Request failed for ${endpoint}: ${error.message}`, 'ERROR');
        throw error;
    }
};

// Test functions
const testHealthCheck = async () => {
    log('🔍 Testing health check endpoint...', 'TEST');
    try {
        const response = await makeRequest('/momo/health');
        log(`✅ Health check passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return true;
    } catch (error) {
        log(`❌ Health check failed: ${error.message}`, 'ERROR');
        return false;
    }
};

const testCreatePayment = async () => {
    log('🔍 Testing create payment endpoint...', 'TEST');
    try {
        const response = await makeRequest('/momo/test-create', {
            method: 'POST',
            body: JSON.stringify(testConfig)
        });
        log(`✅ Create payment passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return response.data;
    } catch (error) {
        log(`❌ Create payment failed: ${error.message}`, 'ERROR');
        return null;
    }
};

const testCheckStatus = async (requestId) => {
    if (!requestId) {
        log('⚠️ No requestId provided for status check', 'WARNING');
        return false;
    }

    log(`🔍 Testing check status endpoint for requestId: ${requestId}...`, 'TEST');
    try {
        const response = await makeRequest(`/momo/status/${requestId}`);
        log(`✅ Check status passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return true;
    } catch (error) {
        log(`❌ Check status failed: ${error.message}`, 'ERROR');
        return false;
    }
};

const testCancelPayment = async (requestId) => {
    if (!requestId) {
        log('⚠️ No requestId provided for cancel payment', 'WARNING');
        return false;
    }

    log(`🔍 Testing cancel payment endpoint for requestId: ${requestId}...`, 'TEST');
    try {
        const response = await makeRequest(`/momo/cancel/${requestId}`, {
            method: 'DELETE'
        });
        log(`✅ Cancel payment passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return true;
    } catch (error) {
        log(`❌ Cancel payment failed: ${error.message}`, 'ERROR');
        return false;
    }
};

const testSimulateResponse = async (requestId, resultCode = 0) => {
    if (!requestId) {
        log('⚠️ No requestId provided for simulate response', 'WARNING');
        return false;
    }

    log(`🔍 Testing simulate response endpoint for requestId: ${requestId} with resultCode: ${resultCode}...`, 'TEST');
    try {
        const response = await makeRequest('/momo/simulate', {
            method: 'POST',
            body: JSON.stringify({ requestId, resultCode })
        });
        log(`✅ Simulate response passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return true;
    } catch (error) {
        log(`❌ Simulate response failed: ${error.message}`, 'ERROR');
        return false;
    }
};

const testGetUserPayments = async () => {
    log('🔍 Testing get user payments endpoint...', 'TEST');
    try {
        const response = await makeRequest('/momo/user?page=1&limit=5');
        log(`✅ Get user payments passed: ${JSON.stringify(response)}`, 'SUCCESS');
        return true;
    } catch (error) {
        log(`❌ Get user payments failed: ${error.message}`, 'ERROR');
        return false;
    }
};

const testAuthentication = async () => {
    log('🔍 Testing authentication...', 'TEST');
    try {
        // Try to create payment without token (should fail)
        const response = await fetch(`${API_BASE_URL}/momo/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testConfig)
        });

        if (response.status === 401) {
            log('✅ Authentication check passed - protected endpoint properly secured', 'SUCCESS');
            
            // Test that test endpoint works without auth
            const testResponse = await fetch(`${API_BASE_URL}/momo/test-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testConfig)
            });

            if (testResponse.ok) {
                log('✅ Test endpoint works without authentication', 'SUCCESS');
                return true;
            } else {
                log('❌ Test endpoint failed without authentication', 'ERROR');
                return false;
            }
        } else {
            log('❌ Authentication check failed - protected endpoint not properly secured', 'ERROR');
            return false;
        }
    } catch (error) {
        log(`❌ Authentication test failed: ${error.message}`, 'ERROR');
        return false;
    }
};

// Main test runner
const runAllTests = async () => {
    log('🚀 Starting MoMo API integration tests...', 'INFO');
    log('=' * 50, 'INFO');

    const results = {
        healthCheck: false,
        authentication: false,
        createPayment: false,
        checkStatus: false,
        cancelPayment: false,
        simulateResponse: false,
        getUserPayments: false
    };

    // Test 1: Health check
    results.healthCheck = await testHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Authentication
    results.authentication = await testAuthentication();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Create payment (should work with test endpoint)
    log('🔍 Testing create payment with test endpoint...', 'INFO');
    const paymentData = await testCreatePayment();
    results.createPayment = paymentData !== null;
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 4: Check status (will fail without auth token)
    if (paymentData?.requestId) {
        log('⚠️ Check status test will fail without authentication token', 'WARNING');
        results.checkStatus = await testCheckStatus(paymentData.requestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 5: Cancel payment (will fail without auth token)
    if (paymentData?.requestId) {
        log('⚠️ Cancel payment test will fail without authentication token', 'WARNING');
        results.cancelPayment = await testCancelPayment(paymentData.requestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 6: Simulate response (should work - public endpoint)
    if (paymentData?.requestId) {
        results.simulateResponse = await testSimulateResponse(paymentData.requestId, 0);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 7: Get user payments (will fail without auth token)
    log('⚠️ Get user payments test will fail without authentication token', 'WARNING');
    results.getUserPayments = await testGetUserPayments();

    // Summary
    log('=' * 50, 'INFO');
    log('📊 Test Results Summary:', 'INFO');
    Object.entries(results).forEach(([test, result]) => {
        const status = result ? '✅ PASS' : '❌ FAIL';
        log(`${test}: ${status}`, result ? 'SUCCESS' : 'ERROR');
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    log(`🎯 Overall Success Rate: ${passedTests}/${totalTests} (${successRate}%)`, 'INFO');

    if (successRate >= 80) {
        log('🎉 MoMo API integration is working well!', 'SUCCESS');
    } else if (successRate >= 50) {
        log('⚠️ MoMo API integration has some issues that need attention', 'WARNING');
    } else {
        log('❌ MoMo API integration has significant issues', 'ERROR');
    }

    return results;
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        log(`Fatal error: ${error.message}`, 'ERROR');
        process.exit(1);
    });
}

export {
    runAllTests,
    testHealthCheck,
    testCreatePayment,
    testCheckStatus,
    testCancelPayment,
    testSimulateResponse,
    testGetUserPayments,
    testAuthentication
};
