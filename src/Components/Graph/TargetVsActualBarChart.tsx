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
} from 'recharts';
const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: 10,
      }}
    >
      {payload.map((entry: any, index: number) => (
        <div
          key={`item-${index}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '20%', // Rounded marker
              backgroundColor: entry.color,
              marginLeft: 30,
            }}
          />
          <span style={{ fontSize: '14px', color: '#000', marginLeft: 10 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const TargetVsActualBarChart = ({
  data,
  actualKey,
  targetKey,
  actualColor,
  targetColor,
  xAxisLabel,
  unit,
  height,
}: any) => {
  const formatter = new Intl.NumberFormat('en-US', {});

  return (
    <ResponsiveContainer width="100%" height={height || 320}>
      <BarChart
        data={data}
        layout="horizontal"
        barCategoryGap="0%"
        barGap="-100%" // << this is the key for overlap
        margin={{ top: 20, right: 30, bottom: 40, left: 20 }}
      >
        {/* <CartesianGrid strokeDasharray="1 1" /> */}
        <XAxis dataKey={xAxisLabel} />
        <YAxis tickFormatter={(value) => formatter.format(value)} />
        <Tooltip
          formatter={(value: any, name: string) => {
            const formattedValue = formatter.format(value);
            return [`${formattedValue} ${unit ? unit : ''}`, name];
          }}
        />
        <Legend content={<CustomLegend />} />

        <Bar
          dataKey={actualKey}
          stackId="a"
          fill={actualColor}
          barSize={20}
          name="Actual"
        />
        <Bar
          dataKey={targetKey}
          stackId="a"
          fill={targetColor}
          barSize={20}
          name="Target"
          radius={[30, 30, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TargetVsActualBarChart;
