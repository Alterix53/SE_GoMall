const mongoose = require('mongoose');

// Import models
let User, Seller;

const loadModels = async () => {
  const UserModule = await import('./models/User.js');
  const SellerModule = await import('./models/Seller.js');
  User = UserModule.default;
  Seller = SellerModule.default;
};

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/GoMall', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createPendingSeller = async () => {
  try {
    // Load models
    await loadModels();
    
    console.log('🔧 Tạo seller pending mới...\n');

    // Tạo user mới
    const newUser = new User({
      username: 'newpendingseller',
      email: 'newpendingseller@example.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      role: ['user'],
      isActive: true
    });

    const savedUser = await newUser.save();
    console.log('✅ Tạo user mới:', savedUser.username);

    // Tạo seller pending
    const newSeller = new Seller({
      userID: savedUser._id,
      businessName: 'New Pending Shop',
      businessLicense: 'NEW123',
      businessAddress: 'New Test Address',
      businessPhone: '0987654321',
      businessEmail: 'newpendingseller@example.com',
      verificationDocs: [],
      status: 'pending',
      isActive: false
    });

    const savedSeller = await newSeller.save();
    console.log('✅ Tạo seller pending:', savedSeller.businessName);
    console.log('   Status:', savedSeller.status);

    console.log('\n🎉 Tạo thành công!');
    console.log('📋 Thông tin tài khoản:');
    console.log('   Username: newpendingseller');
    console.log('   Password: password123');
    console.log('   Business: New Pending Shop');
    console.log('   Status: pending');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
};

createPendingSeller();
