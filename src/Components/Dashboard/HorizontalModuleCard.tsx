import React from 'react';
import { Button, Card, Image } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { Flex, Progress } from 'antd';
import ProgressBar from 'react-bootstrap/ProgressBar';
import styles from './Dashboard.module.scss';

export default function HorizontalModuleCard({
  style,
  title,
  buttonLabel,
  actualValue,
  progressBarColor1,
  progressBarColor2,
  progressBarBorderColor,
  progressBarValue1,
  progressBarValue1Percent,
  progressBarValue2Percent,
  progressBarValue2,
  img,
}: any) {
  return (
    <div className="mt-4 mb-4">
      <Card style={{ borderRadius: '14px', ...style }}>
        <Row className="mt-2 mb-2">
          <Col className="col-lg-2 col-md-3 col-sm-3">
            {' '}
            <Image loading="lazy" src={img} preview={false} />
          </Col>
          <Col>
            <div style={{ borderRight: '2px solid #C4C4C4' }}>
              <p className={styles.titleHorizontal}>{title}</p>
              <p className={styles.actualTitleHorizontal}>Actual</p>
              <div>
                {/* <span className={styles.actualTitle1}>Actual</span> */}
                <h4 className={styles.actualvalueHorizontal}>{actualValue}</h4>
              </div>
            </div>
          </Col>

          <Col className="d-flex align-items-center">
            <Flex vertical gap="small" style={{ width: '100%' }}>
              <ProgressBar
                style={{
                  height: '45px',
                  borderRadius: '30px',
                  // border: "1px solid #00338D",
                }}
              >
                <ProgressBar
                  style={{
                    background: progressBarColor1,
                    borderRadius: '30px',
                  }}
                  now={progressBarValue1Percent}
                  key={1}
                  label={`${actualValue}`}
                >
                  {' '}
                  <div>
                    <small>{progressBarValue1}</small>
                  </div>
                </ProgressBar>
                <div
                  style={{
                    display: 'block',
                    position: 'absolute',
                    bottom: '12vh',
                    right: '13vh',
                  }}
                >
                  <p
                    style={{
                      fontSize: '19px',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontFamily: 'Arial',
                    }}
                  >
                    {progressBarValue2}
                  </p>
                </div>
                <ProgressBar
                  style={{
                    background: progressBarColor2,
                    borderRight: `2px dashed ${progressBarBorderColor}`,
                    position: 'relative',
                  }}
                  now={progressBarValue2Percent}
                  key={2}
                  // label={progressBarValue2}
                />

                <span className={styles.before}></span>
              </ProgressBar>
            </Flex>
          </Col>
        </Row>
      </Card>
      <Col></Col>
    </div>
  );
}
