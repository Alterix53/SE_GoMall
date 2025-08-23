import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Signup/signup.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    name: '',
    phone: ''
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
    const { username, email, password, confirm } = form;

    if (password !== confirm) {
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
          fullName: form.name || form.username,
          phoneNumber: form.phone || ''
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        // Hiển thị lỗi chi tiết
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg || err.message).join('\n');
          setError(errorMessages);
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
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
                <span className="logo-text dangky"> Sign Up</span>
              </div>
            </div>
            <div className="header-right">
              <span className="help-text">Need help?</span>
            </div>
          </div>

          {/* Content - Phần dưới chia dọc */}
          <div className="signup-content">
            {/* Bên trái - Promotional content */}
            <div className="content-left">
              <div className="promotional-content">
                <h1 className="promo-title">JOIN THE COMMUNITY</h1>
                <div className="promo-banners">
                  <div className="promo-banner blue">SMART SHOPPING</div>
                  <div className="promo-banner yellow">MAXIMUM SAVINGS</div>
                  <div className="promo-banner blue">AMAZING EXPERIENCE</div>
                </div>
                <div className="promo-text">SIGN UP TODAY</div>
                <div className="promo-date">Get special offers</div>
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
                    <h2>Create Account</h2>
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
                        placeholder="Username (3-30 characters, letters, numbers and _ only)"
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

                    <div className="input-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="input-group password-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password (min 6 characters, uppercase, lowercase and numbers)"
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
                        placeholder="Confirm Password"
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
                      {loading ? 'Signing up...' : 'SIGN UP'}
                    </button>
                  </form>

                  <div className="form-footer">
                    <div className="login-link">
                      <span>Already have an account? </span>
                      <Link to="/login" className="login-btn-link">Login</Link>
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

export default SignUpPage;
