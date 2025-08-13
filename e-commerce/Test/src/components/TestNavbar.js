import React, { useState } from 'react';

const TestNavbar = ({ 
  brand = 'GoMall', 
  showSearch = true, 
  showCart = true, 
  showUser = true,
  variant = 'light'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getNavbarStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    };

    const variantStyles = {
      light: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        border: '1px solid #dee2e6'
      },
      dark: {
        backgroundColor: '#343a40',
        color: 'white',
        border: '1px solid #495057'
      },
      primary: {
        backgroundColor: '#007bff',
        color: 'white',
        border: '1px solid #0056b3'
      }
    };

    return {
      ...baseStyles,
      ...variantStyles[variant]
    };
  };

  const getLinkStyles = () => ({
    color: variant === 'light' ? '#333' : 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  });

  return (
    <nav style={getNavbarStyles()}>
      {/* Brand */}
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
        {brand}
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a href="#" style={getLinkStyles()}>Home</a>
        <a href="#" style={getLinkStyles()}>Products</a>
        <a href="#" style={getLinkStyles()}>About</a>
        <a href="#" style={getLinkStyles()}>Contact</a>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search */}
        {showSearch && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: variant === 'light' ? 'white' : '#495057',
                color: variant === 'light' ? '#333' : 'white'
              }}
            />
            <button
              style={{
                marginLeft: '5px',
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: variant === 'light' ? 'white' : '#495057',
                color: variant === 'light' ? '#333' : 'white',
                cursor: 'pointer'
              }}
            >
              🔍
            </button>
          </div>
        )}

        {/* Cart */}
        {showCart && (
          <a href="#" style={getLinkStyles()}>
            🛒 Cart (0)
          </a>
        )}

        {/* User */}
        {showUser && (
          <a href="#" style={getLinkStyles()}>
            👤 Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default TestNavbar; 