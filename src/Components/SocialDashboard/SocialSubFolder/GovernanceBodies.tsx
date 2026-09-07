import { Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import PieChartWithCustomizablelabel from '../../Graph/PieChartWithCustomizablelabel';
import Female from '../../../assets/image/Group (1).png';
import Male from '../../../assets/image/Group3.png';

function GovernanceBodies() {
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
          padding: '10px',
          marginTop: '10px',
          height: '60vh',
        }}
      >
        <p className={Styles.GenderText}>Governance Bodies</p>
        <Col span={24}>
          <Row>
            <Col span={12} className="tinyBAr-axis">
              <p
                style={{
                  paddingLeft: '25px',
                  color: '#3F434A',
                  fontSize: '18px',
                }}
              >
                By Gender
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'normal',
                  alignItems: 'center',
                }}
              >
                <div>
                  <img alt="" src={Male} style={{ width: '40px' }} />
                </div>

                <PieChartWithCustomizablelabel
                  data={PieChartdata2}
                  title=""
                  barColors={COLORS1}
                />
                <div>
                  <img alt="" src={Female} style={{ width: '48px' }} />
                </div>
              </div>
            </Col>
            <Col
              style={{
                borderRight: '2px solid #00C0AE',
                height: '40vh',
                marginTop: '2vh',
              }}
            ></Col>
            <Col span={11} className="tinyBAr-axis">
              <p
                style={{
                  paddingLeft: '30px',
                  color: '#3F434A',
                  fontSize: '18px',
                }}
              >
                By Age Groups
              </p>
              <PieChartWithCustomizablelabel
                data={PieChartdata1}
                title=""
                barColors={COLORS1}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default GovernanceBodies;
