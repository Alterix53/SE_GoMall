import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import momoPaymentAPI from '../../utils/momoPaymentAPI.js';
import './MomoPayment.css';

const MomoPayment = ({ orderData, onBack }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(300); // 5 minutes countdown

    // Use orderData from props instead of location state

    useEffect(() => {
        if (!orderData.orderID || !orderData.amount) {
            setError('Thông tin đơn hàng không hợp lệ');
            return;
        }

        createMomoPayment();
    }, []);

    useEffect(() => {
        let interval;
        if (paymentStatus === 'pending' && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        // Timeout - cancel payment
                        cancelPayment();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentStatus, countdown]);

    // Tạo giao dịch MoMo
    const createMomoPayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const orderInfo = `Thanh toan don hang ${orderData.orderNumber || orderData.orderID}`;
            
            const response = await momoPaymentAPI.createPayment(
                orderData.orderID,
                orderData.amount,
                orderInfo
            );

            if (response.success) {
                setPaymentData(response.data);
                // Bắt đầu polling để kiểm tra trạng thái
                startStatusPolling(response.data.requestId);
            } else {
                setError('Không thể tạo giao dịch thanh toán');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            setError('Có lỗi xảy ra khi tạo giao dịch thanh toán');
        } finally {
            setLoading(false);
        }
    };

    // Polling để kiểm tra trạng thái giao dịch
    const startStatusPolling = (requestId) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await momoPaymentAPI.checkPaymentStatus(requestId);
                
                if (response.success) {
                    const status = response.data.status;
                    setPaymentStatus(status.toLowerCase());
                    
                    if (status === 'SUCCESS' || status === 'FAILED' || status === 'CANCELLED') {
                        clearInterval(pollInterval);
                        
                        if (status === 'SUCCESS') {
                            // Redirect to success page
                            setTimeout(() => {
                                navigate('/payment/success', { 
                                    state: { 
                                        paymentData: response.data,
                                        orderData 
                                    } 
                                });
                            }, 2000);
                        } else if (status === 'FAILED') {
                            // Redirect to failed page
                            setTimeout(() => {
                                navigate('/payment/failed', { 
                                    state: { 
                                        paymentData: response.data,
                                        orderData 
                                    } 
                                });
                            }, 2000);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 3000); // Check every 3 seconds

        // Cleanup interval after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
        }, 300000);
    };

    // Hủy giao dịch
    const cancelPayment = async () => {
        if (!paymentData?.requestId) return;

        try {
            setLoading(true);
            await momoPaymentAPI.cancelPayment(paymentData.requestId);
            setPaymentStatus('cancelled');
            
            setTimeout(() => {
                navigate('/payment/cancelled', { 
                    state: { 
                        paymentData,
                        orderData 
                    } 
                });
            }, 2000);
        } catch (error) {
            console.error('Error cancelling payment:', error);
            setError('Có lỗi xảy ra khi hủy giao dịch');
        } finally {
            setLoading(false);
        }
    };

    // Simulate payment (cho testing)
    const simulatePayment = async (resultCode = 0) => {
        if (!paymentData?.requestId) return;

        try {
            setLoading(true);
            await momoPaymentAPI.simulateResponse(paymentData.requestId, resultCode);
        } catch (error) {
            console.error('Error simulating payment:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format amount
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format countdown
    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (error) {
        return (
            <div className="momo-payment-container">
                <div className="momo-payment-card error">
                    <div className="momo-logo">
                        <img src="/images/momo-logo.png" alt="MoMo" />
                    </div>
                    <h2>Lỗi Thanh Toán</h2>
                    <p>{error}</p>
                    <button 
                        className="momo-btn primary"
                        onClick={onBack}
                    >
                        Quay Lại Checkout
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !paymentData) {
        return (
            <div className="momo-payment-container">
                <div className="momo-payment-card loading">
                    <div className="momo-logo">
                        <img src="/images/momo-logo.png" alt="MoMo" />
                    </div>
                    <div className="loading-spinner"></div>
                    <p>Đang tạo giao dịch thanh toán...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="momo-payment-container">
            <div className="momo-payment-card">
                <div className="momo-header">
                    <div className="momo-logo">
                        <img src="/images/momo-logo.png" alt="MoMo" />
                    </div>
                    <h2>Thanh Toán MoMo</h2>
                </div>

                <div className="payment-info">
                    <div className="info-row">
                        <span>Mã đơn hàng:</span>
                        <span>{orderData.orderNumber || orderData.orderID}</span>
                    </div>
                    <div className="info-row">
                        <span>Số tiền:</span>
                        <span className="amount">{formatAmount(orderData.amount)}</span>
                    </div>
                    <div className="info-row">
                        <span>Thời gian:</span>
                        <span className="countdown">{formatCountdown(countdown)}</span>
                    </div>
                </div>

                <div className="qr-section">
                    <div className="qr-code">
                        <div className="qr-placeholder">
                            <div className="qr-icon">📱</div>
                            <p>Quét mã QR bằng ứng dụng MoMo</p>
                        </div>
                    </div>
                    <p className="qr-instruction">
                        Mở ứng dụng MoMo và quét mã QR để thanh toán
                    </p>
                </div>

                <div className="payment-status">
                    <div className={`status-indicator ${paymentStatus}`}>
                        {paymentStatus === 'pending' && 'Đang chờ thanh toán...'}
                        {paymentStatus === 'processing' && 'Đang xử lý...'}
                        {paymentStatus === 'success' && 'Thanh toán thành công!'}
                        {paymentStatus === 'failed' && 'Thanh toán thất bại'}
                        {paymentStatus === 'cancelled' && 'Đã hủy giao dịch'}
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className="momo-btn secondary"
                        onClick={cancelPayment}
                        disabled={loading || paymentStatus !== 'pending'}
                    >
                        Hủy Giao Dịch
                    </button>
                    
                    {/* Testing buttons - remove in production */}
                    <div className="testing-buttons">
                        <button 
                            className="momo-btn test success"
                            onClick={() => simulatePayment(0)}
                            disabled={loading}
                        >
                            Simulate Success
                        </button>
                        <button 
                            className="momo-btn test failed"
                            onClick={() => simulatePayment(1000)}
                            disabled={loading}
                        >
                            Simulate Failed
                        </button>
                    </div>
                </div>

                <div className="payment-note">
                    <p>💡 Lưu ý: Giao dịch sẽ tự động hủy sau 5 phút nếu không được xử lý</p>
                </div>
            </div>
        </div>
    );
};

export default MomoPayment;
