import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import NotificationService from '../services/notificationService.js';

// Kết nối database
const MONGODB_URI = "mongodb://localhost:27017/GoMall";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Test tạo notifications
async function testCreateNotifications() {
  try {
    console.log('\n🧪 Testing notification creation...');
    
    // Test user ID (thay đổi theo user thật trong database)
    const testUserId = '64f8b8c8b8c8b8c8b8c8b8c8'; // Thay bằng user ID thật
    
    // 1. Tạo thông báo đặt hàng thành công
    console.log('📦 Creating order success notification...');
    await NotificationService.createOrderSuccessNotification(
      testUserId, 
      'ORD001', 
      { totalAmount: 500000, items: [{ name: 'Sản phẩm test', quantity: 2 }] }
    );
    
    // 2. Tạo thông báo cập nhật trạng thái giao hàng
    console.log('🚚 Creating shipping update notification...');
    await NotificationService.createShippingUpdateNotification(
      testUserId, 
      'ORD001', 
      'in_transit', 
      '2-3 giờ tới'
    );
    
    // 3. Tạo thông báo khuyến mãi
    console.log('🎉 Creating promotion notification...');
    await NotificationService.createPromotionNotification(
      testUserId,
      'Khuyến mãi mới!',
      'Giảm giá 20% cho tất cả sản phẩm điện tử. Áp dụng từ hôm nay đến hết tuần.'
    );
    
    // 4. Tạo thông báo thanh toán thành công
    console.log('💰 Creating payment success notification...');
    await NotificationService.createPaymentSuccessNotification(
      testUserId,
      'ORD001',
      500000
    );
    
    console.log('✅ All test notifications created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
  }
}

// Test lấy notifications
async function testGetNotifications() {
  try {
    console.log('\n📋 Testing notification retrieval...');
    
    const testUserId = '64f8b8c8b8c8b8c8b8c8b8c8'; // Thay bằng user ID thật
    
    // Lấy tất cả notifications
    const allNotifications = await Notification.find({ userId: testUserId }).sort({ createdAt: -1 });
    console.log(`📊 Total notifications: ${allNotifications.length}`);
    
    // Lấy notifications chưa đọc
    const unreadNotifications = await Notification.find({ userId: testUserId, isRead: false });
    console.log(`🔴 Unread notifications: ${unreadNotifications.length}`);
    
    // Hiển thị chi tiết
    console.log('\n📝 Notification details:');
    allNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.type}] ${notif.title}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Read: ${notif.isRead ? '✅' : '❌'}`);
      console.log(`   Created: ${notif.createdAt.toLocaleString('vi-VN')}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error retrieving notifications:', error);
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  try {
    console.log('\n🌐 Testing API endpoints...');
    
    const testUserId = '64f8b8c8b8c8b8c8b8c8b8c8'; // Thay bằng user ID thật
    
    // Test 1: Lấy danh sách notifications
    console.log('1️⃣ Testing GET /api/notifications...');
    // (Cần server đang chạy để test)
    
    // Test 2: Lấy unread count
    console.log('2️⃣ Testing GET /api/notifications/unread-count...');
    
    // Test 3: Đánh dấu đã đọc
    console.log('3️⃣ Testing PUT /api/notifications/:id/read...');
    
    console.log('⚠️  API tests require server to be running');
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error);
  }
}

// Cleanup test data
async function cleanupTestData() {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    const testUserId = '64f8b8c8b8c8b8c8b8c8b8c8'; // Thay bằng user ID thật
    
    const result = await Notification.deleteMany({ userId: testUserId });
    console.log(`✅ Deleted ${result.deletedCount} test notifications`);
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}

// Main function
async function main() {
  try {
    await connectDB();
    
    console.log('🚀 Starting notification tests...');
    
    // Tạo test notifications
    await testCreateNotifications();
    
    // Lấy và hiển thị notifications
    await testGetNotifications();
    
    // Test API endpoints
    await testAPIEndpoints();
    
    // Cleanup (comment out nếu muốn giữ test data)
    // await cleanupTestData();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  }
}

// Chạy tests
if (require.main === module) {
  main();
}

module.exports = {
  testCreateNotifications,
  testGetNotifications,
  testAPIEndpoints,
  cleanupTestData
};
