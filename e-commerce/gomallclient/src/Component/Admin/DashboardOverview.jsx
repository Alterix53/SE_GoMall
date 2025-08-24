import React, { useState, useEffect } from "react";
import { AdminCard } from './index';
import SummaryCard from './SummaryCard';
import StatsChart from './StatsChart';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import RevenueDistributionTable from './RevenueDistributionTable';
import TrendingProductsTable from './TrendingProductsTable';
import AdminAvatarModal from './AdminAvatarModal';
import { adminAPI } from '../../utils/api';

function DashboardOverview() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            users: { total: 0, active: 0, inactive: 0 },
            products: { total: 0, active: 0, inactive: 0 },
            orders: { total: 0, pending: 0, completed: 0 },
            sellers: { total: 0, active: 0, inactive: 0 },
            revenue: { total: 0, average: 0 }
        },
        revenueData: [],
        topProducts: [],
        trendingProducts: [],
        revenueStats: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get admin token from localStorage or context
                const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
                if (!adminToken) {
                    throw new Error('Admin token not found');
                }

                // Fetch all dashboard data in parallel
                const [statsResponse, revenueDistributionResponse, topProductsResponse, trendingResponse, revenueStatsResponse] = await Promise.all([
                    adminAPI.getDashboardStats(adminToken),
                    adminAPI.getRevenueDistribution(adminToken),
                    adminAPI.getTopSellingProducts(adminToken, 5),
                    adminAPI.getTrendingProducts(adminToken, 10),
                    adminAPI.getRevenueStats(adminToken, 'month')
                ]);

                // Check for errors
                if (!statsResponse.success) {
                    throw new Error(statsResponse.message || 'Failed to fetch dashboard stats');
                }

                if (!revenueDistributionResponse.success) {
                    throw new Error(revenueDistributionResponse.message || 'Failed to fetch revenue distribution');
                }

                if (!topProductsResponse.success) {
                    throw new Error(topProductsResponse.message || 'Failed to fetch top products');
                }
                if (!trendingResponse.success) {
                    throw new Error(trendingResponse.message || 'Failed to fetch trending products');
                }

                // Process revenue data for pie chart
                const revenueData = revenueDistributionResponse.data.map(item => ({
                    name: item.categoryName || 'Other',
                    value: item.revenue || 0
                }));

                // Process revenue stats for line chart
                const revenueStats = revenueStatsResponse.data.map(item => ({
                    date: `${item._id?.month || 1}/${item._id?.year || 2024}`,
                    value: item.revenue || 0
                }));

                setDashboardData({
                    stats: statsResponse.data,
                    revenueData,
                    topProducts: topProductsResponse.data,
                    trendingProducts: (trendingResponse.data || []).map(item => ({
                        id: item._id,
                        name: item.name,
                        unitsSold: item.sold || 0,
                        revenue: item.revenue || 0
                    })),
                    revenueStats
                });

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const COLORS = ['var(--admin-primary)', '#28a745', '#ffc107', '#dc3545'];

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Error</h4>
                            <p>{error}</p>
                            <hr />
                            <p className="mb-0">Please check your network connection and try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-item-center">
              <h3 className="mb-0">Dashboard</h3>
              <div className="d-flex align-items-center">
                <AdminAvatarModal avatarUrl="https://i.pravatar.cc/40?img=3" />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <SummaryCard 
                title="Users" 
                value={dashboardData.stats.users.total} 
                icon={<i className="bi bi-person fs-2"/>}
                subtitle={`${dashboardData.stats.users.active} active`}
            />
            <SummaryCard 
                title="Orders" 
                value={dashboardData.stats.orders.total} 
                icon={<i className="bi bi-bag fs-2"/>}
                subtitle={`${dashboardData.stats.orders.pending} pending`}
            />
            <SummaryCard 
                title="Revenue" 
                value={'$' + dashboardData.stats.revenue.total.toLocaleString()} 
                icon={<i className="bi bi-cash-stack fs-2"/>}
                subtitle={`Avg: $${dashboardData.stats.revenue.average.toLocaleString()}`}
            />
            <SummaryCard 
                title="Sellers" 
                value={dashboardData.stats.sellers.total} 
                icon={<i className="bi bi-shop fs-2"/>}
                subtitle={`${dashboardData.stats.sellers.active} active`}
            />
          </div>
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Revenue Statistics</h5>
                  <StatsChart
                    data={dashboardData.revenueStats}
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
                        data={dashboardData.revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="mt-3">
                    <RevenueDistributionTable data={dashboardData.revenueData} colors={COLORS} />
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
                    <TrendingProductsTable products={dashboardData.trendingProducts} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

export default DashboardOverview; 