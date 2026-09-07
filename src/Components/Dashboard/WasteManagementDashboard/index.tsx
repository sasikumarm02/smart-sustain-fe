import { useEffect, useState } from 'react';
import { PageCardComponent } from '../../../DesignLibrary';
import { Col, Row } from 'antd';
import styles from '../../Table/carbon.module.scss';
import MixBarChart from '../../Graph/MixBarChart';
import { get } from '../../../Services';
import * as echarts from 'echarts';
import { useAuth } from '../../../Hooks/useAuth';
import ReactECharts from 'echarts-for-react';
import { formatNumberUS } from '../../../Utils/Strings';
import { isEmpty } from '../../../Utils/isEmpty';
import PieChartWithCustomizablelabel from '../../Graph/PieChartWithCustomizablelabel';
import { WastePDF } from '../../Emissions/Environment/WastePDF';
import TargetVsActualBarChart from '../../Graph/TargetVsActualBarChart';
import { number } from 'yup';

const convertData = (data: any) => {
  return Object.keys(data)?.map((key) => ({
    name: key,
    value: data[key],
  }));
};

const barColors = ['rgba(239, 254, 255, 1)', 'rgba(235, 247, 255, 1)'];

const LineColors = ['rgba(0, 192, 174, 1)', 'rgba(0, 184, 245, 1)'];

const titles = ['Recycled Waste', 'Disposed Waste'];

interface CardProps {
  idx: number;
  barColor: string;
  data: any;
  bgColor: string;
  title: string;
  payload: object;
  value: any;
  target: number | string;
}

const Card: React.FC<CardProps> = ({
  idx,
  barColor,
  data,
  bgColor,
  title,
  payload,
  value,
  target,
}) => {
  return (
    <Col
      style={{
        backgroundColor: `${bgColor}`,
        height: '100%',
        borderRadius: '1rem',
      }}
    >
      <Row align={'middle'} className={styles.cardMainWrapper}>
        <Col span={10} className={styles.leftMainWrapper}>
          <p className={styles.titleHeader}>{title}</p>
          <div className={styles.quantityStyle}>
            <p className={styles.tcoStyle} style={{ color: `${barColor}` }}>
              tonnes
            </p>
            <div className={styles.divider}>
              <div className={styles.contentWrapper}>
                <p className={styles.titleWrapper}>Target</p>
                <p className={styles.innerNumber}>
                  {value && formatNumberUS(value[0]?.value)}
                </p>
              </div>
              <div className={styles.lineBtn}></div>
              <div className={styles.contentWrapper}>
                <p className={styles.titleWrapper}>Actual</p>
                <p className={styles.innerNumber}>
                  {value && formatNumberUS(value[1]?.value)}
                </p>
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
            style={{ height: 150, width: '150%', marginLeft: '0vw' }}
          />
        </Col>
      </Row>
    </Col>
  );
};

const varData = [
  { name: 'Scope 1', value: 400 },
  { name: 'Scope 2', value: 300 },
  { name: 'Scope 3', value: 300 },
];

export const ShowData = ({ value }: any) => {
  return (
    <>
      Target : <div className={styles.targetInner}>{value}</div>
    </>
  );
};

interface MonthlyData {
  name: string;
  [key: string]: any; // Allow any other string key
}

const convertMonthlyData = (
  data: Record<string, Record<string, any>>
): MonthlyData[] => {
  return Object.keys(data)?.map((month) => {
    const monthData = data[month];
    const keys = Object.keys(monthData);

    // Initialize the result object with the month name
    const item: MonthlyData = { name: month };

    keys.forEach((key) => {
      item[key] = monthData[key];
    });

    return item;
  });
};

