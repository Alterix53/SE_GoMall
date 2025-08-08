
import React from 'react';
import './CategoryItem.css';

export default function CategoryItem({ icon, name, color, onClick }) {
  return (
    <div 
      className="category-item" 
      style={{ '--category-color': color }}
      onClick={onClick}
    >
      <div className="category-icon">
        <span className="icon-text">{icon}</span>
      </div>
      <div className="category-name">{name}</div>
    </div>
  );
}
