import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './sellerdashboard.css'; 

const SellerDashboard = () => {
  // Initial mock data - Đơn giản như product.json
  const initialProducts = [
    { id: 1, name: "Áo thun", price: 120000, category: "Thời trang" },
    { id: 2, name: "Giày thể thao", price: 350000, category: "Giày dép" }
  ];

  const [tab, setTab] = useState(1);
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    categoryID: '',
    description: '',
    image: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Lấy sellerID từ localStorage hoặc API
  const getSellerID = async () => {
    let sellerID = localStorage.getItem('sellerID');
    console.log('Current sellerID from localStorage:', sellerID);
    
    // Nếu không có sellerID trong localStorage, thử lấy từ API
    if (!sellerID) {
      try {
        console.log('No sellerID in localStorage, fetching from API...');
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/sellers/my-status`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.hasApplication && data.data.status === 'approved') {
              sellerID = data.data.sellerID;
              // Lưu vào localStorage
              localStorage.setItem('sellerID', sellerID);
              localStorage.setItem('sellerBusinessName', data.data.businessName);
              console.log('SellerID fetched from API and saved to localStorage:', sellerID);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching sellerID from API:', error);
      }
    }
    
    return sellerID;
  };

  // Function để load sản phẩm từ localStorage - Bền vững như product.json
  const loadProductsFromStorage = () => {
    try {
      const savedProducts = localStorage.getItem('sellerProducts');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          console.log('Products loaded from localStorage:', parsed.length, 'products');
        } else {
          setProducts(initialProducts);
          console.log('Invalid data, using initial products');
        }
      } else {
        setProducts(initialProducts);
        console.log('No saved products, using initial products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(initialProducts);
      console.log('Error occurred, using initial products');
    }
  };



  useEffect(() => {
    const login = localStorage.getItem('isLoggedIn');
    if (login !== 'true') navigate('/login');
    
    // Load products từ localStorage
    loadProductsFromStorage();

    // Load categories từ API
    loadCategories();
  }, [navigate]);

  // Load categories từ API
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data.categories || []);
      } else {
        console.error('Failed to load categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Lưu products vào localStorage mỗi khi thay đổi - Bền vững như product.json
  useEffect(() => {
    // Luôn lưu vào localStorage, không bao giờ xóa
    localStorage.setItem('sellerProducts', JSON.stringify(products));
    console.log('Products saved to localStorage:', products.length, 'products');
  }, [products]);

  // Lưu products vào localStorage khi component unmount (thoát ra)
  useEffect(() => {
    return () => {
      if (products.length > 0) {
        console.log('Component unmounting, saving products to localStorage:', products.length, 'products');
        localStorage.setItem('sellerProducts', JSON.stringify(products));
      }
    };
  }, [products]);

  // Load dữ liệu khi edit mode
  useEffect(() => {
    if (editingProduct && isEditMode) {
      setNewProduct({
        name: editingProduct.name,
        price: editingProduct.price,
        categoryID: editingProduct.categoryID,
        description: editingProduct.description,
        image: editingProduct.image,
        stock: editingProduct.stock
      });
      setImagePreview(editingProduct.image);
    }
  }, [editingProduct, isEditMode]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'danger', text: 'Vui lòng chọn file hình ảnh hợp lệ!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'danger', text: 'Kích thước file không được vượt quá 5MB!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setImagePreview(e.target.result);
          setNewProduct({ ...newProduct, image: e.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewProduct({ ...newProduct, image: url });
    setImagePreview(url);
    setImageFile(null);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setNewProduct({ ...newProduct, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    } else if (newProduct.name.trim().length < 3) {
      newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
    }
    
    if (!newProduct.price) {
      newErrors.price = 'Giá sản phẩm không được để trống';
    } else if (isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải là số dương';
    }
    
    if (!newProduct.categoryID) {
      newErrors.categoryID = 'Vui lòng chọn danh mục';
    }
    
    if (!newProduct.stock) {
      newErrors.stock = 'Số lượng tồn kho không được để trống';
    } else if (isNaN(Number(newProduct.stock)) || Number(newProduct.stock) < 0) {
      newErrors.stock = 'Số lượng tồn kho phải là số không âm';
    }

    if (!newProduct.image) {
      newErrors.image = 'Hình ảnh sản phẩm là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createProductOnServer = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      // Tạo FormData để upload file
      const formData = new FormData();
      
      // Thêm thông tin sản phẩm
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price[original]', productData.price);
      formData.append('inventory[quantity]', productData.stock);
      formData.append('categoryID', productData.categoryID);
      formData.append('brand', 'Thương hiệu riêng');
      formData.append('sku', `SKU-${Date.now()}`);
      formData.append('slug', productData.name.toLowerCase().replace(/\s+/g, '-'));
      
      // Thêm hình ảnh
      if (imageFile) {
        formData.append('images', imageFile);
        formData.append('imageAlts', productData.name);
      } else if (productData.image && productData.image.startsWith('http')) {
        // Nếu là URL, tạo ảnh mặc định
        formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
        formData.append('imageAlts', productData.name);
      }

      console.log('Attempting to connect to:', `${API_BASE_URL}/products`);
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tạo sản phẩm');
      }

      const result = await response.json();
      return result.data.product;
    } catch (error) {
      console.error('Error creating product on server:', error);
      
      // Xử lý lỗi kết nối cụ thể
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
      }
      
      throw error;
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Đang tạo sản phẩm...' });

    try {
      const productData = {
        name: newProduct.name.trim(),
        price: Number(newProduct.price),
        categoryID: newProduct.categoryID, // Sử dụng trực tiếp categoryID
        description: newProduct.description.trim() || 'Không có mô tả',
        image: newProduct.image,
        stock: Number(newProduct.stock)
      };

      let serverProduct = null;
      let isOfflineMode = false;

      try {
        // Thử tạo sản phẩm trên server
        serverProduct = await createProductOnServer(productData);
        console.log('Product created on server:', serverProduct);
      } catch (serverError) {
        console.warn('Server error, falling back to local storage:', serverError);
        isOfflineMode = true;
        
        // Nếu server lỗi, lưu vào localStorage
        if (serverError.message.includes('Không thể kết nối đến server')) {
          setMessage({ type: 'warning', text: 'Server không khả dụng. Sản phẩm sẽ được lưu cục bộ.' });
        }
      }

      // Tìm tên category để hiển thị
      const selectedCategory = categories.find(cat => cat._id === newProduct.categoryID);
      const categoryName = selectedCategory ? selectedCategory.categoryName : 'Không xác định';

      // Lấy sellerID từ localStorage hoặc API
      const sellerID = await getSellerID();
      
      // Tạo sản phẩm mới - Đơn giản như product.json
      const newItem = {
        id: serverProduct?._id || Date.now(),
        name: productData.name,
        price: productData.price,
        category: categoryName,
        categoryID: productData.categoryID,
        description: productData.description,
        image: serverProduct?.images?.[0]?.url || productData.image,
        stock: productData.stock,
        sellerID: sellerID
      };

    setProducts([...products, newItem]);
    
    // Lưu vào localStorage ngay lập tức
    const updatedProducts = [...products, newItem];
    localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Reset form
      setNewProduct({ 
        name: '', 
        price: '', 
        categoryID: '',
        description: '',
        image: '',
        stock: ''
      });
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Hiển thị thông báo thành công
      if (isOfflineMode) {
        setMessage({ 
          type: 'warning', 
          text: 'Sản phẩm đã được lưu cục bộ. Khi server hoạt động trở lại, vui lòng đồng bộ lại.' 
        });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Thêm sản phẩm thành công! Sản phẩm đã được lưu vào hệ thống và có thể tìm kiếm. Bạn có thể thêm sản phẩm tiếp theo.' 
        });
      }
      
      // Reset message sau 5 giây
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'danger', text: `Lỗi khi tạo sản phẩm: ${error.message}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa sản phẩm trên server
  const deleteProductFromServer = async (serverId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/products/${serverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa sản phẩm trên server');
      }

      return true;
    } catch (error) {
      console.error('Error deleting product from server:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      try {
        // Tìm sản phẩm để xóa
        const productToDelete = products.find(p => p.id === id);
        
        // Nếu có serverId, thử xóa trên server
        if (productToDelete && productToDelete.serverId) {
          try {
            await deleteProductFromServer(productToDelete.serverId);
            console.log('Product deleted from server successfully');
          } catch (error) {
            console.warn('Failed to delete product from server, but will delete locally:', error);
          }
        }
        
        // Xóa khỏi state local
        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
        
        // Cập nhật localStorage
        localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
        
        setMessage({ type: 'success', text: 'Xoá sản phẩm thành công!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage({ type: 'danger', text: 'Lỗi khi xoá sản phẩm!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryID: product.categoryID, // Sử dụng ID category để hiển thị
      description: product.description,
      image: product.image,
      stock: product.stock,
      serverId: product.serverId
    });
    setImagePreview(product.image);
    setImageFile(null);
    setIsEditMode(true);
    setTab(3); // Chuyển về tab thêm sản phẩm
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsEditMode(false);
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
    setNewProduct({ 
      name: '', 
      price: '', 
      categoryID: '',
      description: '',
      image: '',
      stock: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateProductOnServer = async (productData, productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      // Tạo FormData để upload file
      const formData = new FormData();
      
      // Thêm thông tin sản phẩm
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price[original]', productData.price);
      formData.append('inventory[quantity]', productData.stock);
      formData.append('categoryID', productData.categoryID);
      formData.append('brand', 'Thương hiệu riêng');
      formData.append('sku', `SKU-${Date.now()}`);
      formData.append('slug', productData.name.toLowerCase().replace(/\s+/g, '-'));
      
      // Thêm hình ảnh
      if (imageFile) {
        formData.append('images', imageFile);
        formData.append('imageAlts', productData.name);
      } else if (productData.image && productData.image.startsWith('http')) {
        // Nếu là URL, tạo ảnh mặc định
        formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
        formData.append('imageAlts', productData.name);
      }

      console.log('Attempting to update product:', productId);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi cập nhật sản phẩm');
      }

      const result = await response.json();
      return result.data.product;
    } catch (error) {
      console.error('Error updating product on server:', error);
      
      // Xử lý lỗi kết nối cụ thể
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
      }
      
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Đang cập nhật sản phẩm...' });

    try {
      const productData = {
        name: newProduct.name.trim(),
        price: Number(newProduct.price),
        categoryID: newProduct.categoryID, // Sử dụng ID category để hiển thị
        description: newProduct.description.trim() || 'Không có mô tả',
        image: newProduct.image,
        stock: Number(newProduct.stock)
      };

      let serverProduct = null;
      let isOfflineMode = false;

      try {
        // Thử cập nhật sản phẩm trên server
        serverProduct = await updateProductOnServer(productData, editingProduct.serverId);
        console.log('Product updated on server:', serverProduct);
      } catch (serverError) {
        console.warn('Server error, falling back to local storage:', serverError);
        isOfflineMode = true;
        
        // Nếu server lỗi, cập nhật local
        if (serverError.message.includes('Không thể kết nối đến server')) {
          setMessage({ type: 'warning', text: 'Server không khả dụng. Sản phẩm sẽ được cập nhật cục bộ.' });
        }
      }

      // Cập nhật sản phẩm trong danh sách - Đơn giản như product.json
      const updatedItem = {
        ...editingProduct,
        name: productData.name,
        price: productData.price,
        category: categories.find(cat => cat._id === newProduct.categoryID)?.categoryName || 'Không xác định',
        categoryID: newProduct.categoryID,
        description: productData.description,
        image: serverProduct?.images?.[0]?.url || productData.image,
        stock: productData.stock
      };

      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? updatedItem : p
      );
      setProducts(updatedProducts);
      
      // Lưu vào localStorage ngay lập tức
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Reset form và edit mode
      cancelEdit();
      
      // Hiển thị thông báo thành công
      if (isOfflineMode) {
        setMessage({ 
          type: 'warning', 
          text: 'Sản phẩm đã được cập nhật cục bộ. Khi server hoạt động trở lại, vui lòng đồng bộ lại.' 
        });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Cập nhật sản phẩm thành công!' 
        });
      }
      
      // Tự động chuyển về tab danh sách sau 3 giây
      setTimeout(() => {
        setTab(1);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage({ type: 'danger', text: `Lỗi khi cập nhật sản phẩm: ${error.message}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (product) => {
    if (product.isOffline) {
      setMessage({ type: 'warning', text: 'Sản phẩm đã ở trạng thái offline, không thể đồng bộ lại.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Đang đồng bộ sản phẩm...' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price[original]', product.price);
      formData.append('inventory[quantity]', product.stock);
      formData.append('categoryID', product.serverId); // Sử dụng serverId để cập nhật
      formData.append('brand', 'Thương hiệu riêng');
      formData.append('sku', product.serverId ? product.serverId.substring(0, 8) + Date.now() : `SKU-${Date.now()}`);
      formData.append('slug', product.name.toLowerCase().replace(/\s+/g, '-'));

      if (product.image && product.image.startsWith('http')) {
        formData.append('images', new File([''], 'default.jpg', { type: 'image/jpeg' }));
        formData.append('imageAlts', product.name);
      } else if (product.image) {
        formData.append('images', new File([product.image], 'product.jpg', { type: 'image/jpeg' }));
        formData.append('imageAlts', product.name);
      }

      const response = await fetch(`${API_BASE_URL}/products/${product.serverId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi đồng bộ sản phẩm');
      }

      const result = await response.json();
      const updatedProduct = result.data.product;

      setProducts(products.map(p => 
        p.id === product.id ? { ...p, serverId: updatedProduct._id, isOffline: false } : p
      ));

      setMessage({ type: 'success', text: 'Đồng bộ sản phẩm thành công!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error syncing product:', error);
      setMessage({ type: 'danger', text: `Lỗi khi đồng bộ sản phẩm: ${error.message}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
    <>
      <div className="seller-dashboard">
        <div className="container">
        <h2>Seller Dashboard</h2>

          {/* Message Display */}
          {message.text && (
            <div className={`alert alert-${message.type}`} onClick={clearMessage}>
              {message.text}
              <button type="button" className="btn-close" onClick={clearMessage}></button>
            </div>
          )}

        <div className="btn-group mb-4">
          <button className={`btn btn-${tab === 1 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(1)}>
              Danh sách sản phẩm ({products.length})
          </button>
          <button className={`btn btn-${tab === 2 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(2)}>
            Thêm sản phẩm
          </button>
          <button className={`btn btn-${tab === 3 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(3)}>
              Sửa sản phẩm
            </button>
            <button className={`btn btn-${tab === 4 ? 'primary' : 'outline-primary'}`} onClick={() => setTab(4)}>
            Thống kê
          </button>
        </div>

        {/* TAB 1: Danh sách sản phẩm */}
        {tab === 1 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                    <th>Hình ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="empty-state">
                          <div className="empty-state-icon">📦</div>
                          <h4>Chưa có sản phẩm nào</h4>
                          <p>Hãy thêm sản phẩm đầu tiên của bạn!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                  <tr key={p.id}>
                         <td>{p.serverId || p.id}</td>
                         <td>
                           <img 
                             src={p.image} 
                             alt={p.name}
                             style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                             onError={(e) => {
                               const target = e.target;
                               if (target && target.src) {
                                 target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                               }
                             }}
                           />
                         </td>
                         <td>
                           <div>
                             <strong>{p.name}</strong>
                             {p.description && p.description !== 'Không có mô tả' && (
                               <div className="text-muted small mt-1">{p.description}</div>
                             )}
                           </div>
                         </td>
                         <td>
                           <span className="fw-bold text-primary">
                             {typeof p.price === 'number' ? p.price.toLocaleString() : Number(p.price || 0).toLocaleString()}₫
                           </span>
                         </td>
                         <td>
                           <span className="badge bg-secondary">{p.category}</span>
                         </td>
                         <td>
                           <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                             {p.stock} {p.stock > 0 ? 'cái' : 'hết hàng'}
                           </span>
                         </td>
                         <td>
                           <div>
                             <span className={`badge ${p.status === 'active' ? 'bg-success' : 'bg-warning'} me-2`}>
                               {p.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                             </span>
                             {p.isOffline && (
                               <span className="badge bg-warning">
                                 <i className="fas fa-wifi me-1"></i>Offline
                               </span>
                             )}
                           </div>
                         </td>
                         <td>
                           <button 
                             className="btn btn-sm btn-warning me-2" 
                             onClick={() => handleEdit(p)}
                           >
                             Sửa
                           </button>
                           {p.isOffline && (
                             <button 
                               className="btn btn-sm btn-info me-2" 
                               onClick={() => handleSync(p)}
                               title="Đồng bộ lên server"
                             >
                               <i className="fas fa-sync-alt"></i>
                             </button>
                           )}
                           <button 
                             className="btn btn-sm btn-danger" 
                             onClick={() => handleDelete(p.id)}
                           >
                        Xoá
                      </button>
                    </td>
                  </tr>
                     ))
                  )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Thêm sản phẩm */}
        {tab === 2 && (
            <div className="add-product-form">
            <h4>Thêm sản phẩm mới</h4>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tên sản phẩm *</label>
            <input
                      placeholder="Nhập tên sản phẩm"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giá (VNĐ) *</label>
            <input
                      placeholder="Nhập giá sản phẩm"
              type="number"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Danh mục *</label>
                    <select
                      className={`form-control ${errors.categoryID ? 'is-invalid' : ''}`}
                      value={newProduct.categoryID}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
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
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
                    {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Hình ảnh sản phẩm *</label>
                    
                    {/* Upload File */}
                    <div className="mb-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageUpload}
                      />
                      <small className="text-muted">Chọn file hình ảnh (JPG, PNG, GIF) - Tối đa 5MB</small>
                    </div>

                    {/* URL Input */}
                    <div className="mb-2">
                      <input
                        placeholder="Hoặc nhập URL hình ảnh"
                        className="form-control"
                        value={newProduct.image}
                        onChange={handleImageUrlChange}
                      />
                      <small className="text-muted">Nhập URL hình ảnh nếu không upload file</small>
                    </div>

                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}

                    {/* Image Preview */}
                    {imagePreview && (
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
                            onClick={clearImage}
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
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button 
                  className="btn btn-success me-3" 
                  onClick={handleAdd}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus me-2"></i>
                      Thêm sản phẩm
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setNewProduct({ 
                      name: '', 
                      price: '', 
                      categoryID: '',
                      description: '',
                      image: '',
                      stock: ''
                    });
                    setImagePreview(null);
                    setImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={isLoading}
                >
                  Làm mới
                </button>
              </div>

              {/* Info Box */}
              <div className="alert alert-info mt-4">
                <h6><i className="fas fa-info-circle me-2"></i>Thông tin quan trọng:</h6>
                <ul className="mb-0">
                  <li>Sản phẩm sau khi thêm sẽ được lưu vào <strong>hệ thống chính</strong></li>
                  <li>Người dùng có thể <strong>tìm kiếm và mua</strong> sản phẩm của bạn</li>
                  <li>Hình ảnh sẽ được <strong>upload lên server</strong> để hiển thị công khai</li>
                  <li>Sản phẩm sẽ xuất hiện trong <strong>danh sách sản phẩm chung</strong></li>
                </ul>
              </div>
            </div>
          )}

        {/* TAB 3: Sửa sản phẩm */}
        {tab === 3 && (
            <div className="edit-product-form">
              <h4>Sửa sản phẩm</h4>
              
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tên sản phẩm *</label>
            <input
                        placeholder="Nhập tên sản phẩm"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Giá (VNĐ) *</label>
            <input
                        placeholder="Nhập giá sản phẩm"
              type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Danh mục *</label>
                      <select
                        className={`form-control ${errors.categoryID ? 'is-invalid' : ''}`}
                        value={newProduct.categoryID}
                        onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
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
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      />
                      {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Hình ảnh sản phẩm *</label>
                      
                      {/* Upload File */}
                      <div className="mb-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={handleImageUpload}
                        />
                        <small className="text-muted">Chọn file hình ảnh mới (JPG, PNG, GIF) - Tối đa 5MB</small>
                      </div>

                      {/* URL Input */}
                      <div className="mb-2">
            <input
                          placeholder="Hoặc nhập URL hình ảnh mới"
                          className="form-control"
                          value={newProduct.image}
                          onChange={handleImageUrlChange}
                        />
                        <small className="text-muted">Nhập URL hình ảnh mới nếu không upload file</small>
                      </div>

                      {errors.image && <div className="invalid-feedback">{errors.image}</div>}

                      {/* Image Preview */}
                      {imagePreview && (
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
                              onClick={clearImage}
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
                        rows="3"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {editingProduct && (
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-primary me-3" 
                    onClick={handleUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={cancelEdit}
                    disabled={isLoading}
                  >
                    Hủy sửa
            </button>
          </div>
        )}

              {/* Info Box */}
              <div className="alert alert-info mt-4">
                <h6><i className="fas fa-info-circle me-2"></i>Thông tin quan trọng:</h6>
                <ul className="mb-0">
                  <li>Sản phẩm sẽ được <strong>cập nhật trên server</strong> nếu kết nối thành công</li>
                  <li>Nếu server lỗi, sản phẩm sẽ được <strong>cập nhật cục bộ</strong></li>
                  <li>Hình ảnh mới sẽ được <strong>upload lên server</strong> khi cập nhật</li>
                  <li>Thay đổi sẽ <strong>hiển thị ngay lập tức</strong> trong danh sách</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: Thống kê */}
          {tab === 4 && (
            <div className="stat-box">
              <h4>Thống kê tổng quan</h4>
              

              
              <div className="row">
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng sản phẩm</div>
                    <div className="stat-value">{products.length}</div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng giá trị</div>
                    <div className="stat-value">
                      {products.length > 0 
                        ? (products.reduce((sum, p) => sum + p.price * p.stock, 0)).toLocaleString()
                        : 0
                      }₫
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Giá trung bình</div>
                    <div className="stat-value">
                      {products.length > 0
                        ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)
                        : 0
                      }₫
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="stat-item">
                    <div className="stat-label">Tổng tồn kho</div>
                    <div className="stat-value">
                      {products.reduce((sum, p) => sum + p.stock, 0)}
                    </div>
                  </div>
                </div>
              </div>

              {products.length > 0 && (
                <div className="mt-4">
                  <h5>Danh mục sản phẩm</h5>
                  <div className="row">
                    {Object.entries(
                      products.reduce((acc, p) => {
                        acc[p.category] = (acc[p.category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count]) => (
                      <div key={category} className="col-md-4 mb-2">
                        <div className="stat-item">
                          <div className="stat-label">{category}</div>
                          <div className="stat-value">{count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
