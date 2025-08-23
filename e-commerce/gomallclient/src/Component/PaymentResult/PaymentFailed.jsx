import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
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
        <>
            <Header />
            <div className="payment-result-container failed">
                <div className="payment-result-card">
                <div className="result-icon">
                    <div className="failed-icon">❌</div>
                </div>
                
                <h1>Payment Failed</h1>
                <p className="result-message">
                    Sorry, your payment transaction was not successful.
                </p>

                <div className="payment-details">
                    <div className="detail-row">
                        <span>Transaction ID:</span>
                        <span>{paymentData?.transId || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Order ID:</span>
                        <span>{orderData?.orderNumber || orderData?.orderID}</span>
                    </div>
                    <div className="detail-row">
                        <span>Amount:</span>
                        <span className="amount">{formatAmount(orderData?.amount)}</span>
                    </div>
                    <div className="detail-row">
                        <span>Time:</span>
                        <span>{formatDate(paymentData?.responseTime || new Date())}</span>
                    </div>
                    <div className="detail-row">
                        <span>Reason:</span>
                        <span>{paymentData?.message || 'Unknown'}</span>
                    </div>
                </div>

                <div className="troubleshooting">
                    <h3>Possible reasons:</h3>
                    <ul>
                        <li>Insufficient MoMo wallet balance</li>
                        <li>Incorrect account information</li>
                        <li>Unstable internet connection</li>
                        <li>MoMo app experiencing issues</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button 
                        className="result-btn primary"
                        onClick={() => navigate('/cart')}
                    >
                        Try Payment Again
                    </button>
                    <button 
                        className="result-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="support-info">
                    <p>If the problem persists, please contact:</p>
                    <p>📧 support@gomall.com | 📞 1900-1234</p>
                </div>
                </div>
            </div>
        </>
    );
};

export default PaymentFailed;
