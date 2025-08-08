import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { apiService } from '../../utils/api';
import '../Signup/signup.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirm } = form;

    setFieldErrors({});

    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    // Client-side validation khớp với server
    const usernameValid = typeof username === 'string' && username.trim().length >= 3 && username.trim().length <= 30;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordComplex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!usernameValid) {
      alert('Username must be between 3 and 30 characters');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Please provide a valid email address');
      return;
    }
    if (!passwordComplex.test(password)) {
      alert('Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const resp = await apiService.post('/auth/register', {
        username,
        email,
        password,
      });

      if (resp?.data?.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        const serverErrors = resp?.data?.errors || [];
        const fe = {};
        serverErrors.forEach((e) => {
          if (e.path) fe[e.path] = e.msg || e.message || 'Invalid value';
        });
        setFieldErrors(fe);
        const combined = serverErrors.length
          ? serverErrors.map(e => e.msg || e.message).join('\n')
          : (resp?.data?.message || 'Registration failed');
        alert(combined);
      }
    } catch (err) {
      const serverErrors = err?.response?.data?.errors || [];
      const fe = {};
      serverErrors.forEach((e) => {
        if (e.path) fe[e.path] = e.msg || e.message || 'Invalid value';
      });
      setFieldErrors(fe);
      const msg = Array.isArray(serverErrors) && serverErrors.length
        ? serverErrors.map(e => e.msg || e.message).join('\n')
        : (err?.response?.data?.message || 'Registration failed');
      alert(msg);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="username" type="text" className="form-control" value={form.username} onChange={handleChange} required />
            {fieldErrors.username && (
              <div className="text-danger mt-1 small">{fieldErrors.username}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
            {fieldErrors.email && (
              <div className="text-danger mt-1 small">{fieldErrors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
            {fieldErrors.password && (
              <div className="text-danger mt-1 small">{fieldErrors.password}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input name="confirm" type="password" className="form-control" value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success">Sign Up</button>
        </form>
        <p className="mt-3">Already have an account? <a href="/login">Login</a></p>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
