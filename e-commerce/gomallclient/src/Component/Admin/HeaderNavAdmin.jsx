import React, { useState } from "react";
import "./HeaderNavAdmin.css";

function HeaderNavAdmin() {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    // TODO: Thêm logic đăng xuất thực tế nếu cần
    setShowModal(false);
    // window.location.href = "/login"; // hoặc chuyển hướng nếu muốn
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
          <div className="admin-avatar" onClick={() => setShowModal(true)} style={{cursor: 'pointer'}}>
            <img src="/images/user.png" alt="Admin Avatar" />
          </div>
        </div>
      </header>
      {/* Modal đăng xuất */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h5>Account</h5>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <button className="btn btn-outline-danger w-100" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderNavAdmin; 