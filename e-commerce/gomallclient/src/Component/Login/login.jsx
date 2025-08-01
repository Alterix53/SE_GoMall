import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
      <div className="login-container">
        <h2 className="mb-4">Đăng nhập</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
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

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
        <p className="mt-3">Chưa có tài khoản <a href="/signup">Đăng ký</a></p>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
