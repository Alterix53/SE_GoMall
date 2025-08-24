import React, { useState, useEffect, useRef } from 'react';
// Header is globally rendered in App.js
import CategoryList from './Component/Category/CategoryList';
import ProductCard from './Component/ProductCard/ProductCard';
import FlashSaleCard from './Component/FlashSaleCard/FlashSaleCard';
import TopProductCard from './Component/TopProductCard/TopProductCard';
import './Home.css';
import { Link } from 'react-router-dom'; // Added Link import
import { apiService } from './utils/api';

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
        const flashSaleResponse = await apiService.get('/products/flash-sale');
        const flashSaleData = flashSaleResponse.data;
        const flashProducts = flashSaleData?.data?.products || flashSaleData?.products || [];
        if (Array.isArray(flashProducts)) {
          const mappedFlash = flashProducts.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p?.price?.sale || p?.price?.original || 0,
            originalPrice: p?.price?.original || 0,
            discount:
              p?.price?.original && p?.price?.sale
                ? Math.round(((p.price.original - p.price.sale) / p.price.original) * 100)
                : 0,
            image: p?.images?.[0]?.url ? `http://localhost:8080${p.images[0].url}` : '/images/placeholder-product.svg',
            rating: p?.rating || { average: 0, count: 0 },
            sold: p?.sold || 0,
            isFlashSale: p.isFlashSale || false,
          }));
          setFlashSaleProducts(mappedFlash.slice(0, 8));
        } else {
          setFlashSaleProducts([]);
        }
      } catch (error) {
        setFlashSaleProducts([]);
      }

      // Fetch Featured Products (used by Top Products and Today's Suggestions)
      try {
        const featuredResponse = await apiService.get('/products/top-products?type=bestseller&limit=12');
        const featuredData = featuredResponse.data;
        const topProducts = featuredData?.data?.products || featuredData?.products || [];
        if (Array.isArray(topProducts)) {
          const mappedTop = topProducts.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p?.price?.sale || p?.price?.original || 0,
            originalPrice: p?.price?.original || 0,
            discount:
              p?.price?.original && p?.price?.sale
                ? Math.round(((p.price.original - p.price.sale) / p.price.original) * 100)
                : 0,
            image: p?.images?.[0]?.url ? `http://localhost:8080${p.images[0].url}` : '/images/placeholder-product.svg',
            rating: p?.rating || { average: 0, count: 0 },
            sold: p?.sold || 0,
            isFeatured: p.isFeatured || false,
          }));
          setFeaturedProducts(mappedTop.slice(0, 12));
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        setFeaturedProducts([]);
      }

      // Fetch Category Products
      try {
        const categoryResponse = await apiService.get('/products');
        console.log('Category Response:', categoryResponse);
        const categoryData = categoryResponse.data;
        console.log('Category Raw Data:', categoryData);
        const allProducts = categoryData?.data?.products || categoryData?.products || [];
        console.log('All Products parsed:', allProducts);
        if (Array.isArray(allProducts)) {
          const groupedByCategory = {};
          allProducts.forEach((product) => {
            const categoryName = product.categoryID?.categoryName || 'Other';
            if (!groupedByCategory[categoryName]) {
              groupedByCategory[categoryName] = [];
            }
            groupedByCategory[categoryName].push(product);
          });
          console.log('Grouped by Category:', groupedByCategory);
          setCategoryProducts(groupedByCategory);
        } else {
          console.log('No Category Products data available');
          setCategoryProducts({});
        }
      } catch (error) {
        console.log('Category Products API error:', error.message);
        setCategoryProducts({});
      }

    } catch (error) {
      console.error('General error in fetchProducts:', error);
      setError(error.message);
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <p>Error loading products: {error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      
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
            <Link to="/flash-sale" className="view-all-link">See more...</Link>
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
            <Link to="/top-products" className="view-all-link">See more...</Link>
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
            <h2 className="today-suggestions-title">🎯 Today's Suggestions</h2>
            <Link to="/today-suggestions" className="view-all-link">See more...</Link>
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
