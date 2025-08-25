import React, { useState, useEffect } from 'react';
import { validateProduct } from '../utils/validation';
import { useImageUploader } from '../hooks/useImageUploader';
import ImageGrid from './ImageGrid';
import SuccessModal from './SuccessModal';

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
    images: [],
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successProductName, setSuccessProductName] = useState('');
  
  const {
    productImages,
    imageFiles,
    imagePreview,
    fileInputRef,
    handleImageUpload,
    removeImage,
    setMainImage,
    reorderImages,
    handleImageUrlChange,
    clearImages,
    setSingleImage,
    getMainImage,
    getMainImageIndex
  } = useImageUploader();

  // Load editing product data
  useEffect(() => {
    if (mode === 'edit' && editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        categoryID: editingProduct.categoryID,
        description: editingProduct.description,
        images: editingProduct.images || [],
        stock: editingProduct.stock
      });
      setSingleImage(editingProduct.image);
    }
  }, [mode, editingProduct?.id]); // Only depend on editingProduct.id instead of the whole object

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
      setErrors(prev => ({ ...prev, images: errorMessage }));
    });
  };

  const handleSubmit = () => {
    // Prepare images data for validation
    const imagesData = productImages.map(img => ({
      url: img.url,
      isMain: img.isMain
    }));

    // Update form data with current images
    const currentFormData = {
      ...formData,
      images: imagesData
    };

    const validation = validateProduct(currentFormData);
    setErrors(validation.errors);

    if (validation.isValid) {
      const productData = {
        name: currentFormData.name.trim(),
        price: Number(currentFormData.price),
        category: categories.find(cat => cat._id === currentFormData.categoryID)?.categoryName || 'Uncategorized',
        categoryID: currentFormData.categoryID,
        description: currentFormData.description.trim() || 'No description available',
        images: imagesData,
        stock: Number(currentFormData.stock)
      };

      // Show success modal after submission
      const message = mode === 'create' 
        ? 'Product has been successfully created and saved to the system.'
        : 'Product has been successfully updated.';
      
      setSuccessMessage(message);
      setSuccessProductName(productData.name);
      setShowSuccessModal(true);

      // Call onSubmit with enhanced callback
      onSubmit(productData, imageFiles, (response) => {
        // Enhanced success handling
        if (response && response.data) {
          const { product, updateDetails, creationDetails } = response.data;
          
          // Update success message based on response details
          if (mode === 'edit' && updateDetails) {
            const changes = updateDetails.changesSummary;
            const changedFields = [];
            
            if (changes.nameChanged) changedFields.push('name');
            if (changes.priceChanged) changedFields.push('price');
            if (changes.categoryChanged) changedFields.push('category');
            if (changes.stockChanged) changedFields.push('stock');
            if (changes.descriptionChanged) changedFields.push('description');
            if (changes.imagesChanged) changedFields.push('images');
            
            const updatedMessage = `Product updated successfully! Changed fields: ${changedFields.join(', ')}`;
            setSuccessMessage(updatedMessage);
          } else if (mode === 'create' && creationDetails) {
            const features = creationDetails.productFeatures;
            const featureList = [];
            
            if (features.hasImages) featureList.push('images');
            if (features.hasPrice) featureList.push('price');
            if (features.hasCategory) featureList.push('category');
            if (features.hasStock) featureList.push('stock');
            if (features.hasDescription) featureList.push('description');
            
            const createdMessage = `Product created successfully with: ${featureList.join(', ')}`;
            setSuccessMessage(createdMessage);
          }
        }
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      price: '',
      categoryID: '',
      description: '',
      images: [],
      stock: ''
    });
    setErrors({});
    clearImages();
  };

  const getTitle = () => {
    return mode === 'create' ? 'Add New Product' : 'Edit Product';
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return mode === 'create' ? 'Creating...' : 'Updating...';
    }
    return mode === 'create' ? 'Add Product' : 'Save Changes';
  };

  const getSubmitButtonIcon = () => {
    return mode === 'create' ? 'fas fa-plus' : 'fas fa-save';
  };

  const getInfoText = () => {
    if (mode === 'create') {
      return (
        <ul className="mb-0">
          <li>Product will be saved to the <strong>main system</strong></li>
          <li>Users can <strong>search and purchase</strong> your product</li>
          <li>Images will be <strong>uploaded to server</strong> for public display</li>
          <li>Product will appear in the <strong>general product list</strong></li>
        </ul>
      );
    } else {
      return (
        <ul className="mb-0">
          <li>Product will be <strong>updated on server</strong> if connection is successful</li>
          <li>If server fails, product will be <strong>updated locally</strong></li>
          <li>New images will be <strong>uploaded to server</strong> when updating</li>
          <li>Changes will <strong>display immediately</strong> in the list</li>
        </ul>
      );
    }
  };

  return (
    <>
      <div className={`${mode}-product-form`}>
        <h4>{getTitle()}</h4>
        
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Product Name *</label>
              <input
                placeholder="Enter product name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Price (VND) *</label>
              <input
                placeholder="Enter product price"
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Category *</label>
              <select
                className={`form-control ${errors.categoryID ? 'is-invalid' : ''}`}
                value={formData.categoryID}
                onChange={(e) => handleInputChange('categoryID', e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
              {errors.categoryID && <div className="invalid-feedback">{errors.categoryID}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Stock Quantity *</label>
              <input
                placeholder="Enter stock quantity"
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
              <label className="form-label">Product Images *</label>
              
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
                  <small className="text-muted">
                    Select multiple image files (JPG, PNG, GIF) - Current: {productImages.length}/6 images
                    {productImages.length > 0 && (
                      <span className="text-success"> • First image will be the main image</span>
                    )}
                  </small>
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
                  <small className="text-muted">Select new image file (JPG, PNG, GIF) - Max 5MB</small>
                </div>
              )}

              {/* URL Input */}
              <div className="mb-2">
                <input
                  placeholder={mode === 'create' ? "Or enter image URL" : "Or enter new image URL"}
                  className="form-control"
                  value={formData.image}
                  onChange={handleImageUrlInputChange}
                />
                <small className="text-muted">
                  {mode === 'create' ? "Enter image URL if not uploading files" : "Enter new image URL if not uploading files"}
                </small>
              </div>

              {errors.images && <div className="invalid-feedback">{errors.images}</div>}

              {/* Multiple Image Preview for create mode */}
              {mode === 'create' && (
                <ImageGrid
                  productImages={productImages}
                  onRemoveImage={removeImage}
                  onReorderImages={reorderImages}
                  onSetMainImage={setMainImage}
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
              <label className="form-label">Description</label>
              <textarea
                placeholder="Enter product description (optional)"
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
              Reset
            </button>
          ) : (
            <button 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="alert alert-info mt-4">
          <h6><i className="fas fa-info-circle me-2"></i>Important Information:</h6>
          {getInfoText()}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
        productName={successProductName}
        mode={mode}
      />
    </>
  );
};

export default ProductForm;
