import React, { useState, useEffect } from "react";
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

const USERS_PER_PAGE = 10;

function ManageUserPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc user theo username
  const filteredUsers = USERS.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Tính toán paging
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIdx = (currentPage - 1) * USERS_PER_PAGE;
  const endIdx = startIdx + USERS_PER_PAGE;
  const usersToShow = filteredUsers.slice(startIdx, endIdx);

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">User Management</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="search users by username"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="list-group">
            {usersToShow.length === 0 && (
              <div className="text-muted p-3">No users found.</div>
            )}
            {usersToShow.map(user => (
              <UserSellerListItem
                key={user.id}
                data={user}
                onClick={() => setSelectedUser(user)}
                className="list-group-item"
              />
            ))}
          </div>
          {/* Paging controls */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
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