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
        alert('✅ Seller application submitted successfully!\n\n📋 Application Information:\n- Business Name: ' + (businessName || 'Test Business') + '\n- Address: ' + (address || 'Test Address') + '\n- Phone: ' + (phone || 'Test Phone') + '\n- Email: ' + (email || 'test@example.com') + '\n- Business License: ' + (businessLicense || 'Test License'));
        navigate('/home');
      } else {
        alert('❌ Error: ' + (resp?.data?.message || 'Could not submit application'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      
      if (err.response?.status === 400) {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes('already have an active or pending seller application')) {
          alert('⚠️ You already have a seller application pending or approved.\n\nPlease check your application status.');
          checkSellerStatus(); // Refresh status
        } else {
          alert('An error occurred: ' + errorMessage);
        }
      } else {
        alert('An error occurred when submitting the application');
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
          <span className="ms-3">Checking seller status...</span>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!isAuthenticated()) {
    return (
      <div className="register-seller-container">
        <div className="alert alert-warning">
          <h4 className="alert-heading">⚠️ Please log in</h4>
          <p>You need to log in to register as a seller.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Log In
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
          <h4 className="alert-heading">📋 Seller Application Information</h4>
          <hr />
          <p><strong>Business Name:</strong> {sellerStatus.businessName}</p>
          <p><strong>Application Date:</strong> {new Date(sellerStatus.createdAt).toLocaleDateString('en-US')}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge status-${sellerStatus.status}`}>
              {sellerStatus.status === 'pending' && '⏳ Pending Approval'}
              {sellerStatus.status === 'approved' && '✅ Approved'}
              {sellerStatus.status === 'rejected' && '❌ Rejected'}
              {sellerStatus.status === 'suspended' && '⏸️ Suspended'}
            </span>
          </p>
          <p><strong>Message:</strong> {sellerStatus.message}</p>
          
          {sellerStatus.status === 'approved' && (
            <div className="alert alert-success mt-3">
              <p>🎉 Congratulations! Your application has been approved.</p>
              <p>You will be redirected to the Seller Dashboard in a few seconds...</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/seller')}
              >
                Go to Seller Dashboard now
              </button>
            </div>
          )}
          
          {sellerStatus.status === 'rejected' && (
            <div className="alert alert-warning mt-3">
              <p>Your application did not meet the requirements. You can submit a new application.</p>
              <button 
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Submit New Application
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
        <h2>Register to Become a Seller</h2>
        <p>Please fill in all the information to register as a seller on GoMall</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessName">Business Name *</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name or store"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Business Address *</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Business Email</label>
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
              <strong>Business Tax ID</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              placeholder="Enter business tax ID"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Business Phone</strong> <span className="text-danger">*</span>
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
            <label htmlFor="businessLicense">Business License *</label>
            <input
              type="text"
              id="businessLicense"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              required
              placeholder="Enter business license number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="document">Verification Documents</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
            />
            <small>Accepts PDF, JPG, JPEG, PNG files</small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterSeller;
