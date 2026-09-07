import React, { useState } from 'react';
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
import { Checkbox } from 'antd';

const data = [
  {
    name: 'Environment',
    National: 4000,
    Sector: 2400,
    Company: 2400,
  },
  {
    name: 'Social',
    National: 3000,
    Sector: 1398,
    Company: 2210,
  },
  {
    name: 'Governance',
    National: 2000,
    Sector: 9800,
    Company: 2290,
  },
];

let categories = Object.keys(data[0]);
const slicedCate = categories.slice(1).map((item) => item);

const AssesmentBenchMark: React.FC = () => {
  const customYAxisTick = ({ x, y, payload, index }: any) => {
    const interval = index === 1 ? payload.value - 0 : 2500;

    if (typeof payload.value === 'number') {
      const stringValue = String(payload.value);
      // Replace numbers with 'L0', 'L1', etc. based on their position in the string
      const replacedValue = stringValue.replace(
        /\b(\d+)\b/g,
        (match, number) => {
          const level = Math.floor(Number(number) / interval) + 1;
          return `L ${level}`;
        }
      );

      return (
        <text x={x} y={y} dy={16} textAnchor="end" fill="#666">
          {replacedValue}
        </text>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="benchmark">
      <ResponsiveContainer width="100%" height="400" aspect={1.5}>
        <BarChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 15,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} stroke="#ebf3f0" />
          <XAxis dataKey="name" />
          <YAxis tick={customYAxisTick as any} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="National" fill="#B497FF" />
          <Bar dataKey="Sector" fill="#76D2FF" />
          <Bar dataKey="Company" fill="#63EBDA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssesmentBenchMark;
