import React, { useEffect, useState } from 'react';
import Styles from './Assessement.module.scss';
import { useNavigate } from 'react-router-dom';
import { UseDispatch } from 'react-redux';
import { setAssessmentComplete, setReportModal } from '../../../Redux/Actions';
import { SendOutlined } from '@ant-design/icons';
import StylesB from './AssessmentStart.module.scss';
import {
  Row,
  Col,
  Progress,
  Flex,
  Card,
  Form,
  Space,
  Select,
  Input,
  Checkbox,
  Tabs,
  Button,
  message,
} from 'antd';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get, post, put } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
} from '../../../DesignLibrary';
import { isEmpty } from '../../../Utils/isEmpty';
import moment from 'moment';
import {
  formatAnswers,
  shouldHideButton,
} from '../../../Components/Emissions/Scope3/Helpers';

const { TextArea } = Input;
const { TabPane } = Tabs;
const mandatory = [
  'Disclosure Requirement',
  'Disclosure Requirement for Exemption',
  'Process Requirement',
];

export default function ISSBAssessment({
  questions,
  draft,
  SubmittedQuestion,
  domain,
  fixedValue,
}: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkboxChecked, setCheckboxChecked] = useState<any>(false);
  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [answers, setAnswers] = useState<{
    [key: string]: { [key: string]: any };
  }>({});
  const topBarBtn = ['Status', 'Comments'];
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const [activeBtn, setActiveBtn] = useState<any>('Status');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([]);

  const [getUploaded, setGetUploaded] = useState<any>([]);
  const [companyLink, setCompanyLink] = useState<any>([]);
  const [getAllUploadedData, setGetAllUploadedData] = useState<any>([]);
  const [isEditable, setIsEditable] = useState<number | null>(null);
  const [CommentedList, setCommentedList] = useState<any>();
  const [hasCommenteds, setHasCommenteds] = useState<boolean>(false);
  const [hasCommentsPerQuestion, setHasCommentsPerQuestion] = useState<{
    [key: number]: boolean;
  }>({});
  const [commentedQuestions, setCommentedQuestions] = useState<number[]>([]);
  const [attempQstnList, setAttempQstnList] = useState<any>([]);
  const ModalOpen = useSelector(
    (state: any) => state.ReportComplianceModal.isOpen
  );
  const handleSubmit = (type: string) => {
    try {
      handleSaveChange('submit');
      handleRevert(type);
    } catch (err) {
    } finally {
      navigate('/ISSB-Gap-Analysis-Results');
      dispatch(setAssessmentComplete(assessmentType));
    }
  };

  useEffect(() => {
    const getUploadedData = async () => {
      try {
        const res = await get(
          `/issb/get_issb_documents/?entity_Id=${user?.entity_Id}`
        );
        if (res.response?.files) {
          setGetUploaded(
            res.response.files.map((file: any) => ({
              name: file.file_name,
            }))
          );
        }
        setCompanyLink([{ name: res.response.company_link }]);
      } catch (err) {
        console.log(err);
      }
    };

    getUploadedData();
  }, []);

  useEffect(() => {
    setGetAllUploadedData([...getUploaded, ...companyLink]);
  }, [getUploaded, companyLink]);

  const handleModifyClick = (questionId: number) => {
    setIsEditable((prevState) =>
      prevState === questionId ? null : questionId
    );
  };

  const isAllFieldsFilled = () => {
    const questionId = questions[currentQuestion]?.Q_id;

    if (!answers[questionId]) {
      return false;
    }

    const requiredFields = [
      'evaluation',
      'analysis',
      'source',
      'location',
      'priority',
      'recommendation',
    ];
    return requiredFields.every((field) => !!answers[questionId]?.[field]);
  };

  const [isAnsweredList, setIsAnsweredList] = useState<any>([]);

  const handleSaveDraft = (questionId: any, currentQuestion: any) => {
    const answerData = answers[questionId] || {};
    const currentQuestionData = questions?.find(
      (q: any) => q.Q_id === questionId
    );
    const questionPrimaryId = currentQuestionData
      ? currentQuestionData.id
      : null;
    if (!answerData) {
      console.log('No answer data for this question.');
      return;
    }

    const isAcknowledged = mandatory?.includes(currentQuestionData?.options)
      ? false
      : checkboxChecked[questionId]?.checked || false;
    const newQuestion = {
      primary: questionPrimaryId,
      qstn_id: questionId,
      entity_Id: user.entity_Id,
      evaluation: answerData.evaluation || '',
      analysis: answerData.analysis || '',
      source: answerData.source || '',
      location: answerData.location || '',
      page_number: answerData.pageNo || '',
      priority_level: answerData.priority || '',
      recommendation: answerData.recommendation || '',
      is_acknowledged: answerData.is_acknowledged || isAcknowledged,
      draft_status: true,
      status:
        user.role === 'L1_DATA_REVIEWER'
          ? 'Submitted from reviewer'
          : user.role === 'L1_DATA_APPROVER'
            ? 'Submitted from approver'
            : user.role === 'DATA_PROVIDER'
              ? 'Submitted from provider'
              : 'Submitted',
    };

    setAttempQstnList((prevList: any) => [...prevList, newQuestion]);
    let data: any = [];
    data.push(...attempQstnList, newQuestion);

    const payload = data.reduce((acc: any, current: any) => {
      const existing = acc.find(
        (item: any) => item.primary === current.primary
      );
      if (!existing) {
        acc.push({ ...current, draft_status: true });
      } else {
      }
      return acc;
    }, []);

    setAttempQstnList(payload);
    post(`/issb/create_issb_data/`, payload)
      .then((res: any) => {
        console.log('Submitted successfully:', res);
      })
      .catch((err) => {
        console.log('Error in submission:', err);
      })
      .finally(() => {
        navigate('/issb-gap-assesment');
      });
  };

  const handleSubmitQuestion = (questionId: any, currentQuestion: any) => {
    const answerData = answers[questionId] || {};
    const currentQuestionData = questions?.find(
      (q: any) => q.Q_id === questionId
    );
    const questionPrimaryId = currentQuestionData
      ? currentQuestionData.id
      : null;
    if (!answerData) {
      console.log('No answer data for this question.');
      return;
    }

    const isAcknowledged = mandatory?.includes(currentQuestionData?.options)
      ? false
      : checkboxChecked[questionId]?.checked || false;
    const newQuestion = {
      primary: questionPrimaryId,
      qstn_id: questionId,
      entity_Id: user.entity_Id,
      evaluation: answerData.evaluation || '',
      analysis: answerData.analysis || '',
      source: answerData.source || '',
      location: answerData.location || '',
      page_number: answerData.pageNo || '',
      priority_level: answerData.priority || '',
      recommendation: answerData.recommendation || '',
      is_acknowledged: answerData.is_acknowledged || isAcknowledged,
      draft_status: false,
      status:
        user.role === 'L1_DATA_REVIEWER'
          ? 'Submitted from reviewer'
          : user.role === 'L1_DATA_APPROVER'
            ? 'Submitted from approver'
            : user.role === 'DATA_PROVIDER'
              ? 'Submitted from provider'
              : 'Submitted',
    };

    setAttempQstnList((prevList: any) => [...prevList, newQuestion]);
    let data: any = [];
    data.push(...attempQstnList, newQuestion);

    const payload = data.reduce((acc: any, current: any) => {
      const existing = acc.find(
        (item: any) => item.primary === current.primary
      );
      if (!existing) {
        acc.push({ ...current, draft_status: false });
      } else {
      }
      return acc;
    }, []);

    setAttempQstnList(payload);
    if (currentQuestion + 1 === questions?.length) {
      if (payload.length === questions?.length) {
        post(`/issb/create_issb_data/`, payload)
          .then((res: any) => {
            console.log('Submitted successfully:', res);
          })
          .catch((err) => {
            console.log('Error in submission:', err);
          });
      } else {
        message.warning('Please attempt all the questions');
      }
    } else {
    }
  };

  const checkAllQuestionsAttempted = (allqstns: any, attempted_qtsns: any) => {
    const allIds = allqstns.slice(0, -1).map((item: any) => item.Q_id);

    return allIds.every((id: any) =>
      attempted_qtsns.some((qstn: any) => qstn.qstn_id === id)
    );
  };

  const [allAttempted, setAllAttempted] = useState(false);

  useEffect(() => {
    setAllAttempted(checkAllQuestionsAttempted(questions, attempQstnList));
  }, [attempQstnList, currentQuestion]);

  const confirmNavigation = async () => {
    try {
      dispatch(
        setReportModal({
          isOpen: false,
          nextRoute: '',
        })
      );
      handleSaveChange('draft');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChange = (type: string) => {
    const questionId = `${questions[currentQuestion]?.Q_id}`;

    if (
      checkboxChecked[questionId]?.checked ||
      user.role === 'L1_DATA_APPROVER' ||
      user.role === 'L1_DATA_REVIEWER' ||
      (questionId in answers && isAllFieldsFilled()) ||
      answers[questions[currentQuestion]?.Q_id]?.is_acknowledged
    ) {
      setLoading(true);

      try {
        // Ensure current question gets marked as attempted
        setAttemptedQuestions((prev) => {
          const isAlreadyAttempted = prev?.includes(currentQuestion);
          if (!isAlreadyAttempted) {
            return [...prev, currentQuestion];
          }
          return prev;
        });

        setHasCommentsPerQuestion((prev) => ({
          ...prev,
          [currentQuestion]: false,
        }));

        if (type === 'submit') {
          handleSubmitQuestion(questionId, currentQuestion);
        } else {
          handleSaveDraft(questionId, currentQuestion);
        }

        // Move to the next question
        setSelectedOption(null);
        setCurrentQuestion(currentQuestion + 1);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Please fill all the required fields or check the checkbox.');
    }
  };

  const [onSubmitAnswers, setOnSubmitAnswers] = useState(
    formatAnswers(SubmittedQuestion || [])
  );

  const getSubmittedQuestion = (domain: any, fixedValue: any) => {
    get(
      `/issb/get_submitted_answers/?entity_Id=${user?.entity_Id}&topic=${domain}&sub_topic=${fixedValue}`
    )
      .then((res: any) => {
        const apiData = res?.response?.data;
        setOnSubmitAnswers(formatAnswers(apiData) || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSubmittedQuestion(domain, fixedValue);
  }, []);

  useEffect(() => {
    getSubmittedQuestion(domain, fixedValue);
  }, [currentQuestion]);

  const handleCurrentQstn = (index: any) => {
    setCurrentQuestion(index);
  };
  useEffect(() => {
    setCommentedList(
      SubmittedQuestion?.find(
        (item: any) =>
          item.question_reference === questions[currentQuestion]?.Q_id
      )?.comments_data
    );

    //getSubmittedQuestion(domain, fixedValue);
  }, [handleCurrentQstn]);

  const [currentQstnId, setCurrentQstnId] = useState('');

  const handleInputChange = (questionId: any, field: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value !== null ? value : '', // Replace null with an empty string
      },
    }));

    // If the question had comments, mark it as attempted when any input is changed
    if (hasCommenteds) {
      setAttemptedQuestions((prev) =>
        prev?.includes(currentQuestion) ? prev : [...prev, currentQuestion]
      );
    }
  };

  const handleRevert = async (type: string) => {
    const updates = questions.map((question: any) => {
      const questionId = question.Q_id;
      const comment = comments[questionId] || '';

      return {
        id:
          SubmittedQuestion?.find(
            (entry: any) => entry.question_reference === questionId
          )?.id || '',
        comments: comment,
        question_status: 'Commented',
      };
    });

    const data = {
      entity_role: user.role,
      status: type,
      updates: updates || [],
    };
    let successMessage = '';
    if (type === 'reverted from reviewer') {
      successMessage = 'Reverted to provider'; // When reverted from reviewer
    } else if (type === 'reverted from approver') {
      successMessage = 'Reverted to reviewer'; // When reverted from approver
    } else {
      successMessage = 'Status updated successfully'; // Default message if none of the above
    }
    try {
      const response = await put('/issb/issb_change_status/', data);
      navigate('/issb-gap-assesment');
      message.success(successMessage);
    } catch (error) {
      console.error('Error while reverting:', error);
    }
  };

  useEffect(() => {
    let qid = questions[currentQuestion]?.Q_id
      ? questions[currentQuestion]?.Q_id
      : questions[0]?.Q_id;

    if (Object.keys(onSubmitAnswers).length) {
      setIsQstnCheck((prevState: any) => ({
        ...prevState,
        [qid]: onSubmitAnswers[qid]?.is_acknowledged,
      }));
    }
    if (user.role === 'DATA_PROVIDER') {
      handleModifyClick(qid);
    }
  }, [onSubmitAnswers, checkboxChecked]);

  useEffect(() => {
    if (SubmittedQuestion && !isEmpty(SubmittedQuestion)) {
      const updatedAnswers = { ...answers };
      const attemptedQuestionsIndexes: number[] = [];
      const updatedHasComments: { [key: number]: boolean } = {};
      const testArray = [
        'Submitted from provider',
        'Submitted from approver',
        'Submitted from reviewer',
        'reverted from approver',
        'reverted from reviewer',
      ];

      SubmittedQuestion.forEach((submittedQuestion: any) => {
        const questionReference = submittedQuestion.question_reference;
        const questionIndex = questions.findIndex(
          (question: any) => question.Q_id === questionReference
        );

        if (questionIndex !== -1) {
          const questionId = questions[questionIndex].Q_id;

          updatedAnswers[questionId] = {
            evaluation: submittedQuestion.evaluation || '',
            analysis: submittedQuestion.analysis || '',
            source: submittedQuestion.source || '',
            location: submittedQuestion.location || '',
            pageNo: submittedQuestion.page_number || '',
            priority: submittedQuestion.priority_level || '',
            recommendation: submittedQuestion.recommendation || '',
            is_acknowledged: submittedQuestion.is_acknowledged || '',
            status: submittedQuestion.status,
          };

          updatedHasComments[questionIndex] = testArray?.includes(
            submittedQuestion.status
          );

          attemptedQuestionsIndexes.push(questionIndex);
        }
      });

      setAnswers(updatedAnswers);
      //setAttemptedQuestions((prev) => [...prev, ...attemptedQuestionsIndexes]);
      setHasCommentsPerQuestion(updatedHasComments);
    }
  }, [SubmittedQuestion, questions]);

  const onChange = (questionId: any, e: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {},
    }));
    setCheckboxChecked((prev: any) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        checked: e.target.checked,
      },
    }));
  };
  const [comments, setComments] = useState<{ [key: string]: any }>({});
  const [comment, setComment] = useState<string>('');

  const handleComments = (value: string) => {
    setComment(value);
  };

  const onHandleComment = (comment: string, questionIndex: number) => {
    const questionId = questions[questionIndex]?.Q_id;

    setComments((prevComments) => ({
      ...prevComments,
      [questionId]: prevComments[questionId]
        ? [...prevComments[questionId], comment]
        : [comment],
    }));

    // Mark this question as commented and apply redHighlight
    setCommentedQuestions((prev) => [...prev, questionIndex]);

    // Reset the comment input
    setComment('');
  };
  useEffect(() => {
    const submittedEntry = SubmittedQuestion?.find(
      (entry: any) =>
        entry.question_reference === questions[currentQuestion]?.Q_id
    );
    setHasCommenteds(
      submittedEntry?.comments_data && submittedEntry?.comments_data.length > 0
    );
  }, [SubmittedQuestion]);
  const commentsLogoConverter = (commentedBy: string) => {
    const data = commentedBy?.charAt(0) ? commentedBy?.charAt(0) : ' - ';
    return data;
  };

  const CurrentCommentedlIst = Object.entries(comments)?.map(
    ([questionId, value]) => {
      // Find the entry for the questionId in SubmittedQuestion
      const submittedEntry = SubmittedQuestion?.find(
        (entry: any) => entry.question_reference === questionId
      );

      return {
        id: submittedEntry?.id || '', // Safely access id if submittedEntry is defined
        comments: value || '', // Default to an empty string if value is undefined
        question_status: 'commented',
        entity_Roles: user.role,
        questionId: questionId,
      };
    }
  );

  const [ischecked, setIsChecked] = useState(false);
  const [isqstnCheck, setIsQstnCheck] = useState<any>({});

  const statusColorMapping: any = {
    'DP Submission': [
      {
        DATA_PROVIDER: '#f68d2e',
        L1_DATA_REVIEWER: 'grey',
        L1_DATA_APPROVER: 'grey',
      },
    ],
    'Submitted from provider': [
      {
        DATA_PROVIDER: '#098E7E', // Green
        L1_DATA_REVIEWER: '#f68d2e', //orange
        L1_DATA_APPROVER: 'grey', //grey
      },
    ],
    'Submitted from reviewer': [
      {
        DATA_PROVIDER: '#098E7E', // Green (Success)
        L1_DATA_REVIEWER: '#098E7E', // Green (Completed/Reviewed)
        L1_DATA_APPROVER: '#f68d2e', // Orange (Pending Approval)
      },
    ],
    'Submitted from approver': [
      {
        DATA_PROVIDER: '#098E7E', // Green (Success)
        L1_DATA_REVIEWER: '#098E7E', // Green (Completed/Reviewed)
        L1_DATA_APPROVER: '#098E7E', // Green (Approved)
      },
    ],
    'reverted from reviewer': [
      {
        DATA_PROVIDER: '#f68d2e', // Orange
        L1_DATA_REVIEWER: '#098E7E', //Green
        L1_DATA_APPROVER: 'grey',
      },
    ],
    'reverted from approver': [
      {
        DATA_PROVIDER: '#098E7E', // Green
        L1_DATA_REVIEWER: '#f68d2e', // Orange
        L1_DATA_APPROVER: '#f68d2e', // Green
      },
    ],
  };

  // Function to get the button color based on the role
  const getButtonColor = (status: any, comments: any, curQstnId: any) => {
    if (
      comments !== null &&
      comments?.length !== 0 &&
      status !== 'Submitted from approver'
    ) {
      return '#7a0202';
    } else {
      return statusColorMapping[status][0][user.role];
    }
  };

  const handleSaveChangeOncomment = (type: string) => {
    const questionId = `${questions[currentQuestion]?.Q_id}`;

    if (
      checkboxChecked[questionId]?.checked ||
      user.role === 'L1_DATA_APPROVER' ||
      user.role === 'L1_DATA_REVIEWER' ||
      (questionId in answers && isAllFieldsFilled()) ||
      answers[questions[currentQuestion]?.Q_id]?.is_acknowledged
    ) {
      setLoading(true);

      try {
        // Ensure current question gets marked as attempted
        setAttemptedQuestions((prev) => {
          const isAlreadyAttempted = prev?.includes(currentQuestion);
          if (!isAlreadyAttempted) {
            return [...prev, currentQuestion];
          }
          return prev;
        });

        setHasCommentsPerQuestion((prev) => ({
          ...prev,
          [currentQuestion]: false,
        }));

        if (type === 'submit') {
          if (questions.length === 1) {
            const answerData = answers[questionId] || {};
            const currentQuestionData = questions?.find(
              (q: any) => q.Q_id === questionId
            );
            const questionPrimaryId = currentQuestionData
              ? currentQuestionData.id
              : null;
            if (!answerData) {
              console.log('No answer data for this question.');
              return;
            }

            const isAcknowledged = mandatory?.includes(
              currentQuestionData?.options
            )
              ? false
              : checkboxChecked[questionId]?.checked || false;
            const newQuestion = {
              primary: questionPrimaryId,
              qstn_id: questionId,
              entity_Id: user.entity_Id,
              evaluation: answerData.evaluation || '',
              analysis: answerData.analysis || '',
              source: answerData.source || '',
              location: answerData.location || '',
              page_number: answerData.pageNo || '',
              priority_level: answerData.priority || '',
              recommendation: answerData.recommendation || '',
              is_acknowledged: answerData.is_acknowledged || isAcknowledged,
              draft_status: false,
              status:
                user.role === 'L1_DATA_REVIEWER'
                  ? 'Submitted from reviewer'
                  : user.role === 'L1_DATA_APPROVER'
                    ? 'Submitted from approver'
                    : user.role === 'DATA_PROVIDER'
                      ? 'Submitted from provider'
                      : 'Submitted',
            };

            setAttempQstnList((prevList: any) => [...prevList, newQuestion]);
            let data: any = [];
            data.push(...attempQstnList, newQuestion);

            const payload = data.reduce((acc: any, current: any) => {
              const existing = acc.find(
                (item: any) => item.primary === current.primary
              );
              if (!existing) {
                acc.push({ ...current, draft_status: false });
              } else {
              }
              return acc;
            }, []);

            setAttempQstnList(payload);
          } else {
            handleSubmitQuestion(questionId, currentQuestion);
          }
        }

        // Move to the next question
        setSelectedOption(null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Please fill all the required fields or check the checkbox.');
    }
  };

  const cancelNavigation = () => {
    dispatch(
      setReportModal({
        isOpen: false,
        nextRoute: '',
      })
    );
  };

  const allQidsPresent = questions.every((item: any) =>
    Object.keys(onSubmitAnswers).includes(item.Q_id)
  );

  const [activeTab, setActiveTab] = useState(topBarBtn[0]);

  return (
    <>
      <Row
        gutter={[12, 12]}
        className={`${Styles.container} ${Styles.pageCardStyle} ${Styles.pageCardCol} bg-white p-3 rounded-3 mb-3`}
      >
        <Col span={16} className="mb-3 form-issb-title">
          <div style={{ height: '100%' }}>
            <Col span={24} className="p-2">
              <Flex align="middle" justify="space-between">
                <div
                  className="c-0D304A titletag"
                  style={{ fontFamily: 'Arial' }}
                >{`${assessmentType} `}</div>
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
            <Form layout="vertical" className="p-2">
              {!isEmpty(questions) &&
                questions?.map((data: any, index: number) => (
                  <div key={index}>
                    {currentQuestion === index && (
                      <>
                        <div
                          className={`mt-2 ${Styles.questionHeader}`}
                          style={{
                            maxHeight: '130px',
                            overflowY: 'auto',
                            paddingRight: '10px',
                          }}
                        >
                          {/* Insert content before the mapped parts */}
                          <div className={`${Styles.questionText} pt-2`}>
                            {data?.Q_id + '.'}{' '}
                            {
                              data?.text?.split(
                                /(?=\(a\)|\(b\)|\(c\)|\(d\)|\(e\)|\(i\)|\(ii\)|\(iii\)|\(iv\)|\(v\))/
                              )[0]
                            }
                          </div>

                          {data?.text
                            .split(
                              /(?=\(a\)|\(b\)|\(c\)|\(1\)|\(2\)|\(3\)|\(4\)|\(5\)|\(6\)|\(7\)|\(8\)|\(9\)|\(10\)|\(d\)|\(e\)|\(f\)|\(g\)|\(h\)|\(j\)|\(i\)|\(ii\)|\(iii\)|\(iv\)|\(v\)|\(vi\)|\(vii\)|\(viii\)|\(ix\)|\(x\))/
                            )
                            .slice(1)
                            .map((part: any, index: any) => (
                              <div
                                className={`${Styles.questionText} pt-2`}
                                key={index}
                              >
                                {part}
                              </div>
                            ))}
                        </div>
                        <div className={Styles.OptionTextSty}>
                          {mandatory?.includes(data.options) ? (
                            <>
                              * This is mandatory for assessment as it is a
                              disclosure requirement.
                            </>
                          ) : (
                            <>
                              <div style={{ color: '#036323' }}>
                                <Checkbox
                                  onChange={(e) => {
                                    onChange(data.Q_id, e);
                                    setIsChecked(!ischecked);
                                    setIsQstnCheck((prevState: any) => ({
                                      ...prevState,
                                      [data.Q_id]: !prevState[data.Q_id], // Toggle the current checkbox state
                                    }));
                                    onSubmitAnswers[data.Q_id] &&
                                      (onSubmitAnswers[
                                        data.Q_id
                                      ].is_acknowledged =
                                        !onSubmitAnswers[data.Q_id]
                                          .is_acknowledged);
                                  }}
                                  disabled={
                                    shouldHideButton(
                                      user.role,
                                      answers[questions[currentQuestion]?.Q_id]
                                        ?.status
                                    ) ||
                                    user.role === 'L1_DATA_REVIEWER' ||
                                    user.role === 'L1_DATA_APPROVER'
                                  }
                                  style={{ marginRight: '10px' }}
                                  checked={(() => {
                                    const status =
                                      onSubmitAnswers[data?.Q_id]?.status;

                                    const isAcknowledged =
                                      onSubmitAnswers[data?.Q_id]
                                        ?.is_acknowledged ?? false;

                                    // if (!status) {
                                    //   return (
                                    //     checkboxChecked[data.Q_id]?.checked ||
                                    //     isAcknowledged
                                    //   );
                                    // }

                                    // if (user.role === 'DATA_PROVIDER') {
                                    //   if (
                                    //     status === 'Submitted from provider' ||
                                    //     status === 'Submitted from reviewer' ||
                                    //     status === 'Submitted from approver'
                                    //   ) {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked ||
                                    //       isAcknowledged
                                    //     );
                                    //   }
                                    //   if (status === 'reverted from reviewer') {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked &&
                                    //       isAcknowledged
                                    //     );
                                    //   }
                                    // }

                                    // if (user.role === 'L1_DATA_REVIEWER') {
                                    //   if (
                                    //     status === 'Submitted from reviewer' ||
                                    //     status === 'Submitted from approver'
                                    //   ) {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked ||
                                    //       isAcknowledged
                                    //     );
                                    //   }
                                    //   if (
                                    //     status === 'Submitted from provider' ||
                                    //     status === 'reverted from approver'
                                    //   ) {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked ||
                                    //       isAcknowledged
                                    //     );
                                    //   }
                                    // }

                                    // if (user.role === 'L1_DATA_APPROVER') {
                                    //   if (
                                    //     status === 'Submitted from approver'
                                    //   ) {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked ||
                                    //       isAcknowledged
                                    //     );
                                    //   }

                                    //   if (
                                    //     status === 'Submitted from reviewer'
                                    //   ) {
                                    //     return (
                                    //       checkboxChecked[data.Q_id]?.checked ||
                                    //       isAcknowledged
                                    //     );
                                    //   }
                                    // }

                                    return (
                                      checkboxChecked[data.Q_id]?.checked ||
                                      isAcknowledged
                                    );
                                  })()}
                                />
                                We have assessed that as this is not a
                                disclosure requirement in IFRS S1 and S2, no
                                further assessment is required.
                              </div>
                            </>
                          )}
                        </div>

                        <Row gutter={[35, 0]} justify="space-between">
                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Evaluation *'
                                  : 'Evaluation'
                              }
                            >
                              <Select
                                value={answers[data?.Q_id]?.evaluation || ''}
                                className={Styles.select50}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? onSubmitAnswers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      onSubmitAnswers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      onSubmitAnswers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    data.Q_id,
                                    'evaluation',
                                    value
                                  )
                                }
                              >
                                <Select.Option value="Not disclosure requirement">
                                  Not disclosure requirement
                                </Select.Option>
                                <Select.Option value="Requirement met">
                                  Requirement met
                                </Select.Option>
                                <Select.Option value="Requirement not met">
                                  Requirement not met
                                </Select.Option>
                                <Select.Option value="Requirement partially met">
                                  Requirement partially met
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Analysis *'
                                  : 'Analysis'
                              }
                            >
                              <TextArea
                                rows={1}
                                value={answers[data?.Q_id]?.analysis || ''}
                                className={Styles.paddingInput}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(e) => {
                                  handleInputChange(
                                    data.Q_id,
                                    'analysis',
                                    e.target.value
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Source *'
                                  : 'Source'
                              }
                            >
                              <Select
                                value={answers[data?.Q_id]?.source || ''}
                                className={Styles.select50}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(value) =>
                                  handleInputChange(data.Q_id, 'source', value)
                                }
                              >
                                {getAllUploadedData &&
                                  getAllUploadedData.map(
                                    (value: any, idx: number) => (
                                      <Select.Option
                                        key={idx}
                                        value={value.name}
                                      >
                                        {value.name}
                                      </Select.Option>
                                    )
                                  )}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Location *'
                                  : 'Location'
                              }
                            >
                              <InputComponent
                                value={answers[data?.Q_id]?.location || ''}
                                className={Styles.paddingInput}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(e: any) =>
                                  handleInputChange(
                                    data.Q_id,
                                    'location',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item label="Relevant Page No.">
                              <InputComponent
                                value={answers[data?.Q_id]?.pageNo || ''}
                                className={Styles.paddingInput}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(e: any) =>
                                  handleInputChange(
                                    data.Q_id,
                                    'pageNo',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Priority Level *'
                                  : 'Priority Level'
                              }
                            >
                              <Select
                                value={answers[data?.Q_id]?.priority || ''}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                onChange={(value) =>
                                  handleInputChange(
                                    data.Q_id,
                                    'priority',
                                    value
                                  )
                                }
                                className={Styles.select50}
                              >
                                <Select.Option value="High">High</Select.Option>
                                <Select.Option value="Medium">
                                  Medium
                                </Select.Option>
                                <Select.Option value="Low">Low</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                mandatory?.includes(data.options)
                                  ? 'Recommendation *'
                                  : 'Recommendation'
                              }
                            >
                              <TextArea
                                rows={1}
                                className={Styles.paddingInput}
                                disabled={
                                  (user.role === 'L1_DATA_REVIEWER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'L1_DATA_APPROVER' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER' &&
                                    onSubmitAnswers[data?.Q_id]?.status ===
                                      'reverted from reviewer' &&
                                    isEditable !== data.Q_id) ||
                                  (user.role === 'DATA_PROVIDER'
                                    ? answers[data?.Q_id]?.status ===
                                        'Submitted from provider' ||
                                      (onSubmitAnswers[data?.Q_id]?.status ===
                                        'reverted from approver' &&
                                        isEditable !== data.Q_id) ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from approver' ||
                                      answers[data?.Q_id]?.status ===
                                        'Submitted from reviewer' ||
                                      (attemptedQuestions?.includes(
                                        currentQuestion
                                      ) &&
                                        Object.keys(answers).length &&
                                        answers[data?.Q_id]?.status &&
                                        answers[data?.Q_id]?.draft_status &&
                                        !answers[data?.Q_id]?.status?.includes(
                                          'reverted from reviewer'
                                        ))
                                    : isEditable !== data.Q_id) ||
                                  isqstnCheck[data?.Q_id]
                                }
                                value={
                                  answers[data?.Q_id]?.recommendation || ''
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    data.Q_id,
                                    'recommendation',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                ))}
            </Form>
            <Row align="middle" gutter={12}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24} className="mt-2">
                <Flex align="middle" justify="end" className="mt-2">
                  <Space>
                    {(user.role === 'L1_DATA_REVIEWER' &&
                      ((onSubmitAnswers[questions[currentQuestion]?.Q_id]
                        ?.status === 'Submitted from provider' &&
                        !onSubmitAnswers[questions[currentQuestion]?.Q_id]
                          ?.is_acknowledged &&
                        isAllFieldsFilled()) ||
                        (onSubmitAnswers[questions[currentQuestion]?.Q_id]
                          ?.status === 'reverted from approver' &&
                          !onSubmitAnswers[questions[currentQuestion]?.Q_id]
                            ?.is_acknowledged &&
                          isAllFieldsFilled()))) ||
                    (user.role === 'DATA_PROVIDER' &&
                      onSubmitAnswers[questions[currentQuestion]?.Q_id]
                        ?.status === 'reverted from reviewer' &&
                      !onSubmitAnswers[questions[currentQuestion]?.Q_id]
                        ?.is_acknowledged &&
                      isAllFieldsFilled()) ||
                    (user.role === 'L1_DATA_APPROVER' &&
                      answers[questions[currentQuestion]?.Q_id]?.status ===
                        'Submitted from reviewer' &&
                      !onSubmitAnswers[questions[currentQuestion]?.Q_id]
                        ?.is_acknowledged &&
                      isAllFieldsFilled()) ? (
                      <>
                        <ButtonComponent
                          loading={loading}
                          hierarchy="tertiary"
                          onClick={() =>
                            handleModifyClick(questions[currentQuestion]?.Q_id)
                          }
                        >
                          Modify
                        </ButtonComponent>
                      </>
                    ) : null}
                    {user.role === 'DATA_PROVIDER' && !allQidsPresent && (
                      <ButtonComponent
                        hierarchy="tertiary"
                        onClick={() => {
                          dispatch(
                            setReportModal({
                              isOpen: true,
                              nextRoute: '',
                            })
                          );
                        }}
                        disabled={
                          !isAllFieldsFilled() &&
                          (mandatory.includes(
                            questions[currentQuestion]?.options
                          ) === false
                            ? !(onSubmitAnswers[
                                questions[currentQuestion]?.Q_id
                              ]?.is_acknowledged
                                ? true // If acknowledged, do not check the checkbox condition
                                : checkboxChecked[
                                    questions[currentQuestion]?.Q_id
                                  ]?.checked)
                            : !isAllFieldsFilled())
                        }
                        loading={loading}
                      >
                        Save as Draft
                      </ButtonComponent>
                    )}

                    {currentQuestion + 1 !== questions?.length &&
                      !shouldHideButton(
                        user.role,
                        answers[questions[currentQuestion]?.Q_id]?.status
                      ) &&
                      ((onSubmitAnswers.hasOwnProperty(
                        questions[currentQuestion]?.Q_id
                      ) &&
                        user.role !== 'DATA_PROVIDER') ||
                        (onSubmitAnswers.hasOwnProperty(
                          questions[currentQuestion]?.Q_id
                        ) &&
                          onSubmitAnswers[questions[currentQuestion]?.Q_id]
                            ?.status !== 'reverted from approver' &&
                          user.role === 'DATA_PROVIDER') ||
                        (!onSubmitAnswers.hasOwnProperty(
                          questions[currentQuestion]?.Q_id
                        ) &&
                          user.role === 'DATA_PROVIDER')) && (
                        <>
                          <ButtonComponent
                            hierarchy="primary"
                            loading={loading}
                            disabled={
                              user.role === 'L1_DATA_APPROVER'
                                ? false
                                : !isAllFieldsFilled() &&
                                  (mandatory.includes(
                                    questions[currentQuestion]?.options
                                  ) === false
                                    ? !(onSubmitAnswers[
                                        questions[currentQuestion]?.Q_id
                                      ]?.is_acknowledged
                                        ? true // If acknowledged, do not check the checkbox condition
                                        : checkboxChecked[
                                            questions[currentQuestion]?.Q_id
                                          ]?.checked)
                                    : !isAllFieldsFilled())
                            }
                            onClick={() => {
                              setIsAnsweredList((prev: any) => [
                                prev,
                                questions[currentQuestion]?.Q_id,
                              ]);
                              getSubmittedQuestion(domain, fixedValue);
                              handleSaveChange('submit');
                            }}
                          >
                            {user.role ===
                            'L1_questions[currentQuestion]?.Q_idDATA_REVIEWER'
                              ? 'Review and Next'
                              : user.role === 'L1_DATA_APPROVER'
                                ? 'Approve and Next'
                                : user.role === 'DATA_PROVIDER'
                                  ? 'Save and Next'
                                  : 'Next'}
                          </ButtonComponent>
                        </>
                      )}

                    {currentQuestion + 1 === questions?.length && (
                      <>
                        {(user.role === 'L1_DATA_REVIEWER' &&
                          (answers[questions[currentQuestion]?.Q_id]?.status ===
                            'Submitted from provider' ||
                            answers[questions[currentQuestion]?.Q_id]
                              ?.status === 'reverted from approver')) ||
                        (user.role === 'L1_DATA_APPROVER' &&
                          answers[questions[currentQuestion]?.Q_id]?.status ===
                            'Submitted from reviewer') ? (
                          <>
                            <ButtonComponent
                              loading={loading}
                              // className="form_submit"
                              hierarchy="secondary"
                              onClick={() => {
                                if (user.role === 'L1_DATA_REVIEWER') {
                                  handleRevert('reverted from reviewer');
                                } else if (user.role === 'L1_DATA_APPROVER') {
                                  handleRevert('reverted from approver');
                                }
                              }}
                            >
                              Revert
                            </ButtonComponent>
                          </>
                        ) : (
                          ''
                        )}

                        {!shouldHideButton(
                          user.role,
                          answers[questions[currentQuestion]?.Q_id]?.status
                        ) &&
                          ((onSubmitAnswers.hasOwnProperty(
                            questions[currentQuestion]?.Q_id
                          ) &&
                            user.role !== 'DATA_PROVIDER') ||
                            (onSubmitAnswers.hasOwnProperty(
                              questions[currentQuestion]?.Q_id
                            ) &&
                              onSubmitAnswers[questions[currentQuestion]?.Q_id]
                                ?.status !== 'reverted from approver' &&
                              user.role === 'DATA_PROVIDER') ||
                            (!onSubmitAnswers.hasOwnProperty(
                              questions[currentQuestion]?.Q_id
                            ) &&
                              user.role === 'DATA_PROVIDER')) && (
                            <>
                              <ButtonComponent
                                hierarchy="primary"
                                // className="form_submit"
                                disabled={
                                  user.role !== 'L1_DATA_APPROVER' &&
                                  ((!isAllFieldsFilled() &&
                                    (mandatory.includes(
                                      questions[currentQuestion]?.options
                                    ) === false
                                      ? !(onSubmitAnswers[
                                          questions[currentQuestion]?.Q_id
                                        ]?.is_acknowledged
                                          ? true
                                          : checkboxChecked[
                                              questions[currentQuestion]?.Q_id
                                            ]?.checked) || !allAttempted
                                      : !isAllFieldsFilled())) ||
                                    (user.role === 'L1_DATA_APPROVER' &&
                                      (answers[questions[currentQuestion]?.Q_id]
                                        ?.status ===
                                        'Submitted from provider' ||
                                        answers[
                                          questions[currentQuestion]?.Q_id
                                        ]?.status ===
                                          'reverted from reviewer')))
                                }
                                onClick={() => {
                                  if (user.role === 'L1_DATA_REVIEWER') {
                                    getSubmittedQuestion(domain, fixedValue);
                                    handleSubmit('Submitted from reviewer');
                                  } else if (user.role === 'L1_DATA_APPROVER') {
                                    handleSubmit('Submitted from approver');
                                  } else {
                                    handleSubmit('Submitted from provider');
                                  }
                                }}
                              >
                                {user.role === 'L1_DATA_REVIEWER'
                                  ? 'Submit for Approval'
                                  : user.role === 'L1_DATA_APPROVER'
                                    ? 'Approve'
                                    : user.role === 'DATA_PROVIDER'
                                      ? 'Submit for Review'
                                      : 'Submit'}
                              </ButtonComponent>
                            </>
                          )}
                      </>
                    )}
                  </Space>
                </Flex>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={1}>
          <div
            style={{ borderRight: '1px solid #d9d9d9', height: '100%' }}
          ></div>
        </Col>

        <Col
          className={`mb-3 d-flex flex-column justify-content-between`}
          span={7}
        >
          <Col style={{ height: '100%', paddingTop: '20px' }}>
            <>
              <Tabs
                activeKey={activeTab}
                onChange={(key: string) => {
                  const index = topBarBtn.indexOf(key);
                  setActiveTab(key);
                  setActiveIndex(index);
                  setActiveBtn(key);
                }}
                items={[
                  {
                    label: 'Status',
                    key: 'Status',
                    children: (
                      <>
                        <div
                          style={{
                            height: '350px',
                            overflowY: 'auto',
                            paddingRight: '10px',
                          }}
                        >
                          <div
                            className={Styles.commentBoxTitle}
                            style={{ marginBottom: '20px' }}
                          >
                            Assessment Status
                          </div>
                          <Row gutter={[5, 10]}>
                            {!isEmpty(questions) &&
                              questions?.map((data: any, index: number) => {
                                const submittedEntry = SubmittedQuestion?.find(
                                  (entry: any) =>
                                    entry.question_reference === data.Q_id
                                );

                                const hasComments =
                                  submittedEntry?.comments_data &&
                                  submittedEntry?.comments_data.length > 0;

                                const isHighlighted =
                                  hasComments && hasCommentsPerQuestion[index];
                                const isReverted =
                                  answers[data?.Q_id]?.status ===
                                    'reverted from reviewer' ||
                                  answers[data?.Q_id]?.status ===
                                    'reverted from approver';
                                const isCurrent = index === currentQuestion;
                                let btnclr;
                                if (
                                  onSubmitAnswers[data?.Q_id]?.status &&
                                  !attempQstnList.length
                                ) {
                                  btnclr = getButtonColor(
                                    onSubmitAnswers[data?.Q_id]?.status,
                                    onSubmitAnswers[data?.Q_id]?.comments_data,
                                    data?.Q_id
                                  );
                                } else {
                                  if (user.role === 'DATA_PROVIDER') {
                                    btnclr = '#f68d2e';
                                  } else {
                                    btnclr = 'grey';
                                  }
                                }

                                return (
                                  <Col
                                    xl={8}
                                    lg={12}
                                    md={24}
                                    sm={24}
                                    xs={24}
                                    key={index}
                                    className="d-flex justify-content-center pt-3"
                                    style={{ paddingLeft: '10px' }}
                                  >
                                    <p
                                      style={{
                                        background: attempQstnList.length
                                          ? ''
                                          : btnclr,
                                      }}
                                      className={`
                            
                            
                            ${commentedQuestions?.includes(index) ? Styles.redHighlight : ''}
                      
                           ${Styles.question_no}
            ${
              index === currentQuestion
                ? `${
                    attemptedQuestions?.includes(index)
                      ? Styles.currentAttemptedQstn
                      : Styles.currentUnAttemptedQstn
                  } ${Styles.currentQuestion}`
                : `${
                    attemptedQuestions?.includes(index)
                      ? Styles.attemptedQstn
                      : Styles.unAttemptedQstn
                  }`
            } 
                            
                            ${
                              user.role === 'L1_DATA_REVIEWER' &&
                              answers[data?.Q_id]?.status ===
                                'Submitted from reviewer'
                                ? Styles.attemptedQstn
                                : user.role === 'L1_DATA_REVIEWER' &&
                                    hasCommentsPerQuestion[index]
                                  ? Styles.unAttemptedQstn
                                  : ''
                            }
                            
                            ${
                              user.role === 'L1_DATA_APPROVER' &&
                              answers[data?.Q_id]?.status ===
                                'Submitted from approver'
                                ? Styles.attemptedQstn
                                : user.role === 'L1_DATA_APPROVER' &&
                                    hasCommentsPerQuestion[index]
                                  ? Styles.unAttemptedQstn
                                  : ''
                            }
                       ${isReverted && hasComments ? Styles.redHighlight : ''}
                            
                            ${comments[questions[index]?.Q_id] ? Styles.redHighlight : ''} 
                            m-0
                          `}
                                      onClick={() => {
                                        getSubmittedQuestion(
                                          domain,
                                          fixedValue
                                        );
                                        handleCurrentQstn(index);
                                        setCurrentQstnId(data?.Q_id);
                                      }}
                                    >
                                      {`${data?.Q_id} `}
                                    </p>
                                  </Col>
                                );
                              })}
                          </Row>
                        </div>

                        <Row
                          style={{ marginTop: '2vh' }}
                          justify="space-between"
                          align="middle"
                        >
                          {[
                            {
                              text: `${user.role === 'DATA_PROVIDER' ? 'Attempted' : user.role === 'L1_DATA_REVIEWER' ? 'Reviewed' : 'Approved'}`,
                              color: '#4B785A',
                              bg: '#4B785A',
                            },
                            {
                              text: 'Action Required',
                              color: '#F48F56',
                              bg: '#F48F56',
                            },
                            {
                              text: 'No Action Required',
                              color: '#A1A1A1',
                              bg: 'grey',
                            },
                            {
                              text: 'Commented',
                              color: '#7A0202',
                              bg: '#7A0202',
                            },
                          ].map((data: any, index: number) => (
                            <Col
                              key={index}
                              xl={12}
                              lg={12}
                              md={24}
                              sm={24}
                              xs={24}
                              className={Styles.qstnStatus}
                            >
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
                      </>
                    ),
                  },
                  {
                    label: 'Comments',
                    key: 'Comments',
                    children: (
                      <div>
                        <div style={{ height: '35rem' }}>
                          <div className={Styles.cardCont}>
                            <Row>
                              <Row className={Styles.commentRow}>
                                <div className={Styles.commentBoxTitle}>
                                  Comment Box
                                </div>
                              </Row>
                            </Row>
                            <Row
                              className={Styles.commentHistoryContainer}
                              align="middle"
                            >
                              {CommentedList?.map(
                                (comment: any, index: number) => (
                                  <Row
                                    style={{ width: '100%' }}
                                    align="middle"
                                    key={index}
                                  >
                                    <Col
                                      className="justify-content-unset"
                                      span={4}
                                    >
                                      <div className={Styles.commentsLogo}>
                                        {commentsLogoConverter(
                                          comment?.entity_Roles
                                        )}
                                      </div>
                                    </Col>
                                    <Col span={12}>
                                      <Row className={Styles.commentedBy}>
                                        {comment?.entity_Roles}
                                      </Row>
                                      <Row
                                        style={{ marginTop: '10px' }}
                                        className={Styles.commentedMsg}
                                      >
                                        {comment?.comments}
                                      </Row>
                                    </Col>
                                    <Col span={8}>
                                      <div
                                        style={{ textAlign: 'end' }}
                                        className={Styles.commentedDate}
                                      >
                                        {moment(comment.commented_date).format(
                                          'DD-MM-YYYY'
                                        )}
                                      </div>
                                      <div
                                        style={{ textAlign: 'end' }}
                                        className={Styles.commentedDate}
                                      >
                                        {moment(comment.commented_date).format(
                                          'HH:mm'
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                )
                              )}{' '}
                              {CurrentCommentedlIst?.filter(
                                (comment: any) =>
                                  comment?.questionId ===
                                  questions[currentQuestion]?.Q_id
                              ).map((comment: any, index: number) => (
                                <Row
                                  style={{ width: '100%' }}
                                  align="middle"
                                  key={index}
                                >
                                  <Col
                                    className="justify-content-unset"
                                    span={4}
                                  >
                                    <div className={Styles.commentsLogo}>
                                      {commentsLogoConverter(
                                        comment?.entity_Roles
                                      )}
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <Row className={Styles.commentedBy}>
                                      {comment?.entity_Roles}
                                    </Row>
                                    <Row
                                      style={{ marginTop: '10px' }}
                                      className={Styles.commentedMsg}
                                    >
                                      {comment?.comments}
                                    </Row>
                                  </Col>
                                  <Col span={8}>
                                    <div
                                      style={{ textAlign: 'end' }}
                                      className={Styles.commentedDate}
                                    >
                                      {moment(comment.commented_date).format(
                                        'DD-MM-YYYY'
                                      )}
                                    </div>
                                    <div
                                      style={{ textAlign: 'end' }}
                                      className={Styles.commentedDate}
                                    >
                                      {moment(comment.commented_date).format(
                                        'HH:mm'
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              ))}
                            </Row>
                          </div>

                          {(user.role === 'L1_DATA_REVIEWER' ||
                            user.role === 'L1_DATA_APPROVER' ||
                            (user.role === 'DATA_PROVIDER' &&
                              answers[questions[currentQuestion]?.Q_id]
                                ?.status === 'reverted from reviewer')) && (
                            <div className="w-100 position-relative d-inline-block">
                              <TextArea
                                placeholder="Post your comments"
                                rows={2}
                                className={`your-textarea-style`}
                                value={comment}
                                onChange={(e) => handleComments(e.target.value)}
                              />
                              <button
                                className={`${Styles.sendIcon}`}
                                onClick={() => {
                                  getSubmittedQuestion(domain, fixedValue);
                                  handleSaveChangeOncomment('submit');

                                  onHandleComment(comment, currentQuestion);
                                }}
                              >
                                <SendOutlined />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </>
          </Col>
          {/* <Col className={`${Styles.pageCardStyle} ${Styles.cardStatus}`}>
            {topBarBtn?.map((val: string, index: any) => {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setActiveBtn(val);
                  }}
                  style={{
                    width: '45%',
                    height: '70%',
                    borderColor: 'none',
                    backgroundColor:
                      activeIndex === index ? '#0D304A' : 'white',
                    color: activeIndex === index ? 'white' : 'black',
                  }}
                >
                  {val}
                </Button>
              );
            })}
          </Col>
          {activeBtn === 'Status' && (
            <Card
              title={`Assessment status`}
              style={{ height: '35rem' }}
              className={`bg-white p-3 mb-2  ${StylesB.customBorderRadius15} ${StylesB.customBoxShadow}`}
            >
              <div
                style={{
                  height: '350px',
                  overflowY: 'auto',
                  paddingRight: '10px',
                }}
              >
                <Row gutter={[5, 10]}>
                  {!isEmpty(questions) &&
                    questions?.map((data: any, index: number) => {
                      const submittedEntry = SubmittedQuestion?.find(
                        (entry: any) => entry.question_reference === data.Q_id
                      );

                      const hasComments =
                        submittedEntry?.comments_data &&
                        submittedEntry?.comments_data.length > 0;

                      const isHighlighted =
                        hasComments && hasCommentsPerQuestion[index];
                      const isReverted =
                        answers[data?.Q_id]?.status ===
                        'reverted from reviewer' ||
                        answers[data?.Q_id]?.status ===
                        'reverted from approver';
                      const isCurrent = index === currentQuestion;
                      let btnclr;
                      if (
                        onSubmitAnswers[data?.Q_id]?.status &&
                        !attempQstnList.length
                      ) {
                        btnclr = getButtonColor(
                          onSubmitAnswers[data?.Q_id]?.status,
                          onSubmitAnswers[data?.Q_id]?.comments_data,
                          data?.Q_id
                        );
                      } else {
                        if (user.role === 'DATA_PROVIDER') {
                          btnclr = '#f68d2e';
                        } else {
                          btnclr = 'grey';
                        }
                      }

                      return (
                        <Col
                          xl={8}
                          lg={12}
                          md={24}
                          sm={24}
                          xs={24}
                          key={index}
                          className="d-flex justify-content-center pt-3"
                          style={{ paddingLeft: '10px' }}
                        >
                          <p
                            style={{
                              background: attempQstnList.length ? '' : btnclr,
                            }}
                            className={`
                            
                            
                            ${commentedQuestions?.includes(index) ? Styles.redHighlight : ''}
                      
                           ${Styles.question_no}
            ${index === currentQuestion
                                ? `${attemptedQuestions?.includes(index)
                                  ? Styles.currentAttemptedQstn
                                  : Styles.currentUnAttemptedQstn
                                } ${Styles.currentQuestion}`
                                : `${attemptedQuestions?.includes(index)
                                  ? Styles.attemptedQstn
                                  : Styles.unAttemptedQstn
                                }`
                              } 
                            
                            ${user.role === 'L1_DATA_REVIEWER' &&
                                answers[data?.Q_id]?.status ===
                                'Submitted from reviewer'
                                ? Styles.attemptedQstn
                                : user.role === 'L1_DATA_REVIEWER' &&
                                  hasCommentsPerQuestion[index]
                                  ? Styles.unAttemptedQstn
                                  : ''
                              }
                            
                            ${user.role === 'L1_DATA_APPROVER' &&
                                answers[data?.Q_id]?.status ===
                                'Submitted from approver'
                                ? Styles.attemptedQstn
                                : user.role === 'L1_DATA_APPROVER' &&
                                  hasCommentsPerQuestion[index]
                                  ? Styles.unAttemptedQstn
                                  : ''
                              }
                       ${isReverted && hasComments ? Styles.redHighlight : ''}
                            
                            ${comments[questions[index]?.Q_id] ? Styles.redHighlight : ''} 
                            m-0
                          `}
                            onClick={() => {
                              getSubmittedQuestion(domain, fixedValue);
                              handleCurrentQstn(index);
                              setCurrentQstnId(data?.Q_id);
                            }}
                          >
                            {`${data?.Q_id} `}
                          </p>
                        </Col>
                      );
                    })}
                </Row>
              </div>

              <Row
                style={{ marginTop: '5vh' }}
                justify="space-between"
                align="middle"
              >
                {[
                  {
                    text: `${user.role === 'DATA_PROVIDER' ? 'Attempted' : user.role === 'L1_DATA_REVIEWER' ? 'Reviewed' : 'Approved'}`,
                    color: '#4B785A',
                    bg: '#4B785A',
                  },
                  {
                    text: 'Action Required',
                    color: '#F48F56',
                    bg: '#F48F56',
                  },
                  {
                    text: 'No Action Required',
                    color: '#A1A1A1',
                    bg: 'grey',
                  },
                  {
                    text: 'Commented',
                    color: '#7A0202',
                    bg: '#7A0202',
                  },
                ].map((data: any, index: number) => (
                  <Col
                    key={index}
                    xl={12}
                    lg={12}
                    md={24}
                    sm={24}
                    xs={24}
                    className={Styles.qstnStatus}
                  >
                    <div
                      className={`${Styles.circleStyle} circle`}
                      style={{
                        border: `1px solid ${data.color}`,
                        background: `${data.bg}`,
                      }}
                    ></div>
                    <span className={Styles.circleSuffix}>{data.text}</span>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
          {activeBtn === 'Comments' && (
            <Card>
              <div>
                <div style={{ height: '35rem' }}>
                  <div className={Styles.cardCont}>
                    <Row>
                      <Row className={Styles.commentRow}>
                        <div className={Styles.commentBoxTitle}>
                          Comment Box
                        </div>
                      </Row>
                    </Row>
                    <Row
                      className={Styles.commentHistoryContainer}
                      align="middle"
                    >
                      {CommentedList?.map((comment: any, index: number) => (
                        <Row
                          style={{ width: '100%' }}
                          align="middle"
                          key={index}
                        >
                          <Col className="justify-content-unset" span={4}>
                            <div className={Styles.commentsLogo}>
                              {commentsLogoConverter(comment?.entity_Roles)}
                            </div>
                          </Col>
                          <Col span={12}>
                            <Row className={Styles.commentedBy}>
                              {comment?.entity_Roles}
                            </Row>
                            <Row
                              style={{ marginTop: '10px' }}
                              className={Styles.commentedMsg}
                            >
                              {comment?.comments}
                            </Row>
                          </Col>
                          <Col span={8}>
                            <div
                              style={{ textAlign: 'end' }}
                              className={Styles.commentedDate}
                            >
                              {moment(comment.commented_date).format(
                                'DD-MM-YYYY'
                              )}
                            </div>
                            <div
                              style={{ textAlign: 'end' }}
                              className={Styles.commentedDate}
                            >
                              {moment(comment.commented_date).format('HH:mm')}
                            </div>
                          </Col>
                        </Row>
                      ))}{' '}
                      {CurrentCommentedlIst?.filter(
                        (comment: any) =>
                          comment?.questionId ===
                          questions[currentQuestion]?.Q_id
                      ).map((comment: any, index: number) => (
                        <Row
                          style={{ width: '100%' }}
                          align="middle"
                          key={index}
                        >
                          <Col className="justify-content-unset" span={4}>
                            <div className={Styles.commentsLogo}>
                              {commentsLogoConverter(comment?.entity_Roles)}
                            </div>
                          </Col>
                          <Col span={12}>
                            <Row className={Styles.commentedBy}>
                              {comment?.entity_Roles}
                            </Row>
                            <Row
                              style={{ marginTop: '10px' }}
                              className={Styles.commentedMsg}
                            >
                              {comment?.comments}
                            </Row>
                          </Col>
                          <Col span={8}>
                            <div
                              style={{ textAlign: 'end' }}
                              className={Styles.commentedDate}
                            >
                              {moment(comment.commented_date).format(
                                'DD-MM-YYYY'
                              )}
                            </div>
                            <div
                              style={{ textAlign: 'end' }}
                              className={Styles.commentedDate}
                            >
                              {moment(comment.commented_date).format('HH:mm')}
                            </div>
                          </Col>
                        </Row>
                      ))}
                    </Row>
                  </div>

                  {(user.role === 'L1_DATA_REVIEWER' ||
                    user.role === 'L1_DATA_APPROVER' ||
                    (user.role === 'DATA_PROVIDER' &&
                      answers[questions[currentQuestion]?.Q_id]?.status ===
                      'reverted from reviewer')) && (
                      <div className="w-100 position-relative d-inline-block">
                        <TextArea
                          placeholder="Post your comments"
                          rows={2}
                          className={`your-textarea-style`}
                          value={comment}
                          onChange={(e) => handleComments(e.target.value)}
                        />
                        <button
                          className={`${Styles.sendIcon}`}
                          onClick={() => {
                            getSubmittedQuestion(domain, fixedValue);
                            handleSaveChangeOncomment('submit');

                            onHandleComment(comment, currentQuestion);
                          }}
                        >
                          <SendOutlined />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </Card>
          )} */}
        </Col>
      </Row>
      <ModalComponent
        isOpen={ModalOpen}
        centered
        content={
          'You are leaving this assessment in between. Do you want to save this as a draft?'
        }
        onCancel={() =>
          dispatch(
            setReportModal({
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
