import { Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import TinyBarChart from './TinyBarChart';

function OccupationalHeathSafety() {
  const data3 = [
    {
      name: 'Senior Management',
      'Injury Rate ': 4000,
      'Occupational Disease Rate': 2400,
      'Lost Day Rate': 2400,
      'Absentee Rate': 4300,
      'High Risk/ Incidence Workers': 500,
    },
  ];
  const barColors2 = ['#00C0AE', '#FD349C', '#63EBDA', '#76D2FF', '#B497FF'];
  const Customlabel = [
    'Injury Rate ',
    'Occupational Disease Rate',
    'Lost Day Rate',
    'Absentee Rate',
    'High Risk/ Incidence Workers',
  ];
  // const barColors  = ["red","green","blue","grey"]

  return (
    <>
      <Row
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '10px',
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
                height={350}
                barGap={30}
                width={400}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default OccupationalHeathSafety;
