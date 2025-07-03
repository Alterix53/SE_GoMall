import React from "react";
import FilterBar from "../FilterBar";
import DataTable from "../DataTable";
import ItemDetailModal from "../ItemDetailModal";

function ItemsPage() {
  return (
    <div>
      <h2>Manage Items</h2>
      <FilterBar />
      <DataTable />
      <ItemDetailModal />
    </div>
  );
}

export default ItemsPage; 