// Minh

import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import SearchBar from "./Component/SearchBar/SearchBar"
import ProductCard from "./Component/ProductCard/ProductCard"
import "./SearchResult.css"

// Mock data với nhiều sản phẩm đa dạng
const mockSearchResults = [
  {
    id: "1",
    name: "Quần jeans nam cao cấp",
    price: 450000,
    originalPrice: 600000,
    rating: 4.5,
    reviewCount: 850,
    sold: 850,
    image: "/placeholder.svg?height=200&width=200",
    discount: 25,
    category: "Thời trang",
    brand: "Uniqlo"
  },
  {
    id: "2", 
    name: "Quần âu nữ công sở",
    price: 380000,
    originalPrice: 500000,
    rating: 4.7,
    reviewCount: 620,
    sold: 620,
    image: "/placeholder.svg?height=200&width=200",
    discount: 24,
    category: "Thời trang",
    brand: "Zara"
  },
  {
    id: "3",
    name: "Quần short thể thao Nike",
    price: 650000,
    originalPrice: 850000,
    rating: 4.8,
    reviewCount: 1200,
    sold: 1200,
    image: "/placeholder.svg?height=200&width=200",
    discount: 24,
    category: "Thể thao & Du lịch",
    brand: "Nike"
  },
  {
    id: "4",
    name: "Quần legging yoga nữ",
    price: 280000,
    originalPrice: 400000,
    rating: 4.6,
    reviewCount: 450,
    sold: 450,
    image: "/placeholder.svg?height=200&width=200",
    discount: 30,
    category: "Thể thao & Du lịch",
    brand: "Adidas"
  },
  {
    id: "5",
    name: "Quần kaki nam H&M",
    price: 320000,
    originalPrice: 450000,
    rating: 4.4,
    reviewCount: 680,
    sold: 680,
    image: "/placeholder.svg?height=200&width=200",
    discount: 29,
    category: "Thời trang",
    brand: "H&M"
  },
  {
    id: "6",
    name: "Quần tây nữ công sở cao cấp",
    price: 890000,
    originalPrice: 1200000,
    rating: 4.9,
    reviewCount: 320,
    sold: 320,
    image: "/placeholder.svg?height=200&width=200",
    discount: 26,
    category: "Thời trang",
    brand: "Zara"
  },
  {
    id: "7",
    name: "iPhone 15 Pro Max 256GB",
    price: 29990000,
    originalPrice: 34990000,
    rating: 4.8,
    reviewCount: 1250,
    sold: 1250,
    image: "/placeholder.svg?height=200&width=200",
    discount: 14,
    category: "Điện tử",
    brand: "Apple"
  },
  {
    id: "8",
    name: "Nồi cơm điện Panasonic 1.8L",
    price: 1200000,
    originalPrice: 1500000,
    rating: 4.5,
    reviewCount: 890,
    sold: 890,
    image: "/placeholder.svg?height=200&width=200",
    discount: 20,
    category: "Gia dụng",
    brand: "Panasonic"
  },
]

const categories = [
  "Thời trang", 
  "Điện tử", 
  "Gia dụng", 
  "Sách & Văn phòng phẩm", 
  "Thể thao & Du lịch",
  "Sức khỏe & Làm đẹp",
  "Mẹ & Bé",
  "Nhà cửa & Đời sống"
];

const brands = [
  "Nike", "Adidas", "Uniqlo", "H&M", "Zara",
  "Apple", "Samsung", "Sony", "LG", "Xiaomi",
  "Philips", "Panasonic", "Sunhouse"
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

  const searchQuery = searchParams.get("keyword") || ""

  // Filter và search logic
  useEffect(() => {
    let results = mockSearchResults;

    // 1. Filter theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter theo khoảng giá
    results = results.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // 3. Filter theo danh mục
    if (selectedCategories.length > 0) {
      results = results.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // 4. Filter theo thương hiệu
    if (selectedBrands.length > 0) {
      results = results.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // 5. Sắp xếp kết quả
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.sort((a, b) => b.sold - a.sold); // Giả sử sold cao = mới
        break;
      default:
        // Relevant: ưu tiên sản phẩm có từ khóa trong tên
        results.sort((a, b) => {
          const aRelevant = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bRelevant = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bRelevant - aRelevant;
        });
        break;
    }

    setFilteredResults(results);
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
                        ({mockSearchResults.filter(p => p.category === category && 
                          p.name.toLowerCase().includes(searchQuery.toLowerCase())).length})
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
                        ({mockSearchResults.filter(p => p.brand === brand && 
                          p.name.toLowerCase().includes(searchQuery.toLowerCase())).length})
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
            ) : (
              <div className="empty-results">
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </button>
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