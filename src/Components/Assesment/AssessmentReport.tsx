import { Key, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spin } from 'antd';
import Styles from './Assessement.module.scss';
import { Progress } from 'antd';
import environmental from '../../assets/image/environmental.png';
import Social from '../../assets/image/Social.png';
import Governanvce from '../../assets/image/Governanvce.png';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { ModalComponent, PageCardComponent } from '../../DesignLibrary';
import img4 from '../../assets/Svg/CurrencyConversion/target.svg';
import B1 from '../../assets/Svg/Assessment/B1.png';
import B2 from '../../assets/Svg/Assessment/B2.png';
import B3 from '../../assets/Svg/Assessment/B3.png';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatNumberUS } from '../../Utils/Strings';

import { useNotification } from '../../Hooks/useNotification';
import AssessmentPDF from './AssessmentPDF';
import { isEmpty } from '../../Utils/isEmpty';
import { getCurrentYear } from '../Emissions/Scope3/Helpers';
import Footer from '../Footer';

function truncateToTwoDecimals(num: number | undefined) {
  if (num === undefined) return 0;
  return Math.floor(num * 100) / 100;
}

interface MaturityCategory {
  Pillar_Percentage: number;
  Pillar_Description: string;
  Maturity_Rating: string;
}

interface ApiResponse {
  Environment: MaturityCategory;
  Governance: MaturityCategory;
  Social: MaturityCategory;
  Overall_Rating: number;
  Overall_Percentage: number;
  Overall_Description: string;
}

const progressData = [
  { text: 'Environment', percent: 25, color: '#00B8F5' },
  { text: 'Social', percent: 38, color: '#7213EA' },
  { text: 'Governance', percent: 13, color: '#098E7E' },
];
const scoreData = [
  { num: '3', total: 12 },
  { num: '5', total: 13 },
  { num: '2', total: 15 },
];

