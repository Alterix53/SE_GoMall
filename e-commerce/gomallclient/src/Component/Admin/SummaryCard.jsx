// components/SummaryCard.jsx
import React from 'react';
export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex align-items-center">
          <div className="me-3">{icon}</div>
          <div>
            <h6 className="card-title text-muted">{title}</h6>
            <h3 className="card-text">{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
