import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../utils/api';
import './RegisterSeller.css';

const RegisterSeller = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sellerStatus, setSellerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const redirectRef = useRef(false);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState('');

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  // Kiểm tra trạng thái seller khi component mount (chỉ gọi 1 lần)
  useEffect(() => {
    console.log('RegisterSeller useEffect triggered, isAuthenticated:', isAuthenticated(), 'hasCheckedStatus:', hasCheckedStatus);
    if (isAuthenticated() && !hasCheckedStatus) {
      console.log('Calling checkSellerStatus...');
      checkSellerStatus();
    } else if (!isAuthenticated()) {
      // Nếu chưa đăng nhập, set hasCheckedStatus = true để không hiển thị loading
      setHasCheckedStatus(true);
    }
  }, [hasCheckedStatus]); // Chỉ chạy khi hasCheckedStatus thay đổi

  // Xử lý chuyển hướng khi seller đã được approve
  useEffect(() => {
    console.log('Redirect useEffect triggered, sellerStatus:', sellerStatus, 'redirectRef.current:', redirectRef.current);
    if (sellerStatus && sellerStatus.hasApplication && sellerStatus.status === 'approved' && !redirectRef.current) {
      console.log('Seller approved, setting redirect timer...');
      
      // Lưu sellerID vào localStorage
      if (sellerStatus.sellerID) {
        localStorage.setItem('sellerID', sellerStatus.sellerID);
        localStorage.setItem('sellerBusinessName', sellerStatus.businessName);
        console.log('SellerID saved to localStorage:', sellerStatus.sellerID);
        console.log('BusinessName saved to localStorage:', sellerStatus.businessName);
      }
      
      redirectRef.current = true; // Đánh dấu đã chuyển hướng
      const timer = setTimeout(() => {
        console.log('Redirecting to /seller...');
        navigate('/seller');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [sellerStatus]); // Chỉ dependency sellerStatus

  const checkSellerStatus = useCallback(async () => {
    console.log('checkSellerStatus called');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Making API call to /sellers/my-status');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch('http://localhost:8080/api/sellers/my-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        if (data.success) {
          console.log('Setting seller status:', data.data);
          console.log('hasApplication:', data.data.hasApplication);
          console.log('status:', data.data.status);
          setSellerStatus(data.data);
          setHasCheckedStatus(true);
        } else {
          console.log('API response not successful:', data.message);
          setHasCheckedStatus(true); // Vẫn set true để tránh loading vô hạn
        }
      } else {
        console.log('API response not ok:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setHasCheckedStatus(true); // Vẫn set true để tránh loading vô hạn
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      setHasCheckedStatus(true); // Vẫn set true để tránh loading vô hạn
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

      const resp = await apiService.post('/sellers/apply', formData);
      
      if (resp?.data?.success) {
        alert('✅ Hồ sơ đăng ký seller đã được nộp thành công!\n\n📋 Thông tin hồ sơ:\n- Tên doanh nghiệp: ' + (businessName || 'Test Business') + '\n- Địa chỉ: ' + (address || 'Test Address') + '\n- Số điện thoại: ' + (phone || '0123456789') + '\n\n⏳ Trạng thái: Đang chờ admin duyệt\n\n📧 Bạn sẽ nhận được thông báo khi hồ sơ được xem xét.');
        navigate('/home');
      } else {
        alert('❌ Lỗi: ' + (resp?.data?.message || 'Không thể nộp hồ sơ'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      
      if (err.response?.status === 400) {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes('already have an active or pending seller application')) {
          alert('⚠️ Bạn đã có hồ sơ đăng ký seller đang chờ duyệt hoặc đã được duyệt.\n\nVui lòng kiểm tra trạng thái hồ sơ của bạn.');
          checkSellerStatus(); // Refresh status
        } else {
          alert('Có lỗi xảy ra: ' + errorMessage);
        }
      } else {
        alert('Có lỗi xảy ra khi nộp hồ sơ');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading khi đang check trạng thái
  if (loading || !hasCheckedStatus) {
    return (
      <div className="register-seller-container">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Đang kiểm tra trạng thái seller...</span>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!isAuthenticated()) {
    return (
      <div className="register-seller-container">
        <div className="alert alert-warning">
          <h4 className="alert-heading">⚠️ Vui lòng đăng nhập</h4>
          <p>Bạn cần đăng nhập để đăng ký trở thành seller.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Nếu đã có hồ sơ, hiển thị thông tin trạng thái
  console.log('Rendering RegisterSeller, sellerStatus:', sellerStatus);
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
                onClick={() => navigate('/seller')}
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

  // Form đăng ký seller (chỉ hiển thị khi đã check xong và không có hồ sơ)
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
              placeholder="Nhập tên doanh nghiệp hoặc cửa hàng"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ doanh nghiệp *</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email doanh nghiệp</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Số giấy phép kinh doanh</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              placeholder="Nhập số giấy phép kinh doanh"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Số điện thoại</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
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
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
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
