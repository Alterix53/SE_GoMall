import React, { useState, useEffect } from 'react';
import './User.css';

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get user data
    setTimeout(() => {
      const mockUser = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: '/images/avatar.jpg',
        joinDate: '2024-01-15',
        totalOrders: 23,
        totalSpent: 2450.75,
        loyaltyPoints: 1250
      };
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="user-loading">
        <div className="loading-spinner"></div>
        <span>Loading user profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-error">
        <h2>User not found</h2>
        <p>Unable to load user profile</p>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-header">
        <div className="user-avatar">
          <img src={user.avatar} alt={user.username} />
        </div>
        <div className="user-info">
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="username">@{user.username}</p>
          <p className="email">{user.email}</p>
          <p className="join-date">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{user.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${user.totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{user.loyaltyPoints}</h3>
            <p>Loyalty Points</p>
          </div>
        </div>
      </div>

      <div className="user-sections">
        <div className="section">
          <h2>Recent Orders</h2>
          <div className="order-list">
            <div className="order-item">
              <div className="order-info">
                <h4>Order #12345</h4>
                <p>iPhone 15 Pro Max</p>
                <span className="order-date">March 15, 2024</span>
              </div>
              <div className="order-status delivered">Delivered</div>
            </div>
            
            <div className="order-item">
              <div className="order-info">
                <h4>Order #12344</h4>
                <p>MacBook Pro 16-inch M3 Max</p>
                <span className="order-date">March 10, 2024</span>
              </div>
              <div className="order-status processing">Processing</div>
            </div>
            
            <div className="order-item">
              <div className="order-info">
                <h4>Order #12343</h4>
                <p>Samsung Galaxy S24 Ultra</p>
                <span className="order-date">March 5, 2024</span>
              </div>
              <div className="order-status delivered">Delivered</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Account Settings</h2>
          <div className="settings-list">
            <button className="setting-btn">
              <span className="setting-icon">👤</span>
              Edit Profile
            </button>
            <button className="setting-btn">
              <span className="setting-icon">🔒</span>
              Change Password
            </button>
            <button className="setting-btn">
              <span className="setting-icon">📍</span>
              Manage Addresses
            </button>
            <button className="setting-btn">
              <span className="setting-icon">💳</span>
              Payment Methods
            </button>
            <button className="setting-btn">
              <span className="setting-icon">🔔</span>
              Notification Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
