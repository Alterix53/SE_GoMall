import React from 'react';
import { Link } from 'react-router-dom';
import './ShopeeShortcuts.css';

const ShopeeShortcuts = () => {
  const shortcuts = [
    {
      id: 1,
      name: 'Mã Giảm Giá',
      icon: '🎫',
      link: '/vouchers',
      color: '#ff6b35'
    },
    {
      id: 2,
      name: 'Hàng Chọn Giá Hời',
      icon: '✅',
      link: '/deals',
      color: '#00a651'
    },
    {
      id: 3,
      name: 'Deal Hot Giờ Vàng',
      icon: '⚡',
      link: '/flash-sale',
      color: '#ff4757'
    },
    {
      id: 4,
      name: 'Shopee Style Voucher 30%',
      icon: '👗',
      link: '/style',
      color: '#ff6b9d'
    },
    {
      id: 5,
      name: 'Săn Ngay 100.000 Xu',
      icon: '🎁',
      link: '/coins',
      color: '#ffa502'
    },
    {
      id: 6,
      name: 'Khách Hàng Thân Thiết',
      icon: '👑',
      link: '/vip',
      color: '#ff6b35'
    }
  ];

  return (
    <div className="shopee-shortcuts">
      <div className="shortcuts-container">
        <div className="shortcuts-grid">
          {shortcuts.map((shortcut) => (
            <Link 
              key={shortcut.id} 
              to={shortcut.link} 
              className="shortcut-item"
              style={{ '--shortcut-color': shortcut.color }}
            >
              <div className="shortcut-icon">
                <span className="icon-text">{shortcut.icon}</span>
              </div>
              <div className="shortcut-name">{shortcut.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopeeShortcuts; 