import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirm } = form;

    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existing = users.find(u => u.username === username);
    if (existing) {
      alert('Username already exists!');
      return;
    }

    const newUser = {
      username,
      email,
      password,
      role: 'buyer',         // mặc định là người mua
      sellerStatus: null     // chưa đăng ký làm người bán
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful!');
    navigate('/login');
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
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
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
