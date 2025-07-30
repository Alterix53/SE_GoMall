import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function UserSetting() {
  const [activeTab, setActiveTab] = useState("user");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showSellerWarning, setShowSellerWarning] = useState(false);
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server để cập nhật thông tin người dùng
    // Ví dụ: await api.updateUser(form)
    alert("Cập nhật thông tin thành công!");
    navigate("/user");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500, border: "1px solid black", padding: "20px", borderRadius: "10px"}}>
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link${activeTab === "user" ? " active" : ""}`}
            onClick={() => setActiveTab("user")}
            type="button"
          >
            Người dùng
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            type="button"
            onClick={() => {
              if (user?.role === "seller") {
                navigate("/seller");
              } else {
                setShowSellerWarning(true);
              }
            }}
          >
            Người bán
          </button>
        </li>
      </ul>
      {showSellerWarning && (
        <div className="alert alert-warning" role="alert">
          Bạn phải đăng ký trở thành seller
        </div>
      )}

      {/* User Info Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Họ tên</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Số điện thoại</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />
        </div>

        {/* Danger Zone: Change Password */}
        <div className="mt-4">
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => setShowPasswordChange((v) => !v)}
          >
            Thay đổi mật khẩu
          </button>
          {showPasswordChange && (
            <div className="border border-danger rounded p-3 mt-3 bg-light">
              <h6 className="text-danger mb-3">Đổi mật khẩu</h6>
              <div className="mb-2">
                <label htmlFor="oldPassword" className="form-label">Mật khẩu cũ</label>
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <div className="mt-4 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSetting; 