import React, { useEffect, useState } from 'react';
import Styles from './Assessement.module.scss';
import {
  useNavigate,
  UNSAFE_NavigationContext,
  useBeforeUnload,
  unstable_usePrompt,
  useBlocker,
  useLocation,
} from 'react-router-dom';
import { UseDispatch } from 'react-redux';
import { setAssessmentComplete, setModal } from '../../Redux/Actions';
import {
  Row,
  Col,
  Progress,
  Flex,
  Card,
  Form,
  Radio,
  Space,
  Button,
  Image,
} from 'antd';
import socialQuestionarePageImage from '../../assets/Svg/Assessment/socQuestionare.png';
import governanceQuestionarePageImage from '../../assets/Svg/Assessment/govQuestionare.png';
import environmentQuestionarePageImage from '../../assets/Svg/Assessment/envQuestionare.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { post } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { isEmpty } from '../../Utils/isEmpty';
import { object } from 'yup';
import CustomModal from '../content/CustomModal';
import ModalComponent from '../../DesignLibrary/ModalComponent';

const circleStyle = {
  height: '10px',
  width: '10px',
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 3px',
};
const images: { [key: string]: string } = {
  Governance: governanceQuestionarePageImage,
  Social: socialQuestionarePageImage,
  Environment: environmentQuestionarePageImage,
};

interface payload {
  question_Id: string;
  answer_level: string;
}

