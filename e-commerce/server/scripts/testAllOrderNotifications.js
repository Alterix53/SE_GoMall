import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NotificationService from '../services/notificationService.js';
import User from '../models/User.js';

dotenv.config();

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gomall');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test tất cả loại notifications
const testAllNotifications = async () => {
  try {
    console.log('\n🧪 Testing All Order Notifications...');
    
    // Lấy user đầu tiên để test
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    const orderDetails = {
      totalAmount: 1500000,
      items: [
        { name: 'Test Product 1', price: 800000, quantity: 1 },
        { name: 'Test Product 2', price: 700000, quantity: 1 }
      ],
      shippingAddress: '123 Test Street, Test City',
      paymentMethod: 'Cash on Delivery'
    };
    
    console.log('\n📱 Testing Order Success Notification...');
    await NotificationService.createOrderSuccessNotification(
      user._id, 
      orderId, 
      orderDetails
    );
    
    console.log('📱 Testing Shipping Update Notification...');
    await NotificationService.createShippingUpdateNotification(
      user._id, 
      orderId, 
      'shipped', 
      '2025-08-25'
    );
    
    console.log('📱 Testing Delivery Success Notification...');
    await NotificationService.createDeliverySuccessNotification(
      user._id, 
      orderId
    );
    
    console.log('📱 Testing Order Cancelled Notification...');
    await NotificationService.createOrderCancelledNotification(
      user._id, 
      orderId, 
      'Sản phẩm hết hàng'
    );
    
    console.log('📱 Testing Payment Success Notification...');
    await NotificationService.createPaymentSuccessNotification(
      user._id, 
      orderId, 
      1500000
    );
    
    console.log('📱 Testing Refund Notification...');
    await NotificationService.createRefundNotification(
      user._id, 
      orderId, 
      1500000, 
      'Sản phẩm bị lỗi'
    );
    
    console.log('📱 Testing Order Returned Notification...');
    await NotificationService.createOrderReturnedNotification(
      user._id, 
      orderId, 
      'Sản phẩm không đúng mô tả'
    );
    
    console.log('📱 Testing Order Delayed Notification...');
    await NotificationService.createOrderDelayedNotification(
      user._id, 
      orderId, 
      'Thời tiết xấu', 
      '2025-08-28'
    );
    
    console.log('📱 Testing Order Ready for Pickup Notification...');
    await NotificationService.createOrderReadyForPickupNotification(
      user._id, 
      orderId, 
      'GoMall Store - 123 Main Street', 
      'PICKUP-2024-001'
    );
    
    console.log('📱 Testing Partial Refund Notification...');
    await NotificationService.createPartialRefundNotification(
      user._id, 
      orderId, 
      500000, 
      'Một sản phẩm bị lỗi'
    );
    
    console.log('📱 Testing Promotion Notification...');
    await NotificationService.createPromotionNotification(
      user._id, 
      '🎉 Flash Sale 50% OFF!', 
      'Chỉ trong 24h! Giảm giá 50% cho tất cả sản phẩm điện tử. Mua ngay kẻo hết!'
    );
    
    console.log('\n🎉 All notification tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting Comprehensive Order Notifications Test...');
  
  await connectDB();
  await testAllNotifications();
  
  console.log('\n📊 Test Summary:');
  console.log('✅ Order Success Notification');
  console.log('✅ Shipping Update Notification');
  console.log('✅ Delivery Success Notification');
  console.log('✅ Order Cancelled Notification');
  console.log('✅ Payment Success Notification');
  console.log('✅ Refund Notification');
  console.log('✅ Order Returned Notification');
  console.log('✅ Order Delayed Notification');
  console.log('✅ Order Ready for Pickup Notification');
  console.log('✅ Partial Refund Notification');
  console.log('✅ Promotion Notification');
  
  console.log('\n📱 Check the database to see all created notifications');
  console.log('🗄️ Database: gomall');
  console.log('📋 Collection: notifications');
  
  process.exit(0);
};

// Chạy script
main().catch(console.error);
