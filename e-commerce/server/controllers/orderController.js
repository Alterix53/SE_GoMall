import Order from '../models/Order.js';

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
    
    const newOrder = await Order.create(orderData);
    console.log('Order created successfully:', newOrder);
    
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
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};