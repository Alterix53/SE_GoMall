import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
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
        <>
            <div className="payment-result-container success">
                <div className="payment-result-card">
                <div className="result-icon">
                    <div className="success-icon">✅</div>
                </div>
                
                <h1>Payment Successful!</h1>
                <p className="result-message">
                    Thank you for your purchase. Your order has been confirmed.
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
                        <span>Payment Method:</span>
                        <span>MoMo Wallet</span>
                    </div>
                </div>

                <div className="next-steps">
                    <h3>Next Steps:</h3>
                    <ul>
                        <li>We will send a confirmation email to your email address</li>
                        <li>Your order will be processed within 1-2 business days</li>
                        <li>You will receive a notification when your order is delivered</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button 
                        className="result-btn primary"
                        onClick={() => navigate('/orders')}
                    >
                        View Orders
                    </button>
                    <button 
                        className="result-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="support-info">
                    <p>If you have any questions, please contact:</p>
                    <p>📧 support@gomall.com | 📞 1900-1234</p>
                </div>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;
