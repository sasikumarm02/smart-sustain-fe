import { Col, Flex, Row, Spin } from 'antd';
import { PageCardComponent } from '../../DesignLibrary';
import image1 from '../../assets/Svg/Environment/scope1.svg';
import image2 from '../../assets/Svg/Environment/scope2.svg';
import image3 from '../../assets/Svg/Environment/scope3.svg';
import Styles from './carbon.module.scss';
import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { formatNumberUS } from '../../Utils/Strings';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import PieChartWithCustomizablelabel from '../Graph/PieChartWithCustomizablelabel';
import CustomTargetVsActualChart from '../Graph/CustomTargetVsActualChart';
import { convertTargetActualData } from '../Emissions/Scope3/Helpers';
import TargetVsActualBarChartTwo from '../Graph/TargetVsActualBarChartTwo';

const cards = [image1, image2, image3];
const titles = ['Scope 1 Emission', 'Scope 2 Emission', 'Scope 3 Emission'];
const colors = ['#0D304A', '#F9B15C', '#036323'];

interface CardProps {
  image: string;
  idx: number;
  barColor: string;
  data: any;
  bgColor: string;
  title: string;
  textColor: string;
}

const Card: React.FC<CardProps> = ({
  image,
  idx,
  barColor,
  data,
  bgColor,
  title,
  textColor,
}) => {
  return (
    <Col className={Styles.totalCarbonCardHeight}>
      <Row
        style={{
          backgroundColor: `${bgColor}`,
          borderRadius: '12px',
          border: '1px solid #E7E7E6',
          height: '160px',
        }}
        className={Styles.totalRowStyle}
      >
        <Col span={18} className={Styles.totalColStyle}>
          <div className={Styles.totalCardTitle}>{title}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                color: textColor,
                fontWeight: '700px',
                fontSize: '30px',
              }}
            >
              {formatNumberUS(data)}
            </p>
            <p className={Styles.tc2Style}>tCO₂e</p>
          </div>
        </Col>
        <Col span={6}>
          <img
            style={{
              minHeight: '100px',
              width: '80px',
            }}
            src={image}
            alt="GHG"
          />
        </Col>
      </Row>
    </Col>
  );
};

