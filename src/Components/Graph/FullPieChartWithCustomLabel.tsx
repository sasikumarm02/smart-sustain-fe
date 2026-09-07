import { Icon } from '@iconify/react';
import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import { PageCardComponent } from '../../DesignLibrary';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={14}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const FullPieChartWithCustomLabel = ({
  data,
  barColors,
  title,
  showLegends,
  height,
  titleColor,
  titleSize,
  showTooltip,
  legendColor,
  unit,
}: any) => {
  const barKeys = data?.map((item: any) => item.name);
  const formatter = new Intl.NumberFormat('en-US', {});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <>
      {data.length > 0 ? (
        <div
          style={{
            backgroundColor: '#0B243B',
            borderRadius: '20px',
            padding: '20px',
            color: '#fff',
            width: '100%',
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: titleSize || '24px',
                fontWeight: '400',
                fontFamily: 'Rubik',
                paddingLeft: '17px',
                paddingBottom: '15px',
                color: titleColor || '#3F434A',
              }}
            >
              {title}
            </h2>
          )}

          {showLegends && (
            <div style={{ marginBottom: '10px' }}>
              {barKeys.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: barColors[index],
                      marginRight: 8,
                    }}
                  />
                  <span
                    style={{ fontSize: '14px', color: legendColor || '#fff' }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Row justify="center">
            <Col span={24}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: height || 300,
                }}
              >
                <ResponsiveContainer width="100%" height={height || 300}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={0}
                      labelLine={false}
                      stroke="none"
                      label={renderCustomizedLabel}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                      activeIndex={activeIndex!}
                      activeShape={(props: any) => {
                        const {
                          cx,
                          cy,
                          innerRadius,
                          outerRadius,
                          startAngle,
                          endAngle,
                          fill,
                          payload,
                          percent,
                          midAngle,
                        } = props;

                        const radiusOffset = 8;
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + radiusOffset;

                        return (
                          <g>
                            {/* <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#000"
          fontSize="14"
          fontWeight="bold"
        >
          {`${payload.name}`}
        </text> */}
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius}
                              outerRadius={radius}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                            />
                          </g>
                        );
                      }}
                    >
                      {data.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[index % barColors.length]}
                        />
                      ))}
                    </Pie>
                    {/* {showTooltip && (
                      <Tooltip
                        content={({ payload }: any) => {
                          if (payload && payload.length) {
                            const { name, value } = payload[0];
                            return (
                              <div
                                style={{
                                  padding: '10px',
                                  backgroundColor: '#fff',
                                  borderRadius: '5px',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                              >
                                <strong>{name}</strong>
                                <div>{formatter.format(value)} {unit}</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    )} */}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <PageCardComponent className="handleGraphEmptyData">
          <span>No data Found</span>
        </PageCardComponent>
      )}
    </>
  );
};

export default FullPieChartWithCustomLabel;
