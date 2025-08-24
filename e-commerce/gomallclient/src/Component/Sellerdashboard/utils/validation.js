export const validateProduct = (product) => {
  const errors = {
    name: '',
    price: '',
    categoryID: '',
    description: '',
    images: '',
    stock: ''
  };
  
  if (!product.name.trim()) {
    errors.name = 'Product name is required';
  } else if (product.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }
  
  if (!product.price) {
    errors.price = 'Product price is required';
  } else if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
    errors.price = 'Product price must be a positive number';
  }
  
  if (!product.categoryID) {
    errors.categoryID = 'Please select a category';
  }
  
  if (!product.stock) {
    errors.stock = 'Stock quantity is required';
  } else if (isNaN(Number(product.stock)) || Number(product.stock) < 0) {
    errors.stock = 'Stock quantity must be a non-negative number';
  }

  // Multi-image validation
  if (!product.images || product.images.length === 0) {
    errors.images = 'Product images are required';
  } else if (product.images.length > 6) {
    errors.images = 'Maximum 6 images allowed';
  } else {
    // Check if exactly one image is marked as main
    const mainImages = product.images.filter(img => img.isMain);
    if (mainImages.length === 0) {
      errors.images = 'At least one main image is required';
    } else if (mainImages.length > 1) {
      errors.images = 'Only one main image is allowed';
    }
  }
  
  // Fix: Check if any errors exist instead of counting keys
  const hasErrors = Object.values(errors).some(Boolean);
  
  return {
    errors,
    isValid: !hasErrors
  };
};
