import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentResult.css';

const PaymentSuccess = () => {
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
        <div className="payment-result-container success">
            <div className="payment-result-card">
                <div className="result-icon">
                    <div className="success-icon">✅</div>
                </div>
                
                <h1>Thanh Toán Thành Công!</h1>
                <p className="result-message">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
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
                        <span>Phương thức:</span>
                        <span>MoMo Wallet</span>
                    </div>
                </div>

                <div className="next-steps">
                    <h3>Bước tiếp theo:</h3>
                    <ul>
                        <li>Chúng tôi sẽ gửi email xác nhận đến địa chỉ email của bạn</li>
                        <li>Đơn hàng sẽ được xử lý trong 1-2 ngày làm việc</li>
                        <li>Bạn sẽ nhận được thông báo khi đơn hàng được giao</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button 
                        className="result-btn primary"
                        onClick={() => navigate('/orders')}
                    >
                        Xem Đơn Hàng
                    </button>
                    <button 
                        className="result-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        Tiếp Tục Mua Sắm
                    </button>
                </div>

                <div className="support-info">
                    <p>Nếu bạn có câu hỏi, vui lòng liên hệ:</p>
                    <p>📧 support@gomall.com | 📞 1900-1234</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
