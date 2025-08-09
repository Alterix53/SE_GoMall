import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import ProductCard from '../ProductCard/ProductCard';
import './CategoryList.css';

// Category icon mapping for display
const categoryIconMap = {
  'Fashion': '👔',
  'Phones': '📱',
  'Electronics': '📺',
  'Laptops': '💻',
  'Cameras': '📷',
  'Watches': '⌚',
  'Shoes': '👞',
  'Home & Garden': '🏠',
  'Beauty & Cosmetics': '💄',
  'Sports': '⚽',
  'Books': '📚',
  'Health': '🏥',
  'Accessories': '💍',
  'Gaming': '🎮',
  'Auto': '🛵',
  'Baby': '👶',
  'Other': '🛒'
};



export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const productsPerPage = 4;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/categories');
      let serverCategories = [];
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.categories) {
          serverCategories = data.data.categories;
        }
      }

      // Merge: ensure ALL categories defined in categoryIconMap are displayed
      const nameToServerCategory = new Map(
        (serverCategories || []).map((c) => [c.categoryName, c])
      );

      const mergedCategories = Object.keys(categoryIconMap).map((categoryName) => {
        const fromServer = nameToServerCategory.get(categoryName) || null;
        const base = fromServer || {
          _id: `placeholder-${categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`,
          categoryName,
          slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
          description: '',
        };
        return {
          ...base,
          icon: categoryIconMap[categoryName] || '🛒',
          color: '#2196F3',
          __placeholder: !fromServer,
        };
      });

      setCategories(mergedCategories);
    } catch (error) {
      console.log('Categories API error:', error.message);
      // Still show full list from icon map as placeholders so UI is complete
      const mergedCategories = Object.keys(categoryIconMap).map((categoryName) => ({
        _id: `placeholder-${categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`,
        categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
        icon: categoryIconMap[categoryName] || '🛒',
        color: '#2196F3',
        __placeholder: true,
      }));
      setCategories(mergedCategories);
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
            image: product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : '/images/default-product.jpg',
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
    fetchCategoryProducts(category._id, category.categoryName);
  };

  const handleBackToCategories = () => {
    setShowProducts(false);
    setSelectedCategory(null);
    setCurrentPage(1);
    setCategoryProducts([]);
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
          <h2 className="category-title">Đang tải danh mục...</h2>
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
                ← Quay lại danh mục
              </button>
            </div>
            <h2 className="category-title">{selectedCategory.categoryName}</h2>
          </div>
          
          {loadingProducts ? (
            <div className="loading-products">
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <>
              {categoryProducts.length === 0 ? (
                <div className="no-products" style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                  Chưa có sản phẩm trong danh mục này
                </div>
              ) : (
                <div className="products-grid">
                  {currentProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
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
        <h2 className="category-title">Danh Mục Sản Phẩm</h2>
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
      </div>
    </div>
  );
}