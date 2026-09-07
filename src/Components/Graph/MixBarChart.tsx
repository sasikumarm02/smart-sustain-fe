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
  ResponsiveContainer,
  LabelList,
  TooltipProps,
} from 'recharts';

import { PageCardComponent } from '../../DesignLibrary';
import { formatNumberUS } from '../../Utils/Strings';

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
        <p style={{ marginBottom: 8, fontWeight: 500 }}>{`Name: ${label}`}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {payload.map((entry: any, index: number) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: entry.color,
                  borderRadius: '50%',
                  marginRight: 6,
                }}
              />
              <span style={{ textTransform: 'capitalize', marginRight: 4 }}>
                {entry.name}:
              </span>
              <span>{formatNumberUS(entry.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ x, y, value, width }: any) => {
  return value > 0 ? (
    <text
      x={x + width / 2}
      y={y - 15}
      textAnchor="middle"
      fill="#666"
      style={{ zIndex: 10 }}
    >
      {formatNumberUS(value)}
    </text>
  ) : null;
};

const MixBarChart = ({
  subTitle,
  title,
  data,
  barColors,
  unit,
  showLegends,
  showCard,
}: any) => {
  const barKeys =
    data && data[0] ? Object.keys(data[0]).filter((key) => key !== 'name') : [];

  return (
    <>
      {data.length > 0 ? (
        <Card
          bordered={false}
          style={{ width: '100%', boxShadow: showCard ? '' : 'none' }}
        >
          {title && <p className="titletag">{title}</p>}
          {subTitle && (
            <p
              style={{
                paddingLeft: '20px',
                color: 'rgba(10, 10, 31, 1)',
                fontWeight: '500',
                fontSize: '16px',
                fontFamily: 'Arial',
              }}
            >
              {subTitle}
            </p>
          )}

          {showLegends && (
            <Row
              gutter={[16, 16]}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                paddingLeft: '20px',
                paddingRight: '20px',
                marginBottom: '10px',
              }}
            >
              {barKeys.map((item, index) => (
                <Col key={index}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        backgroundColor: barColors[index],
                        borderRadius: '50%',
                      }}
                    />
                    <span className="legend-text">{item}</span>
                  </span>
                </Col>
              ))}
            </Row>
          )}

          <Row align={'bottom'}>
            <Col span={24}>
              <ResponsiveContainer height={320}>
                <BarChart
                  data={data}
                  barSize={30}
                  margin={{
                    top: 20,
                    right: 30,
                    left: -22,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="1 0"
                    stroke="#E7EAEE"
                    vertical={false}
                  />
                  <XAxis dataKey="name" tickSize={0} tickMargin={15} />
                  <YAxis tickSize={0} />
                  <Tooltip content={<CustomTooltip />} />
                  {barKeys?.map((key, index) => (
                    <Bar
                      key={index}
                      dataKey={key}
                      stackId="a"
                      fill={barColors[index % barColors.length]}
                      style={{ zIndex: 0 }}
                    >
                      {index === barKeys?.length - 1 ? (
                        <LabelList
                          style={{ zIndex: 100 }}
                          position="insideTop"
                          content={CustomLabel}
                        />
                      ) : null}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Card>
      ) : (
        <PageCardComponent className="handleGraphEmptyData">
          <span>No data Found</span>
        </PageCardComponent>
      )}
    </>
  );
};

export default MixBarChart;
