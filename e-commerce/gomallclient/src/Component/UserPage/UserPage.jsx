import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserPage.css';
import { Link } from 'react-router-dom';
import UserProfileForm from './UserProfileForm';
import PasswordChangeForm from './PasswordChangeForm';
const UserPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!isAuthenticated()) {
    return (
      <div className="user-page">
        <div className="unauthorized">
          <h2>You need to login to view this page</h2>
                      <p>Please login to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-header">
          <div className="user-avatar">
            <img src="/images/user.png" alt="User Avatar" />
          </div>
          <div className="user-info">
            <h1>Hello, {user?.fullName || user?.username}!</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="user-content">
          <div className="user-section">
            <div className="section-header">
              <h2>Account Information</h2>
              <div className="section-actions">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setShowProfileForm(true)}
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <i className="fas fa-key"></i> Change Password
                </button>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Username:</label>
                <span>{user?.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Full Name:</label>
                <span>{user?.fullName || 'Not updated'}</span>
              </div>
              <div className="info-item">
                <label>Phone Number:</label>
                <span>{user?.phoneNumber || 'Not updated'}</span>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <span>{user?.address || 'Not updated'}</span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{user?.gender ? (user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác') : 'Not updated'}</span>
              </div>
            </div>
          </div>

          <div className="user-section">
            <h2>Order Management</h2>
            <div className="order-stats">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">New Orders</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Processing</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Delivered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
          </div>

          <div className="user-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/cart">
                <div className="action-btn">
                  <i className="fas fa-shopping-cart"></i>
                  View Cart
                </div>
              </Link>

              <button className="action-btn">
                <i className="fas fa-heart"></i>
                Favorite Products
              </button>
              <button className="action-btn">
                <i className="fas fa-box"></i>
                Order History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="modal-overlay" onClick={() => setShowProfileForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                className="modal-close"
                onClick={() => setShowProfileForm(false)}
              >
                ×
              </button>
            </div>
            <UserProfileForm
              onSuccess={(updatedData) => {
                setShowProfileForm(false);
                // Optionally refresh the page or update local state
                window.location.reload();
              }}
              onCancel={() => setShowProfileForm(false)}
            />
          </div>
        </div>
      )}

      {/* Password Change Form Modal */}
      {showPasswordForm && (
        <div className="modal-overlay" onClick={() => setShowPasswordForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordForm(false)}
              >
                ×
              </button>
            </div>
            <PasswordChangeForm
              onSuccess={() => {
                setShowPasswordForm(false);
              }}
              onCancel={() => setShowPasswordForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage; 