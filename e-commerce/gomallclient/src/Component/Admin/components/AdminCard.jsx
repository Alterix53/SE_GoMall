import React from 'react';
import PropTypes from 'prop-types';
import './AdminCard.css';

const AdminCard = ({ 
  title, 
  children, 
  className = '', 
  headerActions,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data available'
}) => {
  return (
    <div className={`admin-card ${className}`}>
      {title && (
        <div className="admin-card-header">
          <h3 className="admin-card-title">{title}</h3>
          {headerActions && (
            <div className="admin-card-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="admin-card-body">
        {loading && (
          <div className="admin-card-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="admin-card-error">
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        )}
        
        {empty && !loading && !error && (
          <div className="admin-card-empty">
            <div className="empty-state">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">{emptyMessage}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && !empty && children}
      </div>
    </div>
  );
};

AdminCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  headerActions: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.string,
  empty: PropTypes.bool,
  emptyMessage: PropTypes.string
};

export default AdminCard;
