import React from 'react';
import Styles from './socialdashboard.module.scss';
import { Col, Row } from 'antd';
import Employment from './SocialSubFolder/Employment';
import AgeBasedDiversity from './SocialSubFolder/AgeBasedDiversity';
import GovernanceBodies from './SocialSubFolder/GovernanceBodies';
import EmploymentTurnover from './SocialSubFolder/EmploymentTurnover';
import IncidientDiscrimation from './SocialSubFolder/IncidientDiscrimation';
import BenefitList from './SocialSubFolder/BenefitList';
import OccupationalHealth from './SocialSubFolder/OccupationalHealth';
import OccupationalHeathSafety from './SocialSubFolder/OccupationalHeathSafety';
import OperationWithLocal from './SocialSubFolder/OperationWithLocal';
import male from '../../../src/assets/image/maleLave.png';
import female from '../../../src/assets/image/femaleGreen.png';
import BarChartWithMultiXAxis from '../Graph/BarChartWithMultiXAxis';
import SimpleBarChart from '../Graph/SimpleBarChart';
import SimpleBarChartVertical from '../Graph/SimpleBarChartVertical';
import BelowHeader from '../../Modules/BelowHeader/index';

function SocialDashboard() {
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
  const data5 = [
    {
      name: 'Senior Management',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Middle Management',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Executive',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
  ];

  return (
    <>
      <Row gutter={14}>
        <Col span={24} style={{ paddingBottom: '10px' }}>
          <BelowHeader detailPageName="Social Dashboard" />
        </Col>
        <Col span={12}>
          <Employment />
          <GovernanceBodies />
          <BarChartWithMultiXAxis
            data={data}
            title="Ratio of basic salary and remuneration by gender"
            height={260}
          />
          <OccupationalHealth />
        </Col>
        <Col span={12}>
          <div>
            {' '}
            <AgeBasedDiversity />
          </div>
          <div className="mt-2">
            <EmploymentTurnover />
          </div>

          <IncidientDiscrimation />
          <OccupationalHeathSafety />
        </Col>
        <Col span={24} style={{ paddingTop: '20px' }}>
          <BenefitList />
        </Col>
        <Col span={12}>
          <BarChartWithMultiXAxis
            data={data}
            title="Parental Leave"
            height={180}
          />
          <SimpleBarChart
            data={data5}
            title="Performance and career development reviews coverage"
          />
        </Col>
        <Col span={12}>
          <SimpleBarChartVertical data={data5} title="Development & Training" />
          <OperationWithLocal />
        </Col>
      </Row>
    </>
  );
}

export default SocialDashboard;
