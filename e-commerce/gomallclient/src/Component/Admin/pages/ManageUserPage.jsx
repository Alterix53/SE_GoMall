import React from "react";
import FilterBar from "../FilterBar";
import DataTable from "../DataTable";
import UserDetailModal from "../UserDetailModal";

function ManageUserPage() {
  return (
    <div>
      <h2>Manage Users</h2>
      <FilterBar />
      <DataTable />
      <UserDetailModal />
    </div>
  );
}

export default ManageUserPage; 