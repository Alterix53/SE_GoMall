import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "./HeaderNavAdmin.css";

function HeaderNavAdmin() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { logoutWithNavigation } = useAuth();

  const handleLogout = async () => {
    setShowModal(false);
    try {
      const result = await logoutWithNavigation(navigate, true); // true for admin logout
      if (!result.success) {
        console.warn('Logout warning:', result.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force navigation to admin login
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <>
      <header className="admin-header-nav">
        <div className="admin-header-left">
          <span className="admin-title">Admin Dashboard</span>
        </div>
        <div className="admin-header-right">
          <button className="admin-bell-btn" title="Notifications">
            <i className="fas fa-bell"></i>
            <span className="admin-badge">3</span>
          </button>
          <div className="admin-account-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-user-circle"></i>
            <span>Account</span>
          </div>
        </div>
      </header>
      
      {/* Account Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h5>
                <i className="fas fa-user-circle me-2"></i>
                Account Settings
              </h5>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-account-info mb-3">
                <div className="admin-account-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="admin-account-details">
                  <h6 className="mb-1">Administrator</h6>
                  <small className="text-muted">System Administrator</small>
                </div>
              </div>
              <hr />
              <div className="admin-account-actions">
                <button 
                  className="btn btn-outline-secondary w-100 mb-2" 
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </button>
                <button 
                  className="btn btn-outline-danger w-100" 
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderNavAdmin; 