import { Card } from 'antd';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

interface CustomBarChartProps {
  data: { name: string; Actual: number; Target: number }[];
}

const HorizontalCustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
  return (
    <Card bordered={false} style={{ width: '100%' }} className="p-3">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
        >
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FD349C" />
              <stop offset="100%" stopColor="#971F5D" />
            </linearGradient>

            <linearGradient id="color2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7213EA" />
              <stop offset="100%" stopColor="#400B84" />
            </linearGradient>
          </defs>

          <XAxis type="number" />
          <YAxis dataKey="name" type="category" fontSize={8} fontWeight={500} />
          <Tooltip />
          <Legend align="right" />

          <Bar dataKey="Actual" fill="url(#color1)" name="Actual" />
          <Bar dataKey="Target" fill="url(#color2)" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const RoundBar = (props: any) => {
  const { x, y, width, height, fill } = props;

  const topRadius = Math.min(5, height / 2);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={topRadius}
        fill={fill}
      />

      <rect
        x={x}
        y={y + topRadius}
        width={width}
        height={height - topRadius}
        fill={fill}
      />
    </g>
  );
};
export default HorizontalCustomBarChart;
