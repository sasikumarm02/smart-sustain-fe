import { Icon } from '@iconify/react';
import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
      fontSize={16}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartWithCustomizablelabel = ({
  data,
  barColors,
  title,
  showLegends,
  showLableline,
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

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
          {/* Legends */}
          {showLegends && (
            <div style={{ marginBottom: '10px' }}>
              {data.map((item: any, index: number) => (
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
                    {item.name} : {formatter.format(item.value)}
                    {unit ? ` ${unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Row justify="center">
            <Col span={24} style={{ marginBottom: '80px' }}>
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
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      outerRadius={100}
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
                          percent,
                        } = props;

                        const radius = outerRadius + 10;

                        const startRad = -startAngle * RADIAN;
                        const endRad = -endAngle * RADIAN;

                        const x1 = cx + radius * Math.cos(startRad);
                        const y1 = cy + radius * Math.sin(startRad);
                        const x2 = cx + radius * Math.cos(endRad);
                        const y2 = cy + radius * Math.sin(endRad);

                        return (
                          <g>
                            <path
                              d={`M${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} L${cx},${cy} Z`}
                              fill={fill}
                            />
                            {/* <text
                              x={cx}
                              y={cy - outerRadius / 1.5}
                              textAnchor="middle"
                              fill="#000"
                              fontWeight="bold"
                              fontSize={16}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text> */}
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
                {/* Center Design */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '0',
                    transform: 'translate(-50%, 50%)',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    backgroundColor: '#122C44',
                    border: '6px solid #B6C0DC',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
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

export default PieChartWithCustomizablelabel;
