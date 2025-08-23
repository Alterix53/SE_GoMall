import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../utils/apiService';
import './PasswordChangeForm.css';

const PasswordChangeForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate old password
    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = 'Mật khẩu cũ không được để trống';
    }

    // Validate new password
    if (!form.newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }

    // Validate confirm password
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

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
      const response = await ApiService.changePassword(user.id, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      if (response.success) {
        setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        
        // Clear form
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error.message || 'Không thể đổi mật khẩu';
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
    <div className="password-change-form">
      <div className="form-header">
        <h3>Thay đổi mật khẩu</h3>
        <p>Vui lòng nhập mật khẩu cũ và mật khẩu mới để cập nhật</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="oldPassword" className="form-label">
            Mật khẩu cũ <span className="required">*</span>
          </label>
          <input
            type="password"
            className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
            id="oldPassword"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu hiện tại"
          />
          {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            Mật khẩu mới <span className="required">*</span>
          </label>
          <input
            type="password"
            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
            id="newPassword"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
          />
          {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
          <small className="form-text text-muted">
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Xác nhận mật khẩu mới <span className="required">*</span>
          </label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới"
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        <div className="password-strength">
          <div className="strength-label">Độ mạnh mật khẩu:</div>
          <div className="strength-bar">
            <div 
              className={`strength-fill ${form.newPassword ? 'weak' : ''} ${
                form.newPassword && form.newPassword.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword) ? 'strong' : 
                form.newPassword && form.newPassword.length >= 6 ? 'medium' : ''
              }`}
            ></div>
          </div>
          <div className="strength-text">
            {!form.newPassword ? 'Chưa nhập mật khẩu' :
             form.newPassword.length < 6 ? 'Quá ngắn' :
             !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword) ? 'Trung bình' : 'Mạnh'}
          </div>
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
              'Đổi mật khẩu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
