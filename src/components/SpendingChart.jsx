import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// for Pie Chart colors
const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#A288E2', '#FF6384', '#36A2EB'];

const SpendingChart = ({ categorySpending }) => {
  // Array format: [{ name: 'Food', value: 5000 }, ...]
  const chartData = Object.keys(categorySpending)
    .map(category => ({
      name: category,
      value: Math.round(categorySpending[category] * 100) / 100, // Rounding to 2 decimal places
    }))
    .sort((a, b) => b.value - a.value); 

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        No expense transactions for the current month. Add some expenses to see the breakdown!
      </div>
    );
  }

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white border border-gray-300 shadow-lg rounded-md text-sm">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p>Amount: {data.value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%" // Center X
            cy="50%" // Center Y
            innerRadius={80} // Donut chart effect
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={2}
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;