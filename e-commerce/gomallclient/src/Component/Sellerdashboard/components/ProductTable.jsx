import React from 'react';
import { formatCurrencyWithSymbol } from '../utils/format';

const ProductTable = ({ products, onEdit, onDelete, onSync }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>
                  <h4>No products yet</h4>
                  <p>Add your first product!</p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.serverId || p.id}</td>
                <td>
                  <img 
                    src={p.image} 
                    alt={p.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={() => {
                      // Fallback to placeholder image
                    }}
                  />
                </td>
                <td>
                  <div>
                    <strong>{p.name}</strong>
                    {p.description && p.description !== 'No description available' && (
                      <div className="text-muted small mt-1">{p.description}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="fw-bold text-primary">
                    {formatCurrencyWithSymbol(p.price)}
                  </span>
                </td>
                <td>
                  <span className="badge bg-secondary">{p.category}</span>
                </td>
                <td>
                  <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {p.stock} {p.stock > 0 ? 'items' : 'out of stock'}
                  </span>
                </td>
                <td>
                  <div>
                    <span className={`badge ${p.status === 'active' ? 'bg-success' : 'bg-warning'} me-2`}>
                      {p.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                    {p.isOffline && (
                      <span className="badge bg-warning">
                        <i className="fas fa-wifi me-1"></i>Offline
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                  {p.isOffline && (
                    <button 
                      className="btn btn-sm btn-info me-2" 
                      onClick={() => onSync(p)}
                      title="Sync to server"
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
