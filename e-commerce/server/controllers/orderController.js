import Order from '../models/Order.js';

// Tạo order mới
export const createOrder = async (req, res) => {
  try {
    const { total, shippingAddress, paymentMethod, items } = req.body;
    const userID = req.user._id; // Lấy từ user object trong req.user
    
    if (!total || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newOrder = await Order.create({
      userID,
      total,
      shippingAddress,
      paymentMethod,
      items
    });
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách order của user
export const getUserOrders = async (req, res) => {
  try {
    const userID = req.user._id; // Lấy từ user object trong req.user
    if (!userID) return res.status(400).json({ message: 'Missing userID' });
    const orders = await Order.find({ userID });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái order
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

// Hủy order
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