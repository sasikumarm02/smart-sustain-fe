import { Button, Card, Col, Image, Row } from 'antd';
import React from 'react';
import endTestImg from '../../assets/Svg/endAssessment.svg';
import Styles from './Assessement.module.scss';
import { useNavigate } from 'react-router-dom';

import AssessmentScore from './AssessmentScore';

export default function AssessmentEnd() {
  const navigate = useNavigate();
  return (
    <div>
      {/* <h4 className={Styles.title}>ESG Maturity Assessment</h4>
      <Card className="pb-4 pt-4">
        <Row gutter={24} justify={"center"} className="mb-4">
          <Col span={24} className="d-flex justify-content-center">
            <Image loading="lazy" src={endTestImg} preview={false} width={300} />
          </Col>
          <Col span={22}>
            <h4 className={Styles.title} style={{ textAlign: "center" }}>
              Your maturity assessment has been submitted successfully.
              <br />
              Your assessment report is generating.
            </h4>
          </Col>
          <Col span={24} className="d-flex justify-content-center">
            <Button
              className={Styles.startTestBtn}
              onClick={() => navigate("/assessment-report")}
            >
              View Report
            </Button>
          </Col>
        </Row>
      </Card> */}
      {/* <AssessmentLevel /> */}
      {/* <MaturityReport /> */}
      <AssessmentScore />
    </div>
  );
}
