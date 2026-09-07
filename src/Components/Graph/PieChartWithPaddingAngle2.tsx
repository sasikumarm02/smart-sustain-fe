import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Col, Row } from 'antd';

const COLORS = ['#B497FF', '#00C0AE'];

const renderCustomizedImage = ({
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

  return (
    <text
      x={x}
      y={y}
      fill="white"
      style={{ fontSize: '10px', fontWeight: 'bold', textAnchor: 'middle' }}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(2)}%`}

      {}
    </text>
  );
};

const renderCustomizedLabelOutside = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30; // Increase the radius to position labels outside the pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const barColors = ['#00B8F5', '#2D4BE6', '#00338D'];

  return (
    <text
      x={x}
      y={y}
      fill={barColors[index % barColors.length]}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="16px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const PieChartWithPaddingAngle2 = ({
  height,
  width,
  data,
  color,
  inner,
  outer,
  showLegends = true,
  showLableline,
  unit,
  labels = [],
}: any) => {
  const COLORS2 = color ? color : COLORS;

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsiveContainer>
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            innerRadius={inner ? inner : 30}
            outerRadius={outer ? outer : 70}
            fill="#8884d8"
            dataKey="value"
            labelLine={
              showLableline ? { stroke: '#8884d8', strokeWidth: 1 } : false
            }
            label={
              showLableline
                ? renderCustomizedLabelOutside
                : renderCustomizedImage
            }
          >
            {data.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS2[index % COLORS2.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { name, value } = payload[0];
              const { number } = payload[0]?.payload?.payload;
              return (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                  }}
                >
                  {number ? (
                    <div>
                      {name}:<b>{number}</b>
                    </div>
                  ) : (
                    <div>
                      {name}: <b>{value}</b>
                      {unit ? unit : ''}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {showLegends && labels.length > 0 && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}
        >
          {labels.map((label: string, idx: number) => (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', margin: '0 8px' }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '20%',
                  backgroundColor: color?.[idx % color.length],
                  marginRight: 6,
                }}
              />
              <span style={{ fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChartWithPaddingAngle2;
