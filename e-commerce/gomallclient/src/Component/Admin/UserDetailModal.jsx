import React from "react";

function UserDetailModal({ user, onClose }) {
  return (
    <div>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thông tin thành viên</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row align-items-center mb-3">
              {/* Ảnh thành viên */}
              <div className="col-md-3 text-center">
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt="Ảnh thành viên"
                  className="img-fluid rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
              {/* Thông tin cơ bản */}
              <div className="col-md-9">
                <h4>Tên đăng nhập: {user.username}</h4>
              </div>
            </div>
            {/* Thông tin chi tiết */}
            <div className="row">
              <div className="col-12">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Số điện thoại:</strong> {user.phone}</p>
                <p><strong>Địa chỉ:</strong> {user.address}</p>
                <p><strong>Trạng thái:</strong> {user.status}</p>
                {/* Thêm các thông tin khác nếu cần */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal; 