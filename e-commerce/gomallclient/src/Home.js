import React, { useState, useEffect, useRef } from 'react';
import Header from './Component/Header/Header';
import CategoryList from './Component/Category/CategoryList';
import ProductCard from './Component/ProductCard/ProductCard';
import FlashSaleCard from './Component/FlashSaleCard/FlashSaleCard';
import TopProductCard from './Component/TopProductCard/TopProductCard';
import './Home.css';
import { Link } from 'react-router-dom'; // Added Link import

function Home() {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Reset timer when it reaches 0
              hours = 2;
              minutes = 45;
              seconds = 30;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);





  const flashScrollRef = useRef(null);
  const topScrollRef = useRef(null);
  const todayScrollRef = useRef(null); // Added todayScrollRef

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Flash Sale Products
      try {
        const flashSaleResponse = await fetch('http://localhost:8080/api/products/flash-sale');
        if (flashSaleResponse.ok) {
          const flashSaleData = await flashSaleResponse.json();
          if (flashSaleData.success && flashSaleData.data) {
            setFlashSaleProducts(flashSaleData.data.slice(0, 8));
          } else {
            console.log('No Flash Sale data available');
            setFlashSaleProducts([]);
          }
        } else {
          console.log('Flash Sale API not available');
          setFlashSaleProducts([]);
        }
      } catch (error) {
        console.log('Flash Sale API error:', error.message);
        setFlashSaleProducts([]);
      }

      // Fetch Featured Products (used by Top Products and Today's Suggestions)
      try {
        const featuredResponse = await fetch('http://localhost:8080/api/products/top-products');
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.success && featuredData.data) {
            // Ensure we have up to 12 items for Today Suggestions
            setFeaturedProducts(featuredData.data.slice(0, 12));
          } else {
            console.log('No Featured Products data available');
            setFeaturedProducts([]);
          }
        } else {
          console.log('Featured Products API not available');
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.log('Featured Products API error:', error.message);
        setFeaturedProducts([]);
      }

      // Fetch Category Products
      try {
        const categoryResponse = await fetch('http://localhost:8080/api/products');
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          if (categoryData.success && categoryData.data && categoryData.data.products) {
            const groupedByCategory = {};
            categoryData.data.products.forEach(product => {
              const categoryName = product.categoryID?.categoryName || 'Other';
              if (!groupedByCategory[categoryName]) {
                groupedByCategory[categoryName] = [];
              }
              groupedByCategory[categoryName].push(product);
            });
            setCategoryProducts(groupedByCategory);
          } else {
            console.log('No Category Products data available');
            setCategoryProducts({});
          }
        } else {
          console.log('Category Products API not available');
          setCategoryProducts({});
        }
      } catch (error) {
        console.log('Category Products API error:', error.message);
        setCategoryProducts({});
      }

    } catch (error) {
      console.error('General error in fetchProducts:', error);
      // Set empty data if there's a general error
      setFlashSaleProducts([]);
      setFeaturedProducts([]);
      setCategoryProducts({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <Header />
      
      {/* Promotional Banners */}
      
      {/* Categories */}
      <CategoryList />
      
      {/* Flash Sale Section */}
      <section className="flash-sale-section">
        <div className="flash-sale-container">
          <div className="home-flash-header">
            <div className="flash-sale-title-with-timer">
              <h2 className="flash-sale-title">⚡ FLASH SALE</h2>
              <div className="flash-sale-timer">
                <span className="timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="timer-separator">:</span>
                <span className="timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="timer-separator">:</span>
                <span className="timer-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
            <Link to="/flash-sale" className="view-all-link">Xem thêm</Link>
          </div>
          <div className="flash-sale-products">
            <button className="scroll-arrow left" onClick={() => flashScrollRef.current?.scrollBy({left: -300, behavior: 'smooth'})}>←</button>
            <div className="flash-sale-scroll" ref={flashScrollRef}>
              {flashSaleProducts.length > 0 ? (
                flashSaleProducts.map(product => (
                  <FlashSaleCard key={product._id} product={product} />
                ))
              ) : (
                <p className="no-products">No flash sale products available</p>
              )}
            </div>
            <button className="scroll-arrow right" onClick={() => flashScrollRef.current?.scrollBy({left: 300, behavior: 'smooth'})}>→</button>
          </div>
        </div>
      </section>

      {/* Top Products Section - match Flash Sale layout */}
      <section className="top-products-section">
        <div className="top-products-container">
          <div className="home-top-header">
            <h2 className="top-products-title">🌟 Top Products</h2>
            <Link to="/top-products" className="view-all-link">Xem thêm</Link>
          </div>
          <div className="top-products-products">
            <button className="scroll-arrow left" onClick={() => topScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}>←</button>
            <div className="top-products-scroll" ref={topScrollRef}>
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <TopProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="no-products">No featured products available</p>
              )}
            </div>
            <button className="scroll-arrow right" onClick={() => topScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}>→</button>
          </div>
        </div>
      </section>

      {/* Today's Suggestions Section - carousel layout like Flash Sale */}
      <section className="today-suggestions-section">
        <div className="today-suggestions-container">
          <div className="home-today-header">
            <h2 className="today-suggestions-title">🎯 Gợi ý hôm nay</h2>
            <Link to="/today-suggestions" className="view-all-link">Xem thêm</Link>
          </div>
          <div className="today-suggestions-products">
            <button className="scroll-arrow left" onClick={() => todayScrollRef.current?.scrollBy({left: -300, behavior: 'smooth'})}>←</button>
            <div className="today-suggestions-scroll" ref={todayScrollRef}>
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 12).map(product => (
                  <TopProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="no-products">No suggestions available</p>
              )}
            </div>
            <button className="scroll-arrow right" onClick={() => todayScrollRef.current?.scrollBy({left: 300, behavior: 'smooth'})}>→</button>
          </div>
        </div>
      </section>
      </div>
    ); 
  }
  
  export default Home;
