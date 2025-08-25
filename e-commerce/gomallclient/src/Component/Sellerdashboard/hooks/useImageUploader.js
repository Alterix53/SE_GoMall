import { useState, useRef, useCallback } from 'react';

export const useImageUploader = () => {
  const [productImages, setProductImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((event, onError) => {
    const files = Array.from(event.target.files || []);
    const maxImages = 6;
    
    // Check if adding these files would exceed the limit
    if (productImages.length + files.length > maxImages) {
      onError(`Maximum ${maxImages} images allowed! Currently have ${productImages.length} images.`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        onError('Please select valid image files!');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        onError('File size cannot exceed 5MB!');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Create preview for new images
    const imagePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            file: file,
            name: file.name,
            isMain: productImages.length === 0 // Only first image is main if no images exist
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(newImages => {
      // Append new images to existing ones
      const updatedImages = [...productImages, ...newImages];
      const updatedFiles = [...imageFiles, ...validFiles];
      
      setProductImages(updatedImages);
      setImageFiles(updatedFiles);
      
      // Set first image as main image preview if no main image exists
      if (productImages.length === 0 && newImages.length > 0) {
        setImagePreview(newImages[0].url);
      }
    });
  }, [productImages, imageFiles]);

  const removeImage = useCallback((index) => {
    setProductImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      
      // Update main image if deleted image was main
      if (prevImages[index].isMain && newImages.length > 0) {
        // Set first remaining image as main
        const updatedImages = newImages.map((img, i) => ({
          ...img,
          isMain: i === 0
        }));
        setImagePreview(updatedImages[0].url);
        return updatedImages;
      } else if (newImages.length === 0) {
        setImagePreview(null);
      }
      
      return newImages;
    });
    
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }, []);

  const setMainImage = useCallback((index) => {
    setProductImages(prevImages => {
      const newImages = prevImages.map((img, i) => ({
        ...img,
        isMain: i === index
      }));
      setImagePreview(newImages[index].url);
      return newImages;
    });
  }, []);

  const reorderImages = useCallback((fromIndex, toIndex) => {
    setProductImages(prevImages => {
      const newImages = [...prevImages];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      
      // Update main image preview if main image moved
      const mainImage = newImages.find(img => img.isMain);
      if (mainImage) {
        setImagePreview(mainImage.url);
      }
      
      return newImages;
    });
    
    setImageFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  const handleImageUrlChange = useCallback((url) => {
    setImagePreview(url);
  }, []);

  const clearImages = useCallback(() => {
    setImagePreview(null);
    setProductImages([]);
    setImageFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const setSingleImage = useCallback((imageUrl) => {
    setImagePreview(imageUrl);
    setProductImages([]);
    setImageFiles([]);
  }, []);

  const getMainImage = useCallback(() => {
    return productImages.find(img => img.isMain) || productImages[0];
  }, [productImages]);

  const getMainImageIndex = useCallback(() => {
    return productImages.findIndex(img => img.isMain);
  }, [productImages]);

  return {
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
  };
};
