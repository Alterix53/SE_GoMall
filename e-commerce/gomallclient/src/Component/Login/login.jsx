import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert('Đăng nhập thành công!');
        navigate('/');
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Phần trên - Giao diện màu cam */}
      <div className="login-main-section">
        <div className="orange-background">
          {/* Header - Phần trên */}
          <div className="login-header">
            <div className="header-left">
              <div className="logo-section">
                <Link to="/" className="brand-link" aria-label="Go to Home">
                  <div className="logo-icon">G</div>
                  <span className="logo-text">
                    <span className="gomall">GoMall</span>
                  </span>
                </Link>
                <span className="logo-text dangnhap"> Đăng nhập</span>
              </div>
            </div>
            <div className="header-right">
              <span className="help-text">Bạn cần giúp đỡ?</span>
            </div>
          </div>

          {/* Content - Phần dưới chia dọc */}
          <div className="login-content">
            {/* Bên trái - Promotional content */}
            <div className="content-left">
              <div className="promotional-content">
                <h1 className="promo-title">THAM GIA CỘNG ĐỒNG</h1>
                <div className="promo-banners">
                  <div className="promo-banner blue">MUA SẮM THÔNG MINH</div>
                  <div className="promo-banner yellow">TIẾT KIỆM TỐI ĐA</div>
                  <div className="promo-banner blue">TRẢI NGHIỆM TUYỆT VỜI</div>
                </div>
                <div className="promo-text">ĐĂNG NHẬP NGAY HÔM NAY</div>
                <div className="promo-date">Nhận ưu đãi đặc biệt</div>
              </div>

              {/* Background shapes */}
              <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>

            {/* Bên phải - Login Form */}
            <div className="content-right">
              <div className="login-form-container">
                <div className="login-form">
                  <div className="form-header">
                    <h2>Đăng nhập</h2>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Email/Số điện thoại/Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group password-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className="eye-icon">👁️</i>
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="login-btn" 
                      disabled={loading}
                    >
                      {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                    </button>
                  </form>

                  <div className="form-footer">
                    <Link to="/forgot-password" className="forgot-password">
                      Quên mật khẩu
                    </Link>
                    
                    <div className="register-link">
                      <span>Bạn mới biết đến GoMall? </span>
                      <Link to="/signup" className="register-btn">Đăng ký</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phần dưới - Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
