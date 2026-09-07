import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChartWithCustomizedLabel = ({ data, submittedColor }: any) => {
  // Define the colors based on the submittedColor
  const COLORS = [
    submittedColor?.colors?.requirementMet || '#28a745', // Default to green
    submittedColor?.colors?.requirementPartiallyMet || '#ffc107', // Default to yellow
    submittedColor?.colors?.requirementNotMet || '#ED2939', // Default to red
    submittedColor?.colors?.requirementTbc || '#7F7F7D',
  ];

  // Chart data
  const chartData = [
    { name: 'Requirement Met', value: data.green },
    { name: 'Partially Met', value: data.yellow },
    { name: 'Not Met', value: data.orange },
    { name: 'TBC', value: data.grey },
  ];

  // Render labels inside the chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const value = `${(percent * 100).toFixed(0)}%`;
    const textWidth = value.length * 7;
    const textHeight = 18;

    return (
      <g>
        <rect
          x={x - textWidth / 2 - 4}
          y={y - textHeight / 2}
          rx={5}
          ry={5}
          width={textWidth + 9}
          height={textHeight + 1}
          fill="transparent"
          //stroke="#cccccc"
          strokeWidth={0.5}
        />
        {/* Text */}
        <text
          x={x}
          y={y}
          fill="#000000"
          //fontSize={10}
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight="bold"
          className="custom-tooltip-charts"
        >
          {value === '0%' ? '' : value}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="custom-tooltip-charts"
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            lineHeight: 1.2,
          }}
        >
          <p
            className="label"
            style={{
              color: data.fill,
            }}
          >
            {data.name} : {data.value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius="40%" // Set innerRadius for donut effect
          outerRadius="100%"
          labelLine={false}
          label={renderCustomizedLabel}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChartWithCustomizedLabel;
