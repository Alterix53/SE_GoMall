import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import NotificationService from '../services/notificationService.js';

dotenv.config();

// Kết nối database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testSellerNotification = async () => {
  try {
    console.log('🧪 Bắt đầu test seller notification...\n');

    // 1. Tìm user test
    const testUser = await User.findOne({ username: 'testuser' });
    if (!testUser) {
      console.log('❌ Không tìm thấy user test. Vui lòng tạo user "testuser" trước.');
      return;
    }
    console.log('✅ Tìm thấy user test:', testUser.username);

    // 2. Tạo seller application
    const sellerData = {
      userID: testUser._id,
      businessName: 'Test Business',
      businessLicense: 'TEST123',
      businessAddress: 'Test Address',
      businessPhone: '0123456789',
      businessEmail: testUser.email,
      verificationDocs: [],
      status: 'pending',
      isActive: false
    };

    // Xóa seller cũ nếu có
    await Seller.deleteOne({ userID: testUser._id });

    const seller = await Seller.create(sellerData);
    console.log('✅ Tạo seller application:', seller.businessName);

    // 3. Test notification khi approve
    console.log('\n📧 Test notification khi approve...');
    await NotificationService.createSellerApprovalNotification(testUser._id, seller);
    
    const approvalNotification = await Notification.findOne({
      userId: testUser._id,
      type: 'seller_approved'
    });
    
    if (approvalNotification) {
      console.log('✅ Notification approve được tạo:', approvalNotification.title);
      console.log('   Message:', approvalNotification.message);
      console.log('   Metadata:', approvalNotification.metadata);
    } else {
      console.log('❌ Không tìm thấy notification approve');
    }

    // 4. Test notification khi reject
    console.log('\n📧 Test notification khi reject...');
    await NotificationService.createSellerRejectionNotification(testUser._id, seller, 'Thiếu tài liệu xác minh');
    
    const rejectionNotification = await Notification.findOne({
      userId: testUser._id,
      type: 'seller_rejected'
    });
    
    if (rejectionNotification) {
      console.log('✅ Notification reject được tạo:', rejectionNotification.title);
      console.log('   Message:', rejectionNotification.message);
      console.log('   Metadata:', rejectionNotification.metadata);
    } else {
      console.log('❌ Không tìm thấy notification reject');
    }

    // 5. Test notification chào mừng seller
    console.log('\n📧 Test notification chào mừng seller...');
    await NotificationService.createWelcomeSellerNotification(testUser._id, seller);
    
    const welcomeNotification = await Notification.findOne({
      userId: testUser._id,
      type: 'seller_welcome'
    });
    
    if (welcomeNotification) {
      console.log('✅ Notification welcome được tạo:', welcomeNotification.title);
      console.log('   Message:', welcomeNotification.message);
      console.log('   Metadata:', welcomeNotification.metadata);
    } else {
      console.log('❌ Không tìm thấy notification welcome');
    }

    // 6. Hiển thị tất cả notifications của user
    console.log('\n📋 Tất cả notifications của user:');
    const allNotifications = await Notification.find({ userId: testUser._id }).sort({ createdAt: -1 });
    
    if (allNotifications.length > 0) {
      allNotifications.forEach((notif, index) => {
        console.log(`${index + 1}. [${notif.type}] ${notif.title}`);
        console.log(`   ${notif.message}`);
        console.log(`   Created: ${notif.createdAt}`);
        console.log(`   Read: ${notif.isRead}`);
        console.log('');
      });
    } else {
      console.log('❌ Không có notification nào');
    }

    // 7. Test updateSellerStatus từ adminService
    console.log('\n🔧 Test updateSellerStatus từ adminService...');
    const adminService = (await import('../services/adminService.js')).default;
    
    // Approve seller
    const approvedSeller = await adminService.updateSellerStatus(seller._id, 'approved');
    console.log('✅ Seller được approve:', approvedSeller.status);
    
    // Kiểm tra notification mới
    const newApprovalNotification = await Notification.findOne({
      userId: testUser._id,
      type: 'seller_approved'
    }).sort({ createdAt: -1 });
    
    if (newApprovalNotification) {
      console.log('✅ Notification approve từ adminService:', newApprovalNotification.title);
    } else {
      console.log('❌ Không tìm thấy notification từ adminService');
    }

    // Kiểm tra notification welcome từ adminService
    const newWelcomeNotification = await Notification.findOne({
      userId: testUser._id,
      type: 'seller_welcome'
    }).sort({ createdAt: -1 });
    
    if (newWelcomeNotification) {
      console.log('✅ Notification welcome từ adminService:', newWelcomeNotification.title);
    } else {
      console.log('❌ Không tìm thấy notification welcome từ adminService');
    }

    console.log('\n🎉 Test hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
};

// Chạy test
testSellerNotification();
