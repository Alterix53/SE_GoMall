import userFileService from './services/userFileService.js';

// Test function
async function testUserFileSystem() {
    console.log('=== Testing User File System ===\n');

    try {
        // Test 1: Thêm user mới
        console.log('1. Testing add user...');
        const newUser = userFileService.addUser({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123',
            fullName: 'Test User',
            phoneNumber: '0123456789',
            address: '123 Test Street',
            role: 'user',
            isActive: true
        });
        console.log('✅ User added successfully:', { id: newUser.id, username: newUser.username, email: newUser.email });

        // Test 2: Thêm user thứ 2
        console.log('\n2. Testing add second user...');
        const secondUser = userFileService.addUser({
            username: 'selleruser',
            email: 'seller@example.com',
            password: 'hashedpassword456',
            fullName: 'Seller User',
            phoneNumber: '0987654321',
            address: '456 Seller Street',
            role: 'seller',
            isActive: true
        });
        console.log('✅ Second user added successfully:', { id: secondUser.id, username: secondUser.username, role: secondUser.role });

        // Test 3: Tìm user theo email
        console.log('\n3. Testing find user by email...');
        const foundUser = userFileService.findUserByEmail('test@example.com');
        console.log('✅ User found by email:', { id: foundUser.id, username: foundUser.username });

        // Test 4: Tìm user theo username
        console.log('\n4. Testing find user by username...');
        const foundByUsername = userFileService.findUserByUsername('selleruser');
        console.log('✅ User found by username:', { id: foundByUsername.id, email: foundByUsername.email });

        // Test 5: Lấy tất cả users
        console.log('\n5. Testing get all users...');
        const allUsers = userFileService.getAllUsers();
        console.log('✅ All users:', allUsers.map(u => ({ id: u.id, username: u.username, role: u.role })));

        // Test 6: Lấy users theo role
        console.log('\n6. Testing get users by role...');
        const sellers = userFileService.getUsersByRole('seller');
        console.log('✅ Sellers:', sellers.map(u => ({ id: u.id, username: u.username })));

        // Test 7: Cập nhật user
        console.log('\n7. Testing update user...');
        const updatedUser = userFileService.updateUser(newUser.id, {
            fullName: 'Updated Test User',
            phoneNumber: '1111111111'
        });
        console.log('✅ User updated:', { id: updatedUser.id, fullName: updatedUser.fullName, phoneNumber: updatedUser.phoneNumber });

        // Test 8: Backup users
        console.log('\n8. Testing backup users...');
        const backupPath = userFileService.backupUsers();
        console.log('✅ Backup created:', backupPath);

        // Test 9: Thử thêm user với email trùng lặp (sẽ fail)
        console.log('\n9. Testing duplicate email (should fail)...');
        try {
            userFileService.addUser({
                username: 'duplicateuser',
                email: 'test@example.com', // Email đã tồn tại
                password: 'hashedpassword789',
                fullName: 'Duplicate User',
                role: 'user',
                isActive: true
            });
        } catch (error) {
            console.log('✅ Duplicate email correctly rejected:', error.message);
        }

        console.log('\n=== All tests completed successfully! ===');
        console.log('\nCurrent users in file:');
        const finalUsers = userFileService.getAllUsers();
        finalUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
        });

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Chạy test
testUserFileSystem(); 