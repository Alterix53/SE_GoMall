import React, { useEffect, useMemo, useState } from "react";
import PaginationControl from "./PaginationControl";
import { adminAPI } from "../../utils/api";

function PendingSellerRequests() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const params = { status: "pending", search };
        const res = await adminAPI.getAllSellers(token, params);
        // Flatten into a simple array for the UI table
        const list = (res?.data?.sellers || res?.data || []).map((s) => ({
          id: s._id || s.id,
          username: s.username || s.userID?.username || "",
          businessName: s.businessName || s.storeName || "",
          businessEmail: s.businessEmail || "",
          businessPhone: s.businessPhone || "",
          appliedAt: s.createdAt || s.approvedAt || null,
          status: s.status || "pending",
        }));
        setRequests(list);
      } catch (err) {
        setError(err.message || "Failed to fetch pending requests");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [search]);

  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return requests.slice(start, start + limit);
  }, [requests, page, limit]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Pending Seller Requests</h5>
          <div className="d-flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ maxWidth: 260 }}
              placeholder="Search by name or email"
            />
            <select className="form-select" style={{ width: 120 }} value={limit} onChange={(e)=>setLimit(Number(e.target.value))}>
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Username</th>
                  <th>Business Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Applied At</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-muted text-center">No pending requests</td>
                  </tr>
                ) : (
                  paged.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{(page - 1) * limit + idx + 1}</td>
                      <td>{r.username}</td>
                      <td>{r.businessName}</td>
                      <td>{r.businessEmail}</td>
                      <td>{r.businessPhone}</td>
                      <td>{r.appliedAt ? new Date(r.appliedAt).toLocaleString() : '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success" disabled title="Approve coming soon">Approve</button>
                          <button className="btn btn-sm btn-outline-danger" disabled title="Reject coming soon">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {requests.length > limit && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, requests.length)} of {requests.length} requests
            </small>
            <div className="btn-group">
              <button 
                className="btn btn-outline-secondary btn-sm" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm" 
                disabled={page * limit >= requests.length}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingSellerRequests;


