import React, { useEffect, useMemo, useState } from "react";
import { adminAPI } from '../../../utils/api';

function PendingRequestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const params = { 
          status: "pending", 
          search,
          page,
          limit
        };
        const res = await adminAPI.getAllSellers(token, params);
        
        if (res.success) {
          const sellers = res.data.sellers || res.data || [];
          setRequests(sellers);
          setTotalPages(res.data.totalPages || 1);
          setTotalRequests(res.data.total || sellers.length);
        } else {
          setError(res.message || "Failed to fetch pending requests");
          setRequests([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch pending requests");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [search, page, limit]);

  const handleApprove = async (sellerId) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await adminAPI.updateSellerStatus(token, sellerId, "approved");
      if (res.success) {
        // Refresh the list
        setRequests(prev => prev.filter(req => req._id !== sellerId));
        setTotalRequests(prev => prev - 1);
      } else {
        alert("Failed to approve seller: " + res.message);
      }
    } catch (err) {
      alert("Error approving seller: " + err.message);
    }
  };

  const handleReject = async (sellerId) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await adminAPI.updateSellerStatus(token, sellerId, "rejected");
      if (res.success) {
        // Refresh the list
        setRequests(prev => prev.filter(req => req._id !== sellerId));
        setTotalRequests(prev => prev - 1);
      } else {
        alert("Failed to reject seller: " + res.message);
      }
    } catch (err) {
      alert("Error rejecting seller: " + err.message);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="row text-center mb-4" style={{ minWidth: 180 }}>Pending Seller Requests</h2>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                style={{ maxWidth: 260 }}
                placeholder="Search by business name or email"
              />
              <select 
                className="form-select" 
                style={{ width: 120 }} 
                value={limit} 
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>
            <div className="text-muted">
              Total: {totalRequests} pending requests
            </div>
          </div>

          {loading && <div className="text-center py-3">Loading...</div>}
          {error && <div className="text-danger py-2">{error}</div>}

          {!loading && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Business Name</th>
                    <th>Business Email</th>
                    <th>Business Phone</th>
                    <th>Username</th>
                    <th>Applied At</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-muted text-center">No pending requests</td>
                    </tr>
                  ) : (
                    requests.map((seller, idx) => (
                      <tr key={seller._id}>
                        <td>{(page - 1) * limit + idx + 1}</td>
                        <td>
                          <div className="fw-bold">{seller.businessName || 'N/A'}</div>
                          {seller.businessAddress && (
                            <div className="text-muted small">{seller.businessAddress}</div>
                          )}
                        </td>
                        <td>{seller.businessEmail || 'N/A'}</td>
                        <td>{seller.businessPhone || 'N/A'}</td>
                        <td>{seller.userID?.username || seller.username || 'N/A'}</td>
                        <td>{seller.createdAt ? new Date(seller.createdAt).toLocaleString() : '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-success" 
                              onClick={() => handleApprove(seller._id)}
                              title="Approve this seller application"
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleReject(seller._id)}
                              title="Reject this seller application"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRequests)} of {totalRequests} requests
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item${page === i + 1 ? " active" : ""}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingRequestPage;
