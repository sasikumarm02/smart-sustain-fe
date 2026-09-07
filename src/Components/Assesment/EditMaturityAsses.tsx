import React, { useState, useEffect } from 'react';
import Styles from './Assessement.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TabsComponent,
} from '../../DesignLibrary';
import { Row, Col, Select, Input, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, post, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

function EditMaturityAsses() {
  const location = useLocation();
  const { Option } = Select;
  const navigate = useNavigate();
  const {
    pillar,
    topic,
    questionId,
    subTopic,
    question,
    score,
    options,
    recommendations,
    activityStatus,
  } = location.state || {};

  const initialFormValues = {
    pillar: pillar || '',
    topic: topic || '',
    subTopic: subTopic || '',
    questionId: questionId || '',
    question: question || '',
    score: score || '',
    options: options || {},
    recommendations: recommendations || {},
    activityStatus: activityStatus || false,
  };

  const [activeTabOne, setActiveTabOne] = useState('L0');
  const [activeTabTwo, setActiveTabTwo] = useState('L1');
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (location.state) {
      setFormValues(initialFormValues);
    }
  }, [location.state]);

  const tabDataOne = [
    { tab: 'L0 - Absent', key: 'L0' },
    { tab: 'L1 - Aware', key: 'L1' },
    { tab: 'L2 - Advance', key: 'L2' },
    { tab: 'L3 - Adept', key: 'L3' },
    { tab: 'L4 - Adaptive', key: 'L4' },
  ];

  const tabDataTwo = [
    { tab: 'L1 - Aware', key: 'L1' },
    { tab: 'L2 - Advance', key: 'L2' },
    { tab: 'L3 - Adept', key: 'L3' },
    { tab: 'L4 - Adaptive', key: 'L4' },
  ];

  useEffect(() => {
    const areAllFieldsFilled = () => {
      return (
        formValues.pillar &&
        formValues.topic &&
        formValues.subTopic &&
        formValues.question &&
        formValues.score &&
        formValues.options.L0 &&
        formValues.options.L1 &&
        formValues.options.L2 &&
        formValues.options.L3 &&
        formValues.options.L4 &&
        formValues.recommendations.L1 &&
        formValues.recommendations.L2 &&
        formValues.recommendations.L3 &&
        formValues.recommendations.L4
      );
    };

    setIsSaveDisabled(!areAllFieldsFilled());
  }, [formValues]);

  const [topicsoptions, setTopicsOptions] = useState([]);

  const handleGetOptions = () => {
    const path = '/maturityAssessment/get_topics_dropdown/';

    get(`${path}`)
      .then((res) => {
        if (!isEmpty(res?.response?.topics))
          setTopicsOptions(res?.response?.topics);
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };
  useEffect(() => {
    handleGetOptions();
  }, []);

  const handleTabChangeOne = (key: string) => {
    setActiveTabOne(key);
  };

  const handleTabChangeTwo = (key: string) => {
    setActiveTabTwo(key);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;

    setFormValues({
      ...formValues,
      [field]: e.target.value,
    });
  };

  const handleTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    setFormValues({
      ...formValues,
      [field]: e.target.value,
    });
  };

  const handlePillarChange = (value: string) => {
    setFormValues({
      ...formValues,
      pillar: value,
    });
  };

  const handleTopicChange = (value: string) => {
    setFormValues({
      ...formValues,
      topic: value,
    });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      options: {
        ...formValues.options,
        [activeTabOne]: e.target.value,
      },
    });
  };

  const handleRecommendationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormValues({
      ...formValues,
      recommendations: {
        ...formValues.recommendations,
        [activeTabTwo]: e.target.value,
      },
    });
  };

  const handleSubmit = async () => {
    let payload = {
      question_id: formValues.questionId,
      topic: formValues.topic,
      sub_topic: formValues.subTopic,
      question: formValues.question,
      weightage: formValues.score,
      answers: {
        L0: formValues.options.L0 || '',
        L1: formValues.options.L1 || '',
        L2: formValues.options.L2 || '',
        L3: formValues.options.L3 || '',
        L4: formValues.options.L4 || '',
      },
      recommendations: {
        L1: formValues.recommendations.L1 || '',
        L2: formValues.recommendations.L2 || '',
        L3: formValues.recommendations.L3 || '',
        L4: formValues.recommendations.L4 || '',
      },
      activity_status: formValues.activityStatus,
    };

    try {
      const resData = await put(
        `/maturityAssessment/update_questions/`,
        payload
      );
      if (!isEmpty(resData)) {
        message.success(resData?.message);
        navigate(`/maturity-questionnaire`);
      }
    } catch (error) {
      if (!isEmpty(error)) {
        console.error('Error updating form:', error);
      }
    }
  };

  const handleSave = async () => {
    let payload = {
      pillar: formValues.pillar,
      topic: formValues.topic,
      sub_topic: formValues.subTopic,
      question: formValues.question,
      weightage: formValues.score,
      answers: {
        L0: formValues.options.L0 || '',
        L1: formValues.options.L1 || '',
        L2: formValues.options.L2 || '',
        L3: formValues.options.L3 || '',
        L4: formValues.options.L4 || '',
      },
      recommendations: {
        L1: formValues.recommendations.L1 || '',
        L2: formValues.recommendations.L2 || '',
        L3: formValues.recommendations.L3 || '',
        L4: formValues.recommendations.L4 || '',
      },
    };

    try {
      const resData = await post(
        `/maturityAssessment/create_maturity_question/`,
        payload
      );
      message.success(resData?.message);
      navigate(`/maturity-questionnaire`);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleReset = () => {
    setFormValues(initialFormValues);
    setActiveTabOne('L0');
    setActiveTabTwo('L1');
    setIsSaveDisabled(true);
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row>
          {formValues.questionId ? (
            <div className="pageTitle">Edit Question</div>
          ) : (
            <div className="pageTitle">Add Question</div>
          )}
        </Row>
        <Row gutter={16}>
          <Col span={8} className="selectInput">
            <p className={Styles.quesHeading}>Pillar</p>
            <Select
              style={{ width: '100%', height: '50px' }}
              value={formValues.pillar}
              onChange={handlePillarChange}
            >
              <Option value="Environment">Environment</Option>
              <Option value="Social">Social</Option>
              <Option value="Governance">Governance</Option>
            </Select>
          </Col>
          <Col span={8}>
            <p className={Styles.quesHeading}>Topic</p>
            <Select
              style={{ width: '100%', height: '50px' }}
              value={formValues.topic}
              onChange={handleTopicChange}
            >
              {topicsoptions.map((item) => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <p className={Styles.quesHeading}>Sub Topic</p>
            <Input
              className={Styles.fontFamily}
              style={{ width: '100%', height: '50px' }}
              value={formValues.subTopic}
              onChange={(e) => handleInputChange(e, 'subTopic')}
            />
          </Col>
        </Row>

        <Row justify="space-between" align="middle">
          <Col span={20}>
            <p className={Styles.quesHeading}>Questions</p>
            <TextArea
              className={Styles.fontFamily}
              value={formValues.question}
              onChange={(e) => handleTextAreaChange(e, 'question')}
            />
          </Col>
          <Col span={3} offset={1}>
            <p className={Styles.quesHeading}>Weightage</p>
            <Input
              type="number"
              className={Styles.inputEdit}
              value={formValues.score}
              onChange={(e) => handleInputChange(e, 'score')}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const { key } = e;
                // Prevent negative sign, decimal point, or leading zero.
                if (
                  key === '-' ||
                  key === '.' ||
                  (key === '0' && e.currentTarget.value === '') ||
                  e.key === 'e' ||
                  e.key === 'E'
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <p className={`${Styles.quesHeading} mb-4`}>Answer Responses</p>
            <TabsComponent
              tabs={tabDataOne}
              activeKey={activeTabOne}
              onChange={handleTabChangeOne}
            />
            <TextArea
              className={Styles.fontFamily}
              placeholder={`Response for ${tabDataOne.find((tab) => tab.key === activeTabOne)?.tab}`}
              value={formValues.options[activeTabOne] || ''}
              onChange={handleOptionsChange}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <p className={`${Styles.quesHeading} mb-4`}>Recommendations</p>
            <TabsComponent tabs={tabDataTwo} onChange={handleTabChangeTwo} />
            <TextArea
              className={Styles.fontFamily}
              placeholder={`Recommendations for ${tabDataTwo.find((tab) => tab.key === activeTabTwo)?.tab}`}
              value={formValues.recommendations[activeTabTwo] || ''}
              onChange={handleRecommendationsChange}
            />
          </Col>
        </Row>

        <Row className="mt-3" justify="end">
          {formValues.questionId ? (
            <ButtonComponent onClick={handleSubmit}>
              Save & Update
            </ButtonComponent>
          ) : (
            <>
              <ButtonComponent
                className="mx-3"
                hierarchy="tertiary"
                size="xl"
                onClick={handleReset}
              >
                Reset
              </ButtonComponent>
              <ButtonComponent onClick={handleSave} disabled={isSaveDisabled}>
                Save
              </ButtonComponent>
            </>
          )}
        </Row>
      </PageCardComponent>
    </>
  );
}

export default EditMaturityAsses;
