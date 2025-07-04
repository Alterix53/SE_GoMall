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

  const storedAccount = JSON.parse(localStorage.getItem('account'));

  if (
    storedAccount &&
    storedAccount.username === username &&
    storedAccount.password === password
  ) {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/seller');
  } else {
    alert('Sai tài khoản hoặc mật khẩu!');
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
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary">Đăng nhập</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
