export const validateProduct = (product) => {
  const errors = {
    name: '',
    price: '',
    categoryID: '',
    description: '',
    image: '',
    stock: ''
  };
  
  if (!product.name.trim()) {
    errors.name = 'Tên sản phẩm không được để trống';
  } else if (product.name.trim().length < 3) {
    errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
  }
  
  if (!product.price) {
    errors.price = 'Giá sản phẩm không được để trống';
  } else if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
    errors.price = 'Giá sản phẩm phải là số dương';
  }
  
  if (!product.categoryID) {
    errors.categoryID = 'Vui lòng chọn danh mục';
  }
  
  if (!product.stock) {
    errors.stock = 'Số lượng tồn kho không được để trống';
  } else if (isNaN(Number(product.stock)) || Number(product.stock) < 0) {
    errors.stock = 'Số lượng tồn kho phải là số không âm';
  }

  if (!product.image) {
    errors.image = 'Hình ảnh sản phẩm là bắt buộc';
  }
  
  // Fix: Check if any errors exist instead of counting keys
  const hasErrors = Object.values(errors).some(Boolean);
  
  return {
    errors,
    isValid: !hasErrors
  };
};
