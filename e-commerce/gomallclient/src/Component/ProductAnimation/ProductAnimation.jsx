import React, { useState, useEffect } from 'react';
import './ProductAnimation.css';

const ProductAnimation = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [animatedProducts, setAnimatedProducts] = useState([]);

  useEffect(() => {
    const fetchAnimatedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?limit=4');
        const data = await response.json();
        const products = data.products || [];
        
        // Transform products for animation display
        const transformedProducts = products.map(product => ({
          id: product._id,
          name: product.name,
          price: `${product.price?.sale?.toLocaleString() || 0}₫`,
          image: product.images?.[0]?.url || "/images/placeholder-product.svg",
          discount: product.isFlashSale ? "FLASH SALE" : ""
        }));
        
        setAnimatedProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching animated products:', error);
        setAnimatedProducts([]);
      }
    };

    fetchAnimatedProducts();
  }, []);

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