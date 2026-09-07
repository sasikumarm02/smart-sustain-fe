import { Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import TinyBarChart from './TinyBarChart';

function OccupationalHealth() {
  const data3 = [
    {
      name: 'Senior Management',
      Fatalities: 4000,
      'High Consequence Injuries': 2400,
      'Recordable Injuries': 2400,
      'Recordable Work-related Ill-health Cases': 4300,
    },
  ];
  const barColors2 = ['#617FEB', '#ACEAFF', '#FFA3DA', '#63EBDA'];
  const Customlabel = [
    'Fatalities',
    'High Consequence Injuries',
    'Recordable Injuries',
    'Recordable Work-related Ill-health Cases',
  ];
  return (
    <>
      <Row
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '10px',
          height: '60vh',
        }}
      >
        <Col span={24}>
          <Row justify="space-between">
            <Col span={16}>
              {' '}
              <p className={Styles.GenderText}>Occupational Health & Safety</p>
            </Col>
            {/* <Col span={12} > <p className={Styles.GenderText2}>Total : <span>6.5%</span></p></Col> */}
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
              {Customlabel.map((value: any, index: any) => {
                return (
                  <p key={index} style={{ fontSize: '12px', margin: '0px' }}>
                    {value}
                  </p>
                );
              })}
            </Col>

            <Col span={18} className="indiscrimation-tinychart">
              <TinyBarChart
                data={data3}
                colors={barColors2}
                height={260}
                barGap={25}
                width={400}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default OccupationalHealth;
