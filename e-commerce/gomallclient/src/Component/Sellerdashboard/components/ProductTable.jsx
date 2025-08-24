import React, { useState, useCallback } from 'react';
import { formatCurrencyWithSymbol } from '../utils/format';

const ProductTable = ({ products, onEdit, onDelete, onSync }) => {
  const [imageErrors, setImageErrors] = useState({});

  // Helper function to get main image - memoized to prevent unnecessary recalculations
  const getMainImage = useCallback((product) => {
    // First check if product has images array with primary image
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
    
    // Check single image field (this is the main issue - seller products use 'image' field)
    if (product.image) {
      return product.image;
    }
    
    // Final fallback to placeholder
    return '/images/placeholder-product.svg';
  }, []);

  // Handle image load error - memoized to prevent unnecessary re-renders
  const handleImageError = useCallback((productId) => {
    setImageErrors(prev => {
      // Only update if not already in error state
      if (prev[productId]) {
        return prev;
      }
      return {
        ...prev,
        [productId]: true
      };
    });
  }, []);

  // Get image source with error handling - memoized
  const getImageSrc = useCallback((product) => {
    if (imageErrors[product.id]) {
      return '/images/placeholder-product.svg';
    }
    return getMainImage(product);
  }, [imageErrors, getMainImage]);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: '80px' }}>Image</th>
            <th style={{ width: '35%' }}>Name</th>
            <th style={{ width: '120px' }}>Price</th>
            <th style={{ width: '120px' }}>Category</th>
            <th style={{ width: '100px' }}>Stock</th>
            <th style={{ width: '120px' }}>Status</th>
            <th style={{ width: '200px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
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
                      // Removed onLoad handler to prevent infinite reloads
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
                    <strong className="text-dark">{p.name}</strong>
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
