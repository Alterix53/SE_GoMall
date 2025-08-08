import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Component/Header/Header';
import ProductCard from './Component/ProductCard/ProductCard';
import './TodaySuggestions.css';

function TodaySuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data for suggestions
  const sampleSuggestions = [
    {
      _id: "suggest1",
      name: "iPhone 15 Pro Max",
      price: 25000000,
      originalPrice: 30000000,
      image: "/images/phone1.jpg",
      rating: 4.8,
      sold: 150,
      discount: 17
    },
    {
      _id: "suggest2",
      name: "Samsung Galaxy S24",
      price: 18000000,
      originalPrice: 22000000,
      image: "/images/phone2.jpg",
      rating: 4.6,
      sold: 89,
      discount: 18
    },
    {
      _id: "suggest3",
      name: "MacBook Pro M3",
      price: 45000000,
      originalPrice: 50000000,
      image: "/images/laptop1.jpg",
      rating: 4.9,
      sold: 45,
      discount: 10
    },
    {
      _id: "suggest4",
      name: "AirPods Pro 2",
      price: 5500000,
      originalPrice: 6500000,
      image: "/images/airpods.jpg",
      rating: 4.7,
      sold: 234,
      discount: 15
    },
    {
      _id: "suggest5",
      name: "Apple Watch Series 9",
      price: 12000000,
      originalPrice: 14000000,
      image: "/images/watch.jpg",
      rating: 4.4,
      sold: 35,
      discount: 14
    },
    {
      _id: "suggest6",
      name: "iPad Pro 12.9",
      price: 28000000,
      originalPrice: 32000000,
      image: "/images/ipad.jpg",
      rating: 4.6,
      sold: 67,
      discount: 12
    },
    {
      _id: "suggest7",
      name: "Sony WH-1000XM5",
      price: 8500000,
      originalPrice: 9500000,
      image: "/images/headphones.jpg",
      rating: 4.5,
      sold: 123,
      discount: 11
    },
    {
      _id: "suggest8",
      name: "Nintendo Switch OLED",
      price: 7500000,
      originalPrice: 8500000,
      image: "/images/switch.jpg",
      rating: 4.3,
      sold: 78,
      discount: 12
    },
    {
      _id: "suggest9",
      name: "DJI Mini 3 Pro",
      price: 15000000,
      originalPrice: 18000000,
      image: "/images/drone.jpg",
      rating: 4.7,
      sold: 45,
      discount: 17
    },
    {
      _id: "suggest10",
      name: "GoPro Hero 11",
      price: 9500000,
      originalPrice: 11000000,
      image: "/images/gopro.jpg",
      rating: 4.4,
      sold: 67,
      discount: 14
    },
    {
      _id: "suggest11",
      name: "Kindle Paperwhite",
      price: 3500000,
      originalPrice: 4000000,
      image: "/images/kindle.jpg",
      rating: 4.2,
      sold: 89,
      discount: 13
    },
    {
      _id: "suggest12",
      name: "Samsung QLED 4K TV",
      price: 25000000,
      originalPrice: 30000000,
      image: "/images/tv.jpg",
      rating: 4.6,
      sold: 34,
      discount: 17
    }
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API
        const response = await fetch('http://localhost:8080/api/products/suggestions');
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          console.log('Using fallback data for suggestions');
          setSuggestions(sampleSuggestions);
        }
      } catch (error) {
        console.log('Suggestions API error, using fallback data:', error.message);
        setSuggestions(sampleSuggestions);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="today-suggestions-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-suggestions-page">
      <Header />
      
      <div className="suggestions-container">
        <div className="suggestions-header">
          <h1>🎯 Gợi ý hôm nay</h1>
          <p>Khám phá những sản phẩm phù hợp với bạn</p>
        </div>
        
        <div className="suggestions-grid">
          {suggestions.length > 0 ? (
            suggestions.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-suggestions">Không có gợi ý nào hiện tại</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodaySuggestions; 