const TotalCaronEmission = ({ data, loading }: any) => {
  const { user } = useAuth();
  const formatter = new Intl.NumberFormat('en-US', {});
  const [formattedDataScopeTwo, setFormattedDataScopeTwo] = useState<any>([]);
  const [formattedDataScopeOne, setFormattedDataScopeOne] = useState<any>([]);

  const [totalScopeOne, setTotalScopeOne] = useState(0);
  const [actualScopeOne, setActualScopeOne] = useState(0);
  const [totalScopeTwo, setTotalScopeTwo] = useState(0);
  const [actualScopeTwo, setActualScopetwo] = useState(0);
  const [totalScopeThree, setTotalScopeThree] = useState(0);
  const [actualScopeThree, setActualScopeThree] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2, response3] = await Promise.all([
          get(
            `/Emissions/fetch-overall-emissions/?entity_Id=${user.entity_Id}&scope=Scope1`
          ),
          get(
            `/Emissions/fetch-overall-emissions/?entity_Id=${user.entity_Id}&scope=Scope2`
          ),
          get(
            `/Emissions/fetch-overall-emissions/?entity_Id=${user.entity_Id}&scope=Scope3`
          ),
        ]);

        if (response2?.response?.data[1]?.monthly_emission_breakdown) {
          const newFormattedData =
            response2?.response?.data[1]?.monthly_emission_breakdown.map(
              (acc: any, curr: any) =>
                acc?.emission_from_Electricity_for_EVs +
                acc?.emission_Electricity_from_public_utility +
                acc?.emission_Heat_and_Steam
            );
          setFormattedDataScopeTwo(newFormattedData);
        }

        if (response1?.response?.data[1]?.month_data) {
          const newFormattedData = Array(12)
            .fill(null)
            .map((_, idx) => {
              return (
                response1?.response?.data[1]?.month_data[0]?.stationary[idx]
                  ?.emission +
                response1?.response?.data[1]?.month_data[0]?.fugitive[idx]
                  ?.emission +
                response1?.response?.data[1]?.month_data[0]?.mobile[idx]
                  ?.emission +
                response1?.response?.data[1]?.month_data[0]?.process[idx]
                  ?.emission
              );
            });

          if (newFormattedData) {
            setFormattedDataScopeOne(newFormattedData);
          }
        }

        if (response1?.response?.data[0]) {
          setActualScopeOne(response1?.response?.data[0]?.actual_tCO2e);
          setTotalScopeOne(response1?.response?.data[0]?.target_tCO2e);
        }
        if (response2?.response?.data[0]) {
          setActualScopetwo(response2?.response?.data[0]?.actual_tCO2e);
          const result = response2?.response;
          const res1 = result?.data[0]?.target_tCO2e;
          const res2 = result?.data[1]?.target_tCO2e;
          const res3 = result?.data[2]?.target_tCO2e;
          const finalRes = res1 + res2 + res3;

          setTotalScopeTwo(finalRes);
        }
        if (response3?.response?.data[0]) {
          const s3result = response3?.response;
          const s3res1 = s3result?.data[0]?.target_tCO2e;
          const s3res2 = s3result?.data[1]?.target_tCO2e;
          const s3res3 = s3result?.data[2]?.target_tCO2e;
          const s3res4 = s3result?.data[3]?.target_tCO2e;
          const s3res5 = s3result?.data[4]?.target_tCO2e;
          const s3res6 = s3result?.data[5]?.target_tCO2e;
          const s3finalRes =
            s3res1 + s3res2 + s3res3 + s3res4 + s3res5 + s3res6;
          setActualScopeThree(
            response3?.response?.data[6]?.card_data?.actual_tCO2e
          );
          setTotalScopeThree(s3finalRes);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const totalValue = data?.reduce(
    (sum: any, item: any) => sum + (item?.value || 0),
    0
  );

  const createGaugeOption = (data: {
    actual_tCO2e: number;
    target_tCO2e: number;
  }) => {
    return {
      series: [
        {
          name: 'tCO₂e',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: data?.target_tCO2e,
          radius: '100%',
          axisLine: {
            lineStyle: {
              width: 70,
              color: [
                [
                  data?.actual_tCO2e / data?.target_tCO2e,
                  'rgba(0, 51, 141, 1)',
                ], // Set color dynamically based on actual/target
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
            formatter: () => formatNumberUS(data.actual_tCO2e),
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 16,
            color: '#666',
          },
          data: [
            {
              value: data.actual_tCO2e?.toFixed(2),
              name: 'tCO₂e',
            },
          ],
        },
      ],
    };
  };

  let customData: any;

  if (
    !isEmpty(actualScopeOne) &&
    !isEmpty(actualScopeTwo) &&
    !isEmpty(totalScopeOne) &&
    !isEmpty(totalScopeTwo) &&
    !isEmpty(actualScopeThree) &&
    !isEmpty(totalScopeThree)
  ) {
    customData = [
      {
        name: 'Total Carbon Emission',
        actual_tCO2e: actualScopeOne + actualScopeTwo + actualScopeThree,
        target_tCO2e: totalScopeOne + totalScopeTwo + totalScopeThree,
      },
    ];
  } else {
    customData = [
      {
        name: 'Total Carbon Emission',
        actual_tCO2e: 0,
        target_tCO2e: 0,
      },
    ];
  }

  const option = createGaugeOption(customData);

  const optionRose = {
    backgroundColor: 'rgba(0, 51, 141, 1)',
    title: {
      text: 'GHG Emissions',
      left: 7,
      top: 20,
      textStyle: {
        color: 'white',
        fontFamily: 'Arial', // Font family
        fontWeight: '700', // Font weight
        fontSize: 16, // Font size (number, px is implicit)
        lineHeight: 19.55, // Line height (approximate, as it's not directly supported in ECharts)
        letterSpacing: 0.0015 * 17, // Letter spacing as a fraction of font size
        align: 'left', // Text alignment
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
      top: 60,
      left: 7,
      data: ['Scope 1', 'Scope 2', 'Scope 3'],
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
        center: ['50%', '95%'],
        startAngle: 180,
        endAngle: 360,
        data: [
          {
            value: (data && data[0] && data[0]?.value) || 0,
            name: 'Scope 1',
            itemStyle: { color: 'rgba(99, 235, 218, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => {
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
            value: (data && data[1] && data[1]?.value) || 0,
            name: 'Scope 2',
            itemStyle: { color: 'rgba(118, 210, 255, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              fontFamily: 'Arial',
              fontWeight: 'bold',
              formatter: (params: any) => {
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
              fontSize: 16,
            },
          },
          {
            value: (data && data[2] && data[2]?.value) || 0,
            name: 'Scope 3',
            itemStyle: { color: 'rgba(180, 151, 255, 1)' },
            label: {
              show: true,
              fontWeight: 'bold',
              position: 'inside',
              color: 'black',
              fontFamily: 'Arial',
              formatter: (params: any) => {
                const percentage = ((params.value / totalValue) * 100).toFixed(
                  2
                );
                return `${percentage}%`;
              },
              fontSize: 16,
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
  };

  interface OptionLineSeries {
    name: string;
    type: string;
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
      data: string[];
      left: string | number;
      top: number;
      icon: string;
      itemGap: number;
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
      axisLabel: {
        fontSize: number;
        color: string;
      };
      axisLine: { lineStyle: { color: string } };
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
        let tooltipContent = `${params[0].axisValueLabel} <br/>`;
        params.forEach((param: any) => {
          tooltipContent += `${param.marker} ${param.seriesName}: ${param.value ?? 0} tCO₂e <br/>`;
        });
        return tooltipContent;
      },
    },
    legend: {
      orient: 'horizontal',
      data: ['Scope 1', 'Scope 2'],
      left: '0',
      top: 0,
      icon: 'circle',
      itemGap: 30,
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
      axisLabel: {
        fontSize: 10,
        color: 'black',
      },
      axisLine: { lineStyle: { color: '#ccc' } },
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
        name: 'Scope 1',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: formattedDataScopeOne,
        lineStyle: {
          color: '#0D304A',
          width: 2,
        },
        itemStyle: {
          color: '#0D304A',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0D304A26' },
            { offset: 1, color: '#0D304A00' },
          ]),
        },
      },
      {
        name: 'Scope 2',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: formattedDataScopeTwo,
        lineStyle: {
          color: '#F9B15C',
          width: 2,
        },
        itemStyle: {
          color: '#F9B15C',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F9B15C26' },
            { offset: 1, color: '#F9B15C00' },
          ]),
        },
      },
    ],
  };

  const varData = data || [
    { name: 'Scope 1', value: 400 },
    { name: 'Scope 2', value: 300 },
    { name: 'Scope 3', value: 300 },
  ];

  const barColors = ['#F3FAFF', '#FFFCF8', '#F2FFF6'];

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
        radius: '70%', // Creates the donut effect (inner radius: 40%, outer radius: 70%)
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: customData.actual_tCO2e, name: 'Actual tCO2e' },
          { value: customData.target_tCO2e, name: 'Target tCO2e' },
        ],
      },
    ],
  };

  const COLORS3 = [
    'rgba(99, 235, 218, 1)',
    'rgba(118, 210, 255, 1)',
    'rgba(180, 151, 255, 1)',
  ];
  const totalCarbonEmissionData = [
    { value: data && data[0] && data[0]?.value, name: 'Scope 1' },
    { value: data && data[1] && data[1]?.value, name: 'Scope 2' },
    { value: data && data[2] && data[2]?.value, name: 'Scope 3' },
  ];

  const targetActualdata: any = convertTargetActualData(customData || []);

  return (
    <>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: '10px' }}>
          {cards.map((image: string, idx: any) => (
            <Col key={idx} span={8}>
              <Card
                key={idx}
                image={image}
                idx={idx}
                barColor={barColors[idx]}
                data={varData[idx]?.value}
                bgColor={barColors[idx]}
                title={titles[idx]}
                textColor={colors[idx]}
              />
            </Col>
          ))}
        </Row>

        <Row className="mt-2">
          <div className={Styles.monthlyHeading}>Monthly Carbon Emission</div>
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
                padding: '1vh',
                border: '1px solid rgba(230, 230, 230, 1)',
              }}
            >
              <p className={Styles.titleHeading}>
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

export default TotalCaronEmission;
