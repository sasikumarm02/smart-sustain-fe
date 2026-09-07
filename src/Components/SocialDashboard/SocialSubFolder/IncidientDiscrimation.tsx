import { Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import TinyBarChart from './TinyBarChart';

function IncidientDiscrimation() {
  const data3 = [
    {
      name: 'Senior Management',
      'No. of incidents at start': 4000,
      'Logged during the period': 2400,
      'Reviewed and Remediation plan Implemented': 2400,
      'Reviewed and no longer subject to action': 4300,
      'Remediation Plan Under Study': 500,
      'Yet to be Reviewed': 500,
    },
  ];
  const barColors2 = [
    '#00C0AE',
    '#00C0AE',
    '#FD349C',
    '#63EBDA',
    '#76D2FF',
    '#B497FF',
  ];
  return (
    <>
      <Row
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '10px',
          height: '65vh',
        }}
      >
        <Col span={24}>
          <Row justify="space-between">
            <Col span={12}>
              {' '}
              <p className={Styles.GenderText}>Incidents of Discrimination</p>
            </Col>
            <Col span={12}>
              {' '}
              <p className={Styles.GenderText2}>
                Total : <span>6.5%</span>
              </p>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col
              span={6}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
              }}
            >
              <p style={{ fontSize: '12px', margin: '0px' }}>
                No. of incidents at start
              </p>
              <p style={{ fontSize: '12px', margin: '0px' }}>
                Logged during the period
              </p>
              <p style={{ fontSize: '12px', margin: '0px' }}>
                Reviewed and Remediation plan Implemented
              </p>
              <p style={{ fontSize: '12px', margin: '0px' }}>
                Reviewed and no longer subject to action
              </p>
              <p style={{ fontSize: '12px', margin: '0px' }}>
                Remediation Plan Under Study
              </p>
              <p style={{ fontSize: '12px', margin: '0px' }}>
                Yet to be Reviewed
              </p>
            </Col>

            <Col span={18} className="indiscrimation-tinychart">
              <TinyBarChart
                data={data3}
                colors={barColors2}
                height={400}
                barGap={35}
                width={400}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default IncidientDiscrimation;
