import React from "react";
import { AdminModal } from './index';

function UserDetailModal({ user, onClose }) {
  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title="User Information"
      size="lg"
    >
            <div className="row align-items-center mb-3">
              {/* User avatar */}
              <div className="col-md-3 text-center">
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt="User avatar"
                  className="img-fluid rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
              {/* Basic information */}
              <div className="col-md-9">
                <h4>Username: {user.username}</h4>
              </div>
            </div>
            {/* Detailed information */}
            <div className="row">
              <div className="col-12">
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                <p><strong>Full Name:</strong> {user.fullName || 'N/A'}</p>
                <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
                <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
                <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </AdminModal>
  );
}

export default UserDetailModal; 