export default function MaturityAssessment({ questions, draft }: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string | null }>({});
  const [requestBoady, setRequestBody] = useState<payload[]>([]);
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const ModalOpen = useSelector(
    (state: any) => state.maturityAssessmentModal.isOpen
  );
  const NextRoute = useSelector(
    (state: any) => state.maturityAssessmentModal.nextRoute
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const cancelNavigation = () => {
    dispatch(
      setModal({
        isOpen: false,
        nextRoute: '',
      })
    );
    navigate(NextRoute);
  };

  const confirmNavigation = async () => {
    try {
      dispatch(
        setModal({
          isOpen: false,
          nextRoute: '',
        })
      );
      handleSaveAsDraft(false);
    } catch (err) {
      console.error(err);
    }
  };
  const optionsMap = {
    L0: 'L0-Absent',
    L1: 'L1-Aware',
    L2: 'L2-Advance',
    L3: 'L3-Adept',
    L4: 'L4-Adaptive',
  };

  const handleSubmit = () => {
    try {
      handleSaveChange('submit');
    } catch (err) {
    } finally {
      navigate('/assessment-level');
      dispatch(setAssessmentComplete(assessmentType));
    }
  };

  const handleSaveAsSubmit = () => {
    try {
      const question =
        `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}` || '';
      const answer =
        answers[
          `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}`
        ] || '';

      post(`maturityAssessment/maturity_answer/`, {
        entity_Id: user.entity_Id,
        answer:
          question && answer
            ? [...requestBoady, { question_Id: question, answer_level: answer }]
            : requestBoady,
        isAnswered: 'true',
      })
        .then((res: any) => {})
        .catch((err) => {})
        .finally(() => {
          navigate('/assessment-level');
          dispatch(setAssessmentComplete(assessmentType));
        });
    } catch (error) {}
  };

  const handleSaveAsDraft = (navigateOption: boolean) => {
    try {
      const question =
        `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}` || '';
      const answer =
        answers[
          `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}`
        ] || '';

      post(`maturityAssessment/maturity_answer/`, {
        entity_Id: user.entity_Id,
        answer:
          question && answer
            ? [...requestBoady, { question_Id: question, answer_level: answer }]
            : requestBoady,
        isAnswered: 'false',
      })
        .then((res: any) => {})
        .catch((err) => {})
        .finally(() => {
          navigateOption === true
            ? navigate('/assessment-level')
            : navigate(NextRoute);
          dispatch(setAssessmentComplete(assessmentType));
        });
    } catch (error) {}
  };

  const handleSaveChange = (type: string) => {
    if (
      `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}` in
        answers ===
      true
    ) {
      setLoading(true);
      if (!isEmpty(questions) && questions?.length >= currentQuestion + 1) {
        setCurrentQuestion(currentQuestion + 1);
        try {
          const question =
            `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}` ||
            '';
          const answer =
            answers[
              `${questions[currentQuestion]?.Q_id[0]}${currentQuestion + 1}`
            ] || '';
          if (question !== null && answer !== null) {
            setRequestBody([
              ...requestBoady,
              { question_Id: question, answer_level: answer },
            ]);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
        setSelectedOption(null);
      } else {
        setCurrentQuestion(0);
      }
    } else {
    }
  };

  const handleRadioChange = (question: string, value: string) => {
    setSelectedOption(value);

    setAnswers({ ...answers, [question]: value });
  };

  function getObjectSize(obj: any) {
    let count = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        count++;
      }
    }
    return count;
  }

  const handleCurrentQstn = (index: any) => {
    setCurrentQuestion(index);
  };

  useEffect(() => {
    if (draft && !isEmpty(draft)) {
      const draftData = draft.reduce((acc: any, item: any) => {
        const key = item?.question_id;
        acc[key] = item?.answer;
        return acc;
      }, {});

      const preRequestBody = draft?.map((ele: any, idx: number) => {
        return {
          question_Id: ele?.question_id,
          answer_level: ele?.answer,
        };
      });
      setAnswers({ ...draftData, ...answers });
      setRequestBody([...preRequestBody]);
    }
  }, [draft]);

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Flex align="middle" justify="space-between">
              <div
                className="c-0D304A titletag"
                style={{ fontFamily: 'Arial' }}
              >{`${assessmentType} Goals`}</div>
              <div className={Styles.ass_count}>
                {currentQuestion + 1}/{questions?.length}
              </div>
            </Flex>
            <Progress
              percent={((currentQuestion + 1) / questions?.length) * 100}
              showInfo={false}
              strokeColor={'#0D304A'}
              style={{ marginBottom: 0 }}
            />
          </Col>
          <Col span={24}>
            <Card style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <Form>
                    {!isEmpty(questions) &&
                      !isEmpty(answers) &&
                      questions?.map((data: any, index: number) => (
                        <div key={index}>
                          {currentQuestion === index && (
                            <>
                              <div className={` mt-2 ${Styles.questionHeader}`}>
                                {data?.Q_id + '.'} {'  '}
                                {data?.text}
                              </div>
                              <Form.Item className="mt-2" name={data.id}>
                                <Radio.Group
                                  defaultValue={
                                    answers[data?.Q_id]
                                      ? answers[data?.Q_id]
                                      : ''
                                  }
                                  onChange={(e) =>
                                    handleRadioChange(data.Q_id, e.target.value)
                                  }
                                >
                                  <Space direction="vertical" className="mt-2">
                                    {Object.entries(data?.options).map(
                                      ([key, value]: [any, any]) => (
                                        <Radio
                                          value={key}
                                          className={Styles.radioSpace}
                                        >
                                          {value}
                                        </Radio>
                                      )
                                    )}
                                  </Space>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          )}
                        </div>
                      ))}
                    {!isEmpty(questions) &&
                      isEmpty(answers) &&
                      questions?.map((data: any, index: number) => (
                        <div key={index}>
                          {currentQuestion === index && (
                            <>
                              <div className={` mt-2 ${Styles.questionHeader}`}>
                                {data?.Q_id + '.'} {'  '}
                                {data?.text}
                              </div>
                              <Form.Item className="mt-2" name={data.id}>
                                <Radio.Group
                                  onChange={(e) =>
                                    handleRadioChange(data.Q_id, e.target.value)
                                  }
                                >
                                  <Space direction="vertical" className="mt-2">
                                    {Object.entries(data?.options).map(
                                      ([key, value]: [any, any]) => (
                                        <Radio
                                          value={key}
                                          className={Styles.radioSpace}
                                        >
                                          {value}
                                        </Radio>
                                      )
                                    )}
                                  </Space>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          )}
                        </div>
                      ))}
                  </Form>
                </Col>
                <Col span={1}>
                  <div
                    style={{ borderRight: '1px solid #d9d9d9', height: '100%' }}
                  ></div>
                </Col>
                <Col span={7}>
                  <div style={{ minHeight: '30%' }}>
                    <div
                      className={Styles.commentBoxTitle}
                      style={{ marginBottom: '20px', marginTop: '20px' }}
                    >
                      Assessment Status
                    </div>
                    <Row gutter={[10, 10]}>
                      {!isEmpty(questions) &&
                        questions?.map((data: any, index: number) => (
                          <Col
                            span={8}
                            key={index}
                            className="d-flex justify-content-center"
                          >
                            <p
                              className={`${
                                Styles[
                                  index === currentQuestion &&
                                  (!answers[data?.Q_id] ||
                                    answers[data?.Q_id] === 'null')
                                    ? 'question_no_style'
                                    : index === currentQuestion &&
                                        answers[data?.Q_id] &&
                                        answers[data?.Q_id] !== 'null'
                                      ? 'attemptedQstn'
                                      : answers[data?.Q_id] &&
                                          answers[data?.Q_id] !== 'null'
                                        ? 'attemptedQstn'
                                        : answers[data?.Q_id] === undefined
                                          ? 'unAttemptedQstn'
                                          : 'unAttemptedQstn'
                                ]
                              }
                    m-0 ${Styles.question_no}
                    `}
                              style={
                                !answers[data?.Q_id] ||
                                answers[data?.Q_id] === 'null'
                                  ? { width: '100px', height: '50px' }
                                  : {}
                              }
                              onClick={() => handleCurrentQstn(index)}
                            >
                              {data?.Q_id}
                            </p>
                          </Col>
                        ))}
                    </Row>
                    <Row
                      style={{ marginTop: '5vh' }}
                      justify="space-between"
                      align="middle"
                    >
                      {[
                        {
                          text: 'Attempted',
                          color: '#4B785A',
                          bg: '#4B785A',
                        },
                        {
                          text: 'Not Attempted',
                          color: '#A1A1A1',
                          bg: '#A1A1A1',
                        },
                        {
                          text: 'Current Question',
                          color: '#4B785A',
                          bg: 'transparent',
                        },
                      ].map((data: any, index: number) => (
                        <Col key={index} className={Styles.qstnStatus}>
                          <div
                            className={`${Styles.circleStyle} circle`}
                            style={{
                              border: `1px solid ${data.color}`,
                              background: `${data.bg}`,
                            }}
                          ></div>
                          <span className={Styles.circleSuffix}>
                            {data.text}
                          </span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row align="middle" gutter={12}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24} className="mt-2">
            <Flex align="middle" justify="end" className="mt-2">
              <Space>
                {/* {currentQuestion + 1 !== questions?.length && (
                <Button
                  className="form_reset mx-2"
                  onClick={() => handleSkip()}
                >
                  Skip
                </Button>
              )} */}
                {currentQuestion + 1 === questions?.length && (
                  <ButtonComponent
                    disabled={getObjectSize(answers) <= 0 ? true : false}
                    onClick={() => handleSaveAsDraft(true)}
                    loading={loading}
                  >
                    Save as Draft
                  </ButtonComponent>
                )}
                {currentQuestion + 1 !== questions?.length && (
                  <ButtonComponent
                    loading={loading}
                    disabled={
                      !(
                        `${questions[currentQuestion]?.Q_id[0]}${
                          currentQuestion + 1
                        }` in answers
                      )
                        ? true
                        : false
                    }
                    onClick={() => handleSaveChange('submit')}
                  >
                    Save & Next
                  </ButtonComponent>
                )}
                {/* {!(`${questions[currentQuestion]?.Q_id[0]}${currentQuestion+1}` in answers)  &&
                  currentQuestion + 1 !== questions?.length && (
                    <Button
                      htmlType="submit"
                      className="form_submit"
                      onClick={handleSubmit}
                    >
                      Save as Draft
                    </Button>
                  )} */}
                {/* {!(
                  `${questions[currentQuestion]?.Q_id[0]}${
                    currentQuestion + 1
                  }` in answers
                ) &&
                  currentQuestion + 1 === questions?.length && (
                    <Button
                      htmlType="submit"
                      className="form_submit"
                      onClick={handleSubmit}
                    >
                      Skip & Submit
                    </Button>
                  )} */}
                {currentQuestion + 1 === questions?.length && (
                  <ButtonComponent
                    disabled={
                      getObjectSize(answers) !== questions?.length
                        ? true
                        : false
                    }
                    onClick={() => handleSaveAsSubmit()}
                  >
                    Submit
                  </ButtonComponent>
                )}
              </Space>
            </Flex>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} className="mt-2">
            <Row>
              <Col></Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[20, 20]} className="mt-4"></Row>
      </PageCardComponent>
      <ModalComponent
        isOpen={ModalOpen}
        centered
        content={
          'You are leaving this assessment in between. Do you want to save this as a draft?'
        }
        onCancel={() =>
          dispatch(
            setModal({
              isOpen: false,
              nextRoute: '',
            })
          )
        }
        onProceed={() => confirmNavigation()}
        onClose={() => {
          cancelNavigation();
        }}
      ></ModalComponent>
    </>
  );
}
