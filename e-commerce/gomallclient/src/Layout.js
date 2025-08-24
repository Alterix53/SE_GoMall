import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container">
          <h1>GoMall</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="layout-main">
        {children}
      </main>
      
      <footer className="layout-footer">
        <div className="container">
          <p>&copy; 2024 GoMall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
