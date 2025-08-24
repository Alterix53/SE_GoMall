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
        };
        const res = await adminAPI.getAllSellers(adminToken, params);
        if (res.success) {
          setSellers(res.data.sellers || res.data || []);
          console.log(`[Seller API] Fetched sellers successfully. Count: ${res.data.sellers?.length ?? (res.data?.length ?? 0)}`);
        } else {
          setSellers([]);
          setError(res.message || 'Failed to fetch sellers');
          console.error('[Seller API] Failed to fetch sellers:', res.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch sellers');
        setSellers([]);
        console.error('[Seller API] Error fetching sellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
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