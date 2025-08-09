import React from "react";

function SellerDetailModal({ seller, onClose }) {
  return (
    <div>
      {/* Seller detail modal content here */}
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Seller Information</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row align-items-center mb-3">
              {/* Ảnh người bán */}
              <div className="col-md-3 text-center">
                <img
                  src={seller.avatarUrl || "/default-avatar.png"}
                  alt="Seller avatar"
                  className="img-fluid rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
              {/* Thông tin cơ bản */}
              <div className="col-md-9">
                <h4>Username: {seller?.username}</h4>
                <p className="mb-1"><strong>Business Name:</strong> {seller?.businessName || seller?.storeName}</p>
              </div>
            </div>
            {/* Thông tin chi tiết */}
            <div className="row">
              <div className="col-12">
                <p><strong>Email:</strong> {seller?.businessEmail || seller?.email}</p>
                <p><strong>Phone:</strong> {seller?.businessPhone || seller?.phone}</p>
                <p><strong>Address:</strong> {seller?.businessAddress || seller?.address}</p>
                <p><strong>Status:</strong> {seller?.status}</p>
                {/* Thêm các thông tin khác nếu cần */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDetailModal; 