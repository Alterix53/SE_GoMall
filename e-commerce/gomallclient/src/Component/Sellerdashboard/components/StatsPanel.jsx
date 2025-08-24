import React from 'react';
import { formatCurrencyWithSymbol } from '../utils/format';

const StatsPanel = ({ products }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // Category breakdown
  const categoryStats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="stat-box">
      <h4>Overview Statistics</h4>
      
      <div className="row">
        <div className="col-md-3">
          <div className="stat-item">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="stat-item">
            <div className="stat-label">Total Value</div>
            <div className="stat-value">
              {formatCurrencyWithSymbol(totalValue)}
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="stat-item">
            <div className="stat-label">Average Price</div>
            <div className="stat-value">
              {formatCurrencyWithSymbol(Math.round(averagePrice))}
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="stat-item">
            <div className="stat-label">Total Stock</div>
            <div className="stat-value">
              {totalStock}
            </div>
          </div>
        </div>
      </div>

      {totalProducts > 0 && (
        <div className="mt-4">
          <h5>Product Categories</h5>
          <div className="row">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="col-md-4 mb-2">
                <div className="stat-item">
                  <div className="stat-label">{category}</div>
                  <div className="stat-value">{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
