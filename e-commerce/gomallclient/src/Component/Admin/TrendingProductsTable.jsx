import React from "react";

function TrendingProductsTable({ products }) {
  return (
    <table className="table table-bordered align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Product Name</th>
          <th>Units Sold</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.unitsSold}</td>
            <td>{typeof p.revenue === 'number' ? p.revenue.toLocaleString() : p.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TrendingProductsTable; 