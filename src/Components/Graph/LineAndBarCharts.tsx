import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CustomCombinedChartProps {
  data: { name: string; Actual: number; Projected: number }[];
}

const CustomCombinedChart: React.FC<CustomCombinedChartProps> = ({ data }) => {
  return (
    <>
      <ResponsiveContainer
        style={{ marginTop: '3vh' }}
        width="100%"
        height={213}
      >
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barCategoryGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            style={{ fontSize: '10px' }}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="bottom"
            align="right"
            wrapperStyle={{ bottom: -10, right: 20 }}
          />

          <Bar dataKey="emission" name="Actual" fill="#098E7E" barSize={15} />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

const RoundBar = (props: any) => {
  const { x, y, width, height, fill } = props;

  const topRadius = Math.min(5, height / 2);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={topRadius}
        fill={fill}
      />

      <rect
        x={x}
        y={y + topRadius}
        width={width}
        height={height - topRadius}
        fill={fill}
      />
    </g>
  );
};

export default CustomCombinedChart;
