import { Col, Row } from 'antd';
import React from 'react';
import PieChartWithPaddingAngle from '../Graph/PieChartWithPaddingAngle';

import Styles from '../SocialDashboard/socialdashboard.module.scss';
import MaleBox from '../../assets/image/Rectangle 34625737.png';
import FemaleBox from '../../assets/image/Rectangle 34625738.png';
import PieChartWithCustomizablelabel from '../Graph/PieChartWithCustomizablelabel';
function BoardAndManagement() {
  const PieChartdata1 = [
    { name: 'Group A', value: 170 },
    { name: 'Group B', value: 240 },
    { name: 'Group C', value: 320 },
  ];
  const PieChartdata2 = [
    { name: 'Group A', value: 170 },
    { name: 'Group B', value: 240 },
  ];
  const COLORS1 = ['#FFA3DA', '#76D2FF', '#63EBDA'];
  return (
    <>
      <Row
        style={{
          background: '#fff',
          borderRadius: '10px',
          height: '60vh',
          padding: '15px',
          marginTop: '10px',
        }}
      >
        <Col span={24}>
          <p className={Styles.GenderText}>Board and Management Composition</p>
        </Col>
        <Col span={9} style={{ textAlign: 'center', padding: '10px' }}>
          <p style={{ color: '#3F434A', fontSize: '18px' }}>
            Board Independence
          </p>
          <div
            style={{
              display: 'flex',
              justifyItems: 'normal',
              alignItems: 'center',
            }}
          >
            <PieChartWithCustomizablelabel
              data={PieChartdata2}
              title=""
              barColors={COLORS1}
            />
          </div>
        </Col>
        <Col
          style={{
            borderRight: '2px solid #00C0AE',
            height: '40vh',
            marginTop: '3vh',
          }}
        ></Col>
        <Col span={14} style={{ padding: '10px' }}>
          <div
            style={{
              display: 'flex',
              color: '#3F434A',
              fontSize: '18px',
              gap: '15px',
            }}
          >
            <div>
              <p>Women on Board</p>
              <PieChartWithPaddingAngle
                height={200}
                width={400}
                data={[
                  { name: 'Group A', value: 400 },
                  { name: 'Group B', value: 300 },
                ]}
              />
            </div>
            <div>
              <p>Women in Management Team</p>
              <PieChartWithPaddingAngle
                height={200}
                width={400}
                data={[
                  { name: 'Group A', value: 400 },
                  { name: 'Group B', value: 300 },
                ]}
              />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default BoardAndManagement;
