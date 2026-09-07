import { Button, Card, Col, Row } from 'antd';
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
import { useNavigate } from 'react-router-dom';

export default function BarChartWithSingle({ data, title, buttonLabel }: any) {
  const navigate = useNavigate();
  // Define color palette
  const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];
  const reversedData = [...data].reverse();
  const barKeys = Object.keys(data[0]).filter((key) => key !== 'name');

  return (
    <div>
      <Card style={{ marginTop: '10px' }}>
        <Row>
          <Col span={12}>
            <h5 className="titletag">{title}</h5>
          </Col>
          <Col span={12} className="d-flex justify-content-end">
            {buttonLabel && (
              <Button
                style={{
                  borderRadius: '30px',
                  border: '1px solid #00338D',
                  color: '#00338D',
                }}
                onClick={() => navigate('/settings/supplier-list')}
              >
                {buttonLabel}
              </Button>
            )}
          </Col>
          <Col span={24}>
            <BarChart
              width={500}
              height={300}
              data={reversedData}
              layout="vertical"
              margin={{
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={true} horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="uv" fill="#617FEB" barSize={30} />
            </BarChart>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
