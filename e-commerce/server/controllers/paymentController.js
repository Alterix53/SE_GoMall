import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// Xử lý thanh toán
export const processPayment = async (req, res) => {
  try {
    const { orderID, amount, paymentMethod, cardNumber, expiryDate, cvv } = req.body;
    const userID = req.user._id; // Lấy từ JWT token
    
    // Validation cơ bản
    if (!orderID || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validation cho credit card
    if (paymentMethod === 'credit_card') {
      if (!cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ message: 'Card information is required for credit card payment' });
      }
      
      // Kiểm tra định dạng thẻ (Luhn algorithm)
      if (!isValidCardNumber(cardNumber)) {
        return res.status(400).json({ message: 'Invalid card number' });
      }
      
      // Kiểm tra expiry date
      if (!isValidExpiryDate(expiryDate)) {
        return res.status(400).json({ message: 'Invalid expiry date' });
      }
      
      // Kiểm tra CVV
      if (!isValidCVV(cvv)) {
        return res.status(400).json({ message: 'Invalid CVV' });
      }
    }
    
    // Kiểm tra order tồn tại và thuộc về user này
    const order = await Order.findOne({ _id: orderID, userID });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Kiểm tra order chưa được thanh toán
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is already processed' });
    }
    
    // Kiểm tra amount khớp với order total
    if (amount !== order.total) {
      return res.status(400).json({ message: 'Payment amount does not match order total' });
    }
    
    // Tạo payment
    const payment = await Payment.create({ 
      orderID, 
      userID,
      amount, 
      paymentMethod, 
      status: 'Completed',
      cardInfo: {
        last4: cardNumber ? cardNumber.slice(-4) : null,
        expiryDate,
        maskedNumber: cardNumber ? `****${cardNumber.slice(-4)}` : null
      }
    });
    
    // Cập nhật trạng thái order
    order.status = 'Processing';
    await order.save();
    
    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper functions cho validation
function isValidCardNumber(cardNumber) {
  // Luhn algorithm
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

function isValidExpiryDate(expiryDate) {
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) return false;
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
  
  return true;
}

function isValidCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Lấy chi tiết thanh toán
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xử lý hoàn tiền
export const refundPayment = async (req, res) => {
  try {
    const { paymentID } = req.body;
    const payment = await Payment.findByIdAndUpdate(paymentID, { status: 'Failed' }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    // Cập nhật trạng thái order liên quan
    await Order.findByIdAndUpdate(payment.orderID, { status: 'Cancelled' });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Quản lý trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};