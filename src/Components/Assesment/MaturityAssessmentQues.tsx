import { useEffect, useState } from 'react';
import Styles from './Assessement.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { Row, Col, Select, Switch, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/Svg/EditIcon';
import { get } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

function MaturityAssessmentQues() {
  const navigate = useNavigate();
  const { Option } = Select;

  const [maturityData, setMaturityData] = useState<any>({});
  const [selectedPillar, setSelectedPillar] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSubTopic, setSelectedSubTopics] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [subTopics, setSubTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  const [activityStatus, setActivityStatus] = useState<boolean>(false);

  const fetchMaturityData = async (pillar = '', topic = '', sub_topic = '') => {
    try {
      let urlwithparam = `/maturityAssessment/get_maturity_questionnare/?`;
      if (pillar !== '' && topic !== '' && sub_topic !== '') {
        urlwithparam += `pillar=${pillar}&topic=${topic}&sub_topic=${sub_topic}`;
      } else {
        if (pillar !== '') {
          urlwithparam += `pillar=${pillar}`;
        }
        if (topic !== '') {
          urlwithparam +=
            (urlwithparam.endsWith('?') ? '' : '&') + `topic=${topic}`;
        }
        if (sub_topic !== '') {
          urlwithparam +=
            (urlwithparam.endsWith('?') ? '' : '&') + `sub_topic=${sub_topic}`;
        }
      }
      const resData = await get(urlwithparam);
      if (!isEmpty(resData)) {
        setMaturityData(resData);
      }
      !isEmpty(resData?.response?.topics) &&
        setTopics(resData?.response?.topics || []);
      !isEmpty(resData?.response?.sub_topics) &&
        setSubTopics(resData?.response?.sub_topics || []);

      const questionsData = resData?.response?.questions || [];

      !isEmpty(questionsData) && setQuestions(questionsData);

      // Set activity status based on the first question's activity status
      if (!isEmpty(questionsData) && questionsData.length > 0) {
        setActivityStatus(questionsData[0]?.activity_status === 'Active');
      }
    } catch (error) {
      if (!isEmpty(error)) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(selectedPillar) && selectedPillar) {
      fetchMaturityData(selectedPillar, selectedTopic, selectedSubTopic);
    }
  }, [selectedPillar, selectedTopic, selectedSubTopic]);

  const handlePillarChange = (value: string) => {
    setSelectedPillar(value);
    setSelectedTopic('');
    setSelectedSubTopics('');
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    setSelectedSubTopics('');
  };

  const handleSubTopicChange = (value: string) => {
    setSelectedSubTopics(value);
  };

  const handleEditClick = (questionItem: any) => {
    navigate('/maturity-questionnaire-edit', {
      state: {
        pillar: selectedPillar,
        topic: questionItem.topic,
        subTopic: questionItem.sub_topic,
        questionId: questionItem.question_id,
        question: questionItem.question,
        score: questionItem.weightage,
        options: questionItem.options,
        recommendations: questionItem.recommendations,
        activityStatus: questionItem.activity_status,
      },
    });
  };

  const handleReset = () => {
    setSelectedPillar('');
    setSelectedTopic('');
    setSelectedSubTopics('');
    setQuestions([]);
  };

  const handleSwitchChange = (checked: boolean, questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.question_id === questionId
          ? { ...question, activity_status: checked ? 'Active' : 'Inactive' }
          : question
      )
    );
  };

  const columns = [
    {
      title: 'Question Code',
      dataIndex: 'question_id',
      key: 'question_id',
    },
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Score',
      key: 'score',
      render: (text: any, questionItem: any) => (
        <Input
          className={Styles.inputNumber}
          value={questionItem?.weightage}
          readOnly
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, questionItem: any) => (
        // <img
        //   src={EditIcon}
        //   className={Styles.editIcon3}
        //   onClick={() => handleEditClick(questionItem)}
        // ></img>
        <EditIcon
          className={Styles.editIcon3}
          onClick={() => handleEditClick(questionItem)}
        />
      ),
    },
    {
      title: 'Active / Inactive',
      key: 'activity_status',
      render: (text: any, questionItem: any) => (
        <Switch
          className={`${questionItem.activity_status === 'Active' ? Styles.greenSwitch : ''}`}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={questionItem.activity_status === 'Active'}
          onChange={(checked) =>
            handleSwitchChange(checked, questionItem.question_id)
          }
        />
      ),
    },
  ];

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row className={Styles.headRowNew}>
          <p className={Styles.headingQues}>Manage Questions</p>
          <ButtonComponent
            hierarchy="secondary-gray"
            size="xl"
            onClick={() => navigate('/maturity-questionnaire-edit')}
          >
            <span>Add Question +</span>
          </ButtonComponent>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <p className={Styles.quesHeading}>Pillar</p>
            <Select
              style={{ width: '100%', height: '50px' }}
              onChange={handlePillarChange}
              value={selectedPillar}
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
              value={selectedTopic}
              onChange={handleTopicChange}
            >
              {!isEmpty(topics) &&
                topics.map((topic) => (
                  <Option key={topic} value={topic}>
                    {topic}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={8}>
            <p className={Styles.quesHeading}>Sub Topic</p>
            <Select
              style={{ width: '100%', height: '50px' }}
              value={selectedSubTopic}
              onChange={handleSubTopicChange}
            >
              {!isEmpty(subTopics) &&
                subTopics.map((subtopic) => (
                  <Option key={subtopic} value={subtopic}>
                    {subtopic}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>

        <Row>
          <p className={Styles.quesHeading}>Questions</p>
        </Row>
        <Row>
          <TableComponent
            data={questions.map((item: any, index: any) => ({
              ...item,
              uniqueId: index,
            }))}
            columnHeader={columns}
            enableRowSelection={false}
          />
        </Row>

        <Row justify="end" className={Styles.resetRow}>
          <ButtonComponent hierarchy="tertiary" size="xl" onClick={handleReset}>
            Reset
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default MaturityAssessmentQues;
