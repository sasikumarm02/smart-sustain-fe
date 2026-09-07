import { Card, Col, Row } from 'antd';
import React from 'react';
import Styles from '../SocialDashboard/socialdashboard.module.scss';
import TinyBarChart from '../SocialDashboard/SocialSubFolder/TinyBarChart';
import BarChartNoPadding from '../Graph/BarChartNoPadding';

function EthicalBehaviour() {
  const data3 = [
    {
      name: 'Senior Management',
      'Social impact assessments': 4000,
      'Environmental impact': 2400,
      'Public disclosure of social impact': 2400,
    },
  ];
  const barColors2 = ['#00C0AE', '#76D2FF', '#B497FF'];

  const Customlabel = [
    'Public legal cases regarding corruption',
    'Number of incidents in which action taken against Employees',
    'Number of incidents in which action taken against Business Partners',
  ];
  return (
    <>
      <Card>
        <p className={Styles.GenderText} style={{ paddingTop: '25px' }}>
          Ethical Behavior Risks and Incidents{' '}
        </p>
        <BarChartNoPadding />
      </Card>
    </>
  );
}

export default EthicalBehaviour;
