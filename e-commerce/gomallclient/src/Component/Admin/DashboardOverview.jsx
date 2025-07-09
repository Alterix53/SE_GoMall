import React from "react";
import SummaryCard from './SummaryCard';
import StatsChart from './StatsChart';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function DashboardOverview() {
    // TODO: thay bằng hook fetch dữ liệu thực tế
    const stats = {
        users: 10250,
        orders: 2350,
        revenue: 812000,
        support: 50
    };

    // Dữ liệu nguồn truy cập
    const trafficData = [
      { name: 'Trực tiếp', value: 600 },
      { name: 'Mạng xã hội', value: 400 }
    ];
    const COLORS = ['#0d6efd', '#adb5bd'];

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-item-center">
              {/*Phần bên trái ghi dashboard */}
              <h3 className="mb-0">Dashboard</h3>

              {/*bên phải*/}
              <div className="d-flex align-items-center">
                {/*nút chuông*/}
                <button className="btn btn-light me-3">
                  <i className="bi bi-bell"></i>
                </button>
                {/*Ảnh admin*/}
                <img
                  src="https://i.pravatar.cc/40?img=3" // hoặc đường dẫn ảnh admin thật
                  alt="Admin Avatar"
                  className="rounded-circle"
                  style={{ width: 40, height: 40, cursor: 'pointer', objectFit: 'cover' }}
                  data-bs-toggle="modal"
                  data-bs-target="#adminModal"
                />
                {/* Modal giữ nguyên */}
                <div className="modal fade" id="adminModal" tabIndex="-1" aria-labelledby="adminModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-end">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="adminModalLabel">Account</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                      </div>
                      <div className="modal-body">
                        <button className="btn btn-outline-danger w-100">Log out</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="row mb-4">
            <SummaryCard title="Người dùng" value={stats.users} icon={<i className="bi bi-person fs-2"/>}/>
            <SummaryCard title="Đơn hàng" value={stats.orders} icon={<i className="bi bi-bag fs-2"/>}/>
            <SummaryCard title="Doanh thu" value={stats.revenue.toLocaleString() + ' đ'} icon={<i className="bi bi-cash-stack fs-2"/>}/>
            <SummaryCard title="Hỗ trợ" value={stats.support} icon={<i className="bi bi-chat-dots fs-2"/>}/>
          </div>
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Thống kê doanh thu</h5>
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
                  <h5 className="mb-3">Nguồn truy cập</h5>
                  <PieChart width={220} height={220}>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                  <div className="d-flex justify-content-center mt-2">
                    <span className="me-3"><span style={{display:'inline-block',width:12,height:12,background:'#0d6efd',borderRadius:2,marginRight:4}}></span>Trực tiếp</span>
                    <span><span style={{display:'inline-block',width:12,height:12,background:'#adb5bd',borderRadius:2,marginRight:4}}></span>Mạng xã hội</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Các sản phẩm trend</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Tên sản phẩm</th>
                          <th scope="col">Số lượng bán</th>
                          <th scope="col">Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Áo thun nam</td>
                          <td>320</td>
                          <td>64,000,000 đ</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Giày sneaker</td>
                          <td>210</td>
                          <td>42,000,000 đ</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Đồng hồ thời trang</td>
                          <td>150</td>
                          <td>30,000,000 đ</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Tai nghe bluetooth</td>
                          <td>180</td>
                          <td>27,000,000 đ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
export default DashboardOverview; 