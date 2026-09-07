import { Col, Row, Select, Spin } from 'antd';
import { PageCardComponent } from '../../DesignLibrary';
import styles from './carbon.module.scss';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { formatNumberUS } from '../../Utils/Strings';
import PieChartWithCustomizablelabel from '../Graph/PieChartWithCustomizablelabel';
import TargetVsActualBarChart from '../Graph/TargetVsActualBarChart';
import { convertTargetActualData } from '../Emissions/Scope3/Helpers';
import CustomTargetVsActualChart from '../Graph/CustomTargetVsActualChart';
import TargetVsActualBarChartTwo from '../Graph/TargetVsActualBarChartTwo';

interface ScopeData {
  name: string;
  Actual: number;
  Target: number;
}

const ScopeOne = ({ data, loading }: any) => {
  const arr = Array(12).fill(0);
  const formatter = new Intl.NumberFormat('en-US', {});
  const stationaty = loading
    ? arr
    : data &&
        data?.length >= 1 &&
        data[1]?.month_data[0] &&
        data[1]?.month_data[0]?.stationary
      ? data[1]?.month_data[0]?.stationary
      : arr;
  const mobile = loading
    ? arr
    : data &&
        data?.length >= 1 &&
        data[1]?.month_data[0] &&
        data[1]?.month_data[0]?.mobile
      ? data[1]?.month_data[0]?.mobile
      : arr;
  const fugitive = loading
    ? arr
    : data &&
        data?.length >= 1 &&
        data[1]?.month_data[0] &&
        data[1]?.month_data[0]?.fugitive
      ? data[1]?.month_data[0]?.fugitive
      : arr;
  const process = loading
    ? arr
    : data &&
        data?.length >= 1 &&
        data[1]?.month_data[0] &&
        data[1]?.month_data[0]?.process
      ? data[1]?.month_data[0]?.process
      : arr;

  const desiredOrder = [
    'Stationary Combustion',
    'Mobile Combustion',
    'Process Emission',
    'Fugitive Emission',
  ];

  const barData = loading
    ? []
    : data && data?.length >= 2 && data[2]?.bar_data
      ? data[2].bar_data.sort(
          (a: any, b: any) =>
            desiredOrder.indexOf(a.module) - desiredOrder.indexOf(b.module)
        )
      : [];

  const titles = [
    'Stationary Combustion',
    'Mobile Combustion',
    'Process Emission',
    'Fugitive Emission',
  ];

  const createGaugeOption = (
    data: { actual_tCO2e: number; target_tCO2e: number }[]
  ) => {
    if (!data || data?.length === 0) {
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
            color: '#333',
            marginBottom: '1vh',
            offsetCenter: [0, '-25%'],
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

  interface CardProps {
    idx: number;
    data: any;
    bgColor: string;
    title: string;
    payload: object;
    values: any;
  }

  // const CheckError = (data: any) => {
  //   if (!isEmpty(data)) {
  //     return data;
  //   } else {
  //     return 0;
  //   }
  // };

  const option1 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
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
        name: 'Stationary Combustion',
        type: 'line',
        smooth: true,

        data: [
          stationaty[0]?.emission,
          stationaty[1]?.emission,
          stationaty[2]?.emission,
          stationaty[3]?.emission,
          stationaty[4]?.emission,
          stationaty[5]?.emission,
          stationaty[6]?.emission,
          stationaty[7]?.emission,
          stationaty[8]?.emission,
          stationaty[9]?.emission,
          stationaty[10]?.emission,
          stationaty[11]?.emission,
        ],
        lineStyle: {
          color: '#0D304A',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
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
    }, // Disable tooltip
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
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
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
        name: 'Mobile Combustion',
        type: 'line',
        smooth: true,
        data: [
          mobile[0]?.emission,
          mobile[1]?.emission,
          mobile[2]?.emission,
          mobile[3]?.emission,
          mobile[4]?.emission,
          mobile[5]?.emission,
          mobile[6]?.emission,
          mobile[7]?.emission,
          mobile[8]?.emission,
          mobile[9]?.emission,
          mobile[10]?.emission,
          mobile[11]?.emission,
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
    },
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
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
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
        name: 'Process Emission',
        type: 'line',
        smooth: true,

        data: [
          process[0]?.emission,
          process[1]?.emission,
          process[2]?.emission,
          process[3]?.emission,
          process[4]?.emission,
          process[5]?.emission,
          process[6]?.emission,
          process[7]?.emission,
          process[8]?.emission,
          process[9]?.emission,
          process[10]?.emission,
          process[11]?.emission,
        ],
        lineStyle: {
          color: '#036323',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
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
    }, // Disable tooltip
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
  };

  const option4 = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
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
        name: 'Fugitive Emission',
        type: 'line',
        smooth: true,

        data: [
          fugitive[0]?.emission,
          fugitive[1]?.emission,
          fugitive[2]?.emission,
          fugitive[3]?.emission,
          fugitive[4]?.emission,
          fugitive[5]?.emission,
          fugitive[6]?.emission,
          fugitive[7]?.emission,
          fugitive[8]?.emission,
          fugitive[9]?.emission,
          fugitive[10]?.emission,
          fugitive[11]?.emission,
        ],
        lineStyle: {
          color: '#A4AF2C',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const item = params[0];
        return `
      ${item.axisValue}<br/>
      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#A4AF2C;"></span>
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

  const payload = [option1, option2, option3, option4];

  const Card: React.FC<CardProps> = ({
    idx,
    data,
    bgColor,
    title,
    payload,
    values,
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
          <Col span={12} className={styles.leftMainWrapper}>
            <p className={styles.titleHeader}>{title}</p>
            <div className={styles.quantityStyle}>
              <div className={styles.contentWrapper}>
                <p className={styles.targetVsActualText}>
                  Target:{' '}
                  {formatNumberUS(
                    values?.target_tCO2e ? values?.target_tCO2e : 0
                  )}{' '}
                  <span className={styles.tc02eText}>tCO₂e</span>
                </p>

                <p className={styles.targetVsActualText}>
                  Actual:{' '}
                  {formatNumberUS(
                    values?.actual_tCO2e ? values?.actual_tCO2e : 0
                  )}{' '}
                  <span className={styles.tc02eText}>tCO₂e</span>
                </p>
              </div>
            </div>
          </Col>
          <Col
            span={4}
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
              style={{ height: 130, width: '150%', marginLeft: '0vw' }}
            />
          </Col>
        </Row>
      </Col>
    );
  };

  const totalMobile = mobile?.reduce(
    (accumulator: number, currentValue: any) => {
      return accumulator + currentValue?.emission;
    },
    0
  );
  const totalstat = stationaty?.reduce(
    (accumulator: number, currentValue: any) => {
      return accumulator + currentValue?.emission;
    },
    0
  );

  const totalprocess = process?.reduce(
    (accumulator: number, currentValue: any) => {
      return accumulator + currentValue?.emission;
    },
    0
  );

  const totalFugitive = fugitive?.reduce(
    (accumulator: number, currentValue: any) => {
      return accumulator + currentValue?.emission;
    },
    0
  );

  const totalValue = totalFugitive + totalMobile + totalprocess + totalstat;

  const optionRose = {
    backgroundColor: 'rgba(0, 51, 141, 1)',
    title: {
      text: 'Scope 1 Emissions',
      left: 7,
      top: 20,
      textStyle: {
        color: 'white',
        fontFamily: 'Arial', // Font family
        fontWeight: '700', // Font weight
        fontSize: 16, // Font size (number, px is implicit)
        lineHeight: 19.55, // Line height (approximate, as it's not directly supported in ECharts)
        letterSpacing: 0.0015 * 17, // Letter spacing as a fraction of font size
        align: 'left',
      },
    },
    tooltip: {
      formatter: function (params: any) {
        return `${params.name}: ${formatNumberUS(params.value)} tCO₂e`;
      },
    },
    visualMap: {
      show: false,
    },
    legend: {
      orient: 'vertical',
      icon: 'circle',
      top: 60,
      left: 7,
      data: [
        'Mobile Combustion',
        'Stationary Combustion',
        'Process Emission',
        'Fugitive Emission',
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
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '100%'],
        center: ['50%', '95%'], // Adjusted the center height to accommodate custom element
        startAngle: 180,
        endAngle: 360,
        data: [
          {
            value: mobile?.reduce((accumulator: any, currentValue: any) => {
              return accumulator + currentValue?.emission;
            }, 0),
            name: 'Mobile Combustion',
            itemStyle: { color: 'rgba(99, 235, 218, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => {
                // if (params.value === 0) {
                //   return ''; // Return empty string if value is 0
                // }
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            },
          },
          {
            value:
              stationaty?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + currentValue?.emission;
              }, 0) || 0,
            name: 'Stationary Combustion',
            itemStyle: { color: 'rgba(118, 210, 255, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 'bold',
              formatter: (params: any) => {
                // if (params.value === 0) {
                //   return '';
                // }
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
            },
          },
          {
            value:
              process?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + currentValue?.emission;
              }, 0) || 0,
            name: 'Process Emission',
            itemStyle: { color: 'rgba(180, 151, 255, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => {
                // if (params.value === 0) {
                //   return ''; // Return empty string if value is 0
                // }
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            },
          },
          {
            value:
              fugitive?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + currentValue?.emission;
              }, 0) || 0,
            name: 'Fugitive Emission',
            itemStyle: { color: 'rgba(255, 163, 218, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => {
                // if (params.value === 0) {
                //   return ''; // Return empty string if value is 0
                // }
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            },
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
          borderRadius: 8,
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: any) => Math.random() * 200,
      },
    ],
  };

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
      color: any; // echarts.graphic.LinearGradient type is not available, so use any
    };
  }

  interface OptionLine {
    backgroundColor: string;
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
      data: string[];
      top: string;
      left: string;
      icon: string;
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
      data: string[];
      axisLine: { lineStyle: { color: string } };
      axisLabel: {
        color: string;
        fontSize: number;
      };
    };
    yAxis: {
      type: string;
      axisLine: { show: boolean };
      splitLine: {
        lineStyle: {
          color: string;
        };
      };
      axisLabel: {
        color: string;
        fontSize: number;
        formatter: string;
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
        const order = [
          'Stationary Combustion',
          'Mobile Combustion',
          'Process Emission',
          'Fugitive Emission',
        ];
        params.sort(
          (a: any, b: any) =>
            order.indexOf(a.seriesName) - order.indexOf(b.seriesName)
        );
        let tooltip = `${params[0].axisValue} <br/>`;
        params.forEach((param: any) => {
          tooltip += `${param.marker} ${param.seriesName}: ${param.value ?? 0} tCO₂e<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: [
        'Stationary Combustion',
        'Mobile Combustion',
        'Process Emission',
        'Fugitive Emission',
      ],
      top: '0px',
      left: '0px',
      icon: 'circle',
      textStyle: {
        fontSize: 12,
        color: '#000',
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
      data: Array.from(
        { length: 12 },
        (_, i) => mobile[i]?.month ?? `M${i + 1}`
      ),
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: '#eee',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: '{value} t',
      },
    },
    series: [
      {
        name: 'Stationary Combustion',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: stationaty.map((d: any) => d?.emission ?? 0),
        lineStyle: { color: '#0D304A', width: 2 },
        itemStyle: { color: '#0D304A' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0D304A26' },
            { offset: 1, color: '#0D304A00' },
          ]),
        },
      },
      {
        name: 'Mobile Combustion',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: mobile.map((d: any) => d?.emission ?? 0),
        lineStyle: { color: '#F9B15C', width: 2 },
        itemStyle: { color: '#F9B15C' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F9B15C26' },
            { offset: 1, color: '#F9B15C00' },
          ]),
        },
      },
      {
        name: 'Process Emission',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: process.map((d: any) => d?.emission ?? 0),
        lineStyle: { color: '#036323', width: 2 },
        itemStyle: { color: '#036323' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#03632326' },
            { offset: 1, color: '#03632300' },
          ]),
        },
      },
      {
        name: 'Fugitive Emission',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: fugitive.map((d: any) => d?.emission ?? 0),
        lineStyle: { color: '#A4AF2C', width: 2 },
        itemStyle: { color: '#A4AF2C' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A4AF2C26' },
            { offset: 1, color: '#A4AF2C00' },
          ]),
        },
      },
    ],
  };

  const barColors = ['#F3FAFF', '#FFFCF8', '#F2FFF6F2', '#FEFFF3'];

  const LineColors = [
    'rgba(0, 192, 174, 1)',
    'rgba(0, 184, 245, 1)',
    'rgba(180, 151, 255, 1)',
    'rgba(255, 163, 218, 1)',
  ];

  const varData = data || [
    { name: 'Scope 1', value: 400 },
    { name: 'Scope 2', value: 300 },
    { name: 'Scope 3', value: 300 },
  ];

  const chartColors = [
    'rgba(99, 235, 218, 1)',
    'rgba(118, 210, 255, 1)',
    'rgba(180, 151, 255, 1)',
    'rgba(255, 163, 218, 1)',
  ];
  const scope1Data = [
    {
      value: mobile?.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue?.emission;
      }, 0),
      name: 'Mobile Combustion',
    },
    {
      value: stationaty?.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue?.emission;
      }, 0),
      name: 'Stationary Combustion',
    },
    {
      value: process?.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue?.emission;
      }, 0),
      name: 'Process Emission',
    },
    {
      value: fugitive?.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue?.emission;
      }, 0),
      name: 'Fugitive Emission',
    },
  ];

  const targetActualdata: any = convertTargetActualData(data && [data[0]]);

  return (
    <>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: '10px' }}>
          {titles.map((image: string, idx: any) => (
            <Col key={idx} span={6}>
              <Card
                key={idx}
                idx={idx}
                data={varData}
                bgColor={barColors[idx]}
                title={titles[idx]}
                payload={payload[idx]}
                values={barData ? barData[idx] : {}}
              />
            </Col>
          ))}
        </Row>

        <Row>
          <div className={styles.monthlyHeading}>Monthly Carbon Emission</div>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <ReactECharts option={optionLine} className={styles.scopeOneLine} />
          </Col>
          <Col span={8}>
            <div
              style={{
                minHeight: '400px',
                width: '100%',
                marginTop: '15px',
                borderRadius: '20px',
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
    </>
  );
};

export default ScopeOne;
