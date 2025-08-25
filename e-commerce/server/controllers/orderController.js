import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import NotificationService from '../services/notificationService.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { total, shippingAddress, paymentMethod, items, note } = req.body;
    const userID = req.user._id; // Get from user object in req.user
    
    console.log('Extracted data:', { total, shippingAddress, paymentMethod, items, note, userID });
    
    if (!total || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const orderData = {
      userID,
      total,
      shippingAddress,
      paymentMethod,
      note,
      items
    };
    
    console.log('Creating order with data:', orderData);
    
    // Validate inventory before creating order
    for (const item of items) {
      const product = await Product.findById(item.productID);
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          message: `Product with ID ${item.productID} not found` 
        });
      }
      
      const availableQuantity = product.inventory?.quantity || 0;
      if (availableQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient inventory for product ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}` 
        });
      }
    }
    
    const newOrder = await Order.create(orderData);
    console.log('Order created successfully:', newOrder);
    
    // Decrease inventory after successful order creation
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productID,
        { 
          $inc: { 'inventory.quantity': -item.quantity },
          $inc: { sold: item.quantity } // Increase sold count
        }
      );
      console.log(`Decreased inventory for product ${item.productID} by ${item.quantity}`);
    }
    
    // Clear cart after successful order creation
    try {
      const cart = await Cart.findOne({ userID });
      if (cart) {
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        console.log(`Cleared cart for user ${userID}`);
      }
    } catch (cartError) {
      console.error('Error clearing cart:', cartError);
      // Don't fail the order if cart clearing fails
    }
    
    // Tạo thông báo đặt hàng thành công
    try {
      await NotificationService.createOrderSuccessNotification(
        userID, 
        newOrder._id.toString(), 
        {
          totalAmount: total,
          items: items,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod
        }
      );
    } catch (notificationError) {
      console.error('Error creating order success notification:', notificationError);
      // Không fail order nếu notification fail
    }
    
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders list
export const getUserOrders = async (req, res) => {
  try {
    const userID = req.user._id; // Get from user object in req.user
    if (!userID) return res.status(400).json({ message: 'Missing userID' });
    const orders = await Order.find({ userID })
      .populate('items.productID', 'name images price');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order details
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('items.productID', 'name images price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedDelivery } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Tạo thông báo cập nhật trạng thái giao hàng
    try {
      await NotificationService.createShippingUpdateNotification(
        order.userID, 
        order._id.toString(), 
        status, 
        estimatedDelivery
      );
    } catch (notificationError) {
      console.error('Error creating shipping update notification:', notificationError);
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Get order before updating
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Only allow cancellation if order is still pending or processing
    if (order.status !== 'Pending' && order.status !== 'Processing') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order that is already shipped or delivered' 
      });
    }
    
    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });
    
    // Restore inventory when order is cancelled
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productID,
        { 
          $inc: { 'inventory.quantity': item.quantity },
          $inc: { sold: -item.quantity } // Decrease sold count
        }
      );
      console.log(`Restored inventory for product ${item.productID} by ${item.quantity}`);
    }
    
    // Note: Cart is already cleared when order was created, so no need to restore cart items
    
    // Tạo thông báo hủy đơn hàng
    try {
      await NotificationService.createOrderCancelledNotification(
        order.userID, 
        order._id.toString(), 
        reason || 'Không có lý do cụ thể'
      );
    } catch (notificationError) {
      console.error('Error creating order cancelled notification:', notificationError);
    }
    
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: 'Delivered' }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Tạo thông báo giao hàng thành công
    try {
      await NotificationService.createDeliverySuccessNotification(
        order.userID, 
        order._id.toString()
      );
    } catch (notificationError) {
      console.error('Error creating delivery success notification:', notificationError);
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};