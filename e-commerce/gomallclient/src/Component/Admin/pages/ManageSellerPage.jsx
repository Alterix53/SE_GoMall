import React, { useState } from "react";
import SellerDetailModal from "../SellerDetailModal";
import UserSellerListItem from "../UserSellerListItem";
import { adminAPI } from '../../../utils/api';

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "active", label: "Đang hoạt động" },
  { key: "banned", label: "Bị khóa" },
  { key: "reported", label: "Bị báo cáo" },
];

function ManageSellerPage() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sellers từ API
  React.useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError(null);
      console.log('[Seller API] Bắt đầu fetch danh sách seller...', { status: activeFilter, search: searchTerm });
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
          console.log(`[Seller API] Lấy danh sách seller thành công. Số lượng: ${res.data.sellers?.length ?? (res.data?.length ?? 0)}`);
        } else {
          setSellers([]);
          setError(res.message || 'Lỗi khi lấy danh sách seller');
          console.error('[Seller API] Lỗi khi lấy danh sách seller:', res.message);
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi lấy danh sách seller');
        setSellers([]);
        console.error('[Seller API] Lỗi khi fetch seller:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [activeFilter, searchTerm]);

  let filteredSellers = sellers;

  return (
    <div className="container-fluid">
      <h2 className="row text-center" style={{ minWidth: 180 }}>Quản lý người bán</h2>
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
          placeholder="Tìm kiếm người bán..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <div className="text-center py-3">Loading...</div>}
      {error && <div className="text-danger py-2">{error}</div>}
      <ul className="list-group">
        {!loading && filteredSellers.length === 0 && (
          <li className="list-group-item text-muted">Không có người bán nào.</li>
        )}
        {filteredSellers.map((seller) => (
          <UserSellerListItem
            key={seller._id || seller.id}
            data={seller}
            onClick={() => setSelectedSeller(seller)}
          />
        ))}
      </ul>
      {/* Modal chi tiết người bán */}
      {selectedSeller && (
        <div className="modal show d-block" tabIndex="-1">
          <SellerDetailModal seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
        </div>
      )}
    </div>
  );
}

export default ManageSellerPage; 