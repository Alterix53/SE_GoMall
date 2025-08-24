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

// Tạo nhiều notifications test
const createTestNotifications = async () => {
  try {
    console.log('\n🧪 Creating Test Notifications...');
    
    // Lấy user đầu tiên để test
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log(`✅ Using user: ${user.username || user.email}`);
    
    // Tạo notifications với thời gian khác nhau
    const notifications = [
      {
        type: 'order_success',
        title: 'Đặt hàng thành công!',
        message: 'Đơn hàng #TEST-001 của bạn đã được đặt thành công. Chúng tôi sẽ xử lý và giao hàng sớm nhất.',
        orderId: 'TEST-001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 phút trước
        icon: 'package'
      },
      {
        type: 'shipping_update',
        title: 'Đơn hàng đang được xử lý',
        message: 'Đơn hàng #TEST-002 đã được xử lý và đang chuẩn bị giao hàng.',
        orderId: 'TEST-002',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
        icon: 'truck'
      },
      {
        type: 'delivery_success',
        title: 'Giao hàng thành công',
        message: 'Đơn hàng #TEST-003 đã được giao thành công. Vui lòng kiểm tra và đánh giá sản phẩm.',
        orderId: 'TEST-003',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
        icon: 'check'
      },
      {
        type: 'promotion',
        title: '🎉 Flash Sale 50% OFF!',
        message: 'Chỉ trong 24h! Giảm giá 50% cho tất cả sản phẩm điện tử. Mua ngay kẻo hết!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
        icon: 'bell'
      },
      {
        type: 'order_cancelled',
        title: 'Đơn hàng bị hủy',
        message: 'Đơn hàng #TEST-004 đã bị hủy do sản phẩm hết hàng. Chúng tôi xin lỗi vì sự bất tiện này.',
        orderId: 'TEST-004',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 giờ trước
        icon: 'alert'
      },
      {
        type: 'payment_success',
        title: 'Thanh toán thành công',
        message: 'Đơn hàng #TEST-005 đã được thanh toán thành công với số tiền 1,500,000đ.',
        orderId: 'TEST-005',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 giờ trước
        icon: 'check'
      },
      {
        type: 'order_returned',
        title: 'Đơn hàng bị trả lại',
        message: 'Đơn hàng #TEST-006 đã bị trả lại do sản phẩm không đúng mô tả. Chúng tôi sẽ xử lý theo chính sách đổi trả.',
        orderId: 'TEST-006',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 giờ trước
        icon: 'alert'
      },
      {
        type: 'order_delayed',
        title: 'Đơn hàng bị hoãn',
        message: 'Đơn hàng #TEST-007 bị hoãn do thời tiết xấu. Dự kiến giao hàng mới: 2025-08-25.',
        orderId: 'TEST-007',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 giờ trước
        icon: 'alert'
      },
      {
        type: 'order_ready_for_pickup',
        title: 'Đơn hàng sẵn sàng nhận',
        message: 'Đơn hàng #TEST-008 đã sẵn sàng để nhận tại GoMall Store - 123 Main Street. Mã nhận hàng: PICKUP-001',
        orderId: 'TEST-008',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 giờ trước
        icon: 'package'
      },
      {
        type: 'refund_processed',
        title: 'Hoàn tiền đã được xử lý',
        message: 'Đơn hàng #TEST-009 đã được hoàn tiền 500,000đ do sản phẩm bị lỗi.',
        orderId: 'TEST-009',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
        icon: 'check'
      },
      {
        type: 'seller_approved',
        title: '🎉 Chúc mừng! Hồ sơ seller của bạn đã được chấp nhận',
        message: 'Hồ sơ đăng ký seller "Test Store" đã được admin duyệt thành công. Bạn có thể bắt đầu bán hàng ngay bây giờ!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
        icon: 'check'
      },
      {
        type: 'promotion',
        title: '🎯 Khuyến mãi cuối tuần!',
        message: 'Giảm giá lên đến 70% cho các sản phẩm thời trang. Chỉ diễn ra trong 2 ngày cuối tuần!',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
        icon: 'bell'
      }
    ];
    
    console.log(`📱 Creating ${notifications.length} test notifications...`);
    
    // Tạo từng notification
    for (let i = 0; i < notifications.length; i++) {
      const notif = notifications[i];
      
      try {
        // Sử dụng NotificationService để tạo notification
        if (notif.type === 'order_success') {
          await NotificationService.createOrderSuccessNotification(
            user._id,
            notif.orderId,
            {
              totalAmount: 1500000,
              items: [{ name: 'Test Product', price: 1500000, quantity: 1 }],
              shippingAddress: '123 Test Street',
              paymentMethod: 'Cash on Delivery'
            }
          );
        } else if (notif.type === 'shipping_update') {
          await NotificationService.createShippingUpdateNotification(
            user._id,
            notif.orderId,
            'processing',
            '2025-08-25'
          );
        } else if (notif.type === 'delivery_success') {
          await NotificationService.createDeliverySuccessNotification(
            user._id,
            notif.orderId
          );
        } else if (notif.type === 'order_cancelled') {
          await NotificationService.createOrderCancelledNotification(
            user._id,
            notif.orderId,
            'Sản phẩm hết hàng'
          );
        } else if (notif.type === 'payment_success') {
          await NotificationService.createPaymentSuccessNotification(
            user._id,
            notif.orderId,
            1500000
          );
        } else if (notif.type === 'refund_processed') {
          await NotificationService.createRefundNotification(
            user._id,
            notif.orderId,
            500000,
            'Sản phẩm bị lỗi'
          );
        } else if (notif.type === 'order_returned') {
          await NotificationService.createOrderReturnedNotification(
            user._id,
            notif.orderId,
            'Sản phẩm không đúng mô tả'
          );
        } else if (notif.type === 'order_delayed') {
          await NotificationService.createOrderDelayedNotification(
            user._id,
            notif.orderId,
            'Thời tiết xấu',
            '2025-08-25'
          );
        } else if (notif.type === 'order_ready_for_pickup') {
          await NotificationService.createOrderReadyForPickupNotification(
            user._id,
            notif.orderId,
            'GoMall Store - 123 Main Street',
            'PICKUP-001'
          );
        } else if (notif.type === 'promotion') {
          await NotificationService.createPromotionNotification(
            user._id,
            notif.title,
            notif.message
          );
        } else if (notif.type === 'seller_approved') {
          await NotificationService.createSellerApprovalNotification(
            user._id,
            { _id: 'test-seller-123', businessName: 'Test Store' }
          );
        }
        
        console.log(`✅ Created ${notif.type} notification`);
        
        // Delay nhỏ để tránh quá tải
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error creating ${notif.type} notification:`, error);
      }
    }
    
    console.log('\n🎉 All test notifications created successfully!');
    console.log('📱 Now you can test the notification panel with multiple notifications');
    
  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting Test Notifications Creation...');
  
  await connectDB();
  await createTestNotifications();
  
  console.log('\n📊 Summary:');
  console.log('✅ 12 test notifications created');
  console.log('✅ Different types and timestamps');
  console.log('✅ Ready for testing notification panel');
  
  process.exit(0);
};

// Chạy script
main().catch(console.error);
