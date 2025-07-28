import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user có thông tin trùng khớp
    const account = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!account) {
      alert('Sai tài khoản hoặc mật khẩu!');
      return;
    }

    // Lưu trạng thái đăng nhập
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', account.username);
    localStorage.setItem('userRole', account.role);

    // Điều hướng theo vai trò
    if (account.role === 'seller') {
      if (account.sellerStatus === 'approved') {
        navigate('/seller-dashboard');
      } else {
        alert('Tài khoản người bán của bạn chưa được phê duyệt.');
        return;
      }
    } else {
      // buyer mặc định
      navigate('/home'); // hoặc /marketplace tùy hệ thống
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="mb-4">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Đăng nhập</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
