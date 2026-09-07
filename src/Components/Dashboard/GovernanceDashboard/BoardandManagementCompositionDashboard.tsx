import { Row, Col, Spin } from 'antd';
import { ModalComponent, PageCardComponent } from '../../../DesignLibrary';
import Styles from '../../Assesment/Assessement.module.scss';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import img1 from '../../../assets/Svg/Dashboard/icon21.svg';
import img2 from '../../../assets/Svg/Dashboard/icon22.svg';
import img3 from '../../../assets/Svg/Dashboard/icon23.svg';
import img4 from '../../../assets/Svg/Dashboard/icon24.svg';
import BoardAndCompositionPdf from '../../ReportPdf/BoardAndCompositionPdf';
import { apiBaseUrl, get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TargetVsActualBarChart from '../../Graph/TargetVsActualBarChart';
import BoardPdf from '../../../Modules/Governance/BoardPdf';
import { number } from 'yup';
import { getCurrentYear } from '../../Emissions/Scope3/Helpers';

const RADIAN = Math.PI / 180;

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

function BoardandManagementComposition({}) {
  const formatter = new Intl.NumberFormat('en-US', {});
  const [boardData, setboardData] = useState({
    independent_percentage: 0.0,
    independent_number: 0,
    male_number: 0,
    female_number: 0,
    other_percentage: 0.0,
    other_number: 0,
    male_percentage: 0.0,
    female_percentage: 0.0,

    male_executive_percentage: 0.0,
    male_executive_number: 0,
    female_executive_percentage: 0.0,
    female_executive_number: 0,
    createdOn: null,
  });
  const [targetData, setTargetData] = useState({
    board_independence_target: 0,
    other_target: 0,
    target_male_board: 0,
    target_female_board: 0,
    target_male_management: 0,
    target_female_management: 0,
  });
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: 12,
          marginRight: '30px',
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
                borderRadius: '20%', // ✅ Your request
                backgroundColor: entry.color,
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: '14px', color: '#000' }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PieChartWithCustomizablelabel = ({ data, barColors, title }: any) => {
    const barKeys = data.map((item: any) => item.name);
    const targets = data.map((item: any) => item.target);

    return (
      <>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Arial',
            // paddingLeft: '17px',
            marginBottom: '25px',
            color: '#120A08',
            whiteSpace: 'nowrap',
          }}
        >
          {title ? title : ''}
        </h3>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {/* <Row
          justify="center"
          gutter={8}
          style={{ paddingLeft: '0.2rem', marginBottom: '10px' }}
        >
          {barKeys.length > 0 &&
            barKeys.map((item: any, index: any) => (
              <Col
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 2px 2px 2px',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: barColors[index],
                    marginRight: '3px',
                  }}
                />
                <span>{item}</span>
              </Col>
            ))}
        </Row> */}

          <Row justify="center">
            <Col>
              {' '}
              <PieChart width={300} height={320}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data?.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                  {/* <Legend verticalAlign="bottom" height={36} /> */}
                </Pie>
                <Tooltip
                  content={({ payload }: any) => {
                    if (payload && payload.length) {
                      const { name, value, percent } = payload[0];
                      const { number } = payload[0]?.payload?.payload;
                      return (
                        <div
                          style={{
                            padding: '10px',
                            backgroundColor: '#fff',
                            borderRadius: '5px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          }}
                        >
                          <strong>{name}</strong>
                          {number ? (
                            <div>{formatter.format(number)}</div>
                          ) : (
                            <div>{value}</div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </Col>
          </Row>
        </Row>
      </>
    );
  };

  const [loding, setLoading] = useState(false);
  const { user } = useAuth();

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/board_and_management/get_board_and_mangement_dashboard_res/?entity_Id=${user.entity_Id}`
      );
      if (response?.response?.data) {
        setboardData(response?.response?.data);
        setTargetData(response?.response?.Targets);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const PieChartdata2 = [
    {
      name: 'Male',
      value: boardData?.male_percentage,
      target: targetData['target_male_board'],
      number: boardData?.male_number,
    },
    {
      name: 'Female',
      value: boardData?.female_percentage,
      target: targetData['target_female_board'],
      number: boardData?.female_number,
    },
  ];

  const PieChartdata3 = [
    {
      name: 'Independent',
      value: boardData?.independent_percentage,
      target: targetData['board_independence_target'],
      number: boardData?.independent_number,
    },
    {
      name: 'Others',
      value: boardData?.other_percentage,
      target: targetData['other_target'],
      number: boardData?.other_number,
    },
  ];

  const targetBoardGender = [
    {
      name: 'Male',
      actual: boardData?.male_number,
      target: targetData['target_male_board'],
    },
    {
      name: 'Female',
      actual: boardData?.female_number,
      target: targetData['target_female_board'],
    },
  ];

  const targetBoardIndependence = [
    {
      name: 'Independent',
      actual: boardData?.independent_number,
      target: targetData['board_independence_target'],
    },
    {
      name: 'Others',
      actual: boardData?.other_number,
      target: targetData['other_target'],
    },
  ];

  const targetManageGenderDiversity = [
    {
      name: 'Male',
      actual: boardData?.male_executive_number,
      target: targetData['target_male_management'],
    },
    {
      name: 'Female',
      actual: boardData?.female_executive_number,
      target: targetData['target_female_management'],
    },
  ];

  const COLORS1 = ['#F9B15C', '#036323'];
  const COLORS3 = ['#F9B15C', '#036323'];

  const COLORS2 = [
    'rgba(0, 192, 174, 1)',
    'rgba(238, 214, 148, 1)',
    'rgba(180, 151, 255, 1)',
  ];
  const PieChartdata1 = [
    {
      name: 'Male',
      value: boardData?.male_executive_percentage,
      target: targetData['target_male_management'],
      number: boardData?.male_executive_number,
    },
    {
      name: 'Female',
      value: boardData?.female_executive_percentage,
      target: targetData['target_female_management'],
      number: boardData?.female_executive_number,
    },
  ];

  return (
    <Spin spinning={loding}>
      <PageCardComponent className={Styles.pageCardStyle}>
        <>
          <Row
            justify="end"
            style={{ marginTop: '-10px', marginBottom: '10px' }}
          >
            <BoardPdf />
          </Row>

          <Row
            gutter={24}
            justify="center"
            style={{
              borderRadius: '10px',
              minHeight: '60vh',
              width: '100%',
            }}
          >
            <Col
              span={11}
              className={Styles.border}
              style={{ marginRight: '9px' }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <PieChartWithCustomizablelabel
                    data={PieChartdata3}
                    title="Board Independence"
                    barColors={COLORS3}
                  />
                </Col>
                <Col span={12}>
                  {/* <p
                      className={Styles.targetVsActual}
                      style={{
                        marginLeft: '90px',
                        marginTop: '20px',
                        marginBottom: '0',
                      }}
                    >
                      {'Actual vs Target Board Independence'}
                    </p> */}
                  <div style={{ marginTop: '88px' }}>
                    <TargetVsActualBarChart
                      data={targetBoardIndependence}
                      actualKey="actual"
                      targetKey="target"
                      actualColor="#F9B15C" // Orange
                      targetColor="#036323" // Dark Green
                      xAxisLabel="name"
                      unit="people" // Names will be on the Y-axis
                      showtick={true}
                    />
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              span={11}
              className={Styles.border}
              style={{ marginLeft: '9px' }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <PieChartWithCustomizablelabel
                    data={PieChartdata2}
                    title="Board Gender Diversity"
                    barColors={COLORS1}
                  />
                </Col>
                <Col span={12}>
                  {/* <p
                      className={Styles.targetVsActual}
                      style={{
                        marginLeft: '90px',
                        marginTop: '20px',
                        marginBottom: '0',
                      }}
                    >
                      {'Actual vs Target Board Gender Diversity'}
                    </p> */}
                  <div style={{ marginTop: '88px' }}>
                    <TargetVsActualBarChart
                      data={targetBoardGender}
                      actualKey="actual"
                      targetKey="target"
                      actualColor="#F9B15C" // Orange
                      targetColor="#036323" // Dark Green
                      xAxisLabel="name"
                      unit="people" // Names will be on the Y-axis
                      showtick={true}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row
            className="mt-3"
            justify="start"
            style={{
              borderRadius: '10px',
              minHeight: '60vh',
              width: '100%',
            }}
          >
            <Col
              span={11}
              className={Styles.border}
              style={{ marginLeft: '22px' }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <PieChartWithCustomizablelabel
                    data={PieChartdata1}
                    title="Management Gender Diversity"
                    barColors={COLORS1}
                  />
                </Col>
                <Col span={12}>
                  {/* <p
                      className={Styles.targetVsActual}
                      style={{
                        marginLeft: '90px',
                        marginTop: '20px',
                        marginBottom: '0',
                      }}
                    >
                      {'Actual vs Target Management Gender Diversity'}
                    </p> */}
                  <div style={{ marginTop: '88px' }}>
                    <TargetVsActualBarChart
                      data={targetManageGenderDiversity}
                      actualKey="actual"
                      targetKey="target"
                      actualColor="#F9B15C" // Orange
                      targetColor="#036323" // Dark Green
                      xAxisLabel="name"
                      unit="people" // Names will be on the Y-axis
                      showtick={true}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* hide group of charts */}
          {/* <Row gutter={24} justify={'space-evenly'}>
            <Col span={8}>
              <TargetVsActualBarChart
                data={targetBoardIndependence}
                actualKey="actual"
                targetKey="target"
                actualColor="#8884d8"
                targetColor="#82ca9d"
                xAxisLabel="name" // Names will be on the Y-axis
                showtick={true}
              />
            </Col>
            <Col span={8}>
              <TargetVsActualBarChart
                data={targetBoardGender}
                actualKey="actual"
                targetKey="target"
                actualColor="#8884d8"
                targetColor="#82ca9d"
                xAxisLabel="name" // Names will be on the Y-axis
                showtick={true}
              />
            </Col>
            <Col span={8}>
              <TargetVsActualBarChart
                data={targetManageGenderDiversity}
                actualKey="actual"
                targetKey="target"
                actualColor="#8884d8"
                targetColor="#82ca9d"
                xAxisLabel="name" // Names will be on the Y-axis
                showtick={true}
              />
            </Col>
          </Row> */}
        </>
      </PageCardComponent>
    </Spin>
  );
}

export default function BoardandManagementCompositionDashboard({
  resetForm,
}: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* <div className={Styles?.dashboardHeader}>
        Board and Management Dashboard
      </div> */}

      <BoardandManagementComposition />

      <ModalComponent
        isOpen={isOpen}
        content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
      />
    </>
  );
}
