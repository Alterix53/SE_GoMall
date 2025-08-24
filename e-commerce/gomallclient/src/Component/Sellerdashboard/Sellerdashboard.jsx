import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sellerdashboard.css'; 

const SellerDashboard = () => {
  // Initial mock data
  const initialProducts = [
    { 
      id: 1, 
      name: "Áo thun", 
      price: 120000, 
      category: "Thời trang",
      description: "Áo thun cotton chất liệu cao cấp",
      image: "https://via.placeholder.com/150x150?text=Ao+Thun",
      stock: 50,
      createdAt: "2024-01-01T00:00:00.000Z",
      status: "active"
    },
    { 
      id: 2, 
      name: "Giày thể thao", 
      price: 350000, 
      category: "Giày dép",
      description: "Giày thể thao đế cao su bền bỉ",
      image: "https://via.placeholder.com/150x150?text=Giay+The+Thao",
      stock: 25,
      createdAt: "2024-01-01T00:00:00.000Z",
      status: "active"
    }
  ];

  const [tab, setTab] = useState(1);
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: '',
    description: '',
    image: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Danh sách categories có sẵn
  const categories = [
    'Thời trang', 'Giày dép', 'Điện tử', 'Nhà cửa', 'Sách', 'Thể thao', 
    'Làm đẹp', 'Thực phẩm', 'Đồ chơi', 'Khác'
  ];

  useEffect(() => {
    const login = localStorage.getItem('isLoggedIn');
    if (login !== 'true') navigate('/login');
    
    // Load products từ localStorage nếu có
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }
  }, [navigate]);

  // Lưu products vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('sellerProducts', JSON.stringify(products));
  }, [products]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    } else if (newProduct.name.trim().length < 3) {
      newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
    }
    
    if (!newProduct.price) {
      newErrors.price = 'Giá sản phẩm không được để trống';
    } else if (isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải là số dương';
    }
    
    if (!newProduct.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }
    
    if (!newProduct.stock) {
      newErrors.stock = 'Số lượng tồn kho không được để trống';
    } else if (isNaN(Number(newProduct.stock)) || Number(newProduct.stock) < 0) {
      newErrors.stock = 'Số lượng tồn kho phải là số không âm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newProduct.name.trim(),
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description.trim() || 'Không có mô tả',
      image: newProduct.image.trim() || 'https://via.placeholder.com/150x150?text=No+Image',
      stock: Number(newProduct.stock),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setProducts([...products, newItem]);
    
    // Reset form
    setNewProduct({ 
      name: '', 
      price: '', 
      category: '',
      description: '',
      image: '',
      stock: ''
    });
    
    // Hiển thị thông báo thành công
    setMessage({ type: 'success', text: 'Thêm sản phẩm thành công!' });
    
    // Tự động chuyển về tab danh sách sau 2 giây
    setTimeout(() => {
      setTab(1);
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      setProducts(products.filter((p) => p.id !== id));
      setMessage({ type: 'success', text: 'Xoá sản phẩm thành công!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    }
  };

  const handleEdit = (product) => {
    // TODO: Implement edit functionality
    alert('Chức năng sửa sản phẩm sẽ được phát triển sau!');
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
    <>
      <div className="seller-dashboard">
        <div className="container">
          <h2>Seller Dashboard</h2>

          {/* Message Display */}
          {message.text && (
            <div className={`alert alert-${message.type}`} onClick={clearMessage}>
              {message.text}
              <button type="button" className="btn-close" onClick={clearMessage}></button>
            </div>
          )}

          <div className="btn-group mb-4">
            <button className={`btn btn-${tab === 1 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(1)}>
              Danh sách sản phẩm ({products.length})
            </button>
            <button className={`btn btn-${tab === 2 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(2)}>
              Thêm sản phẩm
            </button>
            <button className={`btn btn-${tab === 3 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(3)}>
              Thống kê
            </button>
          </div>

          {/* TAB 1: Danh sách sản phẩm */}
          {tab === 1 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="empty-state">
                          <div className="empty-state-icon">📦</div>
                          <h4>Chưa có sản phẩm nào</h4>
                          <p>Hãy thêm sản phẩm đầu tiên của bạn!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <img 
                            src={p.image} 
                            alt={p.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              if (e.target && e.target.src) {
                                e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{p.name}</strong>
                            {p.description && p.description !== 'Không có mô tả' && (
                              <div className="text-muted small mt-1">{p.description}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold text-primary">
                            {Number(p.price).toLocaleString()}₫
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{p.category}</span>
                        </td>
                        <td>
                          <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {p.stock} {p.stock > 0 ? 'cái' : 'hết hàng'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${p.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                            {p.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-warning me-2" 
                            onClick={() => handleEdit(p)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(p.id)}
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Thêm sản phẩm */}
          {tab === 2 && (
            <div className="add-product-form">
              <h4>Thêm sản phẩm mới</h4>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tên sản phẩm *</label>
                    <input
                      placeholder="Nhập tên sản phẩm"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giá (VNĐ) *</label>
                    <input
                      placeholder="Nhập giá sản phẩm"
                      type="number"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Danh mục *</label>
                    <select
                      className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Số lượng tồn kho *</label>
                    <input
                      placeholder="Nhập số lượng"
                      type="number"
                      className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                    {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL hình ảnh</label>
                    <input
                      placeholder="Nhập URL hình ảnh (tùy chọn)"
                      className="form-control"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                    <small className="text-muted">Để trống để sử dụng hình mặc định</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                      className="form-control"
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-success me-3" onClick={handleAdd}>
                  <i className="fas fa-plus me-2"></i>
                  Thêm sản phẩm
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setNewProduct({ 
                    name: '', 
                    price: '', 
                    category: '',
                    description: '',
                    image: '',
                    stock: ''
                  })}
                >
                  Làm mới
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Thống kê */}
          {tab === 3 && (
            <div className="stat-box">
              <h4>Thống kê tổng quan</h4>
              
              <div className="row">
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng sản phẩm</div>
                    <div className="stat-value">{products.length}</div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng giá trị</div>
                    <div className="stat-value">
                      {products.length > 0 
                        ? (products.reduce((sum, p) => sum + p.price * p.stock, 0)).toLocaleString()
                        : 0
                      }₫
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Giá trung bình</div>
                    <div className="stat-value">
                      {products.length > 0
                        ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)
                        : 0
                      }₫
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng tồn kho</div>
                    <div className="stat-value">
                      {products.reduce((sum, p) => sum + p.stock, 0)}
                    </div>
                  </div>
                </div>
              </div>

              {products.length > 0 && (
                <div className="mt-4">
                  <h5>Danh mục sản phẩm</h5>
                  <div className="row">
                    {Object.entries(
                      products.reduce((acc, p) => {
                        acc[p.category] = (acc[p.category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count]) => (
                      <div key={category} className="col-md-4 mb-2">
                        <div className="stat-item">
                          <div className="stat-label">{category}</div>
                          <div className="stat-value">{count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
