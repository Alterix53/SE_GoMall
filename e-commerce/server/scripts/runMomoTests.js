#!/usr/bin/env node

import { runAllTests } from './testMomoAPI.js';

console.log('🧪 MoMo Payment Integration Test Suite');
console.log('=====================================');
console.log('');

// Check if server is running
const checkServer = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/momo/health');
        if (response.ok) {
            console.log('✅ Server is running on http://localhost:8080');
            return true;
        }
    } catch (error) {
        console.log('❌ Server is not running on http://localhost:8080');
        console.log('   Please start the server first: npm run dev');
        return false;
    }
};

// Main execution
const main = async () => {
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('');
        console.log('📋 Instructions:');
        console.log('1. Start the server: cd server && npm run dev');
        console.log('2. Run this test: node scripts/runMomoTests.js');
        console.log('');
        process.exit(1);
    }

    console.log('');
    console.log('🚀 Starting tests...');
    console.log('');

    try {
        const results = await runAllTests();
        
        console.log('');
        console.log('📋 Test Summary:');
        console.log('================');
        
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        Object.entries(results).forEach(([test, result]) => {
            const status = result ? '✅ PASS' : '❌ FAIL';
            console.log(`${test.padEnd(20)} ${status}`);
        });
        
        console.log('');
        console.log(`🎯 Success Rate: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! MoMo integration is working perfectly.');
        } else if (passedTests >= totalTests * 0.8) {
            console.log('⚠️ Most tests passed. Some minor issues to address.');
        } else {
            console.log('❌ Several tests failed. Please check the integration.');
        }
        
    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
        process.exit(1);
    }
};

// Run the main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
