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

// Fallback categories in case API fails
const fallbackCategories = [
  // Row 1 (7 categories)
  { _id: 'cat1', categoryName: 'Fashion', icon: '👔', color: '#2196F3' },
  { _id: 'cat2', categoryName: 'Phones', icon: '📱', color: '#2196F3' },
  { _id: 'cat3', categoryName: 'Electronics', icon: '📺', color: '#2196F3' },
  { _id: 'cat4', categoryName: 'Laptops', icon: '💻', color: '#2196F3' },
  { _id: 'cat5', categoryName: 'Cameras', icon: '📷', color: '#2196F3' },
  { _id: 'cat6', categoryName: 'Watches', icon: '⌚', color: '#2196F3' },
  { _id: 'cat7', categoryName: 'Shoes', icon: '👞', color: '#2196F3' },
  // Row 2 (7 categories)
  { _id: 'cat8', categoryName: 'Home & Garden', icon: '🏠', color: '#2196F3' },
  { _id: 'cat9', categoryName: 'Beauty & Cosmetics', icon: '💄', color: '#2196F3' },
  { _id: 'cat10', categoryName: 'Sports', icon: '⚽', color: '#2196F3' },
  { _id: 'cat11', categoryName: 'Books', icon: '📚', color: '#2196F3' },
  { _id: 'cat12', categoryName: 'Health', icon: '🏥', color: '#2196F3' },
  { _id: 'cat13', categoryName: 'Accessories', icon: '💍', color: '#2196F3' },
  { _id: 'cat14', categoryName: 'Gaming', icon: '🎮', color: '#2196F3' },
  // Row 3 (7 categories)
  { _id: 'cat15', categoryName: 'Auto', icon: '🛵', color: '#2196F3' },
  { _id: 'cat16', categoryName: 'Baby', icon: '👶', color: '#2196F3' },
  { _id: 'cat17', categoryName: 'Jewelry', icon: '💎', color: '#2196F3' },
  { _id: 'cat18', categoryName: 'Music', icon: '🎵', color: '#2196F3' },
  { _id: 'cat19', categoryName: 'Toys', icon: '🧸', color: '#2196F3' },
  { _id: 'cat20', categoryName: 'Pet Supplies', icon: '🐕', color: '#2196F3' },
  { _id: 'cat21', categoryName: 'Office', icon: '🏢', color: '#2196F3' },
];

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
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Map API categories to include icons
          const categoriesWithIcons = data.data.map(category => ({
            ...category,
            icon: categoryIconMap[category.categoryName] || '🛒',
            color: '#2196F3'
          }));
          setCategories(categoriesWithIcons);
        } else {
          console.log('Using fallback categories');
          setCategories(fallbackCategories);
        }
      } else {
        console.log('Using fallback categories');
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.log('Categories API error, using fallback data:', error.message);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryId, categoryName) => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`http://localhost:8080/api/categories/${categoryId}/products`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCategoryProducts(data.data);
        } else {
          // Generate fallback products for the category
          const fallbackProducts = Array.from({ length: 8 }, (_, index) => ({
            _id: `${categoryId}_${index + 1}`,
            name: `Sample ${categoryName} Product ${index + 1}`,
            price: { sale: Math.floor(Math.random() * 1000000) + 100000 },
            images: [{ url: `https://via.placeholder.com/200x200?text=${categoryName}+${index + 1}` }],
            rating: { average: (Math.random() * 2 + 3).toFixed(1) },
            sold: Math.floor(Math.random() * 500) + 10
          }));
          setCategoryProducts(fallbackProducts);
        }
      } else {
        // Generate fallback products for the category
        const fallbackProducts = Array.from({ length: 8 }, (_, index) => ({
          _id: `${categoryId}_${index + 1}`,
          name: `Sample ${categoryName} Product ${index + 1}`,
          price: { sale: Math.floor(Math.random() * 1000000) + 100000 },
          images: [{ url: `https://via.placeholder.com/200x200?text=${categoryName}+${index + 1}` }],
          rating: { average: (Math.random() * 2 + 3).toFixed(1) },
          sold: Math.floor(Math.random() * 500) + 10
        }));
        setCategoryProducts(fallbackProducts);
      }
    } catch (error) {
      console.log('Category products API error, using fallback data:', error.message);
      // Generate fallback products for the category
      const fallbackProducts = Array.from({ length: 8 }, (_, index) => ({
        _id: `${categoryId}_${index + 1}`,
        name: `Sample ${categoryName} Product ${index + 1}`,
        price: { sale: Math.floor(Math.random() * 1000000) + 100000 },
        images: [{ url: `https://via.placeholder.com/200x200?text=${categoryName}+${index + 1}` }],
        rating: { average: (Math.random() * 2 + 3).toFixed(1) },
        sold: Math.floor(Math.random() * 500) + 10
      }));
      setCategoryProducts(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowProducts(true);
    setCurrentPage(1);
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
              <div className="products-grid">
                {currentProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
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