import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentResult.css';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentData, orderData } = location.state || {};

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="payment-result-container failed">
            <div className="payment-result-card">
                <div className="result-icon">
                    <div className="failed-icon">❌</div>
                </div>
                
                <h1>Thanh Toán Thất Bại</h1>
                <p className="result-message">
                    Rất tiếc, giao dịch thanh toán của bạn không thành công.
                </p>

                <div className="payment-details">
                    <div className="detail-row">
                        <span>Mã giao dịch:</span>
                        <span>{paymentData?.transId || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Mã đơn hàng:</span>
                        <span>{orderData?.orderNumber || orderData?.orderID}</span>
                    </div>
                    <div className="detail-row">
                        <span>Số tiền:</span>
                        <span className="amount">{formatAmount(orderData?.amount)}</span>
                    </div>
                    <div className="detail-row">
                        <span>Thời gian:</span>
                        <span>{formatDate(paymentData?.responseTime || new Date())}</span>
                    </div>
                    <div className="detail-row">
                        <span>Lý do:</span>
                        <span>{paymentData?.message || 'Không xác định'}</span>
                    </div>
                </div>

                <div className="troubleshooting">
                    <h3>Có thể do các nguyên nhân sau:</h3>
                    <ul>
                        <li>Số dư tài khoản MoMo không đủ</li>
                        <li>Thông tin tài khoản không chính xác</li>
                        <li>Mạng internet không ổn định</li>
                        <li>Ứng dụng MoMo gặp sự cố</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button 
                        className="result-btn primary"
                        onClick={() => navigate('/cart')}
                    >
                        Thử Lại Thanh Toán
                    </button>
                    <button 
                        className="result-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        Tiếp Tục Mua Sắm
                    </button>
                </div>

                <div className="support-info">
                    <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ:</p>
                    <p>📧 support@gomall.com | 📞 1900-1234</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
