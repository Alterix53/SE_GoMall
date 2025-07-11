import React from "react";

function RevenueDistributionTable({ data, colors }) {
  return (
    <table className="table table-sm table-borderless">
      <tbody>
        {data.map((item, idx) => (
          <tr key={item.name}>
            <td>
              <span style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                background: colors[idx % colors.length],
                borderRadius: 2,
                marginRight: 8
              }}></span>
            </td>
            <td>{item.name}</td>
            <td className="text-end">${(item.value / 1000).toFixed(0)}k</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RevenueDistributionTable; 