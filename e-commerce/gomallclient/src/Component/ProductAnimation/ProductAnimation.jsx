import React, { useState, useEffect } from 'react';
import './ProductAnimation.css';

const ProductAnimation = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample products for animation
  const animatedProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "$999",
      image: "/images/iphone-15.jpg",
      discount: "20% OFF"
    },
    {
      id: 2,
      name: "MacBook Air M2",
      price: "$1,199",
      image: "/images/macbook-air.jpg",
      discount: "15% OFF"
    },
    {
      id: 3,
      name: "Nike Air Max",
      price: "$129",
      image: "/images/sneaker.jpg",
      discount: "30% OFF"
    },
    {
      id: 4,
      name: "Samsung S24",
      price: "$899",
      image: "/images/samsung-s24.jpg",
      discount: "25% OFF"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentProductIndex((prev) => (prev + 1) % animatedProducts.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [animatedProducts.length]);

  const currentProduct = animatedProducts[currentProductIndex];

  return (
    <div className="product-animation-container">
      <div className={`product-card ${isAnimating ? 'animate' : ''}`}>
        <div className="product-image-container">
          <img 
            src={currentProduct.image} 
            alt={currentProduct.name}
            className="product-image"
            onError={(e) => {
              console.error("Product animation image load error, falling back to default")
              // Prevent infinite loop by checking if we're already using default image
              if (e.target.src !== "/images/default-product.jpg") {
                e.target.src = "/images/default-product.jpg";
              }
            }}
          />
          <div className="floating-elements">
            <div className="floating-star">⭐</div>
            <div className="floating-heart">❤️</div>
            <div className="floating-fire">🔥</div>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{currentProduct.name}</h3>
          <div className="price-container">
            <span className="product-price">{currentProduct.price}</span>
            <span className="discount-badge">{currentProduct.discount}</span>
          </div>
        </div>
        
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay-1"></div>
        <div className="pulse-ring delay-2"></div>
      </div>
      
      <div className="animation-indicators">
        {animatedProducts.map((_, index) => (
          <div 
            key={index}
            className={`indicator ${index === currentProductIndex ? 'active' : ''}`}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentProductIndex(index);
                setIsAnimating(false);
              }, 300);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductAnimation; 