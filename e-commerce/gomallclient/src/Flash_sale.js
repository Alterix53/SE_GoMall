import React, { useState, useEffect } from 'react';
import './Flash_sale.css';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [flashSaleProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      originalPrice: 1199,
      flashSalePrice: 899,
      image: '/images/iphone-15-pro-max.jpg',
      sold: 156,
      stock: 44
    },
    {
      id: 2,
      name: 'MacBook Pro 16-inch M3 Max',
      originalPrice: 3499,
      flashSalePrice: 2799,
      image: '/images/macbook-pro-16-m3.jpg',
      sold: 89,
      stock: 11
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      originalPrice: 1299,
      flashSalePrice: 999,
      image: '/images/samsung-s24-ultra.jpg',
      sold: 234,
      stock: 66
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      originalPrice: 399,
      flashSalePrice: 299,
      image: '/images/sony-wh-1000xm5.jpg',
      sold: 445,
      stock: 55
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date().setHours(23, 59, 59, 999);
      const distance = endTime - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const calculateDiscount = (original, sale) => {
    return Math.round(((original - sale) / original) * 100);
  };

  const calculateProgress = (sold, stock) => {
    const total = sold + stock;
    return (sold / total) * 100;
  };

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <h1>⚡ FLASH SALE ⚡</h1>
          <p>Limited time offers! Don't miss out!</p>
        </div>
        
        <div className="countdown-timer">
          <div className="timer-item">
            <span className="timer-number">{formatNumber(timeLeft.hours)}</span>
            <span className="timer-label">Hours</span>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-item">
            <span className="timer-number">{formatNumber(timeLeft.minutes)}</span>
            <span className="timer-label">Minutes</span>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-item">
            <span className="timer-number">{formatNumber(timeLeft.seconds)}</span>
            <span className="timer-label">Seconds</span>
          </div>
        </div>
      </div>

      <div className="flash-sale-grid">
        {flashSaleProducts.map(product => (
          <div key={product.id} className="flash-sale-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="discount-badge">
                -{calculateDiscount(product.originalPrice, product.flashSalePrice)}%
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <div className="price-section">
                <span className="flash-sale-price">${product.flashSalePrice}</span>
                <span className="original-price">${product.originalPrice}</span>
              </div>
              
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress(product.sold, product.stock)}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  <span>Sold: {product.sold}</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>
              
              <button className="buy-now-btn">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
