import { useState, useRef } from 'react';

export const useImageUploader = () => {
  const [productImages, setProductImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event, onError) => {
    const files = Array.from(event.target.files || []);
    const maxImages = 6;
    
    if (files.length > maxImages) {
      onError(`Chỉ được upload tối đa ${maxImages} ảnh!`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        onError('Vui lòng chọn file hình ảnh hợp lệ!');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        onError('Kích thước file không được vượt quá 5MB!');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Update state for multiple images
    setImageFiles(validFiles);
    
    // Create preview for all images
    const imagePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            file: file,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setProductImages(images);
      // Set first image as main image
      setImagePreview(images[0]?.url || null);
    });
  };

  const removeImage = (index) => {
    const newImages = productImages.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    
    setProductImages(newImages);
    setImageFiles(newFiles);
    
    // Update main image if deleted image was first
    if (index === 0 && newImages.length > 0) {
      setImagePreview(newImages[0].url);
    } else if (newImages.length === 0) {
      setImagePreview(null);
    }
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...productImages];
    const newFiles = [...imageFiles];
    
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedFile] = newFiles.splice(fromIndex, 1);
    
    newImages.splice(toIndex, 0, movedImage);
    newFiles.splice(toIndex, 0, movedFile);
    
    setProductImages(newImages);
    setImageFiles(newFiles);
    
    // Update main image if first image changed
    if (fromIndex === 0 || toIndex === 0) {
      setImagePreview(newImages[0]?.url || null);
    }
  };

  const handleImageUrlChange = (url) => {
    setImagePreview(url);
  };

  const clearImages = () => {
    setImagePreview(null);
    setProductImages([]);
    setImageFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setSingleImage = (imageUrl) => {
    setImagePreview(imageUrl);
    setProductImages([]);
    setImageFiles([]);
  };

  return {
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
  };
};
