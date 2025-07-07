import React from "react";

function SellerDetailModal({ seller, onClose }) {
  return (
    <div>
      {/* Seller detail modal content here */}
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Thông tin người bán</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row align-items-center mb-3">
              {/* Ảnh người bán */}
              <div className="col-md-3 text-center">
                <img
                  src={seller.avatarUrl || "/default-avatar.png"}
                  alt="Ảnh người bán"
                  className="img-fluid rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
              {/* Thông tin cơ bản */}
              <div className="col-md-9">
                <h4>Tên đăng nhập: {seller.username}</h4>
                <p className="mb-1"><strong>Tên ĐKKD:</strong> {seller.businessName}</p>
              </div>
            </div>
            {/* Thông tin chi tiết */}
            <div className="row">
              <div className="col-12">
                <p><strong>Email:</strong> {seller.email}</p>
                <p><strong>Số điện thoại:</strong> {seller.phone}</p>
                <p><strong>Địa chỉ:</strong> {seller.address}</p>
                <p><strong>Trạng thái:</strong> {seller.status}</p>
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