export default function AssessmentReport() {
  const { user } = useAuth();
  const location = useLocation();

  const [apiData, setApiData] = useState<ApiResponse>();
  const [isLoading, setIsloading] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    fetchApiData(user.entity_Id);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-bold">{`${label}`}</p>
          {payload.map(
            (entry: { name: string | undefined | null; value: any }) => {
              const colors: { [key: string]: string } = {
                National: '#0D4A43',
                Sector: '#24AA48',
                Company: '#3486C5',
              };

              const color = colors[entry.name || ''] || '#000000';

              return (
                <p key={entry.name} style={{ color: color }}>
                  {`${entry.name}: ${entry.value}%`}
                </p>
              );
            }
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    const colors: { [key: string]: string } = {
      National: '#0D4A43',
      Sector: '#24AA48',
      Company: '#3486C5',
    };

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          paddingBottom: 20,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          Maturity Assessment Benchmarking
        </span>
        <div style={{ display: 'flex' }}>
          {payload.map((entry: any, index: any) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 20,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: colors[entry.value || ''],
                  marginRight: 8,
                }}
              />
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const fetchApiData = (entity_Id: any) => {
    setIsloading(true);
    get(`maturityAssessment/maturity_score/?entity_Id=${entity_Id}`)
      .then((res: any) => {
        if (res?.response?.status === true && !isEmpty(res?.response?.data)) {
          setApiData(res?.response?.data);
        } else {
          notification.openToast({
            content: res.message,
            type: 'warning',
          });
        }
      })
      .catch((err) => {
        notification.openToast({
          content: err.message,
          type: 'error',
        });
      })
      .finally(() => setIsloading(false));
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const mapping = [
    'L0 Absent',
    'L1 Aware',
    'L2 Advance',
    'L3 Adept',
    'L4 Adaptive',
  ];

  const data = [
    {
      name: 'Environment',
      National: 60,
      Sector: 30,
      Company: apiData?.Environment?.['Pillar_Percentage']
        ? apiData?.Environment?.['Pillar_Percentage']
        : 0,
      img: environmental,
    },
    {
      name: 'Social',
      National: 70,
      Sector: 20,
      Company: apiData?.Social?.['Pillar_Percentage']
        ? apiData?.Social?.['Pillar_Percentage']
        : 0,
      img: Social,
    },
    {
      name: 'Governance',
      National: 30,
      Sector: 10,
      Company: apiData?.Governance?.['Pillar_Percentage']
        ? apiData?.Governance?.['Pillar_Percentage']
        : 0,
      img: Governanvce,
    },
  ];

  const coalsAchieved = [
    {
      title: 'Environment',
      tag: 'L1 Aware',
      value: '80',
    },
    {
      title: 'Social',
      tag: 'L0 Absent',
      value: '70',
    },
    {
      title: 'Governance',
      tag: 'L2 Advance',
      value: '30',
    },
  ];

  const NewData = [
    { category: 'Environment', National: 12, Sector: 9, Company: 7 },
    { category: 'Social', National: 15, Sector: 12, Company: 10 },
    { category: 'Governance', National: 10, Sector: 8, Company: 5 },
  ];

  const navigate = useNavigate();

  // Function to render progress bar with given percentage
  const renderProgressBar = (percentage: any) => {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '42px',
          backgroundColor: '#E7EBF4',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: '#0D304A',
            borderRadius: '20px',
          }}
        ></div>
      </div>
    );
  };

  return (
    <>
      <Spin spinning={isLoading}>
        {/* <div className="pageTitle mt-2">ESG Maturity Assessment Report</div> */}
        <PageCardComponent
          style={{
            minHeight: '70vh',
            width: '100%',
            display: 'flex',
          }}
          customClass={Styles.pageCardStyle}
        >
          <Row justify="space-between">
            <h3
              style={{
                color: 'Black',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              Overall Score
            </h3>

            <AssessmentPDF />
          </Row>

          <Row>
            <Col span={12}>
              <Row>
                <Col
                  style={{
                    height: '10vh',
                    minWidth: '15vw',

                    color: 'Black',
                    padding: '5px',
                    borderRadius: '0.7vh',
                  }}
                >
                  <p
                    style={{
                      fontWeight: '700',
                      fontSize: '62px',
                      fontFamily: 'Arial',
                    }}
                  >
                    {!isEmpty(apiData) && apiData?.Overall_Rating
                      ? apiData?.Overall_Rating
                      : 'L0 - Absent'}
                  </p>
                </Col>
              </Row>
              <Row>
                <Row></Row>
                <Row
                  style={{ marginTop: '4vh' }}
                  align="middle"
                  justify="start"
                >
                  <Col
                    span={24}
                    xs={24}
                    sm={12}
                    md={4}
                    lg={4}
                    style={{
                      height: 'auto',
                      width: 'auto',
                    }}
                  >
                    <Progress
                      style={{
                        width: '100%',
                        height: 'auto',
                      }}
                      className="matProgress"
                      strokeColor={'rgba(0, 51, 141, 1)'}
                      type="circle"
                      percent={apiData?.Overall_Percentage || 0}
                      format={(percent: any) => (
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {percent?.toFixed(2)}%
                        </span>
                      )}
                      width={110}
                      strokeWidth={3}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={24}
                    xs={24}
                    sm={20}
                    md={18}
                    lg={18}
                    style={{
                      wordSpacing: '0.5em',
                      marginTop: '1vh',
                      padding: '10px',
                    }}
                  >
                    {!isEmpty(apiData) && apiData?.Overall_Description
                      ? apiData?.Overall_Description
                      : 'Minimal environment initiatives that are qualitative in nature are put in place focusing on compliance, lacking specific targets or comprehensive planning.'}
                  </Col>
                </Row>
              </Row>

              <Row style={{ marginTop: '3vh' }} align="middle">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    gap: '10px',
                  }}
                >
                  <img src={B1} alt="..." />
                  <img src={B2} alt="..." />
                </div>
              </Row>
              <Row style={{ marginTop: '1vh' }} align="middle">
                <Col>
                  <img src={B3} alt="..." />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col style={{ width: '40vw' }}>
                  {!isEmpty(coalsAchieved) &&
                    coalsAchieved.map((data, index) => (
                      <div key={index} style={{ marginBottom: '50px' }}>
                        <div style={{ color: '#605B5A', marginBottom: '5px' }}>
                          {data.title}
                        </div>
                        <div className="flex items-center">
                          <div className="w-2/3">
                            {renderProgressBar(
                              index === 0
                                ? apiData?.Environment.Pillar_Percentage
                                : index === 1
                                  ? apiData?.Social.Pillar_Percentage
                                  : apiData?.Governance.Pillar_Percentage
                            )}
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              textAlign: 'left',
                              marginTop: '-33px',
                              paddingLeft: '10px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: 'white',
                            }}
                          >
                            {index === 0
                              ? apiData?.Environment.Maturity_Rating
                              : index === 1
                                ? apiData?.Social.Maturity_Rating
                                : apiData?.Governance.Maturity_Rating}
                          </div>

                          <div
                            style={{
                              position: 'relative',
                              textAlign: 'right',
                              marginTop: '-22px',
                              paddingRight: '10px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: 'black',
                            }}
                          >
                            {index === 0
                              ? apiData?.Environment.Pillar_Percentage
                              : index === 1
                                ? apiData?.Social.Pillar_Percentage
                                : apiData?.Governance.Pillar_Percentage}
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                </Col>
              </Row>
              <Row justify="end">
                <ResponsiveContainer width="75%" height={400}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    barSize={40}
                  >
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      fontWeight={500}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" content={<CustomLegend />} />
                    {/* Linear Gradient Definitions */}
                    <defs>
                      {/* Gradient for National */}
                      <linearGradient
                        id="gradientNational"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#0D4A43" />
                        <stop offset="100%" stopColor="#1FB09F" />
                      </linearGradient>

                      {/* Gradient for Sector */}
                      <linearGradient
                        id="gradientSector"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#24AA48" />
                        <stop offset="100%" stopColor="#17440E" />
                      </linearGradient>

                      {/* Gradient for Company */}
                      <linearGradient
                        id="gradientCompany"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3486C5" />
                        <stop offset="100%" stopColor="#19415F" />
                      </linearGradient>
                    </defs>

                    <Bar
                      dataKey="National"
                      fill="url(#gradientNational)"
                      name="National"
                      radius={[30, 30, 0, 0]}
                    />
                    <Bar
                      dataKey="Sector"
                      fill="url(#gradientSector)"
                      name="Sector"
                      radius={[30, 30, 0, 0]}
                    />
                    <Bar
                      dataKey="Company"
                      fill="url(#gradientCompany)"
                      name="Company"
                      radius={[30, 30, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Row>
            </Col>
          </Row>
        </PageCardComponent>
        <ModalComponent
          isOpen={isOpen}
          content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
          onCancel={() => setIsOpen(false)}
          onProceed={() => setIsOpen(false)}
          submitBtnText="Ok"
        />
      </Spin>
    </>
  );
}
