import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { isEmpty } from '../../Utils/isEmpty';

const total = 500;
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Remaining', value: total - 400 },
];

const CircularChart = ({ color, text1, text2, text3 }: any) => {
  const COLORS = [color, '#E0E0E0'];

  const CustomLabel = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;
    return (
      <>
        <text
          x={cx + 28}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '16px', fontWeight: 400 }}
        >
          Stage
        </text>
        <text
          x={cx - 20}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '34px', fontWeight: 700, color: color }}
        >
          {text1}
        </text>
        <text
          x={cx - 3}
          y={cy - 15}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '16px', fontWeight: 700, color: color }}
        >
          {text2}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '16px', fontWeight: 'normal' }}
        >
          {text3}
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width={200} height={190}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {!isEmpty(data) &&
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          <Label content={<CustomLabel />} position="center" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CircularChart;
