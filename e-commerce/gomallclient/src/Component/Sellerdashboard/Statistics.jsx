import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import mockProducts from './product.json'; 
import './Sellerdashboard'; 

const Statistics = () => {
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [1200000, 800000, 1000000, 1400000],
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const topProducts = [
    { name: 'Áo thun', sold: 100 },
    { name: 'Giày Nike', sold: 80 },
    { name: 'Mũ lưỡi trai', sold: 65 }
  ];

  return (
    <div className="container mt-4">
      <h2>Thống kê doanh thu</h2>
      <Navbar data={data} />

      <h4 className="mt-5">Sản phẩm bán chạy</h4>
      <ul className="list-group">
        {topProducts.map((p, i) => (
          <li className="list-group-item d-flex justify-content-between" key={i}>
            <span>{p.name}</span>
            <span>Đã bán: {p.sold}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
