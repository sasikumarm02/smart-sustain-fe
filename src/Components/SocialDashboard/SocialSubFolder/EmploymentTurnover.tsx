import { Card, Col, Row } from 'antd';
import React from 'react';
import Styles from '../socialdashboard.module.scss';
import TinyBarChart from './TinyBarChart';
import RadialProgressBar from './RadialProgressBar';
import MaleBox from '../../../assets/image/Rectangle 34625737.png';
import FemaleBox from '../../../assets/image/Rectangle 34625738.png';
function EmploymentTurnover() {
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
        <Row>
          <Col span={12}>
            <p className={Styles.GenderText}>Employment Turnoverr</p>
          </Col>
          <Col span={12}>
            <p className={Styles.GenderText2}>
              Overall: <span>6.5%</span>
            </p>
          </Col>
        </Row>

        <Row gutter={12} style={{ borderBottom: '1px solid #000000' }}>
          <Col span={12}>
            <p
              style={{
                paddingLeft: '25px',
                color: '#3F434A',
                fontSize: '18px',
              }}
            >
              Current Employees
            </p>
            <p
              style={{
                paddingLeft: '25px',
                color: '#3F434A',
                fontSize: '18px',
              }}
            >
              Gender Based
            </p>
            <RadialProgressBar />
          </Col>
          <Col
            style={{
              borderRight: '2px solid #00C0AE',
              padding: 0,
            }}
          ></Col>
          <Col span={11}>
            <p
              style={{
                paddingLeft: '30px',
                color: '#3F434A',
                fontSize: '18px',
              }}
            >
              New Hires
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                color: '#3F434A',
                fontSize: '18px',
                gap: '15px',
              }}
            >
              <p>
                <img alt="" src={MaleBox} /> Male
              </p>
              <p>
                {' '}
                <img alt="" src={FemaleBox} /> Female
              </p>
            </div>
            <RadialProgressBar />
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <h6 className="mt-2">Age Based</h6>

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
          <Col span={11} style={{ marginLeft: '20px' }}>
            <h6 className="invisible">Age Based</h6>

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

export default EmploymentTurnover;
