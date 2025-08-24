import React from 'react';

const Tabs = ({ activeTab, onTabChange, productsCount }) => {
  return (
    <div className="btn-group mb-4">
      <button 
        className={`btn btn-${activeTab === 1 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(1)}
      >
        Danh sách sản phẩm ({productsCount})
      </button>
      <button 
        className={`btn btn-${activeTab === 2 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(2)}
      >
        Thêm sản phẩm
      </button>
      <button 
        className={`btn btn-${activeTab === 3 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(3)}
      >
        Sửa sản phẩm
      </button>
      <button 
        className={`btn btn-${activeTab === 4 ? 'primary' : 'outline-primary'}`} 
        onClick={() => onTabChange(4)}
      >
        Thống kê
      </button>
    </div>
  );
};

export default Tabs;
