import React from 'react';

const ImageGrid = ({ 
  productImages, 
  onRemoveImage, 
  onReorderImages, 
  onClearImages,
  showMultiple = true 
}) => {
  if (!showMultiple || productImages.length === 0) return null;

  return (
    <div className="image-preview-container">
      <h6 className="mb-2">Ảnh đã chọn ({productImages.length}/6):</h6>
      <div className="row">
        {productImages.map((image, index) => (
          <div key={index} className="col-md-4 mb-2">
            <div className="image-preview position-relative">
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => onRemoveImage(index)}
                title="Xóa ảnh"
              >
                ×
              </button>
              {index === 0 && (
                <div className="primary-badge">
                  <small>Ảnh chính</small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <small className="text-muted">
        Ảnh đầu tiên sẽ là ảnh chính. Kéo thả để sắp xếp lại thứ tự.
      </small>
    </div>
  );
};

export default ImageGrid;
