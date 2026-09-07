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
} from 'recharts';

interface DataItem {
  name: string;
  pv: number;
  uv: number;
}

interface Props {
  data: DataItem[];
  title: any;
}

const SimpleBarChartVertical = ({ data, title }: Props) => {
  return (
    <Card style={{ marginTop: '10px', height: '55vh' }}>
      <Row>
        <Col span={24}>
          <p style={{ color: '#0A0A1F', fontSize: '24px' }}>{title}</p>
        </Col>
        <Col span={24}>
          <BarChart
            width={500}
            height={300}
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="pv" fill="#8884d8" barSize={30} />
            <Bar dataKey="uv" fill="#82ca9d" barSize={30} />
          </BarChart>
        </Col>
      </Row>
    </Card>
  );
};

export default SimpleBarChartVertical;
