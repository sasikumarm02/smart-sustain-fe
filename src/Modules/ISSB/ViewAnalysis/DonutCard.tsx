import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './DonutCard.module.scss';

type SectionData = {
  Requirement_met: number;
  Requirement_not_met: number;
  Requirement_partially_met: number;
  Not_disclosure_requirement: number;
};

type DonutCardProps = {
  title: string;
  sectionData: SectionData;
};

const COLORS = ['#036323', '#91B4FF', '#B16104', '#43596F'];
const GRAY_COLOR = '#E8EAED';

const DonutCard: React.FC<DonutCardProps> = ({ title, sectionData }) => {
  const totals = {
    Requirement_met: sectionData.Requirement_met,
    Requirement_not_met: sectionData.Requirement_not_met,
    Requirement_partially_met: sectionData.Requirement_partially_met,
    Not_disclosure_requirement: sectionData.Not_disclosure_requirement,
  };

  const totalDRs = Object.values(totals).reduce((a, b) => a + b, 0);

  const donutData = [
    {
      name: 'Requirement Met',
      value: totals.Requirement_met,
      color: COLORS[0],
    },
    {
      name: 'Partially Met',
      value: totals.Requirement_partially_met,
      color: COLORS[1],
    },
    { name: 'Not Met', value: totals.Requirement_not_met, color: COLORS[2] },
    {
      name: 'No DR',
      value: totals.Not_disclosure_requirement,
      color: COLORS[3],
    },
  ];

  // Function to calculate the percentage (rounded)
  const getPercentage = (value: number) => {
    return totalDRs === 0 ? 0 : Math.round((value / totalDRs) * 100);
  };

  // Check if all data values are 0
  const isAllDataZero = totalDRs === 0;

  // If all data is zero, we need to render the chart with gray
  const grayDonutData = donutData.map((entry) => ({
    ...entry,
    value: 1, // Set value to 1 for all slices when totalDRs is 0, so the chart is visible
  }));

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.content}>
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={isAllDataZero ? grayDonutData : donutData}
                dataKey="value"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={1}
                stroke="none"
                isAnimationActive={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                  const percentage = getPercentage(value);
                  if (percentage > 0) {
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="14px"
                      >
                        {percentage}%
                      </text>
                    );
                  }
                  return null;
                }}
                labelLine={false}
              >
                {isAllDataZero
                  ? grayDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRAY_COLOR} />
                    ))
                  : donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.textData}>
            <div>
              <div>DRs Met</div>
              <div className={styles.value}>
                {totals.Requirement_met || '-'}
              </div>
            </div>
            <div>
              <div>DRs Not Met</div>
              <div className={styles.value}>
                {totals.Requirement_not_met || '-'}
              </div>
            </div>
            <div>
              <div>Partially Met</div>
              <div className={styles.value}>
                {totals.Requirement_partially_met || '-'}
              </div>
            </div>
            <div>
              <div>No DR</div>
              <div className={styles.value}>
                {totals.Not_disclosure_requirement || '-'}
              </div>
            </div>
            <div>
              <div>DRs Accessed with Results</div>
              <div className={styles.value}>{totalDRs || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutCard;
