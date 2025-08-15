import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import momoPaymentAPI from '../../utils/momoPaymentAPI.js';
import './MomoPayment.css';

const MomoPayment = ({ orderData, onBack }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(300); // 5 minutes countdown
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [qrLoading, setQrLoading] = useState(true);

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
                        // Timeout - tự động quay về trang chủ
                        console.log('Payment timeout - redirecting to home');
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentStatus, countdown, navigate]);

    // Tạo giao dịch MoMo
    const createMomoPayment = async () => {
        try {
            setLoading(true);
            setError(null);
            setQrLoading(true);

            const orderInfo = `Thanh toan don hang ${orderData.orderNumber || orderData.orderID}`;
            
            console.log('Creating payment with data:', {
                orderID: orderData.orderID,
                amount: orderData.amount,
                orderInfo
            });
            
            const response = await momoPaymentAPI.createPayment(
                orderData.orderID,
                orderData.amount,
                orderInfo
            );

            console.log('Payment creation response:', response);

            if (response.success && response.data) {
                setPaymentData(response.data);
                
                console.log('Payment URL for QR:', response.data.paymentUrl);
                
                // Tạo QR code từ payment URL
                if (response.data.paymentUrl) {
                    try {
                        const qrCodeDataUrl = await QRCode.toDataURL(response.data.paymentUrl, {
                            width: 400,
                            margin: 0,
                            color: {
                                dark: '#000000',
                                light: '#FFFFFF'
                            },
                            errorCorrectionLevel: 'M'
                        });
                        setQrCodeUrl(qrCodeDataUrl);
                        console.log('QR Code generated successfully');
                    } catch (qrError) {
                        console.error('Error generating QR code:', qrError);
                        // Fallback to placeholder
                        setQrCodeUrl('');
                    }
                } else {
                    console.error('No payment URL received');
                    // Tạo QR code test với URL giả
                    try {
                        const testUrl = `https://momo.vn/pay?orderId=${response.data.orderId || orderData.orderID}&amount=${orderData.amount}`;
                        const qrCodeDataUrl = await QRCode.toDataURL(testUrl, {
                            width: 400,
                            margin: 0,
                            color: {
                                dark: '#000000',
                                light: '#FFFFFF'
                            },
                            errorCorrectionLevel: 'M'
                        });
                        setQrCodeUrl(qrCodeDataUrl);
                        console.log('Test QR Code generated successfully');
                    } catch (qrError) {
                        console.error('Error generating test QR code:', qrError);
                        setQrCodeUrl('');
                    }
                }
                
                setQrLoading(false);
                
                // Bắt đầu polling để kiểm tra trạng thái
                if (response.data.requestId) {
                    startStatusPolling(response.data.requestId);
                }
            } else {
                setError('Không thể tạo giao dịch thanh toán');
                setQrLoading(false);
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            setQrLoading(false);
            
            // Kiểm tra lỗi authentication
            if (error.message && error.message.includes('Access token required')) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            } else if (error.message && error.message.includes('401')) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            } else if (error.message && error.message.includes('403')) {
                setError('Không có quyền truy cập. Vui lòng đăng nhập lại!');
            } else {
                // Hiển thị lỗi chi tiết để debug
                const errorMessage = error.message || 'Unknown error';
                console.log('Detailed error:', error);
                setError(`Lỗi: ${errorMessage}. Vui lòng thử lại hoặc liên hệ hỗ trợ!`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Polling để kiểm tra trạng thái giao dịch
    const startStatusPolling = (requestId) => {
        if (!requestId) {
            console.error('No requestId provided for polling');
            return;
        }

        console.log('Starting payment status polling for requestId:', requestId);
        
        const pollInterval = setInterval(async () => {
            try {
                const response = await momoPaymentAPI.checkPaymentStatus(requestId);
                
                console.log('Payment status response:', response);
                
                if (response.success && response.data) {
                    const status = response.data.status || response.data.payment?.status;
                    if (status) {
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
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                // Don't stop polling on error, just log it
            }
        }, 5000); // Check every 5 seconds instead of 3

        // Cleanup interval after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            console.log('Payment status polling stopped after 5 minutes');
        }, 300000);
    };

    // Hủy giao dịch
    const cancelPayment = async () => {
        if (!paymentData?.requestId) {
            // Nếu không có requestId, quay về trang chủ
            navigate('/');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await momoPaymentAPI.cancelPayment(paymentData.requestId);
            console.log('Cancel payment response:', response);
            
            setPaymentStatus('cancelled');
            
            // Chuyển hướng sau 1 giây
            setTimeout(() => {
                navigate('/payment/cancelled', { 
                    state: { 
                        paymentData: response.data || paymentData,
                        orderData 
                    } 
                });
            }, 1000);
            
        } catch (error) {
            console.error('Error cancelling payment:', error);
            
            // Kiểm tra loại lỗi
            if (error.message && error.message.includes('401')) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            } else if (error.message && error.message.includes('404')) {
                setError('Giao dịch không tồn tại hoặc đã được xử lý');
            } else if (error.message && error.message.includes('403')) {
                setError('Không có quyền hủy giao dịch này');
            } else {
                setError('Có lỗi xảy ra khi hủy giao dịch. Vui lòng thử lại!');
            }
            
            // Fallback: quay về trang chủ sau 3 giây nếu có lỗi
            setTimeout(() => {
                navigate('/');
            }, 3000);
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
                        <img src="/images/momo-logo.svg" alt="MoMo" />
                    </div>
                    <h2>Lỗi Thanh Toán</h2>
                    <p>{error}</p>
                    <button 
                        className="momo-btn primary"
                        onClick={onBack}
                    >
                        Quay Lại Checkout
                    </button>
                    
                    {error.includes('đăng nhập') && (
                        <button 
                            className="momo-btn secondary"
                            onClick={() => window.location.href = '/login'}
                            style={{ marginTop: '10px' }}
                        >
                            Đăng Nhập Lại
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (loading && !paymentData) {
        return (
            <div className="momo-payment-container">
                <div className="momo-payment-card loading">
                    <div className="momo-logo">
                        <img src="/images/momo-logo.svg" alt="MoMo" />
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
                        <img src="/images/momo-logo.svg" alt="MoMo" />
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
                        {qrLoading ? (
                            <div className="qr-placeholder">
                                <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
                                <p>Đang tạo mã QR...</p>
                            </div>
                        ) : qrCodeUrl ? (
                            <img 
                                src={qrCodeUrl} 
                                alt="MoMo QR Code" 
                                className="qr-code-image"
                                onError={() => {
                                    console.error('QR code image failed to load');
                                }}
                            />
                        ) : (
                            <div className="qr-placeholder">
                                <div className="qr-placeholder-image">
                                    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="40" y="40" width="320" height="320" fill="white" stroke="#e0e0e0" strokeWidth="8"/>
                                        <rect x="80" y="80" width="60" height="60" fill="#e91e63"/>
                                        <rect x="160" y="80" width="60" height="60" fill="#e91e63"/>
                                        <rect x="240" y="80" width="60" height="60" fill="#e91e63"/>
                                        <rect x="80" y="160" width="60" height="60" fill="#e91e63"/>
                                        <rect x="160" y="160" width="60" height="60" fill="white"/>
                                        <rect x="240" y="160" width="60" height="60" fill="#e91e63"/>
                                        <rect x="80" y="240" width="60" height="60" fill="#e91e63"/>
                                        <rect x="160" y="240" width="60" height="60" fill="#e91e63"/>
                                        <rect x="240" y="240" width="60" height="60" fill="#e91e63"/>
                                        <rect x="110" y="110" width="30" height="30" fill="white"/>
                                        <rect x="190" y="110" width="30" height="30" fill="white"/>
                                        <rect x="110" y="190" width="30" height="30" fill="white"/>
                                        <rect x="190" y="190" width="30" height="30" fill="white"/>
                                    </svg>
                                </div>
                                <p>Không thể tạo mã QR</p>
                                <button 
                                    className="momo-btn primary"
                                    onClick={createMomoPayment}
                                    style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px' }}
                                >
                                    Thử Lại
                                </button>
                            </div>
                        )}
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
                    <button 
                        className="momo-btn primary"
                        onClick={() => navigate('/')}
                        style={{ marginTop: '10px' }}
                    >
                        Quay Về Trang Chủ
                    </button>
                </div>

                <div className="payment-note">
                    <p>💡 Lưu ý: Giao dịch sẽ tự động hủy sau 5 phút nếu không được xử lý</p>
                    <p>🔄 Bạn có thể quay về trang chủ bất cứ lúc nào</p>
                </div>
            </div>
        </div>
    );
};

export default MomoPayment;
