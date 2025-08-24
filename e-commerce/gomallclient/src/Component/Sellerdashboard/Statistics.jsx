import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockProducts from './product.json'; 
import './Sellerdashboard'; 

const Statistics = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Revenue (VND)',
        data: [1200000, 800000, 1000000, 1400000],
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?sort=sold&limit=3');
        const data = await response.json();
        setTopProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching top products:', error);
        setTopProducts([]);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Revenue Statistics</h2>

      <h4 className="mt-5">Best Selling Products</h4>
      <ul className="list-group">
        {topProducts.map((p, i) => (
          <li className="list-group-item d-flex justify-content-between" key={i}>
            <span>{p.name}</span>
            <span>Sold: {p.sold || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
