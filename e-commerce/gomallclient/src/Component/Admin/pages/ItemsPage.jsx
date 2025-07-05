import React, { useState } from "react";

const FILTERS = [
  { key: "new", label: "Sản phẩm mới lên sàn" },
  { key: "hot", label: "Sản phẩm hot" },
  { key: "reported", label: "Sản phẩm bị báo cáo" },
];

// Dữ liệu mẫu, bạn có thể thay bằng dữ liệu thực tế
const PRODUCTS = [
  { id: 1, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
  { id: 2, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
  { id: 3, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
  { id: 4, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
  { id: 5, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
  { id: 6, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
  { id: 7, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
  { id: 8, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
  { id: 9, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
  { id: 10, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
  { id: 11, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
  { id: 12, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
  { id: 13, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
  { id: 14, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
  { id: 15, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
  { id: 16, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
  { id: 17, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
  { id: 18, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
  { id: 19, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
  { id: 20, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
  { id: 21, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
];

function ItemsPage() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = PRODUCTS.filter((p) => p.type === activeFilter);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset về trang 1 khi đổi filter
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar filter */}
        <div className="col-md-3 col-lg-2 border-end bg-light py-4">
          <ul className="nav nav-pills flex-column">
            {FILTERS.map((filter) => (
              <li className="nav-item mb-2" key={filter.key}>
                <button
                  className={`nav-link ${activeFilter === filter.key ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.key)}
                  style={{ cursor: "pointer" }}
                >
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Product list */}
        <div className="col-md-9 col-lg-10 py-4">
          <h2 className="mb-4">{FILTERS.find(f => f.key === activeFilter)?.label}</h2>
          <ul className="list-group">
            {paginatedProducts.length === 0 && (
              <li className="list-group-item text-muted">Không có sản phẩm nào.</li>
            )}
            {paginatedProducts.map((product) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={product.id}>
                <span>{product.name}</span>
                <span className="text-end">
                  <div className="fw-bold">{product.manufacturer}</div>
                  <div className="text-secondary">Đã bán: {product.sold}</div>
                </span>
              </li>
            ))}
          </ul>
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination">
                <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemsPage; 