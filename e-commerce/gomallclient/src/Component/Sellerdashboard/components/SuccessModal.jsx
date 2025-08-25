import React, { useEffect } from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, message, productName, mode = 'create' }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    return mode === 'create' ? 'fas fa-plus-circle' : 'fas fa-check-circle';
  };

  const getTitle = () => {
    return mode === 'create' ? 'Product Created Successfully!' : 'Product Updated Successfully!';
  };

  const getSubtitle = () => {
    return mode === 'create' 
      ? 'Your product has been added to the system and is now available for customers.'
      : 'Your product has been updated and changes are now live.';
  };

  return (
    <div className="modal-overlay success-modal-overlay" onClick={onClose}>
      <div className="modal-content success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal">
          <div className="success-icon-container">
            <div className="success-icon">
              <i className={getIcon()}></i>
            </div>
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          
          <h3 className="success-title">{getTitle()}</h3>
          <p className="success-subtitle">{getSubtitle()}</p>
          <p className="success-message">{message}</p>
          
          {productName && (
            <div className="product-info">
              <div className="product-name">
                <i className="fas fa-box me-2"></i>
                <strong>{productName}</strong>
              </div>
            </div>
          )}
          
          <div className="success-actions">
            <button className="btn btn-success btn-lg" onClick={onClose}>
              <i className="fas fa-check me-2"></i>
              Continue
            </button>
          </div>
          
          <div className="success-footer">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              This modal will auto-close in 5 seconds
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
