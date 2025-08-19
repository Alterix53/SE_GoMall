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
                  setError('Please fill in all information and upload documents!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
                    setError('You need to login to register as a seller!');
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
        alert('Seller registration request has been sent. Please wait for admin approval.');
        navigate('/');
      } else {
                    setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Register seller error:', error);
                  setError('An error occurred during registration. Please try again.');
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
          <h2>Register to become a seller</h2>
        </div>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
                              <label className="form-label">Store name</label>
              <input
                type="text"
                className="form-control"
                                  placeholder="Enter your store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
                              <label className="form-label">Business address</label>
              <input
                type="text"
                className="form-control"
                                  placeholder="Enter business address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
                              <label className="form-label">Contact email</label>
              <input
                type="email"
                className="form-control"
                                  placeholder="Enter contact email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
                              <label className="form-label">Phone number</label>
              <input
                type="tel"
                className="form-control"
                                  placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
                              <label className="form-label">Verification Document</label>
                             <div className="file-upload-group">
                 <div className={`file-upload-wrapper ${document ? 'has-file' : ''}`}>
                   <div className="file-upload-icon">
                     {document ? '✅' : '📄'}
                   </div>
                   <div className="file-upload-text">
                     {document ? 'File selected' : 'Choose file or drag and drop here'}
                   </div>
                   <div className="file-upload-hint">
                     {document ? `Selected: ${document.name}` : 'Supported: PDF, DOC, DOCX, JPG, PNG (max 10MB)'}
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
                            setError('File too large! Maximum size is 10MB');
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
                       Remove file
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
                  Sending request...
                </>
              ) : (
                'Send registration request'
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
