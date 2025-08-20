import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import momoPaymentAPI from '../../utils/momoPaymentAPI.js';
import './PaymentHistory.css';

const PaymentHistory = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        loadPayments();
    }, [pagination.page]);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const response = await momoPaymentAPI.getUserPayments(pagination.page, pagination.limit);
            
            if (response.success) {
                setPayments(response.data.payments);
                setPagination(response.data.pagination);
            } else {
                setError('Cannot load payment history');
            }
        } catch (error) {
            console.error('Error loading payments:', error);
            setError('An error occurred while loading payment history');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
                    'PENDING': { text: 'Pending', class: 'pending' },
        'PROCESSING': { text: 'Processing', class: 'processing' },
        'SUCCESS': { text: 'Success', class: 'success' },
        'FAILED': { text: 'Failed', class: 'failed' },
        'CANCELLED': { text: 'Cancelled', class: 'cancelled' }
        };

        const config = statusConfig[status] || { text: status, class: 'unknown' };
        
        return (
            <span className={`status-badge ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const refreshPayments = () => {
        loadPayments();
    };

    if (loading && payments.length === 0) {
        return (
            <div className="payment-history-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading payment history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-history-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-btn"
                        onClick={refreshPayments}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-container">
            <div className="payment-history-header">
                <h1>MoMo Payment History</h1>
                <button 
                    className="refresh-btn"
                    onClick={refreshPayments}
                    disabled={loading}
                >
                    🔄 Refresh
                </button>
            </div>

            {payments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📱</div>
                    <h3>No transactions yet</h3>
                    <p>You haven't made any MoMo payment transactions yet</p>
                    <button 
                        className="primary-btn"
                        onClick={() => navigate('/')}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="payments-list">
                        {payments.map((payment) => (
                            <div key={payment._id} className="payment-item">
                                <div className="payment-header">
                                    <div className="payment-id">
                                        <span className="label">Transaction ID:</span>
                                        <span className="value">{payment.requestId}</span>
                                    </div>
                                    {getStatusBadge(payment.status)}
                                </div>

                                <div className="payment-details">
                                    <div className="detail-row">
                                        <span className="label">Order:</span>
                                        <span className="value">
                                            {payment.orderID?.orderNumber || payment.orderID?._id || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Amount:</span>
                                        <span className="value amount">
                                            {formatAmount(payment.amount)}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Time:</span>
                                        <span className="value">
                                            {formatDate(payment.createdAt)}
                                        </span>
                                    </div>
                                    {payment.transId && (
                                        <div className="detail-row">
                                            <span className="label">MoMo Code:</span>
                                            <span className="value">{payment.transId}</span>
                                        </div>
                                    )}
                                    {payment.message && (
                                        <div className="detail-row">
                                            <span className="label">Note:</span>
                                            <span className="value">{payment.message}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="payment-actions">
                                    <button 
                                        className="view-btn"
                                        onClick={() => navigate(`/payment/${payment._id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button 
                                className="page-btn"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                            >
                                ← Previous
                            </button>
                            
                            <span className="page-info">
                                Trang {pagination.page} / {pagination.pages}
                            </span>
                            
                            <button 
                                className="page-btn"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                            >
                                Sau →
                            </button>
                        </div>
                    )}

                    <div className="summary-info">
                        <p>Total: <strong>{pagination.total}</strong> transactions</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentHistory;
