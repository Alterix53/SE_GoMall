import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();

  // Dữ liệu giả lập
  const order = {
    id,
    date: '2025-07-03',
    status: 'Đang vận chuyển',
    address: '123 Quảng Ngãi, Việt Nam',
    items: [
      { name: 'Áo thun', quantity: 2, price: 120000 },
      { name: 'Giày Nike', quantity: 1, price: 350000 }
    ]
  };

  const total = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container mt-4">
      <h2>Chi tiết đơn hàng #{order.id}</h2>
      <p><strong>Ngày đặt:</strong> {order.date}</p>
      <p><strong>Trạng thái:</strong> {order.status}</p>
      <p><strong>Địa chỉ giao:</strong> {order.address}</p>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>{(item.quantity * item.price).toLocaleString()}₫</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-3">Tổng cộng: {total.toLocaleString()}₫</h5>
    </div>
  );
};

export default OrderDetail;
