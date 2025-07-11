import React from "react";

function AdminAvatarModal({ avatarUrl }) {
  return (
    <>
      <img
        src={avatarUrl}
        alt="Admin Avatar"
        className="rounded-circle"
        style={{ width: 40, height: 40, cursor: 'pointer', objectFit: 'cover' }}
        data-bs-toggle="modal"
        data-bs-target="#adminModal"
      />
      <div className="modal fade" id="adminModal" tabIndex="-1" aria-labelledby="adminModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-end">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="adminModalLabel">Account</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
            </div>
            <div className="modal-body">
              <button className="btn btn-outline-danger w-100">Log out</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminAvatarModal; 