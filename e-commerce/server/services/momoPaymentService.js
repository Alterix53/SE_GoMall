import crypto from 'crypto';
import MomoPayment from '../models/MomoPayment.js';
import Order from '../models/Order.js';

class MomoPaymentService {
    constructor() {
        // MoMo API Configuration (Mock)
        this.config = {
            partnerCode: 'MOMO',
            accessKey: 'iPXneGmrYHP',
            secretKey: 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
            endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
            ipnUrl: 'http://localhost:8080/api/momo/ipn',
            redirectUrl: 'http://localhost:3000/payment/result'
        };
    }

    // Tạo signature cho request
    createSignature(data) {
        const rawSignature = `accessKey=${data.accessKey}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
        return crypto.createHmac('sha256', this.config.secretKey).update(rawSignature).digest('hex');
    }

    // Tạo giao dịch mới
    async createPayment(orderID, userID, amount, orderInfo) {
        try {
            // Kiểm tra order tồn tại
            const order = await Order.findById(orderID);
            if (!order) {
                throw new Error('Order not found');
            }

            // Tạo request data
            const requestId = `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const orderId = order.orderNumber || orderID.toString();
            const extraData = '';

            const requestData = {
                partnerCode: this.config.partnerCode,
                partnerName: 'GoMall',
                storeId: 'GoMall Store',
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: this.config.redirectUrl,
                ipnUrl: this.config.ipnUrl,
                lang: 'vi',
                requestType: 'captureWallet',
                extraData: extraData,
                accessKey: this.config.accessKey
            };

            // Tạo signature
            const signature = this.createSignature(requestData);

            // Lưu payment vào database
            const momoPayment = new MomoPayment({
                orderID,
                userID,
                amount,
                partnerCode: this.config.partnerCode,
                requestId,
                orderInfo,
                redirectUrl: this.config.redirectUrl,
                ipnUrl: this.config.ipnUrl,
                signature,
                status: 'PENDING'
            });

            await momoPayment.save();

            const paymentUrl = `${this.config.endpoint}?${new URLSearchParams({
                ...requestData,
                signature
            }).toString()}`;

            console.log('Created MoMo payment:', {
                requestId,
                orderId,
                amount,
                paymentUrl: paymentUrl.substring(0, 100) + '...'
            });

            // Trả về data cho frontend
            return {
                paymentUrl,
                requestId,
                orderId: order._id.toString(),
                amount,
                orderInfo
            };

        } catch (error) {
            console.error('Error creating MoMo payment:', error);
            throw error;
        }
    }

    // Xử lý callback từ MoMo
    async handleCallback(callbackData) {
        try {
            const { 
                partnerCode, 
                orderId, 
                requestId, 
                amount, 
                orderInfo, 
                orderType, 
                transId, 
                resultCode, 
                message, 
                payType, 
                signature, 
                extraData 
            } = callbackData;

            // Tìm payment record
            const payment = await MomoPayment.findOne({ requestId });
            if (!payment) {
                throw new Error('Payment not found');
            }

            // Cập nhật thông tin giao dịch
            payment.transId = transId;
            payment.resultCode = resultCode;
            payment.message = message;
            payment.responseTime = new Date();
            payment.extraData = extraData;

            // Xử lý kết quả
            if (resultCode === 0) {
                // Thành công
                payment.status = 'SUCCESS';
                
                // Cập nhật order status
                await Order.findByIdAndUpdate(payment.orderID, { 
                    status: 'Processing',
                    paymentStatus: 'Paid'
                });

            } else if (resultCode === 1000) {
                // Thất bại
                payment.status = 'FAILED';
                
                // Cập nhật order status
                await Order.findByIdAndUpdate(payment.orderID, { 
                    status: 'Cancelled',
                    paymentStatus: 'Failed'
                });

            } else if (resultCode === 1001) {
                // Đang xử lý
                payment.status = 'PROCESSING';
            }

            await payment.save();

            return {
                success: true,
                payment,
                resultCode,
                message
            };

        } catch (error) {
            console.error('Error handling MoMo callback:', error);
            throw error;
        }
    }

    // Kiểm tra trạng thái giao dịch
    async checkPaymentStatus(requestId) {
        try {
            const payment = await MomoPayment.findOne({ requestId });
            if (!payment) {
                throw new Error('Payment not found');
            }

            return {
                success: true,
                payment,
                status: payment.status,
                resultCode: payment.resultCode,
                message: payment.message
            };

        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    }

    // Lấy lịch sử giao dịch của user
    async getUserPayments(userID, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            const payments = await MomoPayment.find({ userID })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('orderID', 'orderNumber total status');

            const total = await MomoPayment.countDocuments({ userID });

            return {
                success: true,
                payments,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };

        } catch (error) {
            console.error('Error getting user payments:', error);
            throw error;
        }
    }

    // Hủy giao dịch
    async cancelPayment(requestId) {
        try {
            const payment = await MomoPayment.findOne({ requestId });
            if (!payment) {
                throw new Error('Payment not found');
            }

            if (payment.status !== 'PENDING') {
                throw new Error('Payment cannot be cancelled');
            }

            payment.status = 'CANCELLED';
            payment.resultCode = 1000;
            payment.message = 'Payment cancelled by user';
            await payment.save();

            // Cập nhật order status
            await Order.findByIdAndUpdate(payment.orderID, { 
                status: 'Cancelled',
                paymentStatus: 'Cancelled'
            });

            return {
                success: true,
                payment
            };

        } catch (error) {
            console.error('Error cancelling payment:', error);
            throw error;
        }
    }

    // Mock function để simulate MoMo response (cho testing)
    async simulateMoMoResponse(requestId, resultCode = 0) {
        try {
            const payment = await MomoPayment.findOne({ requestId });
            if (!payment) {
                throw new Error('Payment not found');
            }

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockCallbackData = {
                partnerCode: this.config.partnerCode,
                orderId: payment.orderID.toString(),
                requestId: payment.requestId,
                amount: payment.amount,
                orderInfo: payment.orderInfo,
                orderType: 'momo_wallet',
                transId: `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                resultCode: resultCode,
                message: resultCode === 0 ? 'Success' : 'Failed',
                payType: 'qr',
                signature: payment.signature,
                extraData: ''
            };

            return await this.handleCallback(mockCallbackData);

        } catch (error) {
            console.error('Error simulating MoMo response:', error);
            throw error;
        }
    }
}

export default new MomoPaymentService();
