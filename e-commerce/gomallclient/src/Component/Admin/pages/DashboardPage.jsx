import React from "react";
import DashboardOverview from "../DashboardOverview";
import StatsChart from "../StatsChart";

function DashboardPage() {
  return (
    <div>
      <h2>Dashboard</h2>
      <DashboardOverview />
      <StatsChart />
    </div>
  );
}

export default DashboardPage; 