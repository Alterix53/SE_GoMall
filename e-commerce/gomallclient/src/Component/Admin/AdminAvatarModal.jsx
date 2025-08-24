import React, { useState } from "react";
import { AdminModal } from './index';

function AdminAvatarModal({ avatarUrl }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={avatarUrl}
        alt="Admin Avatar"
        className="rounded-circle"
        style={{ width: 40, height: 40, cursor: 'pointer', objectFit: 'cover' }}
        onClick={() => setShowModal(true)}
      />
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Account"
        size="sm"
      >
        <button className="btn btn-outline-danger w-100">Log out</button>
      </AdminModal>
    </>
  );
}

export default AdminAvatarModal; 