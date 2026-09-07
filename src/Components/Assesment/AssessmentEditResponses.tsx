import { useState } from 'react';
import Styles from './Assessement.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Radio, Space, message } from 'antd';
import { post, put } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { ButtonComponent } from '../../DesignLibrary';
import { isEmpty } from '../../Utils/isEmpty';

function AssessmentEditResponses() {
  const location = useLocation();
  const { pillar, questionId, question, score, options, answer, currentPage } =
    location.state || {};

  const [selectedOption, setSelectedOption] = useState<string | null>(score);

  const handleRadioChange = (question: string, value: string) => {
    setSelectedOption(value);
  };
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitQuestion = () => {
    put(`maturityAssessment/update_answer/`, {
      question_Id: questionId,
      entity_Id: user?.entity_Id,
      answer_level: selectedOption,
    })
      .then((res: any) => {
        message.success('Re-evaluated Successfully');
        navigate('/assessment-view-responses', {
          state: {
            active_tab: pillar,
            currentPageNum: currentPage,
          },
        });
      })
      .catch((err) => {})
      .finally(() => '');
  };
  return (
    <>
      <Card className="p-1 pb-5">
        <Row>
          <p className="c-00338d titletag" style={{ fontFamily: 'Arial' }}>
            {pillar} Goals
          </p>
        </Row>
        <Row>
          <Col span={24}>
            <Card style={{ height: '100%' }}>
              <Form>
                <div>
                  <>
                    <div className={` mt-2 ${Styles.questionHeader}`}>
                      {questionId + '.'} {'  '}
                      {question}
                    </div>
                    <Form.Item className="mt-2">
                      <Radio.Group
                        defaultValue={score ? score : ''}
                        onChange={(e) =>
                          handleRadioChange(questionId, e.target.value)
                        }
                      >
                        <Space direction="vertical" className="mt-2">
                          {Object.entries(options).map(
                            ([key, value]: [any, any]) => (
                              <Radio value={key} className={Styles.radioSpace}>
                                {value}
                              </Radio>
                            )
                          )}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row justify="end" className="mt-2">
          <ButtonComponent
            className="mx-3"
            onClick={() => {
              navigate('/assessment-view-responses');
            }}
            hierarchy="tertiary"
          >
            Back
          </ButtonComponent>
          <ButtonComponent
            onClick={() => handleSubmitQuestion()}
            hierarchy="primary"
          >
            Re-evaluate
          </ButtonComponent>
        </Row>
      </Card>
    </>
  );
}

export default AssessmentEditResponses;
