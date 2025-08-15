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
                setError('Không thể tải lịch sử giao dịch');
            }
        } catch (error) {
            console.error('Error loading payments:', error);
            setError('Có lỗi xảy ra khi tải lịch sử giao dịch');
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
            'PENDING': { text: 'Chờ xử lý', class: 'pending' },
            'PROCESSING': { text: 'Đang xử lý', class: 'processing' },
            'SUCCESS': { text: 'Thành công', class: 'success' },
            'FAILED': { text: 'Thất bại', class: 'failed' },
            'CANCELLED': { text: 'Đã hủy', class: 'cancelled' }
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
                    <p>Đang tải lịch sử giao dịch...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-history-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Lỗi</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-btn"
                        onClick={refreshPayments}
                    >
                        Thử Lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-container">
            <div className="payment-history-header">
                <h1>Lịch Sử Giao Dịch MoMo</h1>
                <button 
                    className="refresh-btn"
                    onClick={refreshPayments}
                    disabled={loading}
                >
                    🔄 Làm Mới
                </button>
            </div>

            {payments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📱</div>
                    <h3>Chưa có giao dịch nào</h3>
                    <p>Bạn chưa thực hiện giao dịch thanh toán nào qua MoMo</p>
                    <button 
                        className="primary-btn"
                        onClick={() => navigate('/')}
                    >
                        Bắt Đầu Mua Sắm
                    </button>
                </div>
            ) : (
                <>
                    <div className="payments-list">
                        {payments.map((payment) => (
                            <div key={payment._id} className="payment-item">
                                <div className="payment-header">
                                    <div className="payment-id">
                                        <span className="label">Mã GD:</span>
                                        <span className="value">{payment.requestId}</span>
                                    </div>
                                    {getStatusBadge(payment.status)}
                                </div>

                                <div className="payment-details">
                                    <div className="detail-row">
                                        <span className="label">Đơn hàng:</span>
                                        <span className="value">
                                            {payment.orderID?.orderNumber || payment.orderID?._id || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Số tiền:</span>
                                        <span className="value amount">
                                            {formatAmount(payment.amount)}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Thời gian:</span>
                                        <span className="value">
                                            {formatDate(payment.createdAt)}
                                        </span>
                                    </div>
                                    {payment.transId && (
                                        <div className="detail-row">
                                            <span className="label">Mã MoMo:</span>
                                            <span className="value">{payment.transId}</span>
                                        </div>
                                    )}
                                    {payment.message && (
                                        <div className="detail-row">
                                            <span className="label">Ghi chú:</span>
                                            <span className="value">{payment.message}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="payment-actions">
                                    <button 
                                        className="view-btn"
                                        onClick={() => navigate(`/payment/${payment._id}`)}
                                    >
                                        Xem Chi Tiết
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
                                ← Trước
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
                        <p>Tổng cộng: <strong>{pagination.total}</strong> giao dịch</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentHistory;
