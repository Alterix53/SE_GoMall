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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      
      if (result.success) {
        const user = result.user;
        
        // Điều hướng theo vai trò
        if (user.role === 'seller') {
          if (user.sellerInfo && user.sellerInfo.status === 'approved') {
            navigate('/seller-dashboard');
          } else {
            setError('Tài khoản seller của bạn chưa được phê duyệt.');
            return;
          }
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else {
          // buyer hoặc role khác - về trang chủ
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        setError(result.message || 'Đăng nhập thất bại');
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
                <h1 className="promo-title">8.8 SIÊU HỘI VOUCHER</h1>
                <div className="promo-banners">
                  <div className="promo-banner blue">SIÊU RẺ CHỈ TỪ 9.000</div>
                  <div className="promo-banner yellow">TRIỆU PHÚ VOUCHER GIẢM ĐẾN 20%</div>
                  <div className="promo-banner blue">FREE SHIP MỌI ĐƠN</div>
                </div>
                <div className="promo-text">SIÊU NHANH SIÊU RẺ</div>
                <div className="promo-date">26.7 - 9.8</div>
              </div>

              {/* Background shapes */}
              <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="freeship-text">FREESHIP</div>
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

                  <form onSubmit={handleLogin}>
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
                    
                    <div className="separator">
                      <span>HOẶC</span>
                    </div>

                    <div className="social-login">
                      <button className="social-btn facebook">
                        <i className="social-icon">f</i>
                        <span>Facebook</span>
                      </button>
                      <button className="social-btn google">
                        <i className="social-icon">G</i>
                        <span>Google</span>
                      </button>
                    </div>

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
