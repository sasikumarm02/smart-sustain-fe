import { Card } from 'antd';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

const CustomizedLabel = ({ x, y, fill, value }: any) => {
  let formattedValue: string;

  if (Number.isInteger(value / 50)) {
    formattedValue = `${value / 50}.00`;
  } else {
    formattedValue = `${(value / 50).toFixed(2)}`; // Ensures always 3 decimal places
  }

  return (
    <text
      x={x + 19}
      y={y}
      dy={-4}
      fontSize="16"
      fontFamily="sans-serif"
      fill={fill}
      textAnchor="middle"
    >
      {formattedValue}%
    </text>
  );
};

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

const BarGraph = ({ title, subTitle, data, fill }: any) => (
  <>
    <Card bordered={false} style={{ width: '100%' }} className="p-3">
      <h2 className="titletag">{title}</h2>
      <p style={{ color: '#0A0A1F' }}>{subTitle}</p>
      <ResponsiveContainer height={300} width="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: -10, bottom: 25 }}
        >
          <XAxis
            dataKey="Year"
            fontFamily="sans-serif"
            tickSize={2}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis tickSize={0}>
            <Label
              style={{
                textAnchor: 'middle',
                fontSize: '20px',
                fill: 'red',
              }}
              angle={270}
            ></Label>
          </YAxis>
          <Tooltip content={CustomTooltip} />
          <CartesianGrid vertical={false} stroke="#ebf3f0" />
          <Bar
            dataKey="qty"
            barSize={30}
            fontFamily="sans-serif"
            label={<CustomizedLabel />}
            fill={fill}
          >
            {/* {
        data.map((entry, index) => (
          <Cell fill={data[index].AnswerRef === "three" ? '#61bf93' : '#ededed'} key={index} />
        ))
      } */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </>
);

export default BarGraph;
