import React from 'react';
import { RadialBarChart, RadialBar, Legend } from 'recharts';
import Female from '../../../assets/image/Group (1).png';
import Male from '../../../assets/image/Group3.png';
const data = [
  {
    name: '50+',
    uv: 4.63,
    pv: 700,
    fill: '#00C0AE',
  },
  {
    name: 'unknow',
    uv: 2.67,
    pv: 800,
    fill: '#B497FF',
  },
];
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
const style = {
  top: 0,
  left: 350,
  lineHeight: '24px',
};

export default function RadialProgressBar() {
  return (
    <RadialBarChart
      width={500}
      height={190}
      cx={230}
      cy={100}
      innerRadius={110}
      outerRadius={140}
      barSize={10}
      data={data}
    >
      <RadialBar
        // minAngle={15}
        label={renderCustomizedImage}
        background
        // clockWise
        dataKey="uv"
      />
    </RadialBarChart>
  );
}
