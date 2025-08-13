import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Đăng nhập admin thất bại');
      return;
    }

    // Đảm bảo adminToken được set để các trang Admin đọc
    try {
      const token = localStorage.getItem('token');
      if (token) localStorage.setItem('adminToken', token);
    } catch {}

    navigate('/Admin', { replace: true });
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: '40px 16px' }}>
      <h2 className="mb-4">Admin Login</h2>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
