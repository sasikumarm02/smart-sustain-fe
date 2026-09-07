import { Card, Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import TinyBarChart from './TinyBarChart';
import { color } from 'd3-color';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Import Bootstrap's progress bar component

function AgeBasedDiversity() {
  const data3 = [
    {
      name: 'Senior Management',
      '<30': 2000,
      '30-50': 2400,
      '>50': 2400,
    },
  ];
  const barColors2 = ['#EED694', '#76D2FF', '#FFA3DA'];

  const ProgressBarFunc = ({ completedValue, fill, range }: any) => {
    const remainingValue = 100 - completedValue;
    return (
      <>
        <Col span={4} className="mt-2">
          <p style={{ color: fill, fontWeight: '500' }}>{range}</p>
        </Col>
        <Col span={20} className="mt-2">
          <div
            className="progress"
            style={{
              height: '25px',
              borderTopRightRadius: '30px',
              borderBottomRightRadius: '30px',
              background: 'transparent',
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${completedValue}%`,
                backgroundColor: fill,
                borderTopRightRadius: '30px',
                borderBottomRightRadius: '30px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
              }}
              aria-valuenow={completedValue}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
            <span
              style={{
                color: fill,
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                fontSize: '15px',
                fontWeight: '600',
                width: '-webkit-fill-available',
              }}
            >
              {' '}
              {`${completedValue} %`}
            </span>
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{
                width: `${remainingValue}%`,
                backgroundColor: '#fff',
                display: 'none',
              }}
              aria-valuenow={remainingValue}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {`${remainingValue}% Incomplete`}
            </div>
          </div>
        </Col>
      </>
    );
  };

  return (
    <>
      <Card>
        <p className={Styles.GenderText}>Age Based Diversity</p>

        <Row gutter={12}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <p
              style={{
                color: '#3F434A',
                fontSize: '18px',
              }}
            >
              Current Employees
            </p>

            <Row>
              <ProgressBarFunc
                completedValue={30}
                fill="#EED694"
                range="< 30"
              />
              <ProgressBarFunc
                completedValue={75}
                fill="#00C0AE"
                range="30-50"
              />
              <ProgressBarFunc
                completedValue={15}
                fill="#B497FF"
                range="> 50"
              />
            </Row>
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
            lg={24}
            xl={11}
            className="tinyBAr-axis"
            style={{ marginLeft: '20px' }}
          >
            <p
              style={{
                color: '#3F434A',
                fontSize: '18px',
              }}
            >
              New hires
            </p>
            <Row>
              <ProgressBarFunc
                completedValue={30}
                fill="#EED694"
                range="< 30"
              />
              <ProgressBarFunc
                completedValue={75}
                fill="#00C0AE"
                range="30-50"
              />
              <ProgressBarFunc
                completedValue={15}
                fill="#B497FF"
                range="> 50"
              />
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default AgeBasedDiversity;
