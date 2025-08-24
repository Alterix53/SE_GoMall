import React, { useState } from "react";
import { AdminCard, AdminDataTable } from '../index';
import SellerDetailModal from "../SellerDetailModal";
import UserSellerListItem from "../UserSellerListItem";
import { adminAPI } from '../../../utils/api';

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "banned", label: "Banned" },
  { key: "reported", label: "Reported" },
];

function ManageSellerPage() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch sellers from API
  React.useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError(null);
      console.log('[Seller API] Fetch seller list start...', { status: activeFilter, search: searchTerm });
      try {
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!adminToken) throw new Error('Admin token not found');
        const params = {
          status: activeFilter !== 'all' ? activeFilter : '',
          search: searchTerm.trim(),
          page: currentPage,
          limit: itemsPerPage,
        };
        const res = await adminAPI.getAllSellers(adminToken, params);
        if (res.success) {
          setSellers(res.data.sellers || res.data || []);
          setTotalPages(res.data.totalPages || 1);
          console.log(`[Seller API] Fetched sellers successfully. Count: ${res.data.sellers?.length ?? (res.data?.length ?? 0)}`);
        } else {
          setSellers([]);
          setTotalPages(1);
          setError(res.message || 'Failed to fetch sellers');
          console.error('[Seller API] Failed to fetch sellers:', res.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch sellers');
        setSellers([]);
        setTotalPages(1);
        console.error('[Seller API] Error fetching sellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [activeFilter, searchTerm, currentPage]);

  // Reset về trang 1 khi đổi filter hoặc search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  let filteredSellers = sellers;

  return (
    <div className="container-fluid">
      <h2 className="row text-center" style={{ minWidth: 180 }}>Manage Sellers</h2>
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
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <div className="text-center py-3">Loading...</div>}
      {error && <div className="text-danger py-2">{error}</div>}
      <ul className="list-group">
        {!loading && filteredSellers.length === 0 && (
          <li className="list-group-item text-muted">No sellers found.</li>
        )}
        {filteredSellers.map((seller) => (
          <UserSellerListItem
            key={seller._id || seller.id}
            data={seller}
            onClick={() => setSelectedSeller(seller)}
          />
        ))}
      </ul>
      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Seller detail modal */}
      {selectedSeller && (
        <div className="modal show d-block" tabIndex={-1}>
          <SellerDetailModal seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
        </div>
      )}
    </div>
  );
}

export default ManageSellerPage; 