import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoryItem from './CategoryItem';
import ProductCard from '../ProductCard/ProductCard';
import './CategoryList.css';

// Default icon mapping for categories (fallback)
const defaultIconMap = {
  'Phones': '📱',
  'Laptops': '💻',
  'Fashion': '👔',
  'Sports': '⚽',
  'Home & Garden': '🏠',
  'Beauty & Cosmetics': '💄',
  'Accessories': '💍',
  'Books': '📚',
  'Vehicles': '🚗',
  'Electronics': '📺',
  'Cameras': '📷',
  'Watches': '⌚',
  'Shoes': '👞',
  'Health': '🏥'
};

// Font Awesome to emoji mapping
const fontAwesomeToEmoji = {
  'fas fa-mobile-alt': '📱',
  'fas fa-laptop': '💻',
  'fas fa-tshirt': '👔',
  'fas fa-dumbbell': '⚽',
  'fas fa-home': '🏠',
  'fas fa-spa': '💄',
  'fas fa-bag-shopping': '💍',
  'fas fa-book': '📚',
  'fas fa-car': '🚗',
  'fas fa-tv': '📺',
  'fas fa-camera': '📷',
  'fas fa-clock': '⌚',
  'fas fa-shoe-prints': '👞',
  'fas fa-heartbeat': '🏥'
};

// Function to get appropriate icon
const getCategoryIcon = (categoryName, serverIcon) => {
  // If server has a Font Awesome icon, convert it to emoji
  if (serverIcon && fontAwesomeToEmoji[serverIcon]) {
    return fontAwesomeToEmoji[serverIcon];
  }
  
  // If server has an emoji icon, use it directly
  if (serverIcon && !serverIcon.startsWith('fas fa-')) {
    return serverIcon;
  }
  
  // Fallback to default icon map
  return defaultIconMap[categoryName] || '🛒';
};

export default function CategoryList() {
  const navigate = useNavigate();
  const { name: routeCategoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const productsPerPage = 4;

  const formatCurrency = (value) => {
    try {
      const number = Number(value || 0);
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number);
    } catch (_) {
      return `${value}`;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // When categories are loaded and route has a category name, auto-select and fetch
  useEffect(() => {
    if (!routeCategoryName || categories.length === 0) return;
    // Find server category by case-insensitive name match
    const match = categories.find(c => String(c.categoryName).toLowerCase() === String(routeCategoryName).toLowerCase());
    if (match && !match.__placeholder) {
      setSelectedCategory(match);
      setShowProducts(true);
      setCurrentPage(1);
      fetchCategoryProducts(match._id, match.categoryName);
    } else {
      // If no valid category, ensure list view
      setShowProducts(false);
      setSelectedCategory(null);
      setCategoryProducts([]);
    }
  }, [routeCategoryName, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/categories');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.categories) {
          // Transform server categories to include icon and styling
          const transformedCategories = data.data.categories.map(category => ({
            _id: category._id,
            categoryName: category.categoryName,
            slug: category.slug || category.categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
            description: category.description || '',
            image: category.image || '',
            icon: getCategoryIcon(category.categoryName, category.icon),
            color: '#2196F3',
            __placeholder: false,
          }));
          
          setCategories(transformedCategories);
        } else {
          console.log('No categories data available from server');
          setCategories([]);
        }
      } else {
        console.log('Categories API not available');
        setCategories([]);
      }
    } catch (error) {
      console.log('Categories API error:', error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryId, categoryName) => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`http://localhost:8080/api/products/category/${encodeURIComponent(categoryName)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data.products)) {
          const mappedProducts = data.data.products.map(product => ({
            _id: product._id,
            name: product.name,
            price: product?.price?.sale || product?.price?.original || 0,
            originalPrice: product?.price?.original || 0,
            discount: product?.price?.original && product?.price?.sale
              ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
              : 0,
            image: product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : '/images/placeholder-product.svg',
            rating: product?.rating || { average: 0, count: 0 },
            sold: product?.sold || 0,
          }));
          setCategoryProducts(mappedProducts);
        } else {
          console.log('No category products data available');
          setCategoryProducts([]);
        }
      } else {
        console.log('Category products API not available');
        setCategoryProducts([]);
      }
    } catch (error) {
      console.log('Category products API error:', error.message);
      setCategoryProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowProducts(true);
    setCurrentPage(1);
    if (category.__placeholder) {
      setCategoryProducts([]);
      setLoadingProducts(false);
      return;
    }
    // Update URL for deep-linking
    navigate(`/category/${encodeURIComponent(category.categoryName)}`);
    fetchCategoryProducts(category._id, category.categoryName);
  };

  const handleBackToCategories = () => {
    setShowProducts(false);
    setSelectedCategory(null);
    setCurrentPage(1);
    setCategoryProducts([]);
    // Navigate back to /category
    navigate('/category');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="category-section">
        <div className="category-container">
          <h2 className="category-title">Loading categories...</h2>
        </div>
      </div>
    );
  }

  if (showProducts && selectedCategory) {
    const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = categoryProducts.slice(startIndex, endIndex);
    
    return (
      <div className="category-section">
        <div className="category-container">
          <div className="category-header">
            <div className="category-header-top">
              <button className="back-button" onClick={handleBackToCategories}>
                ← Back to categories
              </button>
            </div>
            <h2 className="category-title">{selectedCategory.categoryName}</h2>
          </div>
          
          {loadingProducts ? (
            <div className="loading-products">
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {categoryProducts.length === 0 ? (
                <div className="no-products" style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ marginBottom: '8px', color: '#333' }}>No Products Available</h3>
                  <p>Category "{selectedCategory.categoryName}" currently has no products.</p>
                </div>
              ) : (
                <div className="category-products-grid">
                  {currentProducts.map(product => {
                    const sale = product?.price?.sale ?? product?.price ?? 0;
                    const original = product?.price?.original ?? product?.originalPrice ?? 0;
                    const imgSrc = product?.image || (product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : '/images/placeholder-product.svg');
                    const discount = (original && original > sale) ? Math.round(((original - sale) / original) * 100) : 0;
                    const ratingAvg = typeof product?.rating === 'object' ? (product.rating?.average || 0) : (product?.rating || 0);
                    const sold = product?.sold || 0;
                    return (
                      <Link key={product._id} to={`/product/${product._id}`} className="product-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '360px', textDecoration: 'none', color: 'inherit' }}>
                        {discount > 0 && <span className="cat-discount-badge">-{discount}%</span>}
                        <div className="cat-product-image">
                          <img src={imgSrc} alt={product?.name || 'Product'} style={{ objectFit: 'cover', width: '100%', height: '200px', backgroundColor: '#f8f9fa' }} />
                        </div>
                        <div className="cat-product-info">
                          <h3 className="cat-product-name">{product?.name || 'Unnamed product'}</h3>
                          <div className="cat-price-section">
                            <span className="cat-current-price">{formatCurrency(sale)}</span>
                            {original && original > sale && (
                              <span className="cat-original-price">{formatCurrency(original)}</span>
                            )}
                          </div>
                          <div className="cat-product-stats">
                            <span className="cat-rating">★ {ratingAvg}</span>
                            <span className="cat-sold">Sold {sold >= 1000 ? `${(sold/1000).toFixed(1)}k` : sold}</span>
                          </div>
                        </div>
                        <button className="cat-selling-fast-btn">Buy now</button>
                      </Link>
                    );
                  })}
                </div>
              )}
              
              {/* Pagination Dots */}
              {totalPages > 1 && (
                <div className="pagination-dots">
                  <button 
                    className={`arrow-button prev ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      <span className="dot"></span>
                    </button>
                  ))}
                  <button 
                    className={`arrow-button next ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="category-container">
        <h2 className="category-title">Product Categories</h2>
        {categories.length === 0 ? (
          <div className="no-categories" style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <h3 style={{ marginBottom: '8px', color: '#333' }}>No Categories Available</h3>
            <p>No product categories have been created yet.</p>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryItem 
                key={category._id}
                icon={category.icon} 
                name={category.categoryName} 
                color={category.color}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}