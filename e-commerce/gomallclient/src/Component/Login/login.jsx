import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFieldErrors({});

    const result = await login(usernameOrEmail, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Wrong username or password!');
      // Parse field-specific errors
      const fe = {};
      const isEmailInput = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(usernameOrEmail);
      (result.errors || []).forEach((e) => {
        if (e.path) {
          // Map lỗi về đúng field người dùng đang nhập
          const key = ['email','username'].includes(e.path) ? (isEmailInput ? 'email' : 'username') : e.path;
          fe[key] = e.msg || e.message || 'Invalid value';
        } else if (e.param) {
          const key = ['email','username'].includes(e.param) ? (isEmailInput ? 'email' : 'username') : e.param;
          fe[key] = e.msg || e.message || 'Invalid value';
        }
      });
      setFieldErrors(fe);
      return;
    }

    const account = result.user;
    if (account?.role === 'seller' || account?.sellerInfo) {
      if (account?.sellerInfo?.status === 'approved' || account?.sellerStatus === 'approved') {
        navigate('/seller');
      } else {
        alert('Your seller account has not been approved yet.');
        return;
      }
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div className="login-container">
        <h2 className="mb-4">Login</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
            {fieldErrors.username && (
              <div className="text-danger mt-1 small">{fieldErrors.username}</div>
            )}
            {fieldErrors.email && !fieldErrors.username && (
              <div className="text-danger mt-1 small">{fieldErrors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && (
              <div className="text-danger mt-1 small">{fieldErrors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
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
