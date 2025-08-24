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
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState('');

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  // Check seller status on mount (once)
  useEffect(() => {
    console.log('RegisterSeller useEffect triggered, isAuthenticated:', isAuthenticated(), 'hasCheckedStatus:', hasCheckedStatus);
    if (isAuthenticated() && !hasCheckedStatus) {
      console.log('Calling checkSellerStatus...');
      checkSellerStatus();
    } else if (!isAuthenticated()) {
      // If not signed in, mark checked to avoid infinite loading
      setHasCheckedStatus(true);
    }
  }, [hasCheckedStatus]); // Chỉ chạy khi hasCheckedStatus thay đổi

  // Redirect when seller is approved
  useEffect(() => {
    console.log('Redirect useEffect triggered, sellerStatus:', sellerStatus, 'redirectRef.current:', redirectRef.current);
    if (sellerStatus && sellerStatus.hasApplication && sellerStatus.status === 'approved' && !redirectRef.current) {
      console.log('Seller approved, setting redirect timer...');
      
      // Save sellerID to localStorage
      if (sellerStatus.sellerID) {
        localStorage.setItem('sellerID', sellerStatus.sellerID);
        localStorage.setItem('sellerBusinessName', sellerStatus.businessName);
        console.log('SellerID saved to localStorage:', sellerStatus.sellerID);
        console.log('BusinessName saved to localStorage:', sellerStatus.businessName);
      }
      
      redirectRef.current = true; // Mark redirected
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
         alert('✅ Seller registration application submitted successfully!\n\n📋 Application Information:\n- Business Name: ' + (businessName || 'Test Business') + '\n- Address: ' + (address || 'Test Address') + '\n- Phone Number: ' + (phone || '0123456789') + '\n\n⏳ Status: Waiting for admin approval\n\n📧 You will receive a notification when your application is reviewed.');
         navigate('/home');
       } else {
         alert('❌ Error: ' + (resp?.data?.message || 'Unable to submit application'));
       }
    } catch (err) {
      console.error('Submit error:', err);
      
             if (err.response?.status === 400) {
         const errorMessage = err.response.data.message;
         if (errorMessage.includes('already have an active or pending seller application')) {
           alert('⚠️ You already have a seller application that is pending approval or has been approved.\n\nPlease check your application status.');
           checkSellerStatus(); // Refresh status
         } else {
           alert('An error occurred: ' + errorMessage);
         }
       } else {
         alert('An error occurred while submitting the application');
       }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking status
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

  // If not signed in, show notice
  if (!isAuthenticated()) {
    return (
      <div className="register-seller-container">
        <div className="alert alert-warning">
          <h4 className="alert-heading">⚠️ Please sign in</h4>
          <p>You need to sign in to register as a seller.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // If an application already exists, show status
  console.log('Rendering RegisterSeller, sellerStatus:', sellerStatus);
  if (sellerStatus && sellerStatus.hasApplication) {
    const formatDate = (d) => {
      try {
        return new Date(d).toLocaleDateString('en-GB');
      } catch {
        return '';
      }
    };

    const getEnglishStatusMessage = (statusObj) => {
      const status = statusObj?.status;
      if (status === 'approved') {
        const approvedDate = statusObj?.approvedAt || statusObj?.updatedAt || statusObj?.createdAt;
        return `Your application was approved on ${formatDate(approvedDate)}.`;
      }
      if (status === 'pending') {
        return 'Your application is under review.';
      }
      if (status === 'rejected') {
        return 'Your application was rejected.';
      }
      if (status === 'suspended') {
        return 'Your seller account is suspended.';
      }
      return statusObj?.message || 'No message available.';
    };

    return (
      <div className="register-seller-container">
        <div className="alert alert-info">
          <h4 className="alert-heading">📋 Seller application info</h4>
          <hr />
          <p><strong>Business name:</strong> {sellerStatus.businessName}</p>
          <p><strong>Submitted on:</strong> {new Date(sellerStatus.createdAt).toLocaleDateString('vi-VN')}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge status-${sellerStatus.status}`}>
              {sellerStatus.status === 'pending' && '⏳ Pending'}
              {sellerStatus.status === 'approved' && '✅ Approved'}
              {sellerStatus.status === 'rejected' && '❌ Rejected'}
              {sellerStatus.status === 'suspended' && '⏸️ Suspended'}
            </span>
          </p>
                     <p><strong>Message:</strong> {getEnglishStatusMessage(sellerStatus)}</p>
           
           <div className="mt-3">
             <button 
               className="btn btn-secondary me-2"
               onClick={() => navigate('/home')}
             >
               Proceed to Home
             </button>
           </div>
           
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
               <p>Your application did not meet the requirements. You can submit a new one.</p>
               <button 
                 className="btn btn-warning"
                 onClick={() => window.location.reload()}
               >
                 Resubmit application
               </button>
             </div>
           )}
        </div>
      </div>
    );
  }

  // Seller registration form (shown only when status checked and no application exists)
  return (
    <div className="register-seller-container">
      <div className="register-seller-form">
        <h2>Register to become a Seller</h2>
        <p>Please fill out the information below to register as a seller on GoMall.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessName">Business name *</label>
            <input
              type="text"
              id="businessName"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business or shop name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Business address *</label>
            <input
              type="text"
              id="address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessLicense">Business license number *</label>
            <input
              type="text"
              id="businessLicense"
              className="form-control"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              placeholder="Enter business license number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone number *</label>
            <input
              type="tel"
              id="phone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="document">Verification document</label>
            <input
              type="file"
              id="document"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <small className="file-hint">Accepts PDF, JPG, JPEG, PNG</small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterSeller;
