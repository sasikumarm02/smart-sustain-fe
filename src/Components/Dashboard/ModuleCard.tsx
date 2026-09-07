import React from 'react';
import { Button, Card, Image } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { Flex, Progress } from 'antd';
import ProgressBar from 'react-bootstrap/ProgressBar';
import styles from './Dashboard.module.scss';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';

export default function ModuleCard({
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
  const navigate = useNavigate();
  return (
    <div className="mt-4 mb-4">
      <Card style={{ borderRadius: '14px', ...style }}>
        <Row className="mb-2">
          <Col xl="8" lg="8">
            <p className={styles.title}>{title}</p>
          </Col>
          <Col xl="4" lg="8">
            <button
              // size="small"
              className={styles.buttonClass}
              onClick={() => navigate('/dashboard/details')}
              style={{ width: '100%' }}
            >
              {buttonLabel}
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className={styles.actualTitle}>Actual</span>
            <h4 className={styles.actualvalue}>{actualValue}</h4>
          </Col>
          <Col className="d-flex justify-content-end">
            <Image loading="lazy" src={img} preview={false} />
          </Col>
        </Row>
        <Row className="mt-2 mb-2">
          <Col>
            <Flex vertical gap="small" style={{ width: '100%' }}>
              <ProgressBar
                style={{
                  height: '30px',
                  borderRadius: '30px',
                  border: '1px dashed #00338D',
                }}
              >
                <ProgressBar
                  style={{
                    background: progressBarColor1,
                    borderRadius: '20px',
                  }}
                  now={progressBarValue1Percent}
                  key={1}
                  label={`${actualValue}`}
                >
                  <div>
                    <small>{progressBarValue1}</small>
                  </div>
                </ProgressBar>
                <div
                  style={{
                    display: 'block',
                    position: 'absolute',
                    bottom: '45px',
                    right: '13vh',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#269924',
                      fontWeight: '600',
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

                <div className={styles.before}></div>
              </ProgressBar>
            </Flex>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
