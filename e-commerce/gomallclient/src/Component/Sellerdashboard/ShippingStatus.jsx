import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingStatus = () => {
  const navigate = useNavigate();

  const orders = [
    { id: 101, date: '2025-07-01', status: 'Đang giao', total: 350000 },
    { id: 102, date: '2025-07-02', status: 'Đã giao', total: 180000 },
    { id: 103, date: '2025-07-03', status: 'Chờ xử lý', total: 220000 }
  ];

  return (
    <div className="container mt-4">
      <h2>Tình trạng vận chuyển</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.date}</td>
              <td>{o.status}</td>
              <td>{o.total.toLocaleString()}₫</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/seller/orders/${o.id}`)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingStatus;