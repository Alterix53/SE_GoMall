
import React from 'react';
import {
  ResponsiveContainer,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export default function StatsChart({ data, xKey, dataKey, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip formatter={(val) => new Intl.NumberFormat().format(val)} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#0d6efd"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
