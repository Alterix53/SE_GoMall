import React from 'react';

const ImageGrid = ({ 
  productImages, 
  onRemoveImage, 
  onReorderImages, 
  onSetMainImage,
  onClearImages,
  showMultiple = true 
}) => {
  if (!showMultiple || productImages.length === 0) return null;

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorderImages(dragIndex, dropIndex);
    }
  };

  return (
    <div className="image-preview-container">
      <h6 className="mb-2">Selected Images ({productImages.length}/6):</h6>
      <div className="row">
        {productImages.map((image, index) => (
          <div 
            key={index} 
            className="col-md-4 mb-2"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="image-preview position-relative">
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
              
              {/* Remove button */}
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => onRemoveImage(index)}
                title="Remove image"
              >
                ×
              </button>
              
              {/* Main image badge */}
              {image.isMain && (
                <div className="primary-badge">
                  <small>Main</small>
                </div>
              )}
              
              {/* Set as main button */}
              {!image.isMain && (
                <button
                  type="button"
                  className="btn-set-main"
                  onClick={() => onSetMainImage(index)}
                  title="Set as main image"
                >
                  <i className="fas fa-star"></i>
                </button>
              )}
              
              {/* Drag handle */}
              <div className="drag-handle" title="Drag to reorder">
                <i className="fas fa-grip-vertical"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="image-controls mt-2">
        <small className="text-muted">
          • First image will be the main image by default
          • Drag and drop to reorder images
          • Click the star to set as main image
          • Click × to remove image
          • You can upload more images (max 6 images)
        </small>
      </div>
    </div>
  );
};

export default ImageGrid;
