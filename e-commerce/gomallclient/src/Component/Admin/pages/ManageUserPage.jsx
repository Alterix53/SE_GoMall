import React, { useState } from "react";

import UserDetailModal from "../UserDetailModal";
import UserSellerListItem from "../UserSellerListItem";

const USERS = [
  {
    id: 1,
    username: "user1",
    email: "user1@email.com",
    phone: "0987654321",
    address: "TP.HCM",
    status: "active",
    avatarUrl: "",
  },
  // ... thêm dữ liệu mẫu
];

function ManageUserPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="container-fluid">
      <h2 className="row text-center" style={{ minWidth: 180 }}>Quản lý thành viên</h2>
      <ul className="list-group">
        {USERS.length === 0 && (
          <li className="list-group-item text-muted">Không có thành viên nào.</li>
        )}
        {USERS.map((user) => (
          <UserSellerListItem
            key={user.id}
            data={user}
            onClick={() => setSelectedUser(user)}
          />
        ))}
      </ul>
      {/* Modal chi tiết thành viên */}
      {selectedUser && (
        <div className="modal show d-block" tabIndex="-1">
          <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}

export default ManageUserPage; 