import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './RegisterSeller.css';

const RegisterSeller = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sellerStatus, setSellerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState('');

  // Kiểm tra trạng thái seller khi component mount
  useEffect(() => {
    if (isAuthenticated()) {
      checkSellerStatus();
    }
  }, [isAuthenticated]);

  // Xử lý chuyển hướng khi seller đã được approve
  useEffect(() => {
    if (sellerStatus && sellerStatus.hasApplication && sellerStatus.status === 'approved') {
      const timer = setTimeout(async () => {
        // Refresh thông tin user trước khi chuyển hướng
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8080/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Cập nhật thông tin user trong localStorage
              localStorage.setItem('user', JSON.stringify(data.data.user));
            }
          }
        } catch (error) {
          console.error('Error refreshing user info:', error);
        }
        
        navigate('/seller-dashboard');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [sellerStatus, navigate]);

  const checkSellerStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/sellers/my-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSellerStatus(data.data);
        }
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('businessAddress', address);
      formData.append('businessPhone', phone);
      formData.append('businessLicense', businessLicense);
      if (document) {
        formData.append('verificationDocs', document);
      }

      const response = await fetch('http://localhost:8080/api/sellers/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Hồ sơ đăng ký seller đã được nộp thành công! Vui lòng chờ admin duyệt.');
          // Kiểm tra lại trạng thái sau khi nộp
          await checkSellerStatus();
        } else {
          alert('Có lỗi xảy ra: ' + data.message);
        }
      } else {
        alert('Có lỗi xảy ra khi nộp hồ sơ');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi xảy ra khi nộp hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  // Nếu đã có hồ sơ, hiển thị thông tin trạng thái
  if (sellerStatus && sellerStatus.hasApplication) {
    return (
      <div className="register-seller-container">
        <div className="alert alert-info">
          <h4 className="alert-heading">📋 Thông tin hồ sơ đăng ký seller</h4>
          <hr />
          <p><strong>Tên doanh nghiệp:</strong> {sellerStatus.businessName}</p>
          <p><strong>Ngày nộp hồ sơ:</strong> {new Date(sellerStatus.createdAt).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> 
            <span className={`status-badge status-${sellerStatus.status}`}>
              {sellerStatus.status === 'pending' && '⏳ Đang chờ duyệt'}
              {sellerStatus.status === 'approved' && '✅ Đã được duyệt'}
              {sellerStatus.status === 'rejected' && '❌ Bị từ chối'}
              {sellerStatus.status === 'suspended' && '⏸️ Bị tạm ngưng'}
            </span>
          </p>
          <p><strong>Thông báo:</strong> {sellerStatus.message}</p>
          
          {sellerStatus.status === 'approved' && (
            <div className="alert alert-success mt-3">
              <p>🎉 Chúc mừng! Hồ sơ của bạn đã được duyệt thành công.</p>
              <p>Bạn sẽ được chuyển hướng đến Seller Dashboard trong vài giây...</p>
              <button 
                className="btn btn-primary"
                onClick={async () => {
                  // Refresh thông tin user trước khi chuyển hướng
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:8080/api/users/me', {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });

                    if (response.ok) {
                      const data = await response.json();
                      if (data.success) {
                        // Cập nhật thông tin user trong localStorage
                        localStorage.setItem('user', JSON.stringify(data.data.user));
                      }
                    }
                  } catch (error) {
                    console.error('Error refreshing user info:', error);
                  }
                  
                  navigate('/seller-dashboard');
                }}
              >
                Vào Seller Dashboard ngay
              </button>
            </div>
          )}
          
          {sellerStatus.status === 'rejected' && (
            <div className="alert alert-warning mt-3">
              <p>Hồ sơ của bạn chưa đáp ứng yêu cầu. Bạn có thể nộp lại hồ sơ mới.</p>
              <button 
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Nộp lại hồ sơ
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Form đăng ký seller
  return (
    <div className="register-seller-container">
      <div className="register-seller-form">
        <h2>Đăng ký trở thành Seller</h2>
        <p>Vui lòng điền đầy đủ thông tin để đăng ký trở thành seller trên GoMall</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessName">Tên doanh nghiệp *</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              placeholder="Nhập tên doanh nghiệp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ doanh nghiệp *</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Nhập địa chỉ doanh nghiệp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email doanh nghiệp</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email doanh nghiệp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại doanh nghiệp *</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessLicense">Giấy phép kinh doanh *</label>
            <input
              type="text"
              id="businessLicense"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              required
              placeholder="Nhập số giấy phép kinh doanh"
            />
          </div>

          <div className="form-group">
            <label htmlFor="document">Tài liệu xác minh</label>
            <input
              type="file"
              id="document"
              onChange={(e) => setDocument(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <small>Chấp nhận file PDF, JPG, JPEG, PNG</small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Nộp hồ sơ đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterSeller;
