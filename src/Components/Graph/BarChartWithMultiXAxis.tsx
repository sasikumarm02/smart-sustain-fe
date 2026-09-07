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
  LabelList,
} from 'recharts';

interface DataItem {
  label: string;
  [key: string]: number | string;
}

const BarChartWithMultiXAxis = ({ data, title, height }: any) => {
  const colorPalette = ['#B497FF', '#63EBDA', '#FFA3DA', '#00B8F5', '#098E7E'];
  const barKeys = Object.keys(data[0]).filter((key) => key !== 'label');
  return (
    <Card
      style={{ position: 'relative', marginTop: '10px', marginBottom: '10px' }}
    >
      <Row
        style={{ paddingBottom: '20px', paddingLeft: '20px' }}
        gutter={[2, 2]}
      >
        <Col style={{ color: '#3F434A', fontSize: '24px', fontWeight: 600 }}>
          {title}
        </Col>
        {barKeys.map((item, index) => (
          <Col lg={12} md={12} className="d-none d-md-block" key={index}>
            <Icon
              icon="icon-park-outline:dot"
              style={{
                fontSize: 30,
                color: colorPalette[index],
              }}
            />
            {item}
          </Col>
        ))}
      </Row>
      <ResponsiveContainer width={600} height={height}>
        <BarChart
          data={data}
          barGap={10}
          barSize={20}
          margin={{ top: 5, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" />

          <YAxis />
          <Tooltip />
          {Object.keys(data[0])
            .slice(1)
            .map((key, index) => (
              <Bar
                key={index}
                dataKey={key}
                fill={colorPalette[index % colorPalette.length]}
              >
                {/* <LabelList
                  dataKey={key}
                  position="inside"
                  style={{ fill: "#0A0A1F" }}
                /> */}
              </Bar>
            ))}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            margin: '20px auto',
            gap: '20px',
          }}
        >
          {data.map((item: DataItem, index: number) => (
            <span
              key={index}
              style={{ textAlign: 'center', marginLeft: '25px' }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BarChartWithMultiXAxis;
