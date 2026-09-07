import { Card, Col, Row, Spin } from 'antd';
import Styles from '../SocialDashboard/socialdashboard.module.scss';
import YellowLegend from '../../assets/Svg/Dashboard/YellowLegend';
import BlueLegend from '../../assets/Svg/Dashboard/BlueLegend';
import PurpleLegend from '../../assets/Svg/Dashboard/PurpleLegend';
import { Cell, Pie, PieChart, Tooltip, Legend } from 'recharts';
import Card1 from '../../assets/Svg/Dashboard/icon11.svg';
import Card2 from '../../assets/Svg/Dashboard/icon12.svg';
import Card3 from '../../assets/Svg/Dashboard/icon13.svg';
import Card4 from '../../assets/Svg/Dashboard/icon14.svg';
import LastWorkingDays from '../../assets/Svg/Dashboard/LastWorkingDays';
import HighConsequences from '../../assets/Svg/Dashboard/HighConsequences';
import LostTime from '../../assets/Svg/Dashboard/LostTime';
import Recordable from '../../assets/Svg/Dashboard/Recordable';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { apiBaseUrl, get } from '../../Services';
import DeepBlueLegend from '../../assets/Svg/Dashboard/DeepBlueLegend';
import LoaderComponent from '../../DesignLibrary/LoaderComponent';
import { number } from 'yup';
import { isEmpty } from '../../Utils/isEmpty';
import { useSelector } from 'react-redux';

const RADIAN = Math.PI / 180;

const COLORS3 = ['#F9B15C', '#036323'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Midpoint of the donut ring
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Fatalities = () => {
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [safetyData, setSafetyData] = useState({
    pie_chart: {
      'work related fatalities': 0,
      employee: 0,
      contractor: 0,
    },
    card_data: {
      'work related injuries': 0,
      high_consequence_injury: 0,
      recordable_injury: 0,
      lost_time: 0,
      lost_working_days: 0,
    },
    Targets: {
      Fatalities: 0,
      Injuries: 0,
    },
  });
  const [fatalitiesData, setFatalitiesData]: any = useState([]);
  const fetchFatalityData = async () => {
    try {
      const resData = await get(
        `/injury_management/fetch_fatalities_report/?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );
      if (
        !isEmpty(resData?.response?.data) &&
        resData?.response?.data! == null
      ) {
        setFatalitiesData(resData?.response);
      } else if (resData?.response) {
        setFatalitiesData(resData?.response);
      } else {
        console.error('No data found');
      }
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
    }
  };
  const [loding, setLoading] = useState(false);
  const { user } = useAuth();
  const cardData = [
    {
      title: 'High Consequence',
      content: safetyData?.card_data?.high_consequence_injury,
    },
    {
      title: 'Recordable',
      content: safetyData?.card_data?.recordable_injury,
    },
    {
      title: 'Lost Time',
      content: safetyData?.card_data?.lost_time,
    },
    {
      title: 'Lost Working days',
      content: safetyData?.card_data?.lost_working_days,
    },
  ];

  const data = [
    {
      name: 'Employee',
      value: safetyData?.pie_chart?.employee,
      number: fatalitiesData?.total_emp_fatalities,
    },
    {
      name: 'Contractor',
      value: safetyData?.pie_chart?.contractor,
      number: fatalitiesData?.total_contractor_fatalities,
    },
  ];

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/injury_management/fetch_dashboard_report/?entity_Id=${user.entity_Id}`
      );

      if (response?.response) {
        setSafetyData(response?.response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getApiData();
    fetchFatalityData();
  }, []);

  return (
    <LoaderComponent spinning={loding}>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{ padding: '10px' }}>
            <Row>
              <Col
                className={Styles?.dashboardFatalitiesTitleWrapper}
                span={24}
              >
                <div className={Styles?.dashboardFatalitiesTitle}>
                  Fatalities
                </div>
                <div style={{ display: 'flex' }}>
                  <div className={Styles?.dashboardFatalitiesTitle}>
                    Target :
                  </div>
                  <div className={Styles?.dashboardFatalitiesTitle}>
                    {safetyData && safetyData?.Targets?.Fatalities}
                  </div>
                </div>
              </Col>
              <Col
                span={24}
                style={{ textAlign: 'center', marginBottom: '1rem' }}
              >
                <div style={{ fontSize: '16px', fontWeight: 400 }}>
                  Total Fatalities
                </div>
                <div
                  style={{ fontSize: '32px', fontWeight: 700, color: '#000' }}
                >
                  {safetyData?.pie_chart?.['work related fatalities'] ?? 0}
                </div>
              </Col>
            </Row>
            {/* <Row justify="center" style={{ marginTop: '2vh' }}>
              <Col span={6}>
                <Row align="middle">
                  <DeepBlueLegend />
                  <div className={Styles?.legendAlignment}>Employee</div>
                </Row>
              </Col>
              <Col span={6}>
                <Row align="middle">
                  <BlueLegend />
                  <div className={Styles?.legendAlignment}>Contractor</div>
                </Row>
              </Col>
            </Row> */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <PieChart width={300} height={325}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={70}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data?.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS3[index % COLORS3.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const { name, value } = payload[0];
                    const { number } = payload[0]?.payload?.payload;
                    return (
                      <div
                        style={{
                          backgroundColor: 'white',
                          padding: '10px',
                          border: '1px solid #ccc',
                        }}
                      >
                        {number ? (
                          <div>
                            {name}:<b>{number}</b>
                          </div>
                        ) : (
                          <div>
                            {name}: <b>{value}</b>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ padding: '10px' }}>
            <Col className={Styles?.dashboardFatalitiesTitleWrapper} span={24}>
              <div className={Styles?.dashboardFatalitiesTitle}>Injuries</div>
              <div style={{ display: 'flex' }}>
                <div className={Styles?.dashboardFatalitiesTitle}>Target :</div>
                <div className={Styles?.dashboardFatalitiesTitle}>
                  {safetyData && safetyData?.Targets?.Injuries}
                </div>
              </div>
            </Col>
            <Col
              span={24}
              style={{ textAlign: 'center', marginBottom: '1rem' }}
            >
              <div style={{ fontSize: '16px', fontWeight: 400 }}>
                Work Related Injuries{' '}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#000' }}>
                {safetyData?.card_data?.['work related injuries']}
              </div>
            </Col>
            <Row gutter={[16, 16]} style={{ marginTop: '2vh' }}>
              {cardData.map((card, index) => (
                <Col key={index} span={12}>
                  <div
                    style={{
                      width: '100%',
                      padding: '10px',
                      height: '154px',
                    }}
                  >
                    <Row
                      style={{ height: '100%', marginTop: '20px' }}
                      gutter={10}
                      align="middle"
                      justify="center"
                    >
                      {/* <Col span={10}>
                        <Row justify="center">{card.imgSrc}</Row>
                      </Col> */}
                      <Col
                        span={24}
                        style={{ textAlign: 'center', marginBottom: '1rem' }}
                      >
                        <div style={{ fontSize: '16px', fontWeight: 400 }}>
                          {card.title}
                        </div>
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            color: '#000',
                          }}
                        >
                          {card.content}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </LoaderComponent>
  );
};

export default Fatalities;
