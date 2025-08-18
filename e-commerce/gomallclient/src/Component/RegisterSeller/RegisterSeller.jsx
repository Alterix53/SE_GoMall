import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterSeller.css';
import api, { apiService } from '../../utils/api';

const RegisterSeller = () => {
  // Chuẩn hóa field: dùng businessName thay cho storeName (giữ tương thích ngược khi lưu)
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [sellerStatus, setSellerStatus] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra trạng thái hồ sơ seller khi component load
  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await api.get('/sellers/my-status');
      
      if (response.data.success) {
        setSellerStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      // Nếu lỗi 401 (chưa đăng nhập), redirect về login
      if (error.response?.status === 401) {
        alert('Vui lòng đăng nhập để đăng ký seller!');
        navigate('/login');
        return;
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TẮT VALIDATION ĐỂ TEST - COMMENT ĐOẠN NÀY ĐỂ BẬT LẠI
    /*
    if (!businessName || !address || !email || !phone || !businessLicense) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    // Kiểm tra file size
    if (document && document.size > 10 * 1024 * 1024) {
      alert('📁 Kích thước file không được vượt quá 10MB!');
      return;
    }
    */

    setLoading(true);
    try {
      // Use multipart/form-data to send the file actually
      const formData = new FormData();
      formData.append('businessName', businessName || 'Test Business');
      formData.append('businessAddress', address || 'Test Address');
      formData.append('businessPhone', phone || '0123456789');
      formData.append('businessLicense', businessLicense || 'TEST123');
      if (document) {
        formData.append('verificationDocs', document);
      }

      const resp = await api.post('/sellers/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
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
          alert('❌ Lỗi: ' + errorMessage);
        }
      } else if (err.response?.status === 401) {
        alert('🔐 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else if (err.response?.status === 413) {
        alert('📁 File quá lớn! Kích thước file không được vượt quá 10MB.');
      } else {
        alert('❌ Lỗi server: ' + (err?.response?.data?.message || 'Không thể kết nối đến server. Vui lòng thử lại sau.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TẮT VALIDATION FILE ĐỂ TEST - COMMENT ĐOẠN NÀY ĐỂ BẬT LẠI
      /*
      if (file.size > 10 * 1024 * 1024) {
        alert('📁 Kích thước file không được vượt quá 10MB!');
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('📄 Chỉ chấp nhận file ảnh (JPG, PNG) hoặc PDF!');
        e.target.value = '';
        return;
      }
      */
      
      setDocument(file);
    }
  };

  // Hiển thị trạng thái hồ sơ nếu đã có
  if (checkingStatus) {
    return (
      <div className="register-seller-container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang kiểm tra trạng thái hồ sơ...</p>
        </div>
      </div>
    );
  }

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
            <span className={`badge ms-2 ${
              sellerStatus.status === 'pending' ? 'bg-warning' :
              sellerStatus.status === 'approved' ? 'bg-success' :
              sellerStatus.status === 'rejected' ? 'bg-danger' :
              'bg-secondary'
            }`}>
              {sellerStatus.status === 'pending' ? 'Chờ duyệt' :
               sellerStatus.status === 'approved' ? 'Đã duyệt' :
               sellerStatus.status === 'rejected' ? 'Bị từ chối' :
               'Tạm ngưng'}
            </span>
          </p>
          <hr />
          <p className="mb-0">{sellerStatus.message}</p>
          
          {sellerStatus.status === 'rejected' && (
            <div className="mt-3">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSellerStatus(null);
                  setBusinessName('');
                  setAddress('');
                  setEmail('');
                  setPhone('');
                  setDocument(null);
                  setBusinessLicense('');
                }}
              >
                📝 Nộp lại hồ sơ mới
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="register-seller-container">
        <h2 className="mb-4">📝 Đăng ký trở thành Seller</h2>
        <div className="alert alert-info">
          <strong>ℹ️ Lưu ý:</strong> Hồ sơ của bạn sẽ được admin xem xét trong vòng 1-3 ngày làm việc.
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Tên doanh nghiệp/Cửa hàng</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Nhập tên doanh nghiệp hoặc cửa hàng"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Địa chỉ doanh nghiệp</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Email liên hệ</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
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
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Số điện thoại</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Tài liệu xác minh (Giấy phép/CMND)</strong> <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              required
            />
            <div className="form-text">
              📄 Chấp nhận file PDF, JPG, PNG. Kích thước tối đa: 10MB
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang nộp hồ sơ...
              </>
            ) : (
              '📤 Nộp hồ sơ đăng ký'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterSeller;
