import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Female from '../../assets/image/Group (1).png';
import Male from '../../assets/image/Group3.png';

const COLORS = ['#B497FF', '#00C0AE'];

const renderCustomizedImage = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <image x={cx - 60} y={cy - 40} width={80} height={80} href={Male} />
      <image x={cx - 10} y={cy - 40} width={80} height={80} href={Female} />
      <text
        x={x}
        y={y}
        fill="#000"
        style={{ fontSize: '16px' }}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
};

const PieChartWithPaddingAngle = ({ height, width, data }: any) => {
  return (
    <>
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          innerRadius={120}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          label={renderCustomizedImage}
        >
          {data.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

export default PieChartWithPaddingAngle;
