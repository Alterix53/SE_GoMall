import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import '../Signup/signup.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name,
          phone
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Phần trên - Giao diện màu cam */}
      <div className="signup-main-section">
        <div className="orange-background">
          {/* Header - Phần trên */}
          <div className="signup-header">
            <div className="header-left">
              <div className="logo-section">
                <Link to="/" className="brand-link" aria-label="Go to Home">
                  <div className="logo-icon">G</div>
                  <span className="logo-text">
                    <span className="gomall">GoMall</span>
                  </span>
                </Link>
                <span className="logo-text dangky"> Đăng ký</span>
              </div>
            </div>
            <div className="header-right">
              <span className="help-text">Bạn cần giúp đỡ?</span>
            </div>
          </div>

          {/* Content - Phần dưới chia dọc */}
          <div className="signup-content">
            {/* Bên trái - Promotional content */}
            <div className="content-left">
              <div className="promotional-content">
                <h1 className="promo-title">THAM GIA CỘNG ĐỒNG</h1>
                <div className="promo-banners">
                  <div className="promo-banner blue">MUA SẮM THÔNG MINH</div>
                  <div className="promo-banner yellow">TIẾT KIỆM TỐI ĐA</div>
                  <div className="promo-banner blue">TRẢI NGHIỆM TUYỆT VỜI</div>
                </div>
                <div className="promo-text">ĐĂNG KÝ NGAY HÔM NAY</div>
                <div className="promo-date">Nhận ưu đãi đặc biệt</div>
              </div>

              {/* Background shapes */}
              <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>

            {/* Bên phải - Signup Form */}
            <div className="content-right">
              <div className="signup-form-container">
                <div className="signup-form">
                  <div className="form-header">
                    <h2>Đăng ký tài khoản</h2>
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
                        name="username"
                        placeholder="Tên đăng nhập (3-30 ký tự, chỉ chữ cái, số và _)"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group password-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mật khẩu (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)"
                        value={form.password}
                        onChange={handleChange}
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
                        name="confirm"
                        placeholder="Xác nhận mật khẩu"
                        value={form.confirm}
                        onChange={handleChange}
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
                      className="signup-btn" 
                      disabled={loading}
                    >
                      {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
                    </button>
                  </form>

                  <div className="form-footer">
                    <div className="login-link">
                      <span>Đã có tài khoản? </span>
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

export default SignUpPage;
