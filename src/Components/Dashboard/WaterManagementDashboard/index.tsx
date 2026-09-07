import { useEffect, useState } from 'react';
import { PageCardComponent } from '../../../DesignLibrary';
import { Col, Row } from 'antd';
import styles from '../../Table/carbon.module.scss';
import MixBarChart from '../../Graph/MixBarChart';
import * as echarts from 'echarts';
import { getIcon } from '../../Emissions/Scope3/Helpers';
import { get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import ReactECharts from 'echarts-for-react';
import { formatNumberUS } from '../../../Utils/Strings';
import { isEmpty } from '../../../Utils/isEmpty';
import { ResponsiveContainer } from 'recharts';
import PieChartWithCustomizablelabel from '../../Graph/PieChartWithCustomizablelabel';
import TargetVsActualBarChart from '../../Graph/TargetVsActualBarChart';
import WaterPDF from '../../Emissions/Environment/WaterPDF';
import EffuentsPdf from '../../../Modules/Environment/EffuentsPDF';
import FullPieChartWithCustomLabel from '../../Graph/FullPieChartWithCustomLabel';

export default function WaterManagementDashboard() {
  const { user } = useAuth();
  const [waterpieData, setWaterPieData] = useState<any[]>([]);

  const [waterBarData, setWaterBarData] = useState<any[]>([]);
  const [effluentsBarData, setEffluentsBarData] = useState<any[]>([]);

  const [treatmentType, setTreatmentType] = useState('primaryTreatment');
  const [totalWaterConsumed, setTotalWaterConsumed] = useState(0);
  const [totalEffluentsDischarge, setTotalEffluentsDischarge] = useState(0);
  const [effluentsTargte, setEffluentsTargte] = useState(0);
  const [waterSourceData, setWaterSourceData] = useState<any>();

  const [waterTarget, setWaterTarget] = useState<any>('');
  const [efluentsTarget, setEffluentsTarget] = useState<any>('');
  const formatter = new Intl.NumberFormat('en-US', {});

  const [treatmentComponents, setTreatmentComponents] = useState<
    { icon: JSX.Element; text: string }[]
  >([]);

  const palette1 = [
    '#00B8F5',
    '#2D4BE6',
    '#00338D',
    '#7FD0FA',
    '#404F64',
    '#80A6B5',
    '#1B4E68',
    '#7286EE',
    '#102F82',
    '#132061',
  ];

  const getGraphData = () => {
    get(`/water/get-water-dashboard-info/?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        setWaterBarData(res?.response?.bar_chart_data[0].data);
        setWaterPieData(res?.response?.pie_chart_data[0].data);
        setWaterTarget(res?.response?.pie_chart_data[0]?.target_value);
        setWaterSourceData(res?.response?.water_source_data);
        setTotalWaterConsumed(
          res?.response?.pie_chart_data[0]?.total_water_consumed_in_cubic_meters
        );
      })
      .catch((err) => console.log(err));
  };

  const [effluentsPie, setEffluentsPie] = useState([]);

  const getEffluentsData = () => {
    get(`/effluents/get-effluents-dashboard-info/?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        setEffluentsPie(
          res?.response?.data?.effluent_treatment?.effluent_summary
        );
        setTotalEffluentsDischarge(
          res?.response?.data?.effluent_treatment?.total_effluents_discharged
        );
        setEffluentsTargte(
          res?.response?.data?.effluent_treatment?.target_value
        );

        setEffluentsBarData(res?.response?.data?.monthly_trend);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getGraphData();
    getEffluentsData();
  }, []);

  const barColors = [
    '#F3FAFF',
    '#FFFCF8',
    '#F2FFF6F2',
    '#E6FFFB',
    '#F9F0FF',
    '#FFF0F6F2',
  ];

  const LineColors = [
    '#0D304A',
    '#F9B15C',
    '#036323',
    '#13C2C2',
    '#722ED1',
    '#EB2F96',
  ];

  const titles = [
    'Ground Water',
    'Surface Water',
    'Sea Water',
    'Produced Water',
    'Govt. Supplied Water',
    'Potable Water',
  ];

  interface CardProps {
    idx: number;
    barColor: string;
    data: any;
    bgColor: string;
    title: string;
    payload: object;
    values: any;
  }
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
        name: 'Ground Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Ground Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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
        name: 'Surface Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Surface Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lineStyle: {
          color: '#F9B15C',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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
  const option5 = {
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
        name: 'Sea Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Sea Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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
  const ProducedWaterOption = {
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
        name: 'Produced Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Produced Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lineStyle: {
          color: '#13C2C2',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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

  const GovtSuppliedWaterOption = {
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
        name: 'Govt. Supplied Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Govt. supplied Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lineStyle: {
          color: '#722ED1',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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

  const potableOption = {
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
        name: 'Potable Water',
        type: 'line',
        smooth: true,
        data: waterBarData
          ? waterBarData?.map((ele: any) => {
              return ele?.['Potable Water'];
            })
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lineStyle: {
          color: '#EB2F96',
          width: 2, // Thin line to minimize space
        },
        showSymbol: false, // Hide data points (symbols)
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m3 <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
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

  const payload = [
    option3,
    option4,
    option5,
    ProducedWaterOption,
    GovtSuppliedWaterOption,
    potableOption,
  ];

  const Card: React.FC<CardProps> = ({
    idx,
    barColor,
    data,
    bgColor,
    title,
    payload,
    values,
  }) => {
    return (
      <Col span={8}>
        <PageCardComponent
          style={{
            backgroundColor: `${bgColor}`,
            borderRadius: '12px',
            border: '1px solid #E7E7E6',
            height: '160px',
          }}
        >
          <Row
            align={'middle'}
            className={styles.cardMainWrapper}
            style={{ marginTop: '-5px' }}
          >
            <Col span={10} className={styles.leftMainWrapper}>
              <p className={styles.titleHeader}>{title}</p>

              <div className={styles.quantityStyle}>
                <div className={styles.contentWrapper}>
                  <p className={styles.targetVsActualText}>
                    Target: {formatNumberUS(values?.target)}{' '}
                    <span className={styles.tc02eText}>m³</span>
                  </p>

                  <p className={styles.targetVsActualText}>
                    Actual: {formatNumberUS(values?.actual)}{' '}
                    <span className={styles.tc02eText}>m³</span>
                  </p>
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
                style={{ height: 130, width: '100%', marginLeft: '0vw' }}
              />
            </Col>
          </Row>
        </PageCardComponent>
      </Col>
    );
  };

  const varData = [
    { name: 'Scope 1', value: 400 },
    { name: 'Scope 2', value: 300 },
    { name: 'Scope 3', value: 300 },
  ];

  const getColorForCategory = (name: string) => {
    const colors = {
      'Ground Water': 'rgba(154, 170, 255, 1)',
      'Surface Water': 'rgba(255, 165, 212, 1)',
      'Sea Water': 'rgba(117, 221, 255, 1)',
      'Govt. supplied Water': 'rgba(255, 249, 191, 1)',
      'Recycled Water': 'rgba(99, 235, 218, 1)',
      'Potable Water': 'rgba(180, 151, 255, 1)',
      NEWater: 'rgba(180, 151, 255, 1)',
    } as const;

    return colors[name as keyof typeof colors] || 'rgba(255, 198, 198, 1)';
  };

  // Calculate total value
  const totalValue = waterpieData?.reduce((sum, item) => sum + item.value, 0);

  const optionLine = {
    backgroundColor: 'white',
    title: {
      text: 'Effluents Discharge Monthly Trend',
      left: 0,
      textStyle: {
        color: 'rgba(10, 10, 31, 1)',
        fontWeight: '500',
        fontSize: '16px',
        fontFamily: 'Arial',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`;
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} m³ <br/>`;
        });
        return tooltipContent;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Cubic Meter',
        type: 'line',
        smooth: true,
        data: effluentsBarData
          ? effluentsBarData.map((ele: any) => ele?.['effluents_discharged'])
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lineStyle: {
          color: '#F9B15C',
        },
        itemStyle: {
          color: '#F9B15C',
        },
        showSymbol: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F9B15C26' },
            { offset: 1, color: '#F9B15C00' },
          ]),
        },
      },
    ],
  };

  const chartColors = [
    'rgba(99, 235, 218, 1)',
    'rgba(118, 210, 255, 1)',
    'rgba(180, 151, 255, 1)',
    'rgba(255, 163, 218, 1)',
    'rgba(255, 99, 132, 1)', // Red
    'rgba(54, 162, 235, 1)', // Blue
    'rgba(255, 159, 64, 1)', // Orange
    'rgba(75, 192, 192, 1)', // Greenish teal
    'rgba(153, 102, 255, 1)', // Purple
    'rgba(255, 205, 86, 1)', // Yellow
    'rgba(231, 233, 237, 1)', // Light grey
    'rgba(255, 99, 71, 1)', // Tomato red
    'rgba(173, 216, 230, 1)', // Light blue (Alice blue)
    'rgba(255, 105, 180, 1)', // Hot pink
    'rgba(100, 149, 237, 1)', // Cornflower blue
    'rgba(34, 139, 34, 1)', // Forest green
    'rgba(255, 222, 173, 1)',
  ];

  const effluentsColorPicker = ['#9afcf1', 'rgba(100, 149, 237, 1)', '#b497ff'];

  const EffluentsChartData = effluentsPie
    ? Object.keys(effluentsPie).map((key: any) => ({
        name: key,
        value: effluentsPie[key],
      }))
    : [];

  const watertargetActualData = [
    {
      name: 'Water Consumption',
      actualEmissions: totalWaterConsumed,
      targetEmissions: waterTarget,
    },
  ];
  const effluentstargetActualData = [
    {
      name: 'Effluents Discharge',
      actualEmissions: totalEffluentsDischarge,
      targetEmissions: effluentsTargte,
    },
  ];

  const combinedData = [
    {
      name: 'Water',
      actualEmissions: totalWaterConsumed,
      targetEmissions: waterTarget,
    },
    {
      name: 'Effluents',
      actualEmissions: totalEffluentsDischarge,
      targetEmissions: effluentsTargte,
    },
  ];

  return (
    <div>
      <PageCardComponent className={styles.pageCardStyle}>
        <Row justify="end" className="mb-2 mr-2">
          <span className="mt-2">Water Pdf</span>
          <WaterPDF />
          <span className="mt-2">Effluents Pdf </span>
          <EffuentsPdf />
        </Row>

        <Row
          justify={'space-between'}
          gutter={[16, 16]}
          className={styles.middleRowStyleWater}
        >
          {titles.map((image: string, idx: any) => (
            <Card
              key={idx}
              idx={idx}
              barColor={LineColors[idx]}
              data={varData}
              bgColor={barColors[idx]}
              title={titles[idx]}
              payload={payload[idx]}
              values={
                idx === 0
                  ? waterSourceData?.Ground_Water
                  : idx === 1
                    ? waterSourceData?.Surface_Water
                    : idx === 2
                      ? waterSourceData?.Sea_Water
                      : idx === 3
                        ? waterSourceData?.Produced_Water
                        : idx === 4
                          ? waterSourceData &&
                            waterSourceData['Govt._supplied_Water']
                          : idx === 5
                            ? waterSourceData &&
                              waterSourceData['Potable_Water']
                            : ''
              }
            />
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24} md={12} xl={16}>
            <PageCardComponent>
              <ReactECharts option={optionLine} className={styles.gaugeWater} />
            </PageCardComponent>
          </Col>
          <Col span={24} md={12} xl={8}>
            <PageCardComponent>
              <p className={styles.titleHeading}>
                {'Target vs Actual Discharge'}
              </p>
              <TargetVsActualBarChart
                data={combinedData}
                actualKey="actualEmissions"
                targetKey="targetEmissions"
                actualColor="#F9B15C" // Orange
                targetColor="#036323" // Dark Green
                xAxisLabel="name"
                unit="m³"
                height={300}
              />
            </PageCardComponent>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col span={24} className={styles.secondRowStyleWaste}>
            <PageCardComponent>
              <MixBarChart
                showLegends={true}
                data={waterBarData}
                legendTop={true}
                subTitle={'Water Management Monthly Trend'}
                barColors={[
                  '#036323',
                  '#9254DE',
                  '#F9B15C',
                  '#BAE637',
                  '#1890FF',
                  '#FF5C8A',
                  '#00C49A',
                  '#FF8042',
                  '#8884D8',
                  '#FFBB28',
                ]}
                unit="m³"
              />
            </PageCardComponent>
          </Col>
        </Row>
      </PageCardComponent>
    </div>
  );
}
