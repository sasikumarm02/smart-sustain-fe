import { Col, Row } from 'antd';
import React from 'react';
import Styles from '../SocialDashboard/socialdashboard.module.scss';
import TinyBarChart from '../SocialDashboard/SocialSubFolder/TinyBarChart';

function DataBreaching() {
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
    'Customer privacy breach related complaints from outside parties',
    'Customer privacy breach related complaints from statutory authorities',
    'Customer privacy breach related incidents noticed from other means',
  ];
  return (
    <>
      <Row
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '10px',
          height: '55vh',
        }}
      >
        <Col span={24}>
          <Row justify="space-between">
            <Col span={22}>
              {' '}
              <p className={Styles.GenderText} style={{ paddingTop: '25px' }}>
                Data breach incidents during the period
              </p>
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
                height={250}
                barGap={35}
                width={450}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default DataBreaching;
