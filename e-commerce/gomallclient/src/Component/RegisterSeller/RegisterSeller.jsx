import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './RegisterSeller.css';

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
      <div className="register-seller-container">
        <div className="register-seller-form">
                  <div className="form-header">
          <h2>Đăng ký trở thành người bán</h2>
        </div>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên cửa hàng</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên cửa hàng của bạn"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ kinh doanh</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập địa chỉ kinh doanh"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email liên hệ</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email liên hệ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tài liệu xác minh</label>
                             <div className="file-upload-group">
                 <div className={`file-upload-wrapper ${document ? 'has-file' : ''}`}>
                   <div className="file-upload-icon">
                     {document ? '✅' : '📄'}
                   </div>
                   <div className="file-upload-text">
                     {document ? 'File đã chọn' : 'Chọn file hoặc kéo thả vào đây'}
                   </div>
                   <div className="file-upload-hint">
                     {document ? `Đã chọn: ${document.name}` : 'Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)'}
                   </div>
                                       <input
                      type="file"
                      className="file-input"
                      onChange={(e) => {
                        console.log('File input changed:', e.target.files);
                        const file = e.target.files[0];
                        if (file) {
                          console.log('Selected file:', file.name, file.size);
                          // Kiểm tra kích thước file (10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            setError('File quá lớn! Kích thước tối đa là 10MB');
                            return;
                          }
                          setDocument(file);
                          setError(''); // Xóa lỗi cũ
                        }
                      }}
                      onClick={(e) => {
                        console.log('File input clicked');
                      }}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      required
                    />
                 </div>
                 {document && (
                   <div className="file-preview">
                     <div className="file-preview-name">📎 {document.name}</div>
                     <div className="file-preview-size">{(document.size / 1024 / 1024).toFixed(2)} MB</div>
                     <button 
                       type="button" 
                       className="remove-file-btn"
                       onClick={() => setDocument(null)}
                       style={{
                         background: '#e53e3e',
                         color: 'white',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '4px 8px',
                         fontSize: '12px',
                         cursor: 'pointer',
                         marginTop: '8px'
                       }}
                     >
                       Xóa file
                     </button>
                   </div>
                 )}
               </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang gửi yêu cầu...
                </>
              ) : (
                'Gửi yêu cầu đăng ký'
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterSeller;
