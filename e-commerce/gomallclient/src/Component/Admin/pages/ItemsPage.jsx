import React, { useState, useRef } from "react";
import { adminAPI } from '../../../utils/api';
import ProductDetailModal from "../ProductDetailModal";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New Products" },
  { key: "hot", label: "Hot Products" },
  { key: "reported", label: "Reported Products" },
];

// Dữ liệu mẫu, bạn có thể thay bằng dữ liệu thực tế
// const PRODUCTS = [
//   { id: 1, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
//   { id: 2, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
//   { id: 3, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
//   { id: 4, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
//   { id: 5, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
//   { id: 6, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
//   { id: 7, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
//   { id: 8, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
//   { id: 9, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
//   { id: 10, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
//   { id: 11, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
//   { id: 12, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
//   { id: 13, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
//   { id: 14, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
//   { id: 15, name: "Áo thun nam", manufacturer: "Công ty A", sold: 120, type: "new" },
//   { id: 16, name: "Giày thể thao", manufacturer: "Công ty B", sold: 300, type: "hot" },
//   { id: 17, name: "Túi xách nữ", manufacturer: "Công ty C", sold: 15, type: "reported" },
//   { id: 18, name: "Mũ lưỡi trai", manufacturer: "Công ty D", sold: 80, type: "hot" },
//   { id: 19, name: "Quần jeans", manufacturer: "Công ty E", sold: 50, type: "new" },
//   { id: 20, name: "Áo khoác", manufacturer: "Công ty F", sold: 60, type: "new" },
//   { id: 21, name: "Váy nữ", manufacturer: "Công ty G", sold: 90, type: "hot" },
// ]; // XÓA DỮ LIỆU MẪU

function ItemsPage() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const itemsPerPage = 12;

  // Fetch products from API
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      console.log('[Product API] Start fetching products...', { status: activeFilter, search: searchTerm, page: currentPage });
      try {
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!adminToken) throw new Error('Admin token not found');
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm.trim(),
          status: activeFilter !== 'all' ? activeFilter : '',
        };
        const res = await adminAPI.getAllProducts(adminToken, params);
        if (res.success) {
          setProducts(res.data.products || res.data || []);
          setTotalPages(res.data.totalPages || 1);
          console.log(`[Product API] Fetched products successfully. Count: ${res.data.products?.length ?? (res.data?.length ?? 0)}`);
          // Debug: Log first product structure to understand image data
          if (res.data.products?.length > 0 || res.data?.length > 0) {
            const firstProduct = res.data.products?.[0] || res.data?.[0];
            console.log('[Product API] First product structure:', {
              id: firstProduct._id || firstProduct.id,
              name: firstProduct.name,
              images: firstProduct.images,
              imageUrl: firstProduct.images?.[0]?.url
            });
          }
        } else {
          setProducts([]);
          setTotalPages(1);
          setError(res.message || 'Failed to fetch products');
          console.error('[Product API] Failed to fetch products:', res.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
        setTotalPages(1);
        console.error('[Product API] Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeFilter, searchTerm, currentPage]);

  // Reset về trang 1 khi đổi filter hoặc search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  // Handle image loading errors
  const handleImageError = (productId) => {
    console.log(`[Image] Error loading image for product ${productId}`);
    setImageErrors(prev => new Set(prev).add(productId));
  };

  // Get image source with fallback
  const getImageSrc = (product) => {
    const productId = product._id || product.id;
    if (imageErrors.has(productId)) {
      console.log(`[Image] Using fallback for product ${productId}`);
      return "/images/default-product.jpg";
    }
    const imageUrl = product.images?.[0]?.url || "/images/default-product.jpg";
    // If the image URL is a relative path, prepend the server URL
    const fullImageUrl = imageUrl.startsWith('/') 
      ? `http://localhost:8080${imageUrl}` 
      : imageUrl;
    console.log(`[Image] Product ${productId} image URL:`, fullImageUrl);
    return fullImageUrl;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container-fluid">
      <h2 className="row text-center" style={{ minWidth: 180 }}>Manage Products</h2>
      <div className="row">
        {/* Filter buttons and search input on the same row */}
        <div className="col-12 py-4">
          <div className="d-flex gap-2 mb-3 align-items-center">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                className={`btn btn${activeFilter === filter.key ? "-primary" : "-outline-primary"}`}
                onClick={() => setActiveFilter(filter.key)}
                style={{ minWidth: 120 }}
              >
                {filter.label}
              </button>
            ))}
            <input
              type="text"
              className="form-control ms-3"
              style={{ maxWidth: 250 }}
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <h2 className="mb-4">{FILTERS.find(f => f.key === activeFilter)?.label}</h2>
          {loading && <div className="text-center py-3">Loading...</div>}
          {error && <div className="text-danger py-2">{error}</div>}
                     <div className="table-responsive">
             <table className="table table-hover table-bordered">
               <thead className="table-light">
                 <tr>
                   <th style={{ width: 80 }}>Item Image</th>
                   <th>Item Name</th>
                   <th style={{ width: 150 }}>Category</th>
                   <th style={{ width: 200 }}>Store</th>
                 </tr>
               </thead>
               <tbody>
                 {!loading && products.length === 0 && (
                   <tr>
                     <td colSpan={4} className="text-muted text-center">No products found.</td>
                   </tr>
                 )}
                 {products.map((product) => (
                   <tr 
                     key={product._id || product.id}
                     style={{ cursor: 'pointer' }}
                     onClick={() => setSelectedProduct(product)}
                   >
                                           <td>
                        <img 
                          src={getImageSrc(product)}
                          alt={product.name}
                          className="rounded"
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                          onError={() => handleImageError(product._id || product.id)}
                        />
                      </td>
                     <td>
                       <div className="fw-bold">{product.name}</div>
                       <div className="text-muted small">SKU: {product.sku || 'N/A'}</div>
                     </td>
                     <td>{product.categoryID?.categoryName || 'N/A'}</td>
                     <td>{product.sellerID?.businessName || 'N/A'}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
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
      
      {/* Product detail modal */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-backdrop show" onClick={() => setSelectedProduct(null)}></div>
          <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
      )}
    </div>
  );
}

export default ItemsPage; 