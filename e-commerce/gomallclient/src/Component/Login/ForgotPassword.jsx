import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './forgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập email của bạn');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi email reset mật khẩu');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
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
                <h1 className="welcome-title">QUÊN MẬT KHẨU</h1>
                
                <div className="welcome-banners">
                  <div className="welcome-banner blue">
                    <div className="welcome-text">KHÔI PHỤC TÀI KHOẢN</div>
                    <div className="welcome-date">Nhanh chóng và an toàn</div>
                  </div>
                  <div className="welcome-banner yellow">
                    <div className="welcome-text">XÁC THỰC EMAIL</div>
                    <div className="welcome-date">Bảo mật thông tin của bạn</div>
                  </div>
                  <div className="welcome-banner blue">
                    <div className="welcome-text">ĐẶT LẠI MẬT KHẨU</div>
                    <div className="welcome-date">Dễ dàng và tiện lợi</div>
                  </div>
                </div>

                <div className="welcome-subtitle">
                  <div className="welcome-text">KHÔI PHỤC NGAY HÔM NAY</div>
                  <div className="welcome-date">Nhận link reset mật khẩu qua email</div>
                </div>
              </div>
            </div>

            {/* Phần phải - Form */}
            <div className="content-right">
              <div className="forgot-password-form-container">
                <div className="forgot-password-form">
                  <div className="form-header">
                    <h2>Quên mật khẩu</h2>
                    <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  {success ? (
                    <div className="success-message">
                      <div className="success-icon">✅</div>
                      <h3>Email đã được gửi!</h3>
                      <p>Vui lòng kiểm tra hộp thư email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                      <button 
                        type="button" 
                        className="back-to-login-btn"
                        onClick={handleBackToLogin}
                      >
                        Quay lại đăng nhập
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="input-group">
                        <input
                          type="email"
                          placeholder="Nhập email của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="form-input"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="reset-btn" 
                        disabled={loading}
                      >
                        {loading ? 'Đang gửi...' : 'GỬI LINK RESET'}
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

export default ForgotPassword;
