import React from 'react';
import './CartSuccessModal.css';

const CartSuccessModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-success-modal-overlay" onClick={onClose}>
      <div className="cart-success-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-success-modal-header">
          <div className="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <button className="cart-success-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="cart-success-modal-body">
          <h3 className="cart-success-title">Product Added Successfully!</h3>
          <p className="cart-success-message">The product has been added to your cart.</p>
        </div>
        
        <div className="cart-success-modal-footer">
          <button className="cart-success-btn continue-shopping" onClick={onClose}>
            Continue Shopping
          </button>
          <button className="cart-success-btn view-cart" onClick={() => {
            onClose();
            window.location.href = '/cart';
          }}>
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSuccessModal;
