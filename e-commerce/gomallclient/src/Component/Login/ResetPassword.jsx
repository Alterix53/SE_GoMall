import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './resetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Link không hợp lệ hoặc đã hết hạn');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!token && !error) {
    return (
      <div className="reset-password-page">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      {/* Phần trên - Header */}
      <div className="header-section">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <h1>GoMall</h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Phần chính - Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Phần trái - Welcome */}
            <div className="content-left">
              <div className="welcome-content">
                <h1 className="welcome-title">ĐẶT LẠI MẬT KHẨU</h1>
                
                <div className="welcome-banners">
                  <div className="welcome-banner blue">
                    <div className="welcome-text">BẢO MẬT TÀI KHOẢN</div>
                    <div className="welcome-date">Mật khẩu mới an toàn</div>
                  </div>
                  <div className="welcome-banner yellow">
                    <div className="welcome-text">XÁC THỰC THÔNG TIN</div>
                    <div className="welcome-date">Đảm bảo chính xác</div>
                  </div>
                  <div className="welcome-banner blue">
                    <div className="welcome-text">HOÀN TẤT KHÔI PHỤC</div>
                    <div className="welcome-date">Sẵn sàng sử dụng</div>
                  </div>
                </div>

                <div className="welcome-subtitle">
                  <div className="welcome-text">TẠO MẬT KHẨU MỚI</div>
                  <div className="welcome-date">Đảm bảo mật khẩu mạnh và dễ nhớ</div>
                </div>
              </div>
            </div>

            {/* Phần phải - Form */}
            <div className="content-right">
              <div className="reset-password-form-container">
                <div className="reset-password-form">
                  <div className="form-header">
                    <h2>Đặt lại mật khẩu</h2>
                    <p>Tạo mật khẩu mới cho tài khoản của bạn</p>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  {success ? (
                    <div className="success-message">
                      <div className="success-icon">✅</div>
                      <h3>Đặt lại mật khẩu thành công!</h3>
                      <p>Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.</p>
                      <button 
                        type="button" 
                        className="back-to-login-btn"
                        onClick={handleBackToLogin}
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="input-group password-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mật khẩu mới (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)"
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

                      <div className="input-group password-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Xác nhận mật khẩu mới"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className="eye-icon">👁️</i>
                        </button>
                      </div>

                      <button 
                        type="submit" 
                        className="reset-btn" 
                        disabled={loading}
                      >
                        {loading ? 'Đang cập nhật...' : 'CẬP NHẬT MẬT KHẨU'}
                      </button>
                    </form>
                  )}

                  <div className="form-footer">
                    <div className="login-link">
                      <span>Nhớ mật khẩu? </span>
                      <Link to="/login" className="login-btn-link">Đăng nhập</Link>
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

export default ResetPassword;
