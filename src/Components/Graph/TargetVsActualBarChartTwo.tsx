import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
              borderRadius: '20%',
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

const TargetVsActualBarChartTwo = ({
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
        barCategoryGap="50%" // spacing between categories
        barGap={50} // spacing between bars within same category
        margin={{ top: 50, right: 40, bottom: 40, left: 30 }}
      >
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
          fill={actualColor}
          barSize={20}
          name="Actual"
          radius={[30, 30, 0, 0]}
        />
        <Bar
          dataKey={targetKey}
          fill={targetColor}
          barSize={20}
          name="Target"
          radius={[30, 30, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TargetVsActualBarChartTwo;
