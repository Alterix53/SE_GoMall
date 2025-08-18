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

  const handleFacebookLogin = () => {
    // Mock Facebook OAuth - có thể thay thế bằng OAuth thật sau này
    alert('Tính năng đăng nhập Facebook đang được phát triển. Vui lòng sử dụng đăng nhập thông thường.');
    
    // Nếu muốn sử dụng OAuth thật, uncomment code dưới:
    // const facebookAppId = 'your-facebook-app-id'; // Thay bằng App ID thật
    // const redirectUri = encodeURIComponent(`${window.location.origin}/auth/facebook/callback`);
    // const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=code`;
    // window.location.href = facebookAuthUrl;
  };

  const handleGoogleLogin = () => {
    // Mock Google OAuth - có thể thay thế bằng OAuth thật sau này
    alert('Tính năng đăng nhập Google đang được phát triển. Vui lòng sử dụng đăng nhập thông thường.');
    
    // Nếu muốn sử dụng OAuth thật, uncomment code dưới:
    // const googleClientId = 'your-google-client-id'; // Thay bằng Client ID thật
    // const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=email profile&response_type=code&access_type=offline`;
    // window.location.href = googleAuthUrl;
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
            {/* Bên trái - Welcome content */}
            <div className="content-left">
              <div className="welcome-content">
                <h1 className="welcome-title">Chào mừng đến với GoMall</h1>
                <p className="welcome-subtitle">Nền tảng mua sắm trực tuyến hàng đầu Việt Nam</p>
                <div className="welcome-features">
                  <div className="feature-item">
                    <span className="feature-icon">🛍️</span>
                    <span className="feature-text">Hàng triệu sản phẩm chất lượng</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🚚</span>
                    <span className="feature-text">Giao hàng nhanh chóng</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💰</span>
                    <span className="feature-text">Giá cả cạnh tranh</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🔒</span>
                    <span className="feature-text">Thanh toán an toàn</span>
                  </div>
                </div>
              </div>

              {/* Background shapes */}
              <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="gomall-text">GOMALL</div>
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
                      <button 
                        type="button"
                        className="social-btn facebook"
                        onClick={handleFacebookLogin}
                      >
                        <i className="social-icon">f</i>
                        <span>Facebook</span>
                      </button>
                      <button 
                        type="button"
                        className="social-btn google"
                        onClick={handleGoogleLogin}
                      >
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
