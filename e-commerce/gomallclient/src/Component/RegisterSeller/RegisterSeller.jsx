import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const RegisterSeller = () => {
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const navigate = useNavigate();

  const currentUsername = localStorage.getItem('username');
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!storeName || !address || !email || !phone || !document) {
      alert('Vui lòng điền đầy đủ thông tin và tải lên tài liệu!');
      return;
    }

    // Tìm người dùng hiện tại
    const userIndex = users.findIndex(u => u.username === currentUsername);
    if (userIndex === -1) {
      alert('Không tìm thấy người dùng!');
      return;
    }

    // Cập nhật thông tin đăng ký seller
    users[userIndex] = {
      ...users[userIndex],
      role: 'seller',
      sellerStatus: 'pending',
      storeName,
      address,
      email,
      phone,
      documentName: document.name,
    };

    localStorage.setItem('users', JSON.stringify(users));

    alert('Yêu cầu đăng ký người bán đã được gửi. Vui lòng chờ admin phê duyệt.');
    navigate('/home'); // hoặc chuyển về dashboard buyer
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="mb-4">Đăng ký trở thành người bán</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng</label>
            <input
              type="text"
              className="form-control"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Địa chỉ kinh doanh</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email liên hệ</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tài liệu xác minh (giấy phép/CMND)</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setDocument(e.target.files[0])}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default RegisterSeller;
