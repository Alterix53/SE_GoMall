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

// Test tạo thông báo đặt hàng thành công
const testOrderSuccessNotification = async () => {
  try {
    console.log('\n🧪 Testing Order Success Notification...');
    
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
    
    await NotificationService.createOrderSuccessNotification(
      user._id, 
      orderId, 
      orderDetails
    );
    
    console.log('✅ Order success notification created successfully');
  } catch (error) {
    console.error('❌ Error testing order success notification:', error);
  }
};

// Test tạo thông báo cập nhật trạng thái giao hàng
const testShippingUpdateNotification = async () => {
  try {
    console.log('\n🧪 Testing Shipping Update Notification...');
    
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    const status = 'shipped';
    const estimatedDelivery = '2025-08-25';
    
    await NotificationService.createShippingUpdateNotification(
      user._id, 
      orderId, 
      status, 
      estimatedDelivery
    );
    
    console.log('✅ Shipping update notification created successfully');
  } catch (error) {
    console.error('❌ Error testing shipping update notification:', error);
  }
};

// Test tạo thông báo giao hàng thành công
const testDeliverySuccessNotification = async () => {
  try {
    console.log('\n🧪 Testing Delivery Success Notification...');
    
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    
    await NotificationService.createDeliverySuccessNotification(
      user._id, 
      orderId
    );
    
    console.log('✅ Delivery success notification created successfully');
  } catch (error) {
    console.error('❌ Error testing delivery success notification:', error);
  }
};

// Test tạo thông báo hủy đơn hàng
const testOrderCancelledNotification = async () => {
  try {
    console.log('\n🧪 Testing Order Cancelled Notification...');
    
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    const reason = 'Sản phẩm hết hàng';
    
    await NotificationService.createOrderCancelledNotification(
      user._id, 
      orderId, 
      reason
    );
    
    console.log('✅ Order cancelled notification created successfully');
  } catch (error) {
    console.error('❌ Error testing order cancelled notification:', error);
  }
};

// Test tạo thông báo thanh toán thành công
const testPaymentSuccessNotification = async () => {
  try {
    console.log('\n🧪 Testing Payment Success Notification...');
    
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    const amount = 1500000;
    
    await NotificationService.createPaymentSuccessNotification(
      user._id, 
      orderId, 
      amount
    );
    
    console.log('✅ Payment success notification created successfully');
  } catch (error) {
    console.error('❌ Error testing payment success notification:', error);
  }
};

// Test tạo thông báo hoàn tiền
const testRefundNotification = async () => {
  try {
    console.log('\n🧪 Testing Refund Notification...');
    
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    const orderId = 'test-order-123';
    const amount = 1500000;
    const reason = 'Sản phẩm bị lỗi';
    
    await NotificationService.createRefundNotification(
      user._id, 
      orderId, 
      amount, 
      reason
    );
    
    console.log('✅ Refund notification created successfully');
  } catch (error) {
    console.error('❌ Error testing refund notification:', error);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting Order Notifications Test...');
  
  await connectDB();
  
  // Chạy các test
  await testOrderSuccessNotification();
  await testShippingUpdateNotification();
  await testDeliverySuccessNotification();
  await testOrderCancelledNotification();
  await testPaymentSuccessNotification();
  await testRefundNotification();
  
  console.log('\n🎉 All notification tests completed!');
  console.log('📱 Check the database to see the created notifications');
  
  process.exit(0);
};

// Chạy script
main().catch(console.error);
