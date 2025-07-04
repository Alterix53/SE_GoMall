import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Signup/signup';

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
    if (form.password !== form.confirm) {
      alert('Mật khẩu không khớp!');
      return;
    }

    localStorage.setItem('account', JSON.stringify({
      username: form.username,
      email: form.email,
      password: form.password,
    }));

    alert('Đăng ký thành công!');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>
            <input name="username" type="text" className="form-control" value={form.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Nhập lại mật khẩu</label>
            <input name="confirm" type="password" className="form-control" value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success">Đăng ký</button>
        </form>
        <p className="mt-3">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
