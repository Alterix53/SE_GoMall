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
  {
    id: 2,
    username: "user2",
    email: "user2@email.com",
    phone: "0911222333",
    address: "Hà Nội",
    status: "banned",
    avatarUrl: "",
  },
  {
    id: 3,
    username: "user3",
    email: "user3@email.com",
    phone: "0909090909",
    address: "Đà Nẵng",
    status: "pending",
    avatarUrl: "",
  },
  {
    id: 4,
    username: "user4",
    email: "user4@email.com",
    phone: "0933444555",
    address: "Cần Thơ",
    status: "active",
    avatarUrl: "",
  },
  {
    id: 5,
    username: "user5",
    email: "user5@email.com",
    phone: "0977666888",
    address: "Hải Phòng",
    status: "reported",
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