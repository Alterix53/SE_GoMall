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

  // Sample data for fallback
  const sampleFlashSale = [
    {
      _id: "flash1",
      name: "iPhone 15 Pro Max",
      price: 25000000,
      originalPrice: 30000000,
      image: "/images/phone1.jpg",
      rating: 4.8,
      sold: 150,
      discount: 17
    },
    {
      _id: "flash2", 
      name: "Samsung Galaxy S24",
      price: 18000000,
      originalPrice: 22000000,
      image: "/images/phone2.jpg",
      rating: 4.6,
      sold: 89,
      discount: 18
    },
    {
      _id: "flash3",
      name: "MacBook Pro M3",
      price: 45000000,
      originalPrice: 50000000,
      image: "/images/laptop1.jpg",
      rating: 4.9,
      sold: 45,
      discount: 10
    },
    {
      _id: "flash4",
      name: "AirPods Pro 2",
      price: 5500000,
      originalPrice: 6500000,
      image: "/images/airpods.jpg",
      rating: 4.7,
      sold: 234,
      discount: 15
    }
  ];

  const sampleFeatured = [
    {
      _id: "featured1",
      name: "MacBook Pro M3",
      price: 45000000,
      originalPrice: 50000000,
      image: "/images/laptop1.jpg",
      rating: 4.9,
      sold: 45,
      discount: 10
    },
    {
      _id: "featured2",
      name: "AirPods Pro 2",
      price: 5500000,
      originalPrice: 6500000,
      image: "/images/airpods.jpg",
      rating: 4.7,
      sold: 234,
      discount: 15
    },
    {
      _id: "featured3",
      name: "Apple Watch Series 9",
      price: 12000000,
      originalPrice: 14000000,
      image: "/images/watch.jpg",
      rating: 4.4,
      sold: 35,
      discount: 14
    },
    {
      _id: "featured4",
      name: "iPad Pro 12.9",
      price: 28000000,
      originalPrice: 32000000,
      image: "/images/ipad.jpg",
      rating: 4.6,
      sold: 67,
      discount: 12
    }
  ];

  const sampleCategoryProducts = {
    "Phones": [
      {
        _id: "1",
        name: "iPhone 15 Pro",
        price: 25000000,
        originalPrice: 30000000,
        image: "/images/phone1.jpg",
        rating: 4.5,
        sold: 50
      },
      {
        _id: "2",
        name: "Samsung Galaxy S24",
        price: 18000000,
        originalPrice: 22000000,
        image: "/images/phone2.jpg",
        rating: 4.3,
        sold: 30
      },
      {
        _id: "3",
        name: "Xiaomi 14 Pro",
        price: 15000000,
        originalPrice: 18000000,
        image: "/images/phone3.jpg",
        rating: 4.2,
        sold: 25
      },
      {
        _id: "4",
        name: "OPPO Find X7",
        price: 12000000,
        originalPrice: 15000000,
        image: "/images/phone4.jpg",
        rating: 4.1,
        sold: 20
      }
    ],
    "Laptops": [
      {
        _id: "5",
        name: "MacBook Pro M3",
        price: 45000000,
        originalPrice: 50000000,
        image: "/images/laptop1.jpg",
        rating: 4.8,
        sold: 25
      },
      {
        _id: "6",
        name: "Dell XPS 13",
        price: 28000000,
        originalPrice: 32000000,
        image: "/images/laptop2.jpg",
        rating: 4.6,
        sold: 20
      },
      {
        _id: "7",
        name: "Lenovo ThinkPad X1",
        price: 32000000,
        originalPrice: 38000000,
        image: "/images/laptop3.jpg",
        rating: 4.7,
        sold: 15
      },
      {
        _id: "8",
        name: "HP Spectre x360",
        price: 25000000,
        originalPrice: 30000000,
        image: "/images/laptop4.jpg",
        rating: 4.5,
        sold: 18
      }
    ],
    "Accessories": [
      {
        _id: "9",
        name: "AirPods Pro 2",
        price: 5500000,
        originalPrice: 6500000,
        image: "/images/airpods.jpg",
        rating: 4.7,
        sold: 100
      },
      {
        _id: "10",
        name: "Apple Watch Series 9",
        price: 12000000,
        originalPrice: 14000000,
        image: "/images/watch.jpg",
        rating: 4.4,
        sold: 35
      },
      {
        _id: "11",
        name: "Samsung Galaxy Buds2",
        price: 3500000,
        originalPrice: 4500000,
        image: "/images/buds.jpg",
        rating: 4.3,
        sold: 80
      },
      {
        _id: "12",
        name: "Magic Keyboard",
        price: 8000000,
        originalPrice: 9000000,
        image: "/images/keyboard.jpg",
        rating: 4.6,
        sold: 45
      }
    ],
    "Fashion": [
      {
        _id: "13",
        name: "Nike Air Max 270",
        price: 2500000,
        originalPrice: 3000000,
        image: "/images/shoes1.jpg",
        rating: 4.5,
        sold: 120
      },
      {
        _id: "14",
        name: "Adidas Ultraboost",
        price: 3200000,
        originalPrice: 3800000,
        image: "/images/shoes2.jpg",
        rating: 4.7,
        sold: 95
      },
      {
        _id: "15",
        name: "Levi's 501 Jeans",
        price: 1200000,
        originalPrice: 1500000,
        image: "/images/jeans.jpg",
        rating: 4.3,
        sold: 200
      },
      {
        _id: "16",
        name: "Uniqlo T-Shirt",
        price: 300000,
        originalPrice: 400000,
        image: "/images/tshirt.jpg",
        rating: 4.2,
        sold: 350
      }
    ]
  };

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
            console.log('Using fallback data for Flash Sale');
            setFlashSaleProducts(sampleFlashSale);
          }
        } else {
          console.log('Using fallback data for Flash Sale');
          setFlashSaleProducts(sampleFlashSale);
        }
      } catch (error) {
        console.log('Flash Sale API error, using fallback data:', error.message);
        setFlashSaleProducts(sampleFlashSale);
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
            console.log('Using fallback data for Featured Products');
            // Build a fallback list up to 12 items by combining sampleFeatured with category samples
            const extendedFallback = [...sampleFeatured, ...Object.values(sampleCategoryProducts).flat()].slice(0, 12);
            setFeaturedProducts(extendedFallback);
          }
        } else {
          console.log('Using fallback data for Featured Products');
          // Build a fallback list up to 12 items by combining sampleFeatured with category samples
          const extendedFallback = [...sampleFeatured, ...Object.values(sampleCategoryProducts).flat()].slice(0, 12);
          setFeaturedProducts(extendedFallback);
        }
      } catch (error) {
        console.log('Featured Products API error, using fallback data:', error.message);
        const extendedFallback = [...sampleFeatured, ...Object.values(sampleCategoryProducts).flat()].slice(0, 12);
        setFeaturedProducts(extendedFallback);
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
            console.log('Using fallback data for Category Products');
            setCategoryProducts(sampleCategoryProducts);
          }
        } else {
          console.log('Using fallback data for Category Products');
          setCategoryProducts(sampleCategoryProducts);
        }
      } catch (error) {
        console.log('Category Products API error, using fallback data:', error.message);
        setCategoryProducts(sampleCategoryProducts);
      }

    } catch (error) {
      console.error('General error in fetchProducts:', error);
      // Set all fallback data if there's a general error
      setFlashSaleProducts(sampleFlashSale);
      setFeaturedProducts(sampleFeatured);
      setCategoryProducts(sampleCategoryProducts);
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
