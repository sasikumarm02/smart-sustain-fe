import { Col, Row } from 'antd';
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
} from 'recharts';

const data = [
  {
    name: 'Public legal cases regarding corruption',
    uv: 14,
  },
  {
    name: 'Number of incidents in which action taken against Employees',
    uv: 12,
  },
  {
    name: 'Number of incidents in which action taken against Business Partners',
    uv: 6,
  },
];

const BarChartNoPadding = () => {
  const tickFormatter = ({ data }: any) => {
    return ``;
  };

  return (
    <Row>
      <Col
        span={8}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {data.map((item) => {
          return <p style={{ fontSize: '12px' }}>{item.name}</p>;
        })}
      </Col>
      <Col span={16}>
        <BarChart
          layout="vertical"
          width={600}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
          barSize={50}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" tickFormatter={tickFormatter} />
          <Tooltip />
          {/* <Legend /> */}
          <CartesianGrid stroke="#ccc" horizontal={false} />
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </Col>
    </Row>
  );
};

export default BarChartNoPadding;
