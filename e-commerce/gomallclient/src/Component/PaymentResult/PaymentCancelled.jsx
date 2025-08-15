import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentResult.css';

const PaymentCancelled = () => {
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
        <div className="payment-result-container cancelled">
            <div className="payment-result-card">
                <div className="result-icon">
                    <div className="cancelled-icon">⏹️</div>
                </div>
                
                <h1>Giao Dịch Đã Bị Hủy</h1>
                <p className="result-message">
                    Giao dịch thanh toán của bạn đã được hủy.
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
                        <span>{formatDate(paymentData?.updatedAt || new Date())}</span>
                    </div>
                    <div className="detail-row">
                        <span>Trạng thái:</span>
                        <span>Đã hủy</span>
                    </div>
                </div>

                <div className="cancellation-info">
                    <h3>Thông tin hủy giao dịch:</h3>
                    <ul>
                        <li>Giao dịch đã được hủy thành công</li>
                        <li>Đơn hàng của bạn vẫn được giữ nguyên</li>
                        <li>Bạn có thể thực hiện thanh toán lại bất cứ lúc nào</li>
                        <li>Không có phí phát sinh khi hủy giao dịch</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button 
                        className="result-btn primary"
                        onClick={() => navigate('/cart')}
                    >
                        Thanh Toán Lại
                    </button>
                    <button 
                        className="result-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        Tiếp Tục Mua Sắm
                    </button>
                </div>

                <div className="support-info">
                    <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ:</p>
                    <p>📧 support@gomall.com | 📞 1900-1234</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
