import React, { useState } from 'react';
import { formatCurrencyWithSymbol } from '../utils/format';

const ProductTable = ({ products, onEdit, onDelete, onSync }) => {
  const [imageErrors, setImageErrors] = useState({});

  // Helper function to get main image
  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) {
      // Find the primary image
      const primaryImage = product.images.find(img => img.isPrimary);
      if (primaryImage && primaryImage.url) {
        return primaryImage.url;
      }
      // Fallback to first image if no primary is set
      if (product.images[0] && product.images[0].url) {
        return product.images[0].url;
      }
    }
    // Fallback to single image field
    if (product.image) {
      return product.image;
    }
    // Final fallback to placeholder
    return '/images/placeholder-product.svg';
  };

  // Handle image load error
  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Get image source with error handling
  const getImageSrc = (product) => {
    if (imageErrors[product.id]) {
      return '/images/placeholder-product.svg';
    }
    return getMainImage(product);
  };

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
                  <div className="product-image-container">
                    <img 
                      src={getImageSrc(p)} 
                      alt={p.name}
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                      onError={() => handleImageError(p.id)}
                      onLoad={() => {
                        // Clear error state if image loads successfully
                        if (imageErrors[p.id]) {
                          setImageErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[p.id];
                            return newErrors;
                          });
                        }
                      }}
                    />
                    {imageErrors[p.id] && (
                      <div className="image-error-indicator" title="Image failed to load">
                        <i className="fas fa-exclamation-triangle text-warning"></i>
                      </div>
                    )}
                  </div>
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
