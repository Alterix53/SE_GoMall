import React from "react";
import SummaryCard from './SummaryCard';
import StatsChart from './StatsChart';
function DashboardOverview() {

    // TODO: thay bằng hook fetch dữ liệu thực tế
    const stats = {
        orders: 1240,
        revenue: 53240,
        commission: 8430,
        sellers: 320
    };

    return (
        <div>
          <div className="row">
            <SummaryCard title="Total Orders" value={stats.orders} icon={<i className="bi bi-bag-check"/>}/>
            <SummaryCard title="Revenue"     value={`$${stats.revenue}`} icon={<i className="bi bi-currency-dollar"/>}/>
            <SummaryCard title="Commission"  value={`$${stats.commission}`} icon={<i className="bi bi-percent"/>}/>
            <SummaryCard title="Approved Sellers" value={stats.sellers} icon={<i className="bi bi-people"/>}/>
          </div>
          <a href="/admin/items" style={{textDecoration: 'none', color: 'black'}}>more items</a>
          {/*  */}
    
          <div className="row mt-4">
            <div className="col-lg-8">
              <h5>Revenue Over Time</h5>
              <StatsChart
                data={[ /* [{ date: '2025-06-01', value: 500 }, …] */ ]}
                dataKey="value"
                xKey="date"
                height={300}
              />
            </div>
            <div className="col-lg-4">
              <h5>Trending Products</h5>
              {/* Danh sách đơn giản */}
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Product A <span className="badge bg-primary rounded-pill">120 sold</span>
                </li>
                {/* … */}
              </ul>
            </div>
          </div>
        </div>
      );
    }
export default DashboardOverview; 