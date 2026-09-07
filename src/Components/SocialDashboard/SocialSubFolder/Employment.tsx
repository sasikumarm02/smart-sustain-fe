import { Card, Col, Row } from 'antd';
import React from 'react';
import PieChartWithPaddingAngle from '../../Graph/PieChartWithPaddingAngle';
import GroupPhoto from '../../../assets/image/Group 48095743.png';
import Styles from '../socialdashboard.module.scss';
import MaleBox from '../../../assets/image/Rectangle 34625737.png';
import FemaleBox from '../../../assets/image/Rectangle 34625738.png';
function Employment() {
  return (
    <Card className="p-4">
      <Row>
        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <h5>Employment</h5>
            <img alt="" src={GroupPhoto} style={{ width: '200px' }} />
            <b
              style={{
                fontSize: '18px',
                textAlign: 'center',
                color: '#00338D',
              }}
            >
              Total no of Employees
            </b>
            <p style={{ textAlign: 'center' }}>
              {' '}
              <b style={{ fontSize: '24px', color: '#00338D' }}>750</b>
            </p>
          </div>
        </Col>

        <Col
          style={{
            borderRight: '2px solid #00C0AE',
            padding: 0,
          }}
        ></Col>

        <Col
          xs={24}
          sm={24}
          md={24}
          lg={14}
          xl={14}
          style={{ marginLeft: '20px' }}
        >
          <h5>Gender Diversity</h5>
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <h6>Current Employees</h6>
              <PieChartWithPaddingAngle
                height={200}
                width={400}
                data={[
                  { name: 'Group A', value: 400 },
                  { name: 'Group B', value: 300 },
                ]}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <h6>New Hires</h6>
              <PieChartWithPaddingAngle
                height={200}
                width={400}
                data={[
                  { name: 'Group A', value: 400 },
                  { name: 'Group B', value: 300 },
                ]}
              />
            </Col>
            <Col className="d-flex justify-content-end" span={24}>
              <Col span={16}></Col>
              <Col span={6}>
                {' '}
                <img alt="" src={MaleBox} /> Male
              </Col>
              <Col span={6}>
                {' '}
                <img alt="" src={FemaleBox} /> Female
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

export default Employment;
