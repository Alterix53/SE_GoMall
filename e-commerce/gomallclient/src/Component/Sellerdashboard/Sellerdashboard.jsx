import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <div className="container mt-4">
        <h2>Seller Dashboard</h2>

        <div className="btn-group mb-4">
          <button className={`btn btn-${tab === 1 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(1)}>
            List products
          </button>
          <button className={`btn btn-${tab === 2 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(2)}>
            Add product
          </button>
          <button className={`btn btn-${tab === 3 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(3)}>
            Statistics
          </button>
        </div>

        {/* TAB 1: List products */}
        {tab === 1 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
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
                      <button className="btn btn-sm btn-warning me-2">Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Add product */}
        {tab === 2 && (
          <div>
            <h4>Add new product</h4>
            <input
              placeholder="Name"
              className="form-control mb-2"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              placeholder="Price"
              type="number"
              className="form-control mb-2"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              placeholder="Category"
              className="form-control mb-2"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <button className="btn btn-success" onClick={handleAdd}>
              Add
            </button>
          </div>
        )}

        {/* TAB 3: Statistics */}
        {tab === 3 && (
          <div className="stat-box mt-4 p-4 bg-light rounded">
            <h4>Simple statistics</h4>
            <p>Total products: {products.length}</p>
            <p>
              Average price:{' '}
              {products.length
                ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(0)
                : 0}
              ₫
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerDashboard;
