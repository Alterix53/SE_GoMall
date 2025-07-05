import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import mockProducts from './product.json'; 
import './Sellerdashboard'; 

const SellerDashboard = () => {
  const [tab, setTab] = useState(1);
  const [products, setProducts] = useState(mockProducts);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem('isLoggedIn');
    if (login !== 'true') navigate('/login');
  }, [navigate]);

  const handleAdd = () => {
    const newItem = { ...newProduct, id: Date.now() };
    setProducts([...products, newItem]);
    setNewProduct({ name: '', price: '', category: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Seller Dashboard</h2>

        <div className="btn-group mb-4">
          <button className={`btn btn-${tab === 1 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(1)}>
            Danh sách sản phẩm
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
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{Number(p.price).toLocaleString()}₫</td>
                    <td>{p.category}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2">Sửa</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Thêm sản phẩm */}
        {tab === 2 && (
          <div>
            <h4>Thêm sản phẩm mới</h4>
            <input
              placeholder="Tên"
              className="form-control mb-2"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              placeholder="Giá"
              type="number"
              className="form-control mb-2"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              placeholder="Danh mục"
              className="form-control mb-2"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <button className="btn btn-success" onClick={handleAdd}>
              Thêm
            </button>
          </div>
        )}

        {/* TAB 3: Thống kê */}
        {tab === 3 && (
          <div className="stat-box mt-4 p-4 bg-light rounded">
            <h4>Thống kê đơn giản</h4>
            <p>Tổng sản phẩm: {products.length}</p>
            <p>
              Giá trung bình:{' '}
              {products.length
                ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(0)
                : 0}
              ₫
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SellerDashboard;
