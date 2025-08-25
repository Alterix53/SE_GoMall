import React, { useEffect, useState } from 'react';
import { getSellerNotifications } from '../../utils/sellerAPI.js';
import './sellerdashboard.css';

const PurchaseNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setStatus('loading');
        setError('');
        const data = await getSellerNotifications();
        setNotifications(Array.isArray(data) ? data : []);
        setStatus('success');
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError(err.message || 'Failed to load notifications');
        setStatus('error');
      }
    };

    loadNotifications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (status === 'loading') {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading purchase notifications...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Error:</strong> {error}
                  <button 
                    className="btn btn-outline-danger btn-sm ms-3"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-redo me-1"></i>
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <i className="fas fa-bell me-2 text-primary"></i>
                <h5 className="card-title mb-0">Purchase Notifications</h5>
                <span className="badge bg-primary ms-2">{notifications.length}</span>
              </div>
            </div>
            <div className="card-body">
              {notifications.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h4>No purchase notifications yet</h4>
                    <p className="text-muted">
                      When customers purchase your products, you'll see notifications here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Buyer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Payment Method</th>
                        <th>Purchase Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notification, index) => (
                        <tr key={index} className="notification-row">
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                <i className="fas fa-user"></i>
                              </div>
                              <span className="fw-medium">{notification.buyerName}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                              {notification.productName}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success">{notification.quantity}</span>
                          </td>
                          <td>
                            <span className={`badge ${
                              notification.paymentMethod === 'MoMo' ? 'bg-pink' :
                              notification.paymentMethod === 'Cash' ? 'bg-success' :
                              notification.paymentMethod === 'Bank Transfer' ? 'bg-info' :
                              'bg-secondary'
                            }`}>
                              {notification.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(notification.createdAt)}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotifications;
