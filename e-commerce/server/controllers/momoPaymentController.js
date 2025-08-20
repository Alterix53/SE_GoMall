import momoPaymentService from '../services/momoPaymentService.js';
import ResponseHandler from '../utils/responseHandler.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import MomoPayment from '../models/MomoPayment.js';

// Tạo giao dịch MoMo mới
export const createMomoPayment = async (req, res) => {
    try {
        const { orderID, amount, orderInfo } = req.body;
        const userID = req.user._id;

        // Validation
        if (!orderID || !amount || !orderInfo) {
            return ResponseHandler.badRequest(res, 'Missing required fields: orderID, amount, orderInfo');
        }

        if (amount <= 0) {
            return ResponseHandler.badRequest(res, 'Amount must be greater than 0');
        }

        const result = await momoPaymentService.createPayment(orderID, userID, amount, orderInfo);
        
        return ResponseHandler.success(res, 'Payment created successfully', result);

    } catch (error) {
        console.error('Error in createMomoPayment:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Xử lý callback từ MoMo
export const handleMomoCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        
        // Log callback data
        console.log('MoMo Callback received:', callbackData);

        const result = await momoPaymentService.handleCallback(callbackData);
        
        // Trả về response theo format MoMo yêu cầu
        return res.status(200).json({
            resultCode: 0,
            message: 'Success'
        });

    } catch (error) {
        console.error('Error in handleMomoCallback:', error);
        return res.status(500).json({
            resultCode: 1000,
            message: 'Internal server error'
        });
    }
};

// Kiểm tra trạng thái giao dịch
export const checkPaymentStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userID = req.user._id;

        if (!requestId) {
            return ResponseHandler.badRequest(res, 'Request ID is required');
        }

        const result = await momoPaymentService.checkPaymentStatus(requestId);
        
        // Kiểm tra quyền truy cập
        if (result.payment && result.payment.userID && result.payment.userID.toString() !== userID.toString()) {
            return ResponseHandler.unauthorized(res, 'Access denied');
        }

        return ResponseHandler.success(res, 'Payment status retrieved successfully', result);

    } catch (error) {
        console.error('Error in checkPaymentStatus:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Lấy lịch sử giao dịch của user
export const getUserPayments = async (req, res) => {
    try {
        const userID = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const result = await momoPaymentService.getUserPayments(userID, parseInt(page), parseInt(limit));
        
        return ResponseHandler.success(res, 'User payments retrieved successfully', result);

    } catch (error) {
        console.error('Error in getUserPayments:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Hủy giao dịch
export const cancelPayment = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userID = req.user._id;

        if (!requestId) {
            return ResponseHandler.badRequest(res, 'Request ID is required');
        }

        const result = await momoPaymentService.cancelPayment(requestId);
        
        // Kiểm tra quyền truy cập
        if (result.payment.userID.toString() !== userID.toString()) {
            return ResponseHandler.unauthorized(res, 'Access denied');
        }

        return ResponseHandler.success(res, 'Payment cancelled successfully', result);

    } catch (error) {
        console.error('Error in cancelPayment:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Simulate MoMo response (cho testing)
export const simulateMoMoResponse = async (req, res) => {
    try {
        const { requestId, resultCode = 0 } = req.body;

        if (!requestId) {
            return ResponseHandler.badRequest(res, 'Request ID is required');
        }

        const result = await momoPaymentService.simulateMoMoResponse(requestId, resultCode);
        
        return ResponseHandler.success(res, 'MoMo response simulated successfully', result);

    } catch (error) {
        console.error('Error in simulateMoMoResponse:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

    // Tạo giao dịch test (không cần authentication)
    export const createTestPayment = async (req, res) => {
        try {
            const { orderID, amount, orderInfo } = req.body;
            
            console.log('🔍 createTestPayment called with:', { orderID, amount, orderInfo });

            // Validation
            if (!orderID || !amount || !orderInfo) {
                return ResponseHandler.badRequest(res, 'Missing required fields: orderID, amount, orderInfo');
            }

            if (amount <= 0) {
                return ResponseHandler.badRequest(res, 'Amount must be greater than 0');
            }

        // Tạo payment trực tiếp không cần Order
        const requestId = `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const testOrderId = new mongoose.Types.ObjectId();
        const testUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
        
        console.log('🔧 Creating test payment with:', {
            requestId,
            testOrderId: testOrderId.toString(),
            testUserId: testUserId.toString(),
            amount,
            orderInfo
        });
        
        try {
            // Tạo MomoPayment với dữ liệu test
            const momoPayment = new MomoPayment({
                orderID: testOrderId, // Sử dụng testOrderId đã tạo, không phải orderID từ request
                userID: testUserId,
                amount,
                partnerCode: 'MOMO',
                requestId,
                orderInfo,
                redirectUrl: 'http://localhost:3000/payment/result',
                ipnUrl: 'http://localhost:8080/api/momo/ipn',
                signature: 'test_signature',
                status: 'PENDING'
            });
            
            console.log('💾 MomoPayment object created:', {
                orderID: momoPayment.orderID,
                userID: momoPayment.userID,
                requestId: momoPayment.requestId
            });
            
            // Lưu vào database
            await momoPayment.save();
            console.log('✅ Test payment saved to database successfully');

            // Tạo payment URL giả
            const paymentUrl = `https://test-payment.momo.vn/v2/gateway/api/create?requestId=${requestId}&amount=${amount}&orderId=${testOrderId}`;
            
            const result = {
                paymentUrl,
                requestId,
                orderId: testOrderId.toString(),
                amount,
                orderInfo
            };
            
            return ResponseHandler.success(res, 'Test payment created successfully', result);
        } catch (dbError) {
            console.error('❌ Database error when saving test payment:', dbError);
            console.error('📋 Error details:', {
                name: dbError.name,
                message: dbError.message,
                code: dbError.code
            });
            
            // Fallback: trả về mock data nếu database có lỗi
            // Không cần lưu vào database cho test
            const paymentUrl = `https://test-payment.momo.vn/v2/gateway/api/create?requestId=${requestId}&amount=${amount}&orderId=${testOrderId}`;
            
            const result = {
                paymentUrl,
                requestId,
                orderId: testOrderId.toString(),
                amount,
                orderInfo,
                note: 'Test payment (mock mode - not saved to database)'
            };
            
            console.log('🔄 Fallback to mock mode with result:', result);
            return ResponseHandler.success(res, 'Test payment created successfully (mock mode)', result);
        }

    } catch (error) {
        console.error('Error in createTestPayment:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Lấy thông tin giao dịch theo ID
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user._id;

        const result = await momoPaymentService.checkPaymentStatus(id);
        
        // Kiểm tra quyền truy cập
        if (result.payment.userID.toString() !== userID.toString()) {
            return ResponseHandler.unauthorized(res, 'Access denied');
        }

        return ResponseHandler.success(res, 'Payment details retrieved successfully', result);

    } catch (error) {
        console.error('Error in getPaymentById:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};

// Webhook endpoint cho IPN (Instant Payment Notification)
export const handleIpn = async (req, res) => {
    try {
        const ipnData = req.body;
        
        console.log('IPN received:', ipnData);

        // Xử lý IPN data
        const result = await momoPaymentService.handleCallback(ipnData);
        
        // Trả về response cho MoMo
        return res.status(200).json({
            resultCode: 0,
            message: 'IPN processed successfully'
        });

    } catch (error) {
        console.error('Error in handleIpn:', error);
        return res.status(500).json({
            resultCode: 1000,
            message: 'IPN processing failed'
        });
    }
};

// Health check endpoint
export const healthCheck = async (req, res) => {
    try {
        return ResponseHandler.success(res, 'MoMo Payment Service is healthy', {
            service: 'MoMo Payment',
            status: 'running',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in healthCheck:', error);
        return ResponseHandler.serverError(res, error.message);
    }
};
