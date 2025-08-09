import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import '../Login/login.css';
import { apiService } from '../../utils/api';

const RegisterSeller = () => {
  // Chuẩn hóa field: dùng businessName thay cho storeName (giữ tương thích ngược khi lưu)
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState('');
  const navigate = useNavigate();

  // Sử dụng API thay vì localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessName || !address || !email || !phone || !businessLicense) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const payload = {
        businessName,
        businessAddress: address,
        businessPhone: phone,
        businessLicense,
        verificationDocs: document ? [document.name] : [],
      };
      const resp = await apiService.applyForSeller(payload);
      if (resp?.data?.success) {
        alert('Your seller application has been submitted. Please wait for admin approval.');
        navigate('/home');
      } else {
        alert(resp?.data?.message || 'Failed to submit seller application');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit seller application');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="mb-4">Register to Become a Seller</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Business/Store Name</label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Business Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Business License</label>
            <input
              type="text"
              className="form-control"
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Verification Document (License/ID)</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setDocument(e.target.files[0])}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit Application</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default RegisterSeller;
