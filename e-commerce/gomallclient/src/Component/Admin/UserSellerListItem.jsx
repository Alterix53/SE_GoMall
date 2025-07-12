import React from "react";

function UserSellerListItem({ data, onClick }) {
  return (
    <li
      className="list-group-item d-flex align-items-center"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <img
        src={data.avatarUrl || "/default-avatar.png"}
        alt="avatar"
        className="rounded-circle me-3"
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
      <div>
        <div className="fw-bold">{data.username}</div>
        {data.businessName && (
          <div className="text-secondary">{data.businessName}</div>
        )}
      </div>
      {data.status && (
        <span className="ms-auto badge bg-secondary">{data.status}</span>
      )}
    </li>
  );
}

export default UserSellerListItem; 