import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    subject: 'Environment',
    A: 56,
    B: 60,
    fullMark: 150,
  },
  {
    subject: 'Social',
    A: 56,
    B: 60,
    fullMark: 150,
  },
  {
    subject: 'Governance',
    A: 110,
    B: 120,
    fullMark: 150,
  },
];

const RadialChart = () => (
  <div style={{ width: '100%', height: '100vh', maxHeight: 700 }}>
    <ResponsiveContainer>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          name="Score"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default RadialChart;
