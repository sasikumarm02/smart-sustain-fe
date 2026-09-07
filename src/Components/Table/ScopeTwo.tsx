import { Col, Row, Spin } from 'antd';
import { PageCardComponent } from '../../DesignLibrary';
import { useEffect, useState } from 'react';
import styles from './carbon.module.scss';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { formatNumberUS } from '../../Utils/Strings';
import PieChartWithCustomizablelabel from '../Graph/PieChartWithCustomizablelabel';
import TargetVsActualBarChart from '../Graph/TargetVsActualBarChart';
import { convertTargetActualData } from '../Emissions/Scope3/Helpers';
import CustomTargetVsActualChart from '../Graph/CustomTargetVsActualChart';
import TargetVsActualBarChartTwo from '../Graph/TargetVsActualBarChartTwo';

const titles = [
  'Heat and Steam',
  'Electricity from Public Utility',
  'Electricity from EVs',
];

interface CardProps {
  idx: number;
  // barColor: string;
  data: any;
  bgColor: string;
  title: string;
  target: number;
  payload: object;
}

const Card: React.FC<CardProps> = ({
  idx,
  // barColor,
  data,
  bgColor,
  title,
  target,
  payload,
}) => {
  return (
    <Col
      style={{
        backgroundColor: `${bgColor}`,
        borderRadius: '12px',
        border: '1px solid #E7E7E6',
      }}
      className={styles.totalCarbonCardHeight}
    >
      <Row align={'middle'} className={styles.cardMainWrapper}>
        <Col span={10} className={styles.leftMainWrapper}>
          <p className={styles.titleHeader}>{title}</p>
          <div className={styles.quantityStyle}>
            <div className={styles.contentWrapper}>
              <div className={styles.targetVsActualText}>
                Target: {formatNumberUS(target)}{' '}
                <span className={styles.tc02eText}>tCO₂e</span>
              </div>

              <div className={styles.targetVsActualText}>
                Actual: {formatNumberUS(data)}{' '}
                <span className={styles.tc02eText}>tCO₂e</span>
              </div>
            </div>
          </div>
        </Col>
        <Col
          span={6}
          className={styles.rightMainWrapper}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReactECharts
            option={payload}
            //className={styles.EchatsStyles}
            style={{ height: 130, width: '100%', marginLeft: '0vw' }}
          />
        </Col>
      </Row>
    </Col>
  );
};

const barColors = ['#F3FAFF', '#FFFCF8', '#F2FFF6F2'];

const LineColors = [
  'rgb(245, 0, 12)',
  'rgba(0, 192, 174, 1)',
  'rgba(180, 151, 255, 1)',
];

const varData = [
  { name: 'Scope 1', value: 400 },
  { name: 'Scope 2', value: 300 },
  { name: 'Scope 3', value: 300 },
];

