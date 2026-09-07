import { Card, Col, Row } from 'antd';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TinyBarChart = ({ data, colors, height, barGap, width }: any) => {
  // Extracting the keys of data excluding 'name'
  const barKeys = Object.keys(data[0]).filter((key) => key !== 'name');
  const abc = {
    name: 'Senior Management',
    'Social impact assessments': 4000,
    'Environmental impact': 2400,
    'Public disclosure of social impact': 2400,
  };
  return (
    <Row>
      <Col span={24}>
        <BarChart
          width={width}
          height={height}
          data={data}
          layout="vertical"
          barGap={barGap}
        >
          <CartesianGrid strokeDasharray="" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          {barKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index]} barSize={30} />
          ))}
        </BarChart>
      </Col>
    </Row>
  );
};

export default TinyBarChart;
