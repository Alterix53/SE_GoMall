import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sellerdashboard.css';

// Hooks
import { useAuthRedirect } from './hooks/useAuthRedirect';
import { useSellerProducts } from './hooks/useSellerProducts';
import { useCategories } from './hooks/useCategories';

// Components
import AlertMessage from './components/AlertMessage';
import Tabs from './components/Tabs';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import StatsPanel from './components/StatsPanel';

const SellerDashboard = () => {
  
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Use custom hooks
  useAuthRedirect();
  
  const { categories } = useCategories();
  
  const { 
    products, 
    isLoading, 
    isInitialized,
    serverError,
    setIsLoading,
    setServerError,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    syncProduct,
    refreshProducts
  } = useSellerProducts();

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefreshProducts = async () => {
    try {
      showMessage('info', 'Refreshing products from server...');
      await refreshProducts();
      showMessage('success', 'Products refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing products:', error);
      showMessage('danger', 'Failed to refresh products. Please try again.');
    }
  };



  const handleCreateProduct = async (productData, imageFiles, callback) => {
    try {
      showMessage('info', 'Creating product...');
      
      const result = await createProduct(productData, imageFiles);
      
      if (result.isOfflineMode) {
        showMessage('warning', 'Product has been created locally. When the server is back online, please sync again.');
      } else {
        showMessage('success', 'Product created successfully!');
        
        // Call callback with enhanced response if provided
        if (callback && typeof callback === 'function') {
          callback(result);
        }
      }
      
      // Auto switch to list tab after 3 seconds
      setTimeout(() => {
        setTab(1);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      showMessage('danger', `Error creating product: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (productData, imageFiles, callback) => {
    try {
      showMessage('info', 'Updating product...');
      
      const result = await updateProduct(editingProduct.id, productData, imageFiles);
      
      // Reset edit mode
      setEditingProduct(null);
      setIsEditMode(false);
      
      if (result.isOfflineMode) {
        showMessage('warning', 'Product has been updated locally. When the server is back online, please sync again.');
      } else {
        showMessage('success', 'Product updated successfully!');
        
        // Call callback with enhanced response if provided
        if (callback && typeof callback === 'function') {
          callback(result);
        }
      }
      
      // Auto switch to list tab after 3 seconds
      setTimeout(() => {
        setTab(1);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating product:', error);
      showMessage('danger', `Error updating product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        showMessage('success', 'Product deleted successfully!', 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
        showMessage('danger', 'Error deleting product!', 3000);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryID: product.categoryID,
      description: product.description,
      image: product.image,
      images: product.images,
      stock: product.stock
    });
    setIsEditMode(true);
    setTab(3);
  };

  const handleSyncProduct = async (product) => {
    try {
      showMessage('info', 'Syncing product...');
      
      await syncProduct(product.id);
      
      showMessage('success', 'Product synced successfully!', 3000);
    } catch (error) {
      console.error('Error syncing product:', error);
      showMessage('danger', `Error syncing product: ${error.message}`, 5000);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setIsEditMode(false);
  };

  return (
    <>
      <div className="seller-dashboard">
        <div className="container">
          {/* Header with Home Button */}
          <div className="dashboard-header">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Seller Dashboard</h2>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleRefreshProducts}
                  disabled={isLoading}
                >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-2`}></i>
                  Refresh
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={handleGoHome}
                >
                  <i className="fas fa-home me-2"></i>
                  Back to Home
                </button>
              </div>
            </div>
          </div>



          {/* Server Error Alert */}
          {serverError && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Server Connection Issue:</strong> {serverError}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => window.location.reload()}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Message Display */}
          <AlertMessage message={message} onClear={clearMessage} />

          {/* Tabs Navigation */}
          <Tabs 
            activeTab={tab} 
            onTabChange={setTab} 
            productsCount={products.length} 
          />

          {/* TAB 1: Product List */}
          {tab === 1 && (
            <ProductTable 
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onSync={handleSyncProduct}
            />
          )}

          {/* TAB 2: Add Product */}
          {tab === 2 && (
            <ProductForm
              mode="create"
              categories={categories}
              onSubmit={handleCreateProduct}
              onCancel={() => setTab(1)}
              isLoading={isLoading}
            />
          )}

          {/* TAB 3: Edit Product */}
          {tab === 3 && (
            <>
              {!editingProduct ? (
                <div className="text-center py-5">
                  <div className="empty-state">
                    <div className="empty-state-icon">✏️</div>
                    <h4>No product selected for editing</h4>
                    <p>Please go to "Product List" and click the "Edit" button to select a product to edit</p>
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={() => setTab(1)}
                    >
                      <i className="fas fa-list me-2"></i>
                      View Product List
                    </button>
                  </div>
                </div>
              ) : (
                <ProductForm
                  mode="edit"
                  categories={categories}
                  editingProduct={editingProduct}
                  onSubmit={handleUpdateProduct}
                  onCancel={handleCancelEdit}
                  isLoading={isLoading}
                />
              )}
            </>
          )}

          {/* TAB 4: Statistics */}
          {tab === 4 && (
            <StatsPanel products={products} />
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
