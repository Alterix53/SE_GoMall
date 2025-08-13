// Minh

import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import SearchBar from "./Component/SearchBar/SearchBar"
import ProductCard from "./Component/ProductCard/ProductCard"
import "./SearchResult.css"

// Categories and brands for filters - Updated to match backend data
const categories = [
  "Phones", "Laptops", "Fashion", "Beauty & Cosmetics", "Home & Garden", "Books", "Sports", "Vehicles", "Accessories", "Electronics"
];
const brands = [
  "Apple", "Samsung", "Nike", "Adidas", "Gucci", "Sony", "Dell", "Philips", "iPhone", "MacBook"
];

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sortBy, setSortBy] = useState("relevant")
  const [searchResults, setSearchResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const searchQuery = searchParams.get("keyword") || ""

  // Fetch search results from API
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (!searchQuery.trim()) {
          setSearchResults([]);
          setFilteredResults([]);
          return;
        }
        const params = new URLSearchParams({
          keyword: searchQuery,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? '-price' : 'createdAt'
        });
        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories.join(','));
        }
        const response = await fetch(`http://localhost:8080/api/products/search?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        if (data.success && data.data?.products) {
          console.log('Raw products from API:', data.data.products);
          const products = data.data.products.map(product => {
            const mappedProduct = {
              id: product._id,
              name: product.name || "Unknown Product",
              price: product.price?.sale || product.price?.original || 0,
              originalPrice: product.price?.original || 0,
              image: product.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : "/images/default-product.jpg",
              rating: product.rating?.average || 0,
              reviewCount: product.rating?.count || 0,
              sold: product.sold || 0,
              discount: product.price?.original && product.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
              category: product.categoryID?.categoryName || product.category || "Unknown",
              brand: product.brand || "Unknown"
            };
            console.log('Mapped product:', mappedProduct);
            return mappedProduct;
          });
          console.log('Final products array:', products);
          setSearchResults(products);
          setFilteredResults(products);
        } else {
          console.log('No products found or invalid response structure');
          setSearchResults([]);
          setFilteredResults([]);
        }
              } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
          setFilteredResults([]);
        }
    };
    fetchSearchResults();
  }, [searchQuery, priceRange, selectedCategories, selectedBrands, sortBy]);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };
  // Xử lý thay đổi thương hiệu
  const handleBrandChange = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };
  // Xóa tất cả bộ lọc
  const clearFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
  };
  // Format số cho hiển thị
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  console.log('Rendering SearchResult - searchResults:', searchResults.length, 'filteredResults:', filteredResults.length);
  return (
    <div className="search-results-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <span>Trang chủ</span> / <span>Kết quả tìm kiếm</span> /{" "}
          <span className="breadcrumb-current">"{searchQuery}"</span>
        </nav>
      </div>
      <div className="search-results-container">
        <div className="search-layout">
          {/* Sidebar Filters */}
          <div className="filters-sidebar">
            <div className="filters-card">
              <h3 className="filters-title">
                <span className="filter-icon">⚙</span>
                Bộ lọc
              </h3>
              {/* Price Range */}
              <div className="filter-section">
                <h4 className="filter-subtitle">Khoảng giá</h4>
                <div className="price-range-container">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Từ"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="price-input"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      placeholder="Đến"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000000])}
                      className="price-input"
                    />
                  </div>
                  <div className="price-labels">
                    <span className="price-label">
                      {formatPrice(priceRange[0])}đ
                    </span>
                    <span className="price-label">
                      {formatPrice(priceRange[1])}đ
                    </span>
                  </div>
                </div>
              </div>
              {/* Categories */}
              <div className="filter-section">
                <h4 className="filter-subtitle">Danh mục</h4>
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        className="checkbox"
                      />
                      {category}
                      {/* Hiển thị số lượng sản phẩm trong danh mục */}
                      <span className="category-count">
                        ({filteredResults.filter(p => p.category === category).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Brands */}
              <div className="filter-section">
                <h4 className="filter-subtitle">Thương hiệu</h4>
                <div className="checkbox-group">
                  {brands.map((brand) => (
                    <label key={brand} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => handleBrandChange(brand, e.target.checked)}
                        className="checkbox"
                      />
                      {brand}
                      {/* Hiển thị số lượng sản phẩm của thương hiệu */}
                      <span className="category-count">
                        ({filteredResults.filter(p => p.brand === brand).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={clearFilters} className="clear-filters-btn">
                Xóa bộ lọc ({selectedCategories.length + selectedBrands.length})
              </button>
            </div>
          </div>
          {/* Main Content */}
          <div className="search-content">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <span>
                  Hiển thị <strong>{filteredResults.length}</strong> kết quả cho "{searchQuery}"
                  {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                    <span className="filter-applied"> (đã lọc)</span>
                  )}
                </span>
              </div>
              <div className="results-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="relevant">Liên quan nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="newest">Bán chạy nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Xem dạng lưới"
                  >
                    ⊞
                  </button>
                  <button
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="Xem dạng danh sách"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
              priceRange[0] > 0 || priceRange[1] < 50000000) && (
              <div className="active-filters">
                <span className="active-filters-label">Bộ lọc đang áp dụng:</span>
                {selectedCategories.map((category) => (
                  <span key={category} className="filter-tag">
                    {category}
                    <button 
                      onClick={() => handleCategoryChange(category, false)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedBrands.map((brand) => (
                  <span key={brand} className="filter-tag">
                    {brand}
                    <button 
                      onClick={() => handleBrandChange(brand, false)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
                  <span className="filter-tag">
                    {formatPrice(priceRange[0])}đ - {formatPrice(priceRange[1])}đ
                    <button 
                      onClick={() => setPriceRange([0, 50000000])}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
            {/* Products Grid */}
            {filteredResults.length > 0 ? (
              <div className={`products-grid ${viewMode}`}>
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="empty-results">
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="empty-results">
                <h3>Nhập từ khóa tìm kiếm</h3>
                <p>Vui lòng nhập từ khóa để tìm kiếm sản phẩm</p>
              </div>
            )}
            {/* Pagination */}
            {filteredResults.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  Trước
                </button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">Sau</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResult