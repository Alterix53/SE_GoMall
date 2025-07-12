import React from "react";
import SummaryCard from './SummaryCard';
import StatsChart from './StatsChart';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import RevenueDistributionTable from './RevenueDistributionTable';
import TrendingProductsTable from './TrendingProductsTable';
import AdminAvatarModal from './AdminAvatarModal';
import NotificationButton from './NotificationButton';

function DashboardOverview() {
    // TODO: replace with real data fetching hook
    const stats = {
        users: 10250,
        orders: 2350,
        revenue: 812000,
        support: 50
    };

    // Revenue distribution by category
    const revenueData = [
      { name: 'Fashion', value: 350000 },
      { name: 'Electronics', value: 280000 },
      { name: 'Home & Garden', value: 120000 },
      { name: 'Others', value: 62000 }
    ];
    const COLORS = ['#0d6efd', '#28a745', '#ffc107', '#dc3545'];

    // Trending products data
    const trendingProducts = [
      { id: 1, name: "Men's T-Shirt", unitsSold: 320, revenue: "$64,000" },
      { id: 2, name: "Sneakers", unitsSold: 210, revenue: "$42,000" },
      { id: 3, name: "Fashion Watch", unitsSold: 150, revenue: "$30,000" },
      { id: 4, name: "Bluetooth Headphones", unitsSold: 180, revenue: "$27,000" },
    ];

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-item-center">
              <h3 className="mb-0">Dashboard</h3>
              <div className="d-flex align-items-center">
                <NotificationButton />
                <AdminAvatarModal avatarUrl="https://i.pravatar.cc/40?img=3" />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <SummaryCard title="Users" value={stats.users} icon={<i className="bi bi-person fs-2"/>}/>
            <SummaryCard title="Orders" value={stats.orders} icon={<i className="bi bi-bag fs-2"/>}/>
            <SummaryCard title="Revenue" value={'$' + stats.revenue.toLocaleString()} icon={<i className="bi bi-cash-stack fs-2"/>}/>
            <SummaryCard title="Support" value={stats.support} icon={<i className="bi bi-chat-dots fs-2"/>}/>
          </div>
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Revenue Statistics</h5>
                  <StatsChart
                    data={[
                      { date: 'Jan', value: 50000 },
                      { date: 'Feb', value: 80000 },
                      { date: 'Mar', value: 120000 },
                      { date: 'Apr', value: 110000 },
                      { date: 'May', value: 170000 },
                      { date: 'Jun', value: 150000 },
                    ]}
                    dataKey="value"
                    xKey="date"
                    height={250}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Revenue Distribution</h5>
                  <div className="d-flex justify-content-center">
                    <PieChart width={220} height={220}>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="mt-3">
                    <RevenueDistributionTable data={revenueData} colors={COLORS} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Trending Products</h5>
                  <div className="table-responsive">
                    <TrendingProductsTable products={trendingProducts} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
export default DashboardOverview; 