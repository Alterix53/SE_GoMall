import React, { useState, useEffect } from 'react';
import { validateProduct } from '../utils/validation';
import { useImageUploader } from '../hooks/useImageUploader';
import ImageGrid from './ImageGrid';

const ProductForm = ({ 
  mode = 'create', // 'create' | 'edit'
  categories = [],
  editingProduct = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryID: '',
    description: '',
    image: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  
  const {
    productImages,
    imageFiles,
    imagePreview,
    fileInputRef,
    handleImageUpload,
    removeImage,
    reorderImages,
    handleImageUrlChange,
    clearImages,
    setSingleImage
  } = useImageUploader();

  // Load editing product data
  useEffect(() => {
    if (mode === 'edit' && editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        categoryID: editingProduct.categoryID,
        description: editingProduct.description,
        image: editingProduct.image,
        stock: editingProduct.stock
      });
      setSingleImage(editingProduct.image);
    }
  }, [mode, editingProduct, setSingleImage]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUrlInputChange = (e) => {
    const url = e.target.value;
    handleInputChange('image', url);
    handleImageUrlChange(url);
  };

  const handleImageFileUpload = (event) => {
    handleImageUpload(event, (errorMessage) => {
      setErrors(prev => ({ ...prev, image: errorMessage }));
    });
  };

  const handleSubmit = () => {
    // Update form data with current image
    const currentFormData = {
      ...formData,
      image: imagePreview || formData.image
    };

    const validation = validateProduct(currentFormData);
    setErrors(validation.errors);

    if (validation.isValid) {
      const productData = {
        name: currentFormData.name.trim(),
        price: Number(currentFormData.price),
        category: categories.find(cat => cat._id === currentFormData.categoryID)?.categoryName || 'Không xác định',
        categoryID: currentFormData.categoryID,
        description: currentFormData.description.trim() || 'Không có mô tả',
        image: currentFormData.image,
        stock: Number(currentFormData.stock)
      };

      onSubmit(productData, imageFiles);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      price: '',
      categoryID: '',
      description: '',
      image: '',
      stock: ''
    });
    setErrors({});
    clearImages();
  };

  const getTitle = () => {
    return mode === 'create' ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm';
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...';
    }
    return mode === 'create' ? 'Thêm sản phẩm' : 'Lưu thay đổi';
  };

  const getSubmitButtonIcon = () => {
    return mode === 'create' ? 'fas fa-plus' : 'fas fa-save';
  };

  const getInfoText = () => {
    if (mode === 'create') {
      return (
        <ul className="mb-0">
          <li>Sản phẩm sau khi thêm sẽ được lưu vào <strong>hệ thống chính</strong></li>
          <li>Người dùng có thể <strong>tìm kiếm và mua</strong> sản phẩm của bạn</li>
          <li>Hình ảnh sẽ được <strong>upload lên server</strong> để hiển thị công khai</li>
          <li>Sản phẩm sẽ xuất hiện trong <strong>danh sách sản phẩm chung</strong></li>
        </ul>
      );
    } else {
      return (
        <ul className="mb-0">
          <li>Sản phẩm sẽ được <strong>cập nhật trên server</strong> nếu kết nối thành công</li>
          <li>Nếu server lỗi, sản phẩm sẽ được <strong>cập nhật cục bộ</strong></li>
          <li>Hình ảnh mới sẽ được <strong>upload lên server</strong> khi cập nhật</li>
          <li>Thay đổi sẽ <strong>hiển thị ngay lập tức</strong> trong danh sách</li>
        </ul>
      );
    }
  };

  return (
    <div className={`${mode}-product-form`}>
      <h4>{getTitle()}</h4>
      
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Tên sản phẩm *</label>
            <input
              placeholder="Nhập tên sản phẩm"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Giá (VNĐ) *</label>
            <input
              placeholder="Nhập giá sản phẩm"
              type="number"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Danh mục *</label>
            <select
              className={`form-control ${errors.categoryID ? 'is-invalid' : ''}`}
              value={formData.categoryID}
              onChange={(e) => handleInputChange('categoryID', e.target.value)}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
              ))}
            </select>
            {errors.categoryID && <div className="invalid-feedback">{errors.categoryID}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Số lượng tồn kho *</label>
            <input
              placeholder="Nhập số lượng"
              type="number"
              className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
            />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Hình ảnh sản phẩm *</label>
            
            {/* Upload File - Support multiple images for create mode */}
            {mode === 'create' && (
              <div className="mb-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control"
                  onChange={handleImageFileUpload}
                />
                <small className="text-muted">Chọn nhiều file hình ảnh (JPG, PNG, GIF) - Tối đa 6 ảnh, mỗi ảnh tối đa 5MB</small>
              </div>
            )}

            {/* Upload File - Single image for edit mode */}
            {mode === 'edit' && (
              <div className="mb-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageFileUpload}
                />
                <small className="text-muted">Chọn file hình ảnh mới (JPG, PNG, GIF) - Tối đa 5MB</small>
              </div>
            )}

            {/* URL Input */}
            <div className="mb-2">
              <input
                placeholder={mode === 'create' ? "Hoặc nhập URL hình ảnh" : "Hoặc nhập URL hình ảnh mới"}
                className="form-control"
                value={formData.image}
                onChange={handleImageUrlInputChange}
              />
              <small className="text-muted">
                {mode === 'create' ? "Nhập URL hình ảnh nếu không upload file" : "Nhập URL hình ảnh mới nếu không upload file"}
              </small>
            </div>

            {errors.image && <div className="invalid-feedback">{errors.image}</div>}

            {/* Multiple Image Preview for create mode */}
            {mode === 'create' && (
              <ImageGrid
                productImages={productImages}
                onRemoveImage={removeImage}
                onReorderImages={reorderImages}
                onClearImages={clearImages}
                showMultiple={true}
              />
            )}

            {/* Single Image Preview for edit mode */}
            {mode === 'edit' && imagePreview && productImages.length === 0 && (
              <div className="image-preview-container mt-3">
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="preview-image"
                  />
                  <button 
                    type="button" 
                    className="btn-remove-image"
                    onClick={clearImages}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả sản phẩm (tùy chọn)"
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button 
          className={`btn ${mode === 'create' ? 'btn-success' : 'btn-primary'} me-3`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {getSubmitButtonText()}
            </>
          ) : (
            <>
              <i className={`${getSubmitButtonIcon()} me-2`}></i>
              {getSubmitButtonText()}
            </>
          )}
        </button>
        
        {mode === 'create' ? (
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            disabled={isLoading}
          >
            Làm mới
          </button>
        ) : (
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy sửa
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="alert alert-info mt-4">
        <h6><i className="fas fa-info-circle me-2"></i>Thông tin quan trọng:</h6>
        {getInfoText()}
      </div>
    </div>
  );
};

export default ProductForm;