const ScopeTwo = ({ data, loading }: any) => {
  const [formattedData, setFormattedData] = useState<{ [key: string]: any }>(
    {}
  );
  const formatter = new Intl.NumberFormat('en-US', {});
  const [totalValue, setTotalValue] = useState<any>({});

  const calculateTotals = () => {
    const totals = {
      emission_from_Electricity_for_EVs: 0,
      emission_Electricity_from_public_utility: 0,
      emission_Heat_and_Steam: 0,
    };

    Object.values(formattedData).forEach((monthData: any) => {
      totals.emission_from_Electricity_for_EVs +=
        monthData?.emission_from_Electricity_for_EVs || 0;
      totals.emission_Electricity_from_public_utility +=
        monthData?.emission_Electricity_from_public_utility || 0;
      totals.emission_Heat_and_Steam += monthData?.emission_Heat_and_Steam || 0;
    });

    setTotalValue(totals);
  };

  useEffect(() => {
    if (data && data[3] && data[3]?.monthly_emission_breakdown) {
      const newFormattedData = data[3]?.monthly_emission_breakdown?.reduce(
        (acc: any, curr: any) => {
          acc[curr.month?.substr(0, 3)] = {
            emission_from_Electricity_for_EVs:
              curr.emission_from_Electricity_for_EVs,
            emission_Electricity_from_public_utility:
              curr.emission_Electricity_from_public_utility,
            emission_Heat_and_Steam: curr.emission_Heat_and_Steam,
            month: curr?.month,
          };
          return acc;
        },
        {}
      );

      setFormattedData(newFormattedData);
      calculateTotals();
    }
  }, [data]);

  const option1 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        formattedData?.['Jan']?.month ? formattedData?.['Jan']?.month : 'Jan',
        formattedData?.['Feb']?.month ? formattedData?.['Feb']?.month : 'Feb',
        formattedData?.['Mar']?.month ? formattedData?.['Mar']?.month : 'mar',
        formattedData?.['Apr']?.month ? formattedData?.['Apr']?.month : 'Apr',
        formattedData?.['May']?.month ? formattedData?.['May']?.month : 'May',
        formattedData?.['Jun']?.month ? formattedData?.['Jun']?.month : 'Jun',
        formattedData?.['Jul']?.month ? formattedData?.['Jul']?.month : 'Jul',
        formattedData?.['Aug']?.month ? formattedData?.['Aug']?.month : 'Aug',
        formattedData?.['Sep']?.month ? formattedData?.['Sep']?.month : 'Sep',
        formattedData?.['Oct']?.month ? formattedData?.['Oct']?.month : 'Oct',
        formattedData?.['Nov']?.month ? formattedData?.['Nov']?.month : 'Nov',
        formattedData?.['Dec']?.month ? formattedData?.['Dec']?.month : 'Dec',
      ],
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Heat and Steam',
        type: 'line',
        smooth: true,

        data: [
          formattedData?.['Jan']?.emission_Heat_and_Steam,
          formattedData?.['Feb']?.emission_Heat_and_Steam,
          formattedData?.['Mar']?.emission_Heat_and_Steam,
          formattedData?.['Apr']?.emission_Heat_and_Steam,
          formattedData?.['May']?.emission_Heat_and_Steam,
          formattedData?.['Jun']?.emission_Heat_and_Steam,
          formattedData?.['Jul']?.emission_Heat_and_Steam,
          formattedData?.['Aug']?.emission_Heat_and_Steam,
          formattedData?.['Sep']?.emission_Heat_and_Steam,
          formattedData?.['Oct']?.emission_Heat_and_Steam,
          formattedData?.['Nov']?.emission_Heat_and_Steam,
          formattedData?.['Dec']?.emission_Heat_and_Steam,
        ],
        lineStyle: {
          color: '#0D304A',
          width: 2,
        },
        showSymbol: false,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const item = params[0];
        return `
      ${item.axisValue}<br/>
      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0D304A;"></span>
      ${item.seriesName}: ${item.data ?? 0}
    `;
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
  };
  const option2 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        formattedData?.['Jan']?.month ? formattedData?.['Jan']?.month : 'Jan',
        formattedData?.['Feb']?.month ? formattedData?.['Feb']?.month : 'Feb',
        formattedData?.['Mar']?.month ? formattedData?.['Mar']?.month : 'mar',
        formattedData?.['Apr']?.month ? formattedData?.['Apr']?.month : 'Apr',
        formattedData?.['May']?.month ? formattedData?.['May']?.month : 'May',
        formattedData?.['Jun']?.month ? formattedData?.['Jun']?.month : 'Jun',
        formattedData?.['Jul']?.month ? formattedData?.['Jul']?.month : 'Jul',
        formattedData?.['Aug']?.month ? formattedData?.['Aug']?.month : 'Aug',
        formattedData?.['Sep']?.month ? formattedData?.['Sep']?.month : 'Sep',
        formattedData?.['Oct']?.month ? formattedData?.['Oct']?.month : 'Oct',
        formattedData?.['Nov']?.month ? formattedData?.['Nov']?.month : 'Nov',
        formattedData?.['Dec']?.month ? formattedData?.['Dec']?.month : 'Dec',
      ],
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Electricity from Public Utility',
        type: 'line',
        smooth: true,

        data: [
          formattedData?.['Jan']?.emission_Electricity_from_public_utility,
          formattedData?.['Feb']?.emission_Electricity_from_public_utility,
          formattedData?.['Mar']?.emission_Electricity_from_public_utility,
          formattedData?.['Apr']?.emission_Electricity_from_public_utility,
          formattedData?.['May']?.emission_Electricity_from_public_utility,
          formattedData?.['Jun']?.emission_Electricity_from_public_utility,
          formattedData?.['Jul']?.emission_Electricity_from_public_utility,
          formattedData?.['Aug']?.emission_Electricity_from_public_utility,
          formattedData?.['Sep']?.emission_Electricity_from_public_utility,
          formattedData?.['Oct']?.emission_Electricity_from_public_utility,
          formattedData?.['Nov']?.emission_Electricity_from_public_utility,
          formattedData?.['Dec']?.emission_Electricity_from_public_utility,
        ],
        lineStyle: {
          color: '#F9B15C',
          width: 2,
        },
        showSymbol: false,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const item = params[0];
        return `
      ${item.axisValue}<br/>
      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#F9B15C;"></span>
      ${item.seriesName}: ${item.data ?? 0}
    `;
      },
    }, // Disable tooltip
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
  };
  const option3 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        formattedData?.['Jan']?.month ? formattedData?.['Jan']?.month : 'Jan',
        formattedData?.['Feb']?.month ? formattedData?.['Feb']?.month : 'Feb',
        formattedData?.['Mar']?.month ? formattedData?.['Mar']?.month : 'mar',
        formattedData?.['Apr']?.month ? formattedData?.['Apr']?.month : 'Apr',
        formattedData?.['May']?.month ? formattedData?.['May']?.month : 'May',
        formattedData?.['Jun']?.month ? formattedData?.['Jun']?.month : 'Jun',
        formattedData?.['Jul']?.month ? formattedData?.['Jul']?.month : 'Jul',
        formattedData?.['Aug']?.month ? formattedData?.['Aug']?.month : 'Aug',
        formattedData?.['Sep']?.month ? formattedData?.['Sep']?.month : 'Sep',
        formattedData?.['Oct']?.month ? formattedData?.['Oct']?.month : 'Oct',
        formattedData?.['Nov']?.month ? formattedData?.['Nov']?.month : 'Nov',
        formattedData?.['Dec']?.month ? formattedData?.['Dec']?.month : 'Dec',
      ],
      axisLine: { show: false }, // Hide the x-axis line
      axisLabel: { show: false }, // Hide the x-axis labels (month names)
      splitLine: { show: false }, // Hide the split lines
      axisTick: { show: false }, // Hide the tick marks
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false }, // Hide the y-axis line
      axisLabel: { show: false }, // Hide the y-axis labels (values)
      splitLine: { show: false }, // Hide the grid lines
      axisTick: { show: false }, // Hide the tick marks
    },
    series: [
      {
        name: 'Electricity from EVs',
        type: 'line',
        smooth: true,

        data: [
          formattedData?.['Jan']?.emission_from_Electricity_for_EVs,
          formattedData?.['Feb']?.emission_from_Electricity_for_EVs,
          formattedData?.['Mar']?.emission_from_Electricity_for_EVs,
          formattedData?.['Apr']?.emission_from_Electricity_for_EVs,
          formattedData?.['May']?.emission_from_Electricity_for_EVs,
          formattedData?.['Jun']?.emission_from_Electricity_for_EVs,
          formattedData?.['Jul']?.emission_from_Electricity_for_EVs,
          formattedData?.['Aug']?.emission_from_Electricity_for_EVs,
          formattedData?.['Sep']?.emission_from_Electricity_for_EVs,
          formattedData?.['Oct']?.emission_from_Electricity_for_EVs,
          formattedData?.['Nov']?.emission_from_Electricity_for_EVs,
          formattedData?.['Dec']?.emission_from_Electricity_for_EVs,
        ],
        lineStyle: {
          color: '#036323',
          width: 2,
        },
        showSymbol: false,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const item = params[0];
        return `
      ${item.axisValue}<br/>
      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#036323;"></span>
      ${item.seriesName}: ${item.data ?? 0}
    `;
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
  };

  const [optionRose, setOptionRose] = useState({});

  const updateOptionRose = () => {
    setOptionRose({
      backgroundColor: 'rgba(0, 51, 141, 1)',
      title: {
        text: 'Scope 2 Emissions',
        left: 7,
        top: 20,
        textStyle: {
          color: 'white',
          fontFamily: 'Arial',
          fontWeight: '700',
          fontSize: 16,
          lineHeight: 19.55,
          letterSpacing: 0.0015 * 17,
          align: 'left',
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      visualMap: {
        show: false,
      },
      legend: {
        orient: 'vertical',
        top: 60,
        left: 7,
        data: [
          'Heat and Steam',
          'Electricity from Public Utility',
          'Electricity from EVs',
        ],
        textStyle: {
          fontSize: 13,
          color: 'white',
          fontFamily: 'Arial',
          fontWeight: '400',
          lineHeight: 14.95,
          letterSpacing: 0.004 * 17,
        },
        symbol: 'circle',
        symbolSize: 10,
        icon: 'circle',
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          center: ['50%', '90%'],
          startAngle: 180,
          endAngle: 360,
          data: [
            {
              value: totalValue?.emission_Heat_and_Steam
                ? totalValue?.emission_Heat_and_Steam
                : 0,
              name: 'Heat and Steam',
              itemStyle: { color: '#0D304A' },
              label: {
                show: true,
                position: 'inside',
                color: 'black',
                formatter: (params: any) => {
                  // if (params.value === 0) {
                  //   return ''; // Return empty string if value is 0
                  // }
                  const percentage = ((params.value / totalSum) * 100).toFixed(
                    2
                  );
                  return `${percentage}%`;
                },
                fontSize: 16,
                fontFamily: 'Arial',
              },
            },
            {
              value: totalValue?.emission_Electricity_from_public_utility
                ? totalValue?.emission_Electricity_from_public_utility
                : 0,
              name: 'Electricity from Public Utility',
              itemStyle: { color: '#F9B15C' },
              label: {
                show: true,
                position: 'inside',
                color: 'black',
                formatter: (params: any) => {
                  // if (params.value === 0) {
                  //   return ''; // Return empty string if value is 0
                  // }
                  const percentage = ((params.value / totalSum) * 100).toFixed(
                    2
                  );
                  return `${percentage}%`;
                },
                fontSize: 16,
                fontFamily: 'Arial',
              },
            },
            {
              value: totalValue?.emission_from_Electricity_for_EVs
                ? totalValue?.emission_from_Electricity_for_EVs
                : 0,
              name: 'Electricity from EVs',
              itemStyle: { color: '#036323' },
              label: {
                show: true,
                position: 'inside',
                color: 'black',
                formatter: (params: any) => {
                  // if (params.value === 0) {
                  //   return ''; // Return empty string if value is 0
                  // }
                  const percentage = ((params.value / totalSum) * 100).toFixed(
                    2
                  );
                  return `${percentage}%`;
                },
                fontSize: 16,
                fontFamily: 'Arial',
              },
            },
          ],
          graphic: [
            {
              type: 'circle',
              id: 'center-ball',
              shape: {
                cx: '50%',
                cy: '50%',
                r: 30,
              },
              style: {
                fill: 'rgba(255, 255, 255, 0.3)',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
              },
              z: 100,
            },
          ],
          roseType: 'radius',
          label: {
            color: 'black',
            fontWeight: '700',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
              width: 10,
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: (idx: any) => Math.random() * 200,
        },
      ],
    });
  };

  useEffect(() => {
    if (Object.keys(formattedData).length > 0) {
      calculateTotals();
    }
  }, [formattedData]);

  useEffect(() => {
    if (Object.keys(totalValue).length > 0) {
      updateOptionRose();
    }
  }, [totalValue]);

  const totalSum =
    totalValue?.emission_Electricity_from_public_utility +
    totalValue?.emission_Heat_and_Steam +
    totalValue?.emission_from_Electricity_for_EVs;

  interface OptionLineSeries {
    name: string;
    type: 'line';
    smooth: boolean;
    showSymbol: boolean;
    data: number[];
    lineStyle: {
      color: string;
      width: number;
    };
    itemStyle: {
      color: string;
    };
    areaStyle: {
      color: any;
    };
  }

  interface OptionLine {
    backgroundColor: string;
    // title: {
    //   text: string;
    //   left: number | string;
    //   textStyle: {
    //     color: string;
    //     fontFamily: string;
    //     fontSize: number;
    //   };
    // };
    tooltip: {
      trigger: string;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      textStyle: {
        color: string;
        fontSize: number;
      };
      padding: number;
      formatter: (params: any) => string;
    };
    legend: {
      orient: string;
      icon: string;
      data: string[];
      left: string | number;
      top: number;
      textStyle: {
        fontSize: number;
        color: string;
      };
    };
    grid: {
      left: string;
      right: string;
      bottom: string;
      top: string;
      containLabel: boolean;
    };
    xAxis: {
      type: string;
      boundaryGap: boolean;
      data: (string | undefined)[];
      axisLabel: {
        fontSize: number;
        color: string;
      };
    };
    yAxis: {
      type: string;
      axisLabel: {
        color: string;
        fontSize: number;
        formatter: string;
      };
      splitLine: {
        lineStyle: {
          color: string;
        };
      };
    };
    series: OptionLineSeries[];
  }

  const optionLine: OptionLine = {
    backgroundColor: 'white',

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
      padding: 10,
      formatter: function (params: any) {
        const preferredOrder = [
          'Heat and Steam',
          'Electricity from Public Utility',
          'Electricity from EVs',
        ];

        // Sort params based on preferredOrder
        params.sort((a: any, b: any) => {
          return (
            preferredOrder.indexOf(a.seriesName) -
            preferredOrder.indexOf(b.seriesName)
          );
        });

        let tooltipContent = `${params[0].axisValueLabel} <br/>`;
        params.forEach((param: any) => {
          tooltipContent += `${param.marker} ${param.seriesName}: ${param.value ?? 0} tCO₂e <br/>`;
        });
        return tooltipContent;
      },
    },
    legend: {
      orient: 'horizontal',
      icon: 'circle',
      data: [
        'Heat and Steam',
        'Electricity from Public Utility',
        'Electricity from EVs',
      ],
      left: '0',
      top: 0,
      textStyle: {
        fontSize: 14,
        color: 'black',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '6%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        formattedData?.['Jan']?.month ?? 'Jan',
        formattedData?.['Feb']?.month ?? 'Feb',
        formattedData?.['Mar']?.month ?? 'Mar',
        formattedData?.['Apr']?.month ?? 'Apr',
        formattedData?.['May']?.month ?? 'May',
        formattedData?.['Jun']?.month ?? 'Jun',
        formattedData?.['Jul']?.month ?? 'Jul',
        formattedData?.['Aug']?.month ?? 'Aug',
        formattedData?.['Sep']?.month ?? 'Sep',
        formattedData?.['Oct']?.month ?? 'Oct',
        formattedData?.['Nov']?.month ?? 'Nov',
        formattedData?.['Dec']?.month ?? 'Dec',
      ],
      axisLabel: {
        fontSize: 10,
        color: 'black',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: '{value} t',
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
        },
      },
    },
    series: [
      {
        name: 'Heat and Steam',
        type: 'line',
        smooth: true,
        showSymbol: false,

        data: [
          formattedData?.['Jan']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Feb']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Mar']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Apr']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['May']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Jun']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Jul']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Aug']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Sep']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Oct']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Nov']?.emission_Heat_and_Steam ?? 0,
          formattedData?.['Dec']?.emission_Heat_and_Steam ?? 0,
        ],
        lineStyle: { color: '#0D304A', width: 2 },
        itemStyle: { color: '#0D304A' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0D304A26' },
            { offset: 1, color: '#0D304A00' },
          ]),
        },
      },
      {
        name: 'Electricity from Public Utility',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [
          formattedData?.['Jan']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Feb']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Mar']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Apr']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['May']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Jun']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Jul']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Aug']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Sep']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Oct']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Nov']?.emission_Electricity_from_public_utility ?? 0,
          formattedData?.['Dec']?.emission_Electricity_from_public_utility ?? 0,
        ],
        lineStyle: { color: '#F9B15C', width: 2 },
        itemStyle: { color: '#F9B15C' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F9B15C26' },
            { offset: 1, color: '#F9B15C00' },
          ]),
        },
      },
      {
        name: 'Electricity from EVs',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [
          formattedData?.['Jan']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Feb']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Mar']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Apr']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['May']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Jun']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Jul']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Aug']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Sep']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Oct']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Nov']?.emission_from_Electricity_for_EVs ?? 0,
          formattedData?.['Dec']?.emission_from_Electricity_for_EVs ?? 0,
        ],
        lineStyle: { color: '#036323', width: 2 },
        itemStyle: { color: '#036323' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#03632326' },
            { offset: 1, color: '#03632300' },
          ]),
        },
      },
    ],
  };

  const createGaugeOption = (
    data: { actual_tCO2e: number; target_tCO2e: number }[]
  ) => {
    if (!data || data.length === 0) {
      return {};
    }

    const actualValue = data[0]?.actual_tCO2e;
    const targetValue = data[0]?.target_tCO2e;

    const option = {
      series: [
        {
          name: 'tCO₂e',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: targetValue, // Target value from data
          radius: '100%',
          axisLine: {
            lineStyle: {
              width: 70,
              color: [
                [actualValue / targetValue, 'rgba(0, 51, 141, 1)'], // Actual vs Target dynamic color ratio
                [1, '#e6e6e6'],
              ],
            },
          },
          pointer: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#333',
            marginBottom: '1vh',
            offsetCenter: [0, '-25%'], // Position the value label
            formatter: () => formatNumberUS(actualValue),
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 12,
            color: '#666',
          },
          data: [
            {
              value: actualValue, // Dynamic actual value
              name: 'tCO₂e',
            },
          ],
        },
      ],
    };

    return option;
  };

  const option = createGaugeOption(data);

  const payload = [option1, option2, option3];

  const donutoption = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    avoidLabelOverlap: false,
    series: [
      {
        name: '',
        type: 'pie',
        //radius: ['40%', '70%'], // Creates the donut effect (inner radius: 40%, outer radius: 70%)
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: data[0]?.actual_tCO2e, name: 'Actual tCO2e' },
          { value: data[0]?.target_tCO2e, name: 'Target tCO2e' },
        ],
      },
    ],
  };

  const targetActualdata: any = convertTargetActualData(
    (data && data[5] && data[5]?.bar_data) || []
  );

  const chartColors = [
    'rgba(99, 235, 218, 1)',
    'rgba(118, 210, 255, 1)',
    'rgba(180, 151, 255, 1)',
    'rgba(255, 163, 218, 1)',
  ];

  const scope2Data = [
    {
      value: totalValue?.emission_Heat_and_Steam
        ? totalValue?.emission_Heat_and_Steam
        : 0,
      name: 'Heat and Steam',
    },
    {
      value: totalValue?.emission_Electricity_from_public_utility
        ? totalValue?.emission_Electricity_from_public_utility
        : 0,
      name: 'Electricity from Public Utility',
    },
    {
      value: totalValue?.emission_from_Electricity_for_EVs
        ? totalValue?.emission_from_Electricity_for_EVs
        : 0,
      name: 'Electricity from EVs',
    },
  ];

  return (
    <>
      {formattedData && (
        <Spin spinning={loading}>
          <Row
            gutter={[16, 16]}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {titles.map((image: string, idx: any) => (
              <Col key={idx} span={8}>
                <Card
                  idx={idx}
                  // barColor={LineColors[idx]}
                  data={data[idx]?.actual_tCO2e}
                  bgColor={barColors[idx]}
                  title={titles[idx]}
                  payload={payload[idx]}
                  target={data[idx]?.target_tCO2e}
                />
              </Col>
            ))}
          </Row>

          <Row>
            <div className={styles.monthlyHeading}>Monthly Carbon Emission</div>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <ReactECharts
                option={optionLine}
                style={{
                  minHeight: '400px',
                  width: '100%',
                  marginTop: '15px',
                  borderRadius: '20px',
                  padding: '10px',
                  border: '1px solid rgba(230, 230, 230, 1)',
                }}
              />
            </Col>
            <Col span={8}>
              <div
                style={{
                  minHeight: '400px',
                  width: '100%',
                  marginTop: '15px',
                  borderRadius: '20px',
                  padding: '10px',
                  border: '1px solid rgba(230, 230, 230, 1)',
                }}
              >
                <p className={styles.titleHeading}>
                  {'Target vs Actual Discharge'}
                </p>
                <TargetVsActualBarChartTwo
                  data={targetActualdata}
                  actualKey="actual_tCO2e"
                  targetKey="target_tCO2e"
                  actualColor="#F9B15C" // Orange
                  targetColor="#036323" // Dark Green
                  xAxisLabel="name"
                  unit="people" // Names will be on the Y-axis
                  showtick={true}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      )}
    </>
  );
};

export default ScopeTwo;
