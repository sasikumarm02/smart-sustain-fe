import { Row, Col, Button } from 'antd';
import BelowHeader from '../../src/Modules/BelowHeader/index';
import MiniTable from '../../src/Components/Dashboard/MiniTable';
import BarChartWithMultiXAxis from '../../src/Components/Graph/BarChartWithMultiXAxis';
import FormModal from '../Components/Modals/FormModal';
import { useState } from 'react';
import BoardAndManagement from '../Components/GovernanceSubFolder/BoardAndManagement';
import EthicalBehaviour from '../Components/GovernanceSubFolder/EthicalBehaviour';
import DataBreaching from '../Components/GovernanceSubFolder/DataBreaching';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ModalComponent, PageCardComponent } from '../DesignLibrary';
import Styles from '../Components/Assesment/Assessement.module.scss';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import img1 from '../assets/Svg/Dashboard/icon21.svg';
import img2 from '../assets/Svg/Dashboard/icon22.svg';
import img3 from '../assets/Svg/Dashboard/icon23.svg';
import img4 from '../assets/Svg/Dashboard/icon24.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentYear } from '../Components/Emissions/Scope3/Helpers';

const dataSet = [
  {
    title: 'Bribery',
    count: '2',
    img: img1,
  },
  {
    title: 'Fraud',
    count: '1',
    img: img2,
  },
  {
    title: 'Enviroment Violation',
    count: '2',
    img: img3,
  },
  {
    title: 'Data Safety Breach',
    count: '1',
    img: img4,
  },
];

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
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      fontWeight={700}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCustomizedLabelDonut = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="black"
      fontWeight={700}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const DonutChartWithCustomizableLabel = ({ data, barColors, title }: any) => {
  const barKeys = data.map((item: any) => item.name);

  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontSize: '12px',
          fontWeight: '400',
          fontFamily: 'Rubik',
          paddingLeft: '17px',
          paddingBottom: '15px',
          color: '#3F434A',
          whiteSpace: 'nowrap',
        }}
      >
        {title || ''}
      </h2>
      <Row
        justify="center"
        gutter={8}
        style={{ flexWrap: 'nowrap', marginBottom: '16px' }}
      >
        {barKeys.length > 0 &&
          barKeys.map((item: any, index: any) => (
            <Col
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 2px',
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
      </Row>
      <Row justify="center">
        <Col>
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              labelLine={false}
              label={renderCustomizedLabelDonut}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Col>
      </Row>
    </Row>
  );
};

const PieChartWithCustomizablelabel = ({ data, barColors, title }: any) => {
  const barKeys = data.map((item: any) => item.name);

  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'Rubik',
          paddingLeft: '17px',
          paddingBottom: '15px',
          color: '#00338d',
          whiteSpace: 'nowrap',
        }}
      >
        {title ? title : 'Jai ho'}
      </h2>
      <Row justify="center" gutter={8} style={{ paddingLeft: '0.2rem' }}>
        {barKeys.length > 0 &&
          barKeys.map((item: any, index: any) => (
            <Col
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 2px',
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
      </Row>

      <Row justify="center">
        <Col>
          {' '}
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={95}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
              <Legend verticalAlign="bottom" height={36} />
            </Pie>
          </PieChart>
        </Col>
      </Row>
    </Row>
  );
};

function GovernanceBodies() {
  const PieChartdata1 = [
    { name: '< 30', value: 170 },
    { name: '30 - 50', value: 240 },
    { name: '> 50', value: 320 },
  ];
  const PieChartdata2 = [
    { name: 'Male', value: 170 },
    { name: 'Female', value: 240 },
  ];
  const PieChartdata3 = [
    { name: 'Male', value: 80 },
    { name: 'Female', value: 20 },
  ];
  const COLORS2 = [
    'rgba(0, 192, 174, 1)',
    'rgba(238, 214, 148, 1)',
    'rgba(180, 151, 255, 1)',
  ];
  const COLORS1 = ['#FFA3DA', '#76D2FF', '#63EBDA'];
  return (
    <>
      <Row
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '10px',
          marginTop: '10px',
          height: '60vh',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '25px' }}>Governance Bodies</p>

        <Col span={24}>
          <Row gutter={16}>
            <Col span={10} className="tinyBAr-axis">
              {/* <p
                style={{
                  paddingLeft: "25px",

                  color: "#3F434A",
                  fontSize: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                By Gender
              </p> */}
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <PieChartWithCustomizablelabel
                  data={PieChartdata3}
                  title="By Gender"
                  barColors={COLORS1}
                />
              </div>
            </Col>
            <Col
              style={{
                borderRight: '2px solid rgba(0, 184, 245, 1)',
                height: '45vh',
              }}
            ></Col>
            <Col span={10} className="tinyBAr-axis">
              {/* <p
                style={{
                  paddingLeft: "30px",
                  color: "#3F434A",
                  fontSize: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                By Age Groups
              </p> */}
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'normal',
                  alignItems: 'center',
                }}
              >
                <PieChartWithCustomizablelabel
                  data={PieChartdata1}
                  title="By Age Groups"
                  barColors={COLORS2}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

