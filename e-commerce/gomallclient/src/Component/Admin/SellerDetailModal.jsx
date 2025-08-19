import React, { useState } from "react";

function SellerDetailModal({ seller, onClose }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return "/default-avatar.png";
    }
    return seller.avatarUrl || "/default-avatar.png";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-warning',
      'approved': 'bg-success',
      'rejected': 'bg-danger',
      'banned': 'bg-dark',
      'active': 'bg-success'
    };
    return statusMap[status] || 'bg-secondary';
  };

  return (
    <div>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seller Information</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row align-items-center mb-3">
              {/* Seller avatar */}
              <div className="col-md-3 text-center">
                <img
                  src={getImageSrc()}
                  alt="Seller avatar"
                  className="img-fluid rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={handleImageError}
                />
              </div>
              {/* Basic information */}
              <div className="col-md-9">
                <h4>{seller?.businessName || seller?.storeName || 'N/A'}</h4>
                <p className="text-muted mb-2">Username: {seller?.username || seller?.userID?.username || 'N/A'}</p>
                <div className="d-flex gap-3">
                  <span className={`badge ${getStatusBadge(seller?.status)}`}>
                    {seller?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  {seller?.isVerified && <span className="badge bg-info">Verified</span>}
                </div>
              </div>
            </div>
            
            {/* Detailed information in tables */}
            <div className="row">
              <div className="col-md-6">
                <h6>Business Information</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Business Name</strong></td>
                        <td>{seller?.businessName || seller?.storeName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Business Email</strong></td>
                        <td>{seller?.businessEmail || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Business Phone</strong></td>
                        <td>{seller?.businessPhone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Business Address</strong></td>
                        <td>{seller?.businessAddress || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <h6>Account Information</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Username</strong></td>
                        <td>{seller?.username || seller?.userID?.username || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>User Email</strong></td>
                        <td>{seller?.userID?.email || seller?.email || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Status</strong></td>
                        <td>{seller?.status?.toUpperCase() || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Verified</strong></td>
                        <td>{seller?.isVerified ? 'Yes' : 'No'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <h6>Timestamps</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Applied</strong></td>
                        <td>{seller?.createdAt ? new Date(seller.createdAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Updated</strong></td>
                        <td>{seller?.updatedAt ? new Date(seller.updatedAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                      {seller?.approvedAt && (
                        <tr>
                          <td><strong>Approved</strong></td>
                          <td>{new Date(seller.approvedAt).toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <h6>Additional Information</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Tax ID</strong></td>
                        <td>{seller?.taxId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Business License</strong></td>
                        <td>{seller?.businessLicense || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Description</strong></td>
                        <td>{seller?.description || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDetailModal; 