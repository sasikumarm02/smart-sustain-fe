import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StackedChart = ({
  chartWidth,
  chartHeight,
  chartData,
  chartMargin,
}: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={chartData}
        margin={chartMargin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" stackId="a" fill="#8884d8" />
        <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedChart;
