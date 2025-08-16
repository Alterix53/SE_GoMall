import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';

const RegisterSeller = () => {
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Kiểm tra các trường bắt buộc
    if (!storeName || !address || !email || !phone || !document) {
      setError('Vui lòng điền đầy đủ thông tin và tải lên tài liệu!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để đăng ký seller!');
        setLoading(false);
        return;
      }

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('storeName', storeName);
      formData.append('address', address);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('document', document);

      const response = await fetch('http://localhost:8080/api/seller/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('Yêu cầu đăng ký người bán đã được gửi. Vui lòng chờ admin phê duyệt.');
        navigate('/');
      } else {
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Register seller error:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="mb-4">Đăng ký trở thành người bán</h2>
        
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng</label>
            <input
              type="text"
              className="form-control"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Địa chỉ kinh doanh</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email liên hệ</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tài liệu xác minh (giấy phép/CMND)</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setDocument(e.target.files[0])}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default RegisterSeller;
