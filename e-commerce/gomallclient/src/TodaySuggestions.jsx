import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Header is globally rendered in App.js
import ProductCard from './Component/ProductCard/ProductCard';
import './TodaySuggestions.css';

function TodaySuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products for suggestions
        const response = await fetch('http://localhost:8080/api/products?limit=20');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data.products)) {
            const mappedSuggestions = data.data.products.map(product => ({
              _id: product._id,
              name: product.name,
              price: product?.price?.sale || product?.price?.original || 0,
              originalPrice: product?.price?.original || 0,
              discount: product?.price?.original && product?.price?.sale
                ? Math.round(((product.price.original - product.price.sale) / product.price.original) * 100)
                : 0,
              image: product?.images?.[0]?.url ? `http://localhost:8080${product.images[0].url}` : '/images/default-product.jpg',
              rating: product?.rating || { average: 0, count: 0 },
              sold: product?.sold || 0,
            }));
            setSuggestions(mappedSuggestions);
          } else {
            console.log('No suggestions data available');
            setSuggestions([]);
          }
        } else {
          console.log('Suggestions API not available');
          setSuggestions([]);
        }
      } catch (error) {
        console.log('Suggestions API error:', error.message);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="today-suggestions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-suggestions-page">
      
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