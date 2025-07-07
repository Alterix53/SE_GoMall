import React, { useState } from "react";
import SellerDetailModal from "../SellerDetailModal";

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "active", label: "Đang hoạt động" },
  { key: "banned", label: "Bị khóa" },
  { key: "reported", label: "Bị báo cáo" },
];

const SELLERS = [
  {
    id: 1,
    username: "seller1",
    businessName: "Công ty ABC",
    email: "seller1@email.com",
    phone: "0123456789",
    address: "Hà Nội",
    status: "active",
    avatarUrl: "",
  },
  // ... thêm dữ liệu mẫu
];

function ManageSellerPage() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);

  let filteredSellers =
    activeFilter === "all"
      ? SELLERS
      : SELLERS.filter((s) => s.status === activeFilter);

  if (searchTerm.trim() !== "") {
    filteredSellers = filteredSellers.filter(
      (s) =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
      <ul className="list-group">
        {filteredSellers.length === 0 && (
          <li className="list-group-item text-muted">Không có người bán nào.</li>
        )}
        {filteredSellers.map((seller) => (
          <li
            className="list-group-item d-flex align-items-center"
            key={seller.id}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedSeller(seller)}
          >
            <img
              src={seller.avatarUrl || "/default-avatar.png"}
              alt="avatar"
              className="rounded-circle me-3"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
            <div>
              <div className="fw-bold">{seller.username}</div>
              <div className="text-secondary">{seller.businessName}</div>
            </div>
            <span className="ms-auto badge bg-secondary">{seller.status}</span>
          </li>
        ))}
      </ul>
      {/* Modal chi tiết người bán */}
      {selectedSeller && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-backdrop fade show" onClick={() => setSelectedSeller(null)} />
          <SellerDetailModal seller={selectedSeller} />
        </div>
      )}
    </div>
  );
}

export default ManageSellerPage; 