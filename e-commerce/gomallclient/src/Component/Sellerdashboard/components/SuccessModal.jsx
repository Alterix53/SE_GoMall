import React from 'react';

const SuccessModal = ({ isOpen, onClose, message, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 className="success-title">Success!</h3>
          <p className="success-message">{message}</p>
          {productName && (
            <div className="product-info">
              <strong>Product:</strong> {productName}
            </div>
          )}
          <div className="success-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
