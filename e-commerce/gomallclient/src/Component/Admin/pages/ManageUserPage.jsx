import React, { useState, useEffect } from "react";
import UserDetailModal from "../UserDetailModal";
import UserSellerListItem from "../UserSellerListItem";
import { adminAPI } from '../../../utils/api';

const USERS_PER_PAGE = 10;

function ManageUserPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!adminToken) throw new Error('Admin token not found');
        const params = {
          page: currentPage,
          limit: USERS_PER_PAGE,
          search: search.trim(),
        };
        const res = await adminAPI.getAllUsers(adminToken, params);
        if (res.success) {
          setUsers(res.data.users || res.data || []);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(1);
          setError(res.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
        setUsers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [search, currentPage]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
          {loading && <div className="text-center py-3">Loading...</div>}
          {error && <div className="text-danger py-2">{error}</div>}
          <div className="list-group">
            {!loading && users.length === 0 && (
              <div className="text-muted p-3">No users found.</div>
            )}
            {users.map(user => (
              <UserSellerListItem
                key={user._id || user.id}
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
      {/* User detail modal */}
      {selectedUser && (
        <div className="modal show d-block" tabIndex="-1">
          <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}

export default ManageUserPage; 