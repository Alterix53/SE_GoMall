import React, { useEffect, useMemo, useState } from "react";
import { AdminCard, AdminDataTable } from '../index';
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
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [approvedSellerName, setApprovedSellerName] = useState("");
  
  // Seller detail modal states
  const [showSellerDetailModal, setShowSellerDetailModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerDetailLoading, setSellerDetailLoading] = useState(false);

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

  const handleViewSellerDetail = async (sellerId) => {
    try {
      setSellerDetailLoading(true);
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      
      // Fetch detailed seller information
      const res = await adminAPI.getSellerById(token, sellerId);
      
      if (res.success) {
        setSelectedSeller(res.data);
        setShowSellerDetailModal(true);
      } else {
        alert("Failed to fetch seller details: " + res.message);
      }
    } catch (err) {
      alert("Error fetching seller details: " + err.message);
    } finally {
      setSellerDetailLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      console.log('handleApprove called with sellerId:', sellerId);
      
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      console.log('Using token:', token ? 'yes' : 'no');
      
      // Tìm thông tin seller trước khi approve để hiển thị trong modal
      const sellerToApprove = requests.find(req => req._id === sellerId);
      const sellerName = sellerToApprove?.businessName || 'Unknown Seller';
      
      console.log('Calling adminAPI.approveSeller...');
      const res = await adminAPI.approveSeller(token, sellerId);
      console.log('API response:', res);
      
      if (res.success) {
        console.log('Approve successful, updating UI...');
        
        // Hiển thị modal thành công
        setApprovedSellerName(sellerName);
        setSuccessMessage("Seller đã được duyệt thành công!");
        setShowSuccessModal(true);
        
        // Refresh the list
        setRequests(prev => prev.filter(req => req._id !== sellerId));
        setTotalRequests(prev => prev - 1);
      } else {
        console.error('Approve failed:', res.message);
        alert("Failed to approve seller: " + res.message);
      }
    } catch (err) {
      console.error('Error in handleApprove:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      alert("Error approving seller: " + err.message);
    }
  };

  const handleReject = async (sellerId) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await adminAPI.updateSellerStatus(token, sellerId, "rejected");
      if (res.success) {
        // Hiển thị thông báo thành công cho reject
        const sellerToReject = requests.find(req => req._id === sellerId);
        const sellerName = sellerToReject?.businessName || 'Unknown Seller';
        setApprovedSellerName(sellerName);
        setSuccessMessage("Seller đã bị từ chối thành công!");
        setShowSuccessModal(true);
        
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pending Seller Requests</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Business Info</th>
                    <th>Contact</th>
                    <th>Username</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        No pending requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((seller, idx) => (
                      <tr key={seller._id} style={{ cursor: 'pointer' }} onClick={() => handleViewSellerDetail(seller._id)}>
                        <td>{(page - 1) * limit + idx + 1}</td>
                        <td>
                          <div className="fw-bold">{seller.businessName || 'N/A'}</div>
                          {seller.businessAddress && (
                            <div className="text-muted small">{seller.businessAddress}</div>
                          )}
                        </td>
                        <td>
                          <div>{seller.businessEmail || 'N/A'}</div>
                          <div className="text-muted small">{seller.businessPhone || 'N/A'}</div>
                        </td>
                        <td>{seller.userID?.username || seller.username || 'N/A'}</td>
                        <td>{seller.createdAt ? new Date(seller.createdAt).toLocaleString() : '-'}</td>
                        <td>
                          <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                  {pageNum}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{successMessage}</p>
                <p><strong>Seller:</strong> {approvedSellerName}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSuccessModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Detail Modal */}
      {showSellerDetailModal && selectedSeller && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seller Application Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowSellerDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                {sellerDetailLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Business Information</h6>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Business Name:</label>
                        <p className="mb-1">{selectedSeller.businessName || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Business Address:</label>
                        <p className="mb-1">{selectedSeller.businessAddress || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Business Phone:</label>
                        <p className="mb-1">{selectedSeller.businessPhone || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Business Email:</label>
                        <p className="mb-1">{selectedSeller.businessEmail || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Business License:</label>
                        <p className="mb-1">{selectedSeller.businessLicense || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">User Information</h6>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Username:</label>
                        <p className="mb-1">{selectedSeller.userID?.username || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Full Name:</label>
                        <p className="mb-1">{selectedSeller.userID?.fullName || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email:</label>
                        <p className="mb-1">{selectedSeller.userID?.email || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone:</label>
                        <p className="mb-1">{selectedSeller.userID?.phoneNumber || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Applied Date:</label>
                        <p className="mb-1">
                          {selectedSeller.createdAt ? new Date(selectedSeller.createdAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold mb-3">Verification Documents</h6>
                      {selectedSeller.verificationDocs && selectedSeller.verificationDocs.length > 0 ? (
                        <div className="row">
                          {selectedSeller.verificationDocs.map((doc, index) => (
                            <div key={index} className="col-md-6 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <h6 className="card-title">Document {index + 1}</h6>
                                                                                                        <img 
                                     src={doc.startsWith('http') ? doc : `http://localhost:8080${doc}`}
                                     alt={`Verification document ${index + 1}`}
                                     className="img-fluid rounded"
                                     style={{ maxHeight: '200px', objectFit: 'cover' }}
                                   />
                                   <div style={{ display: 'none' }} className="text-center py-3">
                                     <p className="text-muted">Image not available</p>
                                     <a href={doc.startsWith('http') ? doc : `http://localhost:8080${doc}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                       View Document
                                     </a>
                                   </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No verification documents uploaded</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => {
                      handleApprove(selectedSeller._id);
                      setShowSellerDetailModal(false);
                    }}
                  >
                    Approve
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      handleReject(selectedSeller._id);
                      setShowSellerDetailModal(false);
                    }}
                  >
                    Reject
                  </button>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSellerDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {(showSuccessModal || showSellerDetailModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default PendingRequestPage;
