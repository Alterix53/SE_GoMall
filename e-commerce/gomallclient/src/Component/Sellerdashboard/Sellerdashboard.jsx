import React, { useState, useEffect } from 'react';
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
    createProduct, 
    updateProduct, 
    deleteProduct, 
    syncProduct 
  } = useSellerProducts();

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleCreateProduct = async (productData, imageFiles) => {
    try {
      showMessage('info', 'Đang tạo sản phẩm...');
      
      const result = await createProduct(productData, imageFiles);
      
      if (result.isOfflineMode) {
        showMessage('warning', 'Sản phẩm đã được lưu cục bộ. Khi server hoạt động trở lại, vui lòng đồng bộ lại.');
      } else {
        showMessage('success', 'Thêm sản phẩm thành công! Sản phẩm đã được lưu vào hệ thống và có thể tìm kiếm. Bạn có thể thêm sản phẩm tiếp theo.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showMessage('danger', `Lỗi khi tạo sản phẩm: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (productData, imageFiles) => {
    try {
      showMessage('info', 'Đang cập nhật sản phẩm...');
      
      const result = await updateProduct(editingProduct.id, productData, imageFiles);
      
      // Reset edit mode
      setEditingProduct(null);
      setIsEditMode(false);
      
      if (result.isOfflineMode) {
        showMessage('warning', 'Sản phẩm đã được cập nhật cục bộ. Khi server hoạt động trở lại, vui lòng đồng bộ lại.');
      } else {
        showMessage('success', 'Cập nhật sản phẩm thành công!');
      }
      
      // Auto switch to list tab after 3 seconds
      setTimeout(() => {
        setTab(1);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating product:', error);
      showMessage('danger', `Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      try {
        await deleteProduct(productId);
        showMessage('success', 'Xoá sản phẩm thành công!', 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
        showMessage('danger', 'Lỗi khi xoá sản phẩm!', 3000);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      categoryID: product.categoryID,
      description: product.description,
      image: product.image,
      stock: product.stock,
      serverId: product.serverId
    });
    setIsEditMode(true);
    setTab(3); // Switch to edit tab
  };

  const handleSyncProduct = async (product) => {
    try {
      showMessage('info', 'Đang đồng bộ sản phẩm...');
      
      await syncProduct(product.id);
      
      showMessage('success', 'Đồng bộ sản phẩm thành công!', 3000);
    } catch (error) {
      console.error('Error syncing product:', error);
      showMessage('danger', `Lỗi khi đồng bộ sản phẩm: ${error.message}`, 5000);
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
          <h2>Seller Dashboard</h2>

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
                    <h4>Chưa chọn sản phẩm để sửa</h4>
                    <p>Vui lòng vào "Danh sách sản phẩm" và click nút "Sửa" để chọn sản phẩm cần sửa</p>
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={() => setTab(1)}
                    >
                      <i className="fas fa-list me-2"></i>
                      Xem danh sách sản phẩm
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
