import { Card, Pagination, Radio, Form, Button, Row, Col } from 'antd';
import React, { useState } from 'react';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import Styles from './Assessement.module.scss';
import { useDispatch } from 'react-redux';
import { setAssessmentType } from '../../Redux/Actions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MaturityAssessment from './MaturityAssessment';

export default function Assessment({ questions }: any) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const pageSize = 5;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentQuestions = questions.slice(startIndex, endIndex);
  const dispatch = useDispatch();
  const totalPages = Math.ceil(questions.length / pageSize);
  const assessmentType = useSelector((state: any) => state.assessmentType);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const qstnStyle = {
    fontSize: '18px',
    fontFamily: 'Rubik',
    fontWeight: '500',
    margin: '20px 0',
  };

  const handleRadioChange = (question: string, value: string) => {
    setAnswers({ ...answers, [question]: value });
  };

  const handleNextButtonClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevButtonClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = () => {
    navigate('/assessment-end');
    setAnswers({});
    setTimeout(() => {
      setCurrentPage(1);
    }, 2000);
  };

  const handleRadioChange1 = (e: any) => {
    setCurrentPage(1);
    dispatch(setAssessmentType(e.target.value));
  };

  const handleClearAllButton = () => {};
  return (
    <>
      {' '}
      <h4 className={Styles.title}>ESG Maturity Assessment</h4>
      <Card className="p-1 pb-5">
        {/* <Row gutter={[0, 20]}>
          <Col lg={16} md={24}>
            {" "}
            <Radio.Group onChange={handleRadioChange1} value={assessmentType}>
              <Radio value="Environment">Environment</Radio>
              <Radio value="Social">Social</Radio>
              <Radio value="Governance">Governance</Radio>
            </Radio.Group>
          </Col>
          <Col lg={8} md={24} className={Styles.questionsSummaryCol}>
            <div className="d-flex justify-content-end">
              <span> Total Questions: 12</span>
              <span style={{ marginLeft: "20px" }}>
                {" "}
                Answered Questions: 06
              </span>
            </div>
          </Col>
          <Col span={10} className={Styles.qstnDetails}></Col>
        </Row>
        <h4 className="mt-3 c-00338d titletag">{assessmentType}</h4>
        <Form>
          {currentQuestions.map((question: any) => (
            <div key={question.id} style={{ padding: "10px 0" }}>
              <Row justify="space-between" align="middle">
                <Col span={20}>
                  <p style={qstnStyle}>{question.text}</p>
                </Col>
                <Col span={4}>
                  <Form.Item name={question.id}>
                    <Radio.Group
                      onChange={(e) =>
                        handleRadioChange(question.text, e.target.value)
                      }
                    >
                      {question.options.map(
                        (option: string, optionIndex: number) => (
                          <Radio key={optionIndex} value={option}>
                            {option}
                          </Radio>
                        )
                      )}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              className="clearall"
              onClick={handleClearAllButton}
            >
              Clear All
            </Button>
            {currentPage < totalPages ? (
              <Button
                type="primary"
                onClick={handleNextButtonClick}
                className="save-next"
              >
                Save & Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSubmit()}
                className="save-next"
              >
                Submit
              </Button>
            )}
          </Form.Item>
        </Form>
        <Pagination
          current={currentPage}
          total={questions.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showLessItems
          prevIcon={<CaretLeftOutlined style={{ fontSize: "25px" }} />}
          nextIcon={<CaretRightOutlined style={{ fontSize: "25px" }} />}
        /> */}
        <MaturityAssessment question={questions} />
      </Card>
    </>
  );
}
