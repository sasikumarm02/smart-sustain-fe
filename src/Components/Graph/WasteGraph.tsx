import { Icon } from '@iconify/react';
import { Card, Col, Row } from 'antd';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <p className="label">{`Name: ${label}`}</p>
        {payload.map((entry: any, index: any) => (
          <p
            key={`item-${index}`}
            style={{ color: entry.color }}
          >{`${entry.name}: ${entry.value}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

const WasteGraph = ({ title, data, barColors }: any) => {
  const barKeys = Object.keys(data[0]).filter((key) => key !== 'name');

  return (
    <Card bordered={false} style={{ width: '100%' }}>
      <h2 className="titletag">{title}</h2>
      <Row style={{ paddingBottom: '20px' }} gutter={[10, 10]}>
        {barKeys.map((item, index) => (
          <Col xl={10} lg={12} md={10} className="d-none d-md-block">
            <Icon
              icon="icon-park-outline:dot"
              style={{
                fontSize: 20,
                color: barColors[index],
              }}
            />
            <span className="graphLegends">{item}</span>
          </Col>
        ))}
      </Row>
      <ResponsiveContainer height={300} width="100%">
        <BarChart
          data={data}
          layout="vertical"
          barSize={20}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1 0" stroke="#E8E9EB" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            style={{ paddingRight: '20px' }}
          />
          <Tooltip content={CustomTooltip} />
          {/* <Legend verticalAlign="top" align="left"  /> */}
          {barKeys.map((key, index) => (
            <Bar
              key={index}
              dataKey={key}
              stackId="a"
              fill={barColors[index % barColors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WasteGraph;
