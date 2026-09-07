import { Row, Col, Card, Spin } from 'antd';
import {
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import Styles from '../../Assesment/Assessement.module.scss';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import img1 from '../../../assets/Svg/Dashboard/icon21.svg';
import img2 from '../../../assets/Svg/Dashboard/icon22.svg';
import img3 from '../../../assets/Svg/Dashboard/icon23.svg';
import img4 from '../../../assets/Svg/Dashboard/icon24.svg';
import { useEffect, useState } from 'react';
import { apiBaseUrl, get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import GovernanceCompliancePdf from '../../Emissions/Environment/GovernanceCompliancePdf';
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

export default function GovernanceComplianceDashboard({ resetForm }: any) {
  const [complianceData, setComplianceData] = useState({
    'Environmental Violation': 0,
    Bribery: 0,
    Fraud: 0,
    'Data Safety Breach': 0,
  });
  const [targetData, setTargetData] = useState({
    nonComplianceIncidents: 0,
    tagets: 0,
  });
  const [loding, setLoading] = useState(false);
  const { user } = useAuth();

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/corruption/get_corruption_dashboard_res/?entity_Id=${user.entity_Id}`
      );
      if (response?.response?.data) {
        setComplianceData(response?.response?.data);
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

  const dataSet = [
    {
      title: 'Bribery',
      count: complianceData?.['Bribery'],
      img: img1,
    },
    {
      title: 'Fraud',
      count: complianceData?.['Fraud'],
      img: img2,
    },
    {
      title: 'Environment Violation',
      count: complianceData?.['Environmental Violation'],
      img: img3,
    },
    {
      title: 'Data Safety Breach',
      count: complianceData?.['Data Safety Breach'],
      img: img4,
    },
  ];
  const dataSources = [
    {
      key: '1',
      bribery: complianceData?.['Bribery'] || 0,
      fraud: complianceData?.['Fraud'] || 0,
      environmentViolation: complianceData?.['Environmental Violation'] || 0,
      dataSafetyBreach: complianceData?.['Data Safety Breach'] || 0,
    },
  ];

  const columns = [
    {
      title: 'Bribery',
      dataIndex: 'bribery',
      key: 'bribery',
      align: 'center',
    },
    {
      title: 'Fraud',
      dataIndex: 'fraud',
      key: 'fraud',
      align: 'center',
    },
    {
      title: 'Environment Violation',
      dataIndex: 'environmentViolation',
      key: 'environmentViolation',
      align: 'center',
    },
    {
      title: 'Data Safety Breach',
      dataIndex: 'dataSafetyBreach',
      key: 'dataSafetyBreach',
      align: 'center',
    },
  ];

  function getValuesByKey(key: any, data: any) {
    if (data && data.hasOwnProperty(key)) {
      return data[key];
    } else {
      return [];
    }
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Spin spinning={loding}>
      <Row justify={'space-between'}>
        <PageCardComponent
          className={Styles.pageCardStyle}
          style={{ width: '100%' }}
        >
          <Row justify="end" style={{ marginBottom: '-20px' }}>
            <GovernanceCompliancePdf />
          </Row>
          {/* <Row className={Styles.FirstHeading}>Governance Compliance</Row> */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            {/* Target Incidents */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card
                style={{
                  backgroundColor: '#002b5c',
                  color: '#fff',
                  borderRadius: '12px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 'Normal' }}>
                  Target Incidents
                </div>
                <div style={{ fontSize: '21px', fontWeight: 'bold' }}>
                  {targetData['nonComplianceIncidents']}
                </div>
                {/* Invisible placeholder to balance layout */}
                <div style={{ height: 6, visibility: 'hidden' }} />
              </Card>
            </Col>

            {/* Report Incidents */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card
                style={{
                  backgroundColor: '#002b5c',
                  color: '#fff',
                  borderRadius: '12px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 'Normal' }}>
                  Report Incidents
                </div>
                <div style={{ fontSize: '21px', fontWeight: 'bold' }}>
                  {getValuesByKey('Non Compliance Incidents', complianceData)}
                </div>
                {/* Progress Bar with percentage */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 4,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: '#081420',
                      height: 6,
                      borderRadius: 5,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          (getValuesByKey(
                            'Non Compliance Incidents',
                            complianceData
                          ) /
                            100) *
                            100,
                          100
                        )}%`,
                        backgroundColor: '#E8EAED',
                        height: '100%',
                        borderRadius: 5,
                      }}
                    />
                  </div>

                  {/* Percentage text */}
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>
                    {Math.min(
                      (getValuesByKey(
                        'Non Compliance Incidents',
                        complianceData
                      ) /
                        100) *
                        100,
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <TableComponent
              isForm={true}
              isRowExpand={false}
              data={dataSources}
              enableRowSelection={false}
              columnHeader={columns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Row>
        </PageCardComponent>
      </Row>

      <ModalComponent
        isOpen={isOpen}
        content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
      />
    </Spin>
  );
}
