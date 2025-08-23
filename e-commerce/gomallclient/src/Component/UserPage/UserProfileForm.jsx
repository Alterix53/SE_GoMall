import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../utils/apiService';
import './UserProfileForm.css';

const UserProfileForm = ({ onSuccess, onCancel }) => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    avatar: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          const response = await ApiService.getCurrentUserProfile(user.id);
          
          if (response?.success && response?.user) {
            const userData = response.user;
            
            setForm(prev => ({
              ...prev,
              fullName: userData?.fullName || '',
              email: userData?.email || '',
              phoneNumber: userData?.phoneNumber || '',
              address: userData?.address || '',
              dateOfBirth: userData?.dateOfBirth || '',
              gender: userData?.gender || '',
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setMessage({ text: 'Không thể tải thông tin người dùng', type: 'error' });
        }
      }
    };

    loadUserData();
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone number
    if (form.phoneNumber && !/^[0-9]{10,11}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    // Validate address
    if (form.address && form.address.trim().length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'avatar' && files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setMessage({ text: 'Không tìm thấy thông tin người dùng', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const updateData = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
      };

      const response = await ApiService.updateUserProfile(user.id, updateData);
      
      if (response.success) {
        setMessage({ text: 'Cập nhật thông tin thành công!', type: 'success' });
        
        // Update local user data
        updateUser(updateData);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(updateData);
        }

        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMsg = error.message || 'Không thể cập nhật thông tin';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="user-profile-form">
      <div className="form-header">
        <h3>Cập nhật thông tin cá nhân</h3>
        <p>Vui lòng điền thông tin chính xác để cập nhật hồ sơ của bạn</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ tên <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên đầy đủ"
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled
              title="Email không thể chỉnh sửa"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
            <input
              type="tel"
              className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="0123456789"
            />
            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender" className="form-label">Giới tính</label>
            <select
              className="form-control"
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="avatar" className="form-label">Ảnh đại diện</label>
            <input
              type="file"
              className="form-control"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
            <small className="form-text text-muted">
              Chỉ chấp nhận file ảnh (JPG, PNG, GIF) với kích thước tối đa 5MB
            </small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Địa chỉ</label>
          <textarea
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ chi tiết"
            rows="3"
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật thông tin'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
