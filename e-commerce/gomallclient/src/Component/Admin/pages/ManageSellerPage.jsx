import React from "react";
import FilterBar from "../FilterBar";
import DataTable from "../DataTable";
import SellerDetailModal from "../SellerDetailModal";

function ManageSellerPage() {
  return (
    <div>
      <h2>Manage Sellers</h2>
      <FilterBar />
      <DataTable />
      <SellerDetailModal />
    </div>
  );
}

export default ManageSellerPage; 