export default function WasteManagementDashboard() {
  const [wasteManagePie, setWasteManagePie] = useState<any>([]);
  const [toxicPie, setToxicPie] = useState<any>([]);
  const [hazNonHazNumber, setHazNonHazNumber]: any = useState({});
  const [wasteManageBar, setWasteManageBar] = useState<any>([]);
  const [totalRecycled, setTotalRecycled] = useState<any>();

  const [totalDisposed, setTotalDisposed] = useState<any>();
  const [totalRecyeledWaste, setTotalRecycledWaste] = useState<any>([]);
  const [totalDisposedWaste, setTotalDisposedWaste] = useState<any>([]);
  const [toxicBar, setToxicBar] = useState<any>([]);
  const [targetValue, setTargetValue] = useState<any>('');
  const [totalWaste, setTotalWaste] = useState('');
  const { user } = useAuth();
  const formatter = new Intl.NumberFormat('en-US', {});

  const convertTotalRecycled = (data: any) => {
    const formatteddata = Object.values(data)?.map(
      (entry: any) => entry?.Recycled
    );
    setTotalRecycledWaste(formatteddata);
  };

  const convertTotalDisposed = (data: any) => {
    const formatteddata = Object.values(data)?.map(
      (entry: any) => entry?.Disposed
    );
    setTotalDisposedWaste(formatteddata);
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
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel} <br/>`; // Get the month (x-axis label)
        params.forEach((param: any) => {
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} tonnes <br/>`; // Add the value with the unit (e.g., kg)
        });
        return tooltipContent;
      },
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
        name: 'Recycled',
        type: 'line',
        smooth: true,

        data: totalRecyeledWaste,
        lineStyle: {
          color: 'rgba(0, 192, 174, 1)',
          width: 2,
        },
        showSymbol: false,
      },
    ],
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
        name: 'Disposed',
        type: 'line',
        smooth: true,
        data: totalDisposedWaste,
        lineStyle: {
          color: 'rgba(0, 184, 245, 1)',
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
          tooltipContent += `${param.seriesName}: ${formatter.format(param.value)} tonnes <br/>`; // Add the value with the unit (e.g., kg)
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

  const payload = [option3, option4];

  const getGraphData = () => {
    get(`/waste/get_waste_dashboard_info/?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        const PieChartdata1 = convertData(
          res.response['pie_chart_data']?.card_data[3]?.data
        );
        const PieChartdata2 = convertData(
          res.response['pie_chart_data']?.card_data[4]?.data
        );
        const PieChartdata3 = convertData(
          res.response['pie_chart_data']?.card_data[1]?.data
        );
        const PieChartdata4 = convertData(
          res.response['pie_chart_data']?.card_data[2]?.data
        );

        const hazNonhazNumber = convertData(
          res.response['pie_chart_data']?.card_data[5]?.data
        );
        setHazNonHazNumber(hazNonhazNumber);
        setWasteManagePie(PieChartdata1);
        setToxicPie(PieChartdata2);
        setTotalDisposed(PieChartdata4);
        setTotalRecycled(PieChartdata3);

        const bar1 = convertMonthlyData(
          res?.response['bar_graph_data']?.bar_graphs?.monthly_waste_management
            ?.data
        );
        setTargetValue(
          res?.response['pie_chart_data']?.card_data[0]?.data?.total_actual
        );

        setWasteManageBar(
          convertMonthlyData(
            res?.response['bar_graph_data']?.bar_graphs.monthly_waste_management
              ?.data
          )
        );
        setToxicBar(
          convertMonthlyData(
            res?.response['bar_graph_data']?.bar_graphs.category_monthly_waste
              ?.data
          )
        );

        convertTotalDisposed(
          res?.response['bar_graph_data']?.bar_graphs.monthly_waste_management
            ?.data
        );

        convertTotalRecycled(
          res?.response['bar_graph_data']?.bar_graphs.monthly_waste_management
            ?.data
        );
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    getGraphData();
  }, []);

  const optionRose1 = {
    backgroundColor: 'rgba(0, 51, 141, 1)',
    title: [
      {
        text: 'Total Waste',
        left: '10',
        top: 20,
        textStyle: {
          color: 'white',
          fontFamily: `Arial`,
          fontSize: 16,
          fontWeight: `400`,
        },
      },
      {
        text: `${formatNumberUS(targetValue)} tonnes`,
        left: '10',
        top: 50,
        textStyle: {
          color: 'white',
          fontFamily: `Arial`,
          fontSize: `36px`,
          fontWeight: `700`,
        },
      },
    ],

    tooltip: {
      formatter: function (params: any) {
        const percentage = params?.percent;
        if (!isEmpty(percentage) && percentage !== 'NaN') {
          return `${params.name} ${percentage}%`;
        }
        return `0%`;
      },
    },
    visualMap: {
      show: false,
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      center: 0,
      data: ['Hazardous', 'Non Hazardous'],
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
        center: ['50%', '80%'],
        startAngle: 180,
        endAngle: 360,
        data: [
          {
            value: !isEmpty(toxicPie[0]?.value) ? toxicPie[0]?.value : 0,
            name: 'Hazardous',
            itemStyle: { color: 'rgba(251, 254, 234, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => `${params?.value}%`,
              fontSize: 16,
              fontFamily: 'Arial',
            },
          },
          {
            value: toxicPie[1]?.value,
            name: 'Non Hazardous',
            itemStyle: { color: 'rgba(251, 208, 255, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => `${params?.value}%`,
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
  };
  const optionRose = {
    backgroundColor: 'rgba(0, 51, 141, 1)',
    tooltip: {
      formatter: function (params: any) {
        const percentage = params?.percent;
        if (!isEmpty(percentage) && percentage !== 'NaN') {
          return `${params.name} ${percentage}%`;
        }
        return `0%`;
      },
    },
    visualMap: {
      show: false,
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      center: 0,
      data: ['Recycled', 'Disposed'],
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
        center: ['50%', '80%'],
        startAngle: 180,
        endAngle: 360,
        data: [
          {
            value: wasteManagePie[1]?.value,
            name: 'Recycled',
            itemStyle: { color: 'rgba(156, 255, 243, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => `${params?.value}%`,
              fontSize: 16,
              fontFamily: 'Arial',
            },
          },
          {
            value: wasteManagePie[0]?.value,
            name: 'Disposed',
            itemStyle: { color: 'rgba(180, 151, 255, 1)' },
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: (params: any) => `${params?.value}%`,
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
  };

  const optionLine = {
    backgroundColor: 'white',

    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let tooltipContent = `${params[0].axisValueLabel}<br/>`;
        params.forEach((param: any) => {
          tooltipContent += `
      <span style="display:inline-block;margin-right:6px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>
      ${param.seriesName}: ${formatter.format(param.value)} tonnes<br/>
    `;
        });
        return tooltipContent;
      },
    },
    legend: {
      orient: 'horizontal',
      data: ['Recycled', 'Disposed'],
      left: '0',
      top: -1,
      textStyle: {
        fontSize: 14,
        color: 'black',
      },
      symbol: 'circle',
      symbolSize: 10,
      icon: 'circle',
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
        name: 'Recycled',
        type: 'line',
        smooth: true,
        data: totalRecyeledWaste,
        lineStyle: {
          color: '#036323',
        },
        itemStyle: {
          color: '#036323',
        },
        showSymbol: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#03632326' },
            { offset: 1, color: '#03632300' },
          ]),
        },
      },
      {
        name: 'Disposed',
        type: 'line',
        smooth: true,
        data: totalDisposedWaste,
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

  const wastePieData = [
    {
      value: !isEmpty(toxicPie[0]?.value) ? toxicPie[0]?.value : 0,
      name: 'Hazardous',
      number: hazNonHazNumber[0]?.value,
    },
    {
      value: toxicPie[1]?.value,
      name: 'Non Hazardous',
      number: hazNonHazNumber[1]?.value,
    },
  ];

  const chartColors = [
    'rgba(99, 235, 218, 1)',
    'rgba(118, 210, 255, 1)',
    'rgba(180, 151, 255, 1)',
    'rgba(255, 163, 218, 1)',
  ];

  const recycleDisposechartColors = [
    'rgba(180, 151, 255, 1)',
    'rgba(99, 235, 218, 1)',
    'rgba(255, 163, 218, 1)',
    'rgba(118, 210, 255, 1)',
  ];
  const recycledDisposedpie = [
    {
      value: wasteManagePie[1]?.value,
      number: totalRecycled && totalRecycled[1]?.value,
      name: 'Recycled',
    },
    {
      value: wasteManagePie[0]?.value,
      number: totalDisposed && totalDisposed[1]?.value,
      name: 'Disposed',
    },
  ];

  const actualTargetData = [
    {
      name: 'Recycled',
      actual: totalRecycled && totalRecycled[1]?.value,
      target: totalRecycled && totalRecycled[0]?.value,
    },
    {
      name: 'Disposed',
      actual: totalDisposed && totalDisposed[1]?.value,
      target: totalDisposed && totalDisposed[0]?.value,
    },
  ];

  return (
    <div>
      <PageCardComponent className={styles.pageCardStyle}>
        <>
          <Row justify="end" className="mb-2">
            <WastePDF activeTab="0" />
          </Row>
          <Row gutter={[16, 16]} justify="start">
            <Col span={24} md={12} xl={16}>
              <PageCardComponent>
                <ReactECharts
                  option={optionLine}
                  className={styles.gaugeWater}
                />
              </PageCardComponent>
            </Col>

            <Col
              style={{ marginRight: '-1vh' }}
              className={styles.colStyleRose}
              span={24}
              md={12}
              xl={8}
            >
              <PageCardComponent>
                <p className={styles.targetVsActual}>
                  {'Actual vs Target Waste Management'}
                </p>
                <TargetVsActualBarChart
                  title=""
                  data={actualTargetData}
                  actualKey="actual"
                  targetKey="target"
                  actualColor="#F9B15C" // Orange
                  targetColor="#036323" // Dark Green
                  xAxisLabel="name" // Names will be on the Y-axis
                  unit="tonnes"
                />
              </PageCardComponent>
            </Col>
          </Row>

          <Row
            className={styles.marginTop}
            justify={'space-between'}
            align={'top'}
          >
            <Col span={24}>
              <PageCardComponent className={styles.mixBarChart}>
                <MixBarChart
                  showLegends={true}
                  data={toxicBar}
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
                  unit="tonnes"
                />
              </PageCardComponent>
            </Col>
          </Row>
        </>
      </PageCardComponent>
    </div>
  );
}