function BoardandManagementComposition() {
  const PieChartdata2 = [
    { name: 'Male', value: 42 },
    { name: 'Female', value: 58 },
  ];

  const PieChartdata3 = [
    { name: 'Independent Directors', value: 30 },
    { name: 'Other Directors', value: 70 },
  ];
  const COLORS1 = ['#FFA3DA', '#76D2FF', '#63EBDA'];
  const COLORS3 = ['rgba(0, 192, 174, 1)', 'rgba(180, 151, 255, 1)'];
  const COLORS2 = [
    'rgba(0, 192, 174, 1)',
    'rgba(238, 214, 148, 1)',
    'rgba(180, 151, 255, 1)',
  ];
  const PieChartdata1 = [
    { name: '< 30', value: 170 },
    { name: '30 - 50', value: 240 },
    { name: '> 50', value: 320 },
  ];

  return (
    <>
      <Row
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '10px',
          marginTop: '10px',
          minHeight: '60vh',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '25px' }}>
          Board and Management Composition
        </p>

        <Row gutter={24} style={{ width: '100vw' }}>
          <Col span={7} className="tinyBAr-axis">
            <div
              style={{
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginLeft: '2vw',
              }}
            >
              <PieChartWithCustomizablelabel
                data={PieChartdata3}
                title="Board Independence"
                barColors={COLORS3}
              />
            </div>
          </Col>

          <Col
            style={{
              borderRight: '2px solid rgba(0, 184, 245, 1)',
              minHeight: '40vh',
            }}
          ></Col>

          <Col span={7} className="tinyBAr-axis">
            <div
              style={{
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <PieChartWithCustomizablelabel
                data={PieChartdata2}
                title="By Gender"
                barColors={COLORS1}
              />
            </div>
          </Col>
          <Col
            style={{
              borderRight: '2px solid rgba(0, 184, 245, 1)',
              minHeight: '40vh',
            }}
          ></Col>
          <Col span={7} className="tinyBAr-axis">
            <div
              style={{
                display: 'flex',
                justifyItems: 'normal',
                alignItems: 'center',
                marginLeft: '5vw',
              }}
            >
              <PieChartWithCustomizablelabel
                data={PieChartdata1}
                title="By Age Groups"
                barColors={COLORS2}
              />
            </div>
          </Col>
        </Row>
      </Row>
    </>
  );
}

export default function GovernanceDashboard({ resetForm }: any) {
  const data2 = [
    {
      label: 'Communication about anti corruption policies and procedures',
      'Governance Body Members': 50,
      'Senior Management': 20,
      'Middle Management': 30,
      'Senior Management2': 20,
      'Middle Management3': 30,
      'Middle Management4': 30,
    },
    {
      label: 'Training about anti-corruption policies and procedures',
      'Governance Body Members': 35,
      'Senior Management': 25,
      'Middle Management': 15,
      'Senior Management2': 20,
      'Middle Management3': 30,
      'Middle Management4': 30,
    },
  ];
  const dataSourceCertification = [
    { key: '1', Name: 'ISO 14001 (Environmental Management System)' },
    { key: '2', Name: 'ISO 9001 (Quality Management System)' },
    { key: '3', Name: 'BCA Green Mark (Building Sustainability Index)' },
    { key: '4', Name: 'LEED (Leadership in Energy and Environmental Design)' },
    {
      key: '5',
      Name: "SG Clean (Singapore's cleanliness and hygiene certification)",
    },
  ];
  const dataSourceAlignment = [
    { key: '1', Name: 'GRI (Global Reporting Initiative)' },
    { key: '2', Name: 'SASB (Sustainability Accounting Standards Board)' },
    {
      key: '3',
      Name: 'TCFD (Task Force on Climate-related Financial Disclosures)',
    },
    { key: '4', Name: 'SDGs (Sustainable Development Goals)' },
    {
      key: '5',
      Name: "SG Clean (Singapore's cleanliness and hygiene certification)",
    },
  ];
  const dataSourceAssurance = [
    { key: '1', Name: 'External' },
    { key: '2', Name: 'Internal' },
    { key: '3', Name: 'None' },
  ];
  const data: any[] = [
    {
      label: 'Basic Salary',
      Female: 24,
    },
    {
      label: 'Remuneration',
      Female: 24,
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <h4
        style={{
          color: 'rgba(0, 51, 141, 1)',
          fontWeight: 700,
          marginTop: '2vh',
        }}
      >
        Governance Dashboard
      </h4>

      <Row gutter={16}>
        <Col>
          <BoardandManagementComposition />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '4vh' }}>
        {dataSet?.map((item: any, index: number) => {
          return (
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <PageCardComponent>
                <div style={{ display: 'flex' }}>
                  <div>
                    <img
                      style={{ height: '18vh', width: '80%' }}
                      src={item?.img}
                    ></img>
                  </div>
                  <div style={{ marginTop: '4vh' }}>
                    <p style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>
                      {item?.title}
                    </p>
                    <p
                      style={{
                        color: 'rgba(0, 51, 141, 1)',
                        fontWeight: '800',
                        fontSize: '18px',
                      }}
                    >
                      {item?.count}
                    </p>
                  </div>
                </div>
              </PageCardComponent>
            </Col>
          );
        })}
      </Row>

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
