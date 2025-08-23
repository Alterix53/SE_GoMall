import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
    setLoading(true);
    setError('');

    console.log('Attempting login with:', { username, password });

    try {
      const result = await login(username, password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        const user = result.user;
        console.log('User data:', user);
        
        // Điều hướng theo vai trò
        if (user.role === 'seller') {
          if (user.sellerInfo && user.sellerInfo.status === 'approved') {
            navigate('/seller-dashboard');
          } else {
            setError('Your seller account has not been approved yet.');
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
        console.log('Login failed:', result.message);
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
              setError('An error occurred during login. Please try again.');
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
                <span className="logo-text dangnhap"> Login</span>
              </div>
            </div>
            <div className="header-right">
              <span className="help-text">Need help?</span>
            </div>
          </div>

          {/* Content - Phần dưới chia dọc */}
          <div className="login-content">
            {/* Bên trái - Promotional content */}
            <div className="content-left">
              <div className="promotional-content">
                <h1 className="promo-title">JOIN THE COMMUNITY</h1>
                <div className="promo-banners">
                  <div className="promo-banner blue">SMART SHOPPING</div>
                  <div className="promo-banner yellow">MAXIMUM SAVINGS</div>
                  <div className="promo-banner blue">GREAT EXPERIENCE</div>
                </div>
                <div className="promo-text">LOGIN TODAY</div>
                <div className="promo-date">Get special offers</div>
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
                    <h2>Login</h2>
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
                        placeholder="Email/Phone/Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group password-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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
                      {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
                  </form>

                  <div className="form-footer">
                    <Link to="/forgot-password" className="forgot-password">
                      Forgot password
                    </Link>
                    
                    <div className="register-link">
                      <span>New to GoMall? </span>
                      <Link to="/signup" className="register-btn">Sign up</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer is injected by App.js for auth pages */}
    </div>
  );
};

export default LoginPage;
