import { Icon } from '@iconify/react';
import { Card, Col, Row } from 'antd';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '12px' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const WastemanagementPie = ({ data, barColors, title }: any) => {
  const barKeys = data.map((item: any) => item.name);

  return (
    <>
      <Row justify="center">
        <Col>
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={10}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={20}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry: any, index: any) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Row justify="center" style={{ paddingTop: '20px' }} gutter={16}>
        {barKeys.length > 0 &&
          barKeys.map((item: any, index: any) => (
            <Col
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0 10px',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: barColors[index],
                  marginRight: '8px',
                }}
              />
              <span>{item}</span>
            </Col>
          ))}
      </Row>
    </>
  );
};

export default WastemanagementPie;
