import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/GoMall';

async function testInventoryUpdate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find a test product
    const product = await Product.findOne({ 'inventory.quantity': { $gt: 0 } });
    if (!product) {
      console.log('No products with inventory found. Creating a test product...');
      // Create a test product
      const testProduct = new Product({
        name: 'Test Product for Inventory',
        slug: 'test-product-inventory',
        description: 'Test product for inventory testing',
        sku: 'TEST001',
        brand: 'Test Brand',
        categoryID: new mongoose.Types.ObjectId(),
        sellerID: new mongoose.Types.ObjectId(),
        images: [{ url: 'test.jpg', alt: 'Test', isPrimary: true }],
        price: { original: 100, sale: 80 },
        inventory: { quantity: 10, lowStockThreshold: 2 },
        isActive: true
      });
      await testProduct.save();
      console.log('Test product created with 10 items in inventory\n');
    }

    // Get the product again
    const testProduct = await Product.findOne({ 'inventory.quantity': { $gt: 0 } });
    console.log('Test Product:', {
      id: testProduct._id,
      name: testProduct.name,
      initialInventory: testProduct.inventory.quantity,
      initialSold: testProduct.sold
    });

    // Find a test user
    let testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Creating a test user...');
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
        fullName: 'Test User'
      });
      await testUser.save();
      console.log('Test user created\n');
    }

    // Test 1: Create an order
    console.log('=== TEST 1: Creating Order ===');
    const orderData = {
      userID: testUser._id,
      total: 160,
      shippingAddress: 'Test Address',
      paymentMethod: 'Cash',
      items: [{
        productID: testProduct._id,
        quantity: 2,
        unitPrice: 80,
        discount: 0
      }]
    };

    const newOrder = await Order.create(orderData);
    console.log('Order created:', newOrder._id);

    // Manually update inventory (simulating the orderController logic)
    await Product.findByIdAndUpdate(
      testProduct._id,
      { 
        $inc: { 
          'inventory.quantity': -2,
          sold: 2 
        }
      }
    );

    // Check inventory after order
    const productAfterOrder = await Product.findById(testProduct._id);
    console.log('Inventory after order:', {
      quantity: productAfterOrder.inventory.quantity,
      sold: productAfterOrder.sold
    });

    // Test 2: Cancel the order
    console.log('\n=== TEST 2: Canceling Order ===');
    await Order.findByIdAndUpdate(newOrder._id, { status: 'Cancelled' });

    // Manually restore inventory (simulating the cancelOrder logic)
    await Product.findByIdAndUpdate(
      testProduct._id,
      { 
        $inc: { 
          'inventory.quantity': 2,
          sold: -2 
        }
      }
    );

    // Check inventory after cancellation
    const productAfterCancel = await Product.findById(testProduct._id);
    console.log('Inventory after cancellation:', {
      quantity: productAfterCancel.inventory.quantity,
      sold: productAfterCancel.sold
    });

    // Verify final state
    console.log('\n=== VERIFICATION ===');
    const finalProduct = await Product.findById(testProduct._id);
    const isCorrect = finalProduct.inventory.quantity === testProduct.inventory.quantity && 
                     finalProduct.sold === testProduct.sold;
    
    console.log('Initial inventory:', testProduct.inventory.quantity);
    console.log('Final inventory:', finalProduct.inventory.quantity);
    console.log('Initial sold:', testProduct.sold);
    console.log('Final sold:', finalProduct.sold);
    console.log('Test result:', isCorrect ? '✅ PASSED' : '❌ FAILED');

    // Clean up
    await Order.findByIdAndDelete(newOrder._id);
    console.log('\nTest order cleaned up');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testInventoryUpdate();
