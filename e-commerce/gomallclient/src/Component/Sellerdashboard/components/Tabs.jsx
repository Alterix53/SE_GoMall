import React from 'react';

const Tabs = ({ activeTab, onTabChange, productsCount }) => {
  return (
    <div className="btn-group mb-4">
      <button 
        className={`btn btn-${activeTab === 1 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(1)}
      >
        Product List ({productsCount})
      </button>
      <button 
        className={`btn btn-${activeTab === 2 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(2)}
      >
        Add Product
      </button>
      <button 
        className={`btn btn-${activeTab === 3 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(3)}
      >
        Edit Product
      </button>
      <button 
        className={`btn btn-${activeTab === 4 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(4)}
      >
        Statistics
      </button>
      <button 
        className={`btn btn-${activeTab === 5 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(5)}
      >
        <i className="fas fa-bell me-1"></i>
        Notifications
      </button>
    </div>
  );
};

export default Tabs;
