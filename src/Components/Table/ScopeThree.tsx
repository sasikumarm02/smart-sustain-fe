import { Col, Row, Grid, Button, Spin } from 'antd';
import { PageCardComponent } from '../../DesignLibrary';
import { formatNumberUS } from '../../Utils/Strings';
import styles from './carbon.module.scss';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

const ScopeThree = (props: any) => {
  const { data } = props;

  const filteredData = props.data
    ?.filter((card: any) => card?.module && card?.actual_tCO2e !== undefined)
    ?.sort((a: any, b: any) => b?.actual_tCO2e - a?.actual_tCO2e); // descending

  const yAxisData = filteredData.map((card: any) => `${card.module}`).reverse();
  const dataD = filteredData.map((card: any) => card.actual_tCO2e).reverse();

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
    'Purchased Goods and Services',
    'Capital Goods',
    'Fuel and Energy',
    'Business Travel',
    'Waste Generated in Operations',
    'Downstream Leased Assets',
  ];

  interface CardProps {
    idx: number;
    barColor: string;
    data: any;
    bgColor: string;
    title: string;
    target: number | string;
    actual: number | string;
  }

  const Card: React.FC<CardProps> = ({
    idx,
    barColor,
    data,
    bgColor,
    title,
    target,
    actual,
  }) => {
    return (
      <Col span={8}>
        <PageCardComponent
          style={{
            backgroundColor: `${bgColor}`,
            borderRadius: '12px',
            border: '1px solid #E7E7E6',
          }}
          className={styles.pageCardWrapperScopeThree}
        >
          <Row align={'middle'} className={styles.cardMainWrapper}>
            <Col span={10} className={styles.leftMainWrapperTwo}>
              <p className={styles.titleHeader}>{title}</p>
              <div className={styles.quantityStyleTwo}>
                <p className={styles.tcoStyle} style={{ color: `${barColor}` }}>
                  tCO₂e
                </p>
                <div className={styles.divider}>
                  <div className={styles.contentWrapper}>
                    <p className={styles.titleWrapper}>Target</p>
                    <p className={styles.innerNumber}>
                      {formatNumberUS(target)}
                    </p>
                  </div>
                  <div className={styles.lineBtn}></div>
                  <div className={styles.contentWrapper}>
                    <p className={styles.titleWrapper}>Actual</p>
                    <p className={styles.innerNumber}>
                      {formatNumberUS(actual)}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </PageCardComponent>
      </Col>
    );
  };

  function calculateLeftMargin(yAxisData: any) {
    const longestLabel = yAxisData.reduce(
      (max: any, label: any) => (label.length > max.length ? label : max),
      ''
    );
    const labelWidth = longestLabel.length * 10; // Assuming an average width per character
    return labelWidth - 50; // Adding some extra space to avoid overlap
  }

  // Dynamically calculate left margin
  const leftMargin = calculateLeftMargin(yAxisData);

  const varData = data || [
    { name: 'Scope 1', value: 400 },
    { name: 'Scope 2', value: 300 },
    { name: 'Scope 3', value: 300 },
  ];

  const optionBarCharts = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any) {
        const category = params[0]?.name;
        const value = params[0]?.value;
        return `${category}: ${formatNumberUS(value)} tCO₂e`;
      },
    },

    xAxis: {
      type: 'value',
      name: 'tCO₂e',
      nameLocation: 'center',
      nameGap: 15,
      nameRotate: 0, // keep horizontal
      nameTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        padding: [20, 0, 0, 0], // add top padding (rarely helps here)
      },
    },

    yAxis: {
      type: 'category',
      name: 'Category',
      nameLocation: 'center',
      nameGap: 210,
      nameRotate: 90,
      nameTextStyle: {
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 12,
      },
      data: yAxisData,
    },
    series: [
      {
        name: 'Emissions',
        type: 'bar',
        data: dataD,
        itemStyle: {
          color: '#F9B15C',
          borderRadius: [0, 10, 10, 0],
        },
        barWidth: 20,
      },
    ],
    grid: {
      left: `${leftMargin}px`,
      right: '10%',
      bottom: '10%',
      top: '10%',
    },
  };

  const [formattedData, setFormattedData] = useState<{ [key: string]: any }>(
    {}
  );

  useEffect(() => {
    if (data) {
      const newFormattedData = data?.reduce((acc: any, curr: any) => {
        acc[curr.module] = {
          category: curr?.category,
          actual: curr?.actual_tCO2e,
          target: curr?.target_tCO2e,
        };
        return acc;
      }, {});

      setFormattedData(newFormattedData);
    }
  }, [data]);

  const getTarget = (payload: string) => {
    switch (payload) {
      case 'Purchased Goods and Services':
        return formattedData?.['Purchased Goods and Services']?.target;
      case 'Capital Goods':
        return formattedData?.['Capital Goods']?.target;
      case 'Fuel and Energy':
        return formattedData?.['Fuel and Energy']?.target;
      case 'Business Travel':
        return formattedData?.['Business Travel']?.target;
      case 'Waste Generated in Operations':
        return formattedData?.['Waste Generated in Operations']?.target;
      case 'Downstream Leased Assets':
        return formattedData?.['Downstream Leased Assets']?.target;
      default:
        return 0;
    }
  };
  const getActual = (payload: string) => {
    switch (payload) {
      case 'Purchased Goods and Services':
        return formattedData?.['Purchased Goods and Services']?.actual;
      case 'Capital Goods':
        return formattedData?.['Capital Goods']?.actual;
      case 'Fuel and Energy':
        return formattedData?.['Fuel and Energy']?.actual;
      case 'Business Travel':
        return formattedData?.['Business Travel']?.actual;
      case 'Waste Generated in Operations':
        return formattedData?.['Waste Generated in Operations']?.actual;
      case 'Downstream Leased Assets':
        return formattedData?.['Downstream Leased Assets']?.actual;
      default:
        return 0;
    }
  };

  return (
    <>
      <div>
        <Spin spinning={props.loading}>
          <Row gutter={[15, 15]} className={styles.gap}>
            {titles?.map((image: string, idx: any) => (
              <Card
                key={idx}
                idx={idx}
                barColor={LineColors[idx]}
                data={varData}
                bgColor={barColors[idx]}
                title={titles[idx]}
                target={getTarget(titles[idx])}
                actual={getActual(titles[idx])}
              />
            ))}
          </Row>
          <Row style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Col span={24}>
              <ReactECharts
                option={optionBarCharts}
                style={{
                  height: 500,
                  width: '100%',
                  marginLeft: '-10px',
                  border: '1px solid rgba(230, 230, 230, 1)',
                  borderRadius: '1rem',
                  paddingBottom: '10px',
                }}
              ></ReactECharts>
            </Col>
          </Row>
        </Spin>
      </div>
    </>
  );
};

export default ScopeThree;
