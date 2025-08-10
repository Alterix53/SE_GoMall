import React from 'react';
import { Link } from 'react-router-dom';
import './ShopeeCategories.css';

const ShopeeCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Thời Trang Nam',
      icon: '👔',
      link: '/category/men-fashion',
      color: '#4a90e2'
    },
    {
      id: 2,
      name: 'Điện Thoại & Phụ Kiện',
      icon: '📱',
      link: '/category/phones',
      color: '#f39c12'
    },
    {
      id: 3,
      name: 'Thiết Bị Điện Tử',
      icon: '📺',
      link: '/category/electronics',
      color: '#e74c3c'
    },
    {
      id: 4,
      name: 'Máy Tính & Laptop',
      icon: '💻',
      link: '/category/computers',
      color: '#9b59b6'
    },
    {
      id: 5,
      name: 'Máy Ảnh & Máy Quay Phim',
      icon: '📷',
      link: '/category/cameras',
      color: '#34495e'
    },
    {
      id: 6,
      name: 'Đồng Hồ',
      icon: '⌚',
      link: '/category/watches',
      color: '#1abc9c'
    },
    {
      id: 7,
      name: 'Giày Dép Nam',
      icon: '👟',
      link: '/category/men-shoes',
      color: '#e67e22'
    },
    {
      id: 8,
      name: 'Thiết Bị Điện Gia Dụng',
      icon: '🏠',
      link: '/category/home-appliances',
      color: '#27ae60'
    },
    {
      id: 9,
      name: 'Thể Thao & Du Lịch',
      icon: '⚽',
      link: '/category/sports',
      color: '#f1c40f'
    },
    {
      id: 10,
      name: 'Ô Tô & Xe Máy & Xe Đạp',
      icon: '🏍️',
      link: '/category/vehicles',
      color: '#95a5a6'
    },
    {
      id: 11,
      name: 'Mỹ phẩm',
      icon: '💄',
      link: '/category/cosmetics',
      color: '#e91e63'
    },
    {
      id: 12,
      name: 'Sản phẩm y tế',
      icon: '💊',
      link: '/category/health',
      color: '#00bcd4'
    },
    {
      id: 13,
      name: 'Giày cao gót',
      icon: '👠',
      link: '/category/women-shoes',
      color: '#ff5722'
    },
    {
      id: 14,
      name: 'Túi xách',
      icon: '👜',
      link: '/category/bags',
      color: '#795548'
    },
    {
      id: 15,
      name: 'Thắt lưng',
      icon: '👖',
      link: '/category/belts',
      color: '#8d6e63'
    },
    {
      id: 16,
      name: 'Sô cô la',
      icon: '🍫',
      link: '/category/chocolate',
      color: '#6d4c41'
    },
    {
      id: 17,
      name: 'Sách',
      icon: '📚',
      link: '/category/books',
      color: '#d32f2f'
    }
  ];

  return (
    <div className="shopee-categories">
      <div className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">DANH MỤC</h2>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link} 
              className="category-item"
              style={{ '--category-color': category.color }}
            >
              <div className="category-icon">
                <span className="icon-text">{category.icon}</span>
              </div>
              <div className="category-name">{category.name}</div>
            </Link>
          ))}
        </div>
        
        <div className="categories-nav">
          <button className="nav-arrow left-arrow">‹</button>
          <button className="nav-arrow right-arrow">›</button>
        </div>
      </div>
    </div>
  );
};

export default ShopeeCategories; 