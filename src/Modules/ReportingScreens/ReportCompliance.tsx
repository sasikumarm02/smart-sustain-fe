import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Row,
  Col,
  Select,
  List,
  Progress,
  Collapse,
  Input,
  Image,
  Avatar,
  Radio,
  message,
  Typography,
  Button,
  Checkbox,
  Tabs,
} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SendOutlined } from '@ant-design/icons';
import Styles from './report-compliance.module.scss';
import {
  setAssessmentComplete,
  setModal,
  setReportModal,
} from '../../Redux/Actions';
import CopyIcon from '../../../src/assets/Svg/CopyIcon.svg';
import './report-compliance.css';
import { useAuth } from '../../Hooks/useAuth';
import { apiBaseUrl, get, post } from '../../Services';
import { useQuery } from '../../Hooks/useQuery';
import { isEmpty } from '../../Utils/isEmpty';
import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  TabsComponent,
} from '../../DesignLibrary';
import AddIcon from '../../assets/Svg/Governance/AddIcon';
import MinusIcon from '../../assets/Svg/Governance/MinusIcon';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addIcon } from '@iconify/react';
import { getUniqueQuestions } from '../../Components/Emissions/Scope3/Helpers';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { Text } = Typography;

interface SubCategory {
  sub_category: string | any;
  sub_category_id: string;
  question_count: number;
  answer_count: number;
  update: any;
}

interface Category {
  category: string;
  category_id: string;
  status: any;
}

interface Comments {
  comment: string;
  commented_by: string;
  date: string;
}

interface Answer {
  question_id: string;
  question: string;
  answer: string;
  isAnswered: boolean;
}

interface Question {
  answer: string;
  question: string;
  isAnswered: boolean;
  question_id: string;
  question_type: string;
  sub_questions: Question[] | string;
  is_sub_questions: boolean;
  dependent_questions: Question[] | string;
  is_dependent_question: boolean;
}

interface accessQuestionairesObj {
  isComplete: boolean;
  isEditable: boolean;
  isAppliedReview: boolean;
  isReview: boolean;
  reviewStatus: string;
  isApproved: boolean;
  approvalStatus: string;
}

interface ExtractedQuestion {
  question: string;
  question_id: string;
}

const ReportCompliance: React.FC = () => {
  const query: any = useQuery();
  const { user } = useAuth();
  const maxDrLevel = query.get('max_DR');
  const maxDaLevel = query.get('max_DA');
  // const progressPercent = (answeredQuestions / totalQuestions) * 100;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: Answer[] }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [getCurCatIndex, setGetCurCatIndex] = useState<any>();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filterValue, setFilterValue] = useState<string>('All');
  const [subCategoriesFull, setSubCategoriesFull] = useState<SubCategory[]>([]);
  const [questionsForInput, setQuestionsForInput] = useState<any[]>([]);
  const [questionsForInputForComments, setQuestionsForInputForComments] =
    useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>();
  const [title, setTitle] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [answerReset, setAnswerReset] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState({
    total_questions: 0,
    total_answered: 0,
    completion_percentage: 10,
  });
  const [accessQuestionairesData, setaccessQuestionairesData] = useState<any>();
  const [categoriesStatus, setCategoriesStatus] = useState<any>();
  const [categoryId, setCategoryId] = useState<string>('');
  const [isFirstColumnCollapsed, setIsFirstColumnCollapsed] =
    useState<boolean>(false);
  const [isModifyVal, setisModifyVal] = useState<boolean>(false);
  const [canBeApproved, setCanBeApproved] = useState<boolean>(false);
  const [savedSubCategory, setSavedSubCategory] = useState<boolean>(false);
  const [commentsDataValue, setCommentsDataValue] = useState<any>({});
  const [enableBtn, setEnableBtn] = useState(false);
  const [findlasIndex, setFindLastIndex] = useState<any>(0);
  // const [activeIndex, setActiveIndex] = useState<any>(0);
  // const [activeBtn, setActiveBtn] = useState<any>('Status');
  const [hideCategory, setHideCategory] = useState<any>(true);
  const [commentsArray, setCommentsArray] = useState<any>();
  const hasIndexBeenSet = useRef(false);
  const navigate = useNavigate();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const toggleFirstColumn = () => {
    setIsFirstColumnCollapsed(!isFirstColumnCollapsed);
  };

  function extractQuestions(questions: Question[]): ExtractedQuestion[] {
    let extractedQuestions: ExtractedQuestion[] = [];

    function processQuestions(questions: Question[]): void {
      questions.forEach((question) => {
        extractedQuestions.push({
          question: question.question,
          question_id: question?.question_id,
        });

        if (question.is_sub_questions) {
          if (Array.isArray(question?.sub_questions)) {
            processQuestions(question?.sub_questions);
          } else if (typeof question?.sub_questions === 'string') {
            extractedQuestions.push({
              question: question?.sub_questions,
              question_id: question?.question_id,
            });
          }
        }

        if (question.is_dependent_question) {
          if (Array.isArray(question.dependent_questions)) {
            processQuestions(question.dependent_questions);
          } else if (typeof question.dependent_questions === 'string') {
            extractedQuestions.push({
              question: question.dependent_questions,
              question_id: question?.question_id,
            });
          }
        }
      });
    }

    processQuestions(questions);

    return extractedQuestions;
  }
  let quesData: Question[] = [];
  let updateData: any = {};
  const getQuestion = async (
    sub_category: string | null,
    id: string | null,
    subCatId: string | undefined | null
  ) => {
    setisModifyVal(false);
    if (!sub_category || !id) {
    } else {
      get(
        `${apiBaseUrl}/report/get_sub_category_assessment/?categoryName=${sub_category}&subcategoryName=${id}&subCategoryId=${subCatId}&entity_Id=${user.entity_Id}`
      )
        .then((res: any) => {
          if (res?.response.status !== false) {
            const dataQqstn = res?.response?.data?.questionnaires?.questions;
            const dataQstnWithComments = dataQqstn.map((q: any) => {
              return {
                ...q,

                comment: {
                  comments: '',
                  commented_by: '',
                  commented_date: '',
                },
                ...(q?.sub_questions &&
                  q?.sub_questions.length > 0 && {
                    numberOfSubQ: q?.sub_questions.length,
                  }),
              };
            });
            setQuestionsForInput(dataQstnWithComments);
            setQuestionsForInputForComments(
              res?.response?.data?.questionnaires?.questions
            );
            quesData = res?.response?.data?.questionnaires?.questions;
            updateData = res?.update?.status;
            setaccessQuestionairesData(updateData);
            setCategoriesStatus(updateData);
            if (res?.update?.reviewStatus === 'Approved') {
              setCanBeApproved(true);
            } else {
              setCanBeApproved(false);
            }
          }
        })
        .catch((err) => console.log(err));
    }
    const questions = extractQuestions(quesData);
    return questions;
  };

  const getLengthList = () => {
    const ApproverArr: any = [
      'For L1 Review',
      'For L2 Review',
      'For L3 Review',
      'For DP Revision',
      null,
    ];

    const ReviewerArr: any = [
      'For L1 Approval',
      'For L2 Approval',
      'For DP Revision',
    ];

    const approver: any = [
      'L1_DATA_APPROVER',
      'L2_DATA_APPROVER',
      'L3_DATA_APPROVER',
    ];
    const reviewer: any = [
      'L1_DATA_REVIEWER',
      'L2_DATA_REVIEWER',
      'L3_DATA_REVIEWER',
    ];

    const filteredApprData = subCategories?.filter(
      (val: any) =>
        val.update.status !== null &&
        val.update.status !== 'For L1 Approval' &&
        val.update.status !== 'For L2 Approval' &&
        val.update.status !== 'For L1 DR Revision' &&
        val.update.status !== 'For L2 DR Revision' &&
        val.update.status !== 'For L3 DR Revision' &&
        val.update.status !== 'Approved'
    );

    const filteredRevrData = subCategories?.filter(
      (val: any) =>
        val.update.status !== null &&
        val.update.status !== 'For L1 Review' &&
        val.update.status !== 'For L2 Review' &&
        val.update.status !== 'For DP Revision' &&
        val.update.status !== 'For L3 Review' &&
        val.update.status !== 'For L1 Approval' &&
        val.update.status !== 'For L2 Approval' &&
        val.update.status !== 'For L1 DR Revision' &&
        val.update.status !== 'For L2 DR Revision' &&
        val.update.status !== 'For L3 DR Revision' &&
        val.update.status !== 'Approved'
    );

    const checkApprover = approver.find((val: any) => val === user.role);
    const checkReviwer = reviewer.find((val: any) => val === user.role);
    const checkReview = ApproverArr.find(
      (val: any) => val === accessQuestionairesData?.trim()
    );

    const checkApprove = ReviewerArr.find(
      (val: any) => val === accessQuestionairesData?.trim()
    );

    let checKNextLevelUser;
    if (
      (checkReview === 'For L1 Review' || checkReview === 'For DP Revision') &&
      (user.role === 'L2_DATA_REVIEWER' || user.role === 'L3_DATA_REVIEWER')
    ) {
      checKNextLevelUser = true;
    } else if (
      checkReview === 'For L2 Review' &&
      user.role === 'L3_DATA_REVIEWER'
    ) {
      checKNextLevelUser = true;
    } else if (
      checkReview === 'For L3 Review' &&
      user.role === 'L1_DATA_APPROVER'
    ) {
      checKNextLevelUser = true;
    } else if (
      checkApprove === 'For L1 Approval' &&
      user.role === 'L2_DATA_APPROVER'
    ) {
      checKNextLevelUser = true;
    }
    if (checkReview && checkApprover && filteredApprData?.length > 0) {
      setHideCategory(false);
    } else if (checKNextLevelUser) {
      setHideCategory(false);
    } else if (checkApprove && filteredRevrData.length > 0 && checkReviwer) {
      setHideCategory(false);
    } else {
      setHideCategory(true);
    }
  };

  useEffect(() => {
    try {
      get(
        `/report/get_category_summary/?categoryName=${query.get('category_name')}&category_id=${query.get('category_id')}&entityID=${user.entity_Id}`
      ).then((res: any) => {
        const data = res?.response?.data;
        const categoryData: Category = {
          category: data.category_id,
          category_id: data.category_name,
          status: data?.update,
        };
        const subcategoryData: SubCategory[] = data.sub_category_info;
        setSubCategories(subcategoryData);
        setSubCategoriesFull(subcategoryData);
        setTitle(data.category_name);
        setCategoryId(data.category_id);
        setCategories([categoryData]);
        setProgressStatus({
          total_questions: data.total_questions,
          total_answered: data.total_answered,
          completion_percentage: data.completion_percentage,
        });
        if (selectedSubCategory !== undefined && selectedSubCategory !== null) {
          setSelectedSubCategory(selectedSubCategory);
          getQuestion(
            data.category_name,
            selectedSubCategory?.sub_category,
            selectedSubCategory?.sub_category_id
          );
        } else {
          if (user.role === 'DATA_PROVIDER') {
            const selectedSubCat: SubCategory[] = subcategoryData.filter(
              (sub) => sub.sub_category_id === query.get('sub_category_id')
            );
            setSelectedSubCategory(selectedSubCat[0]);
            getQuestion(
              data.category_name,
              selectedSubCat[0]?.sub_category,
              selectedSubCat[0]?.sub_category_id
            );
          } else {
            setSelectedSubCategory(subcategoryData[query.get('index')]);
            getQuestion(
              data.category_name,
              subcategoryData[query.get('index')]?.sub_category,
              subcategoryData[query.get('index')]?.sub_category_id
            );
          }
        }
      });
    } catch (error: any) {
      message.error('No Data');
    }
  }, [savedSubCategory, query.get('category_id')]);

  const handleAnswerChange = (value: string, autofill: string | undefined) => {
    if (autofill) {
      setAnswer(autofill);
    }
    setAnswer(value);
    const updatedQuestions = questionsForInput.map((question) => {
      if (
        question?.question_id ===
        questionsForInput[currentQuestionIndex]?.question_id
      ) {
        return {
          ...question,
          answer: value,
          isAnswered: true,
        };
      } else {
        return {
          ...question,
        };
      }
    });
    setQuestionsForInput(updatedQuestions);
    if (value === '') setAnswerReset(true);
    else setAnswerReset(false);
  };

  const handleSubQuestionAnswerChange = (
    value: string | undefined,
    questionId: string,
    subQuestion: string,
    qstnType?: string
  ) => {
    const qstnAttr =
      qstnType === 'dpdtQstn' ? 'dependent_questions' : 'sub_questions';
    const updatedQuestions = questionsForInput.map((question) => {
      if (questionId === question?.question_id) {
        const updatedSubQuestions = question[qstnAttr]?.map((subQ: any) => {
          if (currentQstn.question_type === 'MultiList') {
            if (subQ.question_key === subQuestion) {
              return { ...subQ, isAnswered: true, answer: value };
            }
          } else {
            if (subQ.question === subQuestion) {
              return { ...subQ, isAnswered: true, answer: value };
            }
          }

          return subQ;
        });
        return {
          ...question,
          [qstnAttr]: updatedSubQuestions,
        };
      }
      return question;
    });
    setQuestionsForInput(updatedQuestions);
  };
  const [comment, setComment] = useState<any>();
  const handleComments = (value: string | undefined, question_id: string) => {
    setComment(value);
    if (user.role === 'L1_DATA_REVIEWER') {
      questionsForInput[currentQuestionIndex].isL1DRReverted = true;
      if (questionsForInput[currentQuestionIndex].isL1Reviewed) {
        questionsForInput[currentQuestionIndex].isL1Reviewed = false;
      }
    } else if (user.role === 'L2_DATA_REVIEWER') {
      questionsForInput[currentQuestionIndex].isL2DRReverted = true;
      if (questionsForInput[currentQuestionIndex].isL2Reviewed) {
        questionsForInput[currentQuestionIndex].isL2Reviewed = false;
      }
    } else if (user.role === 'L3_DATA_REVIEWER') {
      questionsForInput[currentQuestionIndex].isL3DRReverted = true;
      if (questionsForInput[currentQuestionIndex].isL3Reviewed) {
        questionsForInput[currentQuestionIndex].isL3Reviewed = false;
      }
    } else if (user.role === 'L1_DATA_APPROVER') {
      questionsForInput[currentQuestionIndex].isL1DAReverted = true;
      if (questionsForInput[currentQuestionIndex].isL1Approved) {
        questionsForInput[currentQuestionIndex].isL1Approved = false;
      }
    } else if (user.role === 'L2_DATA_APPROVER') {
      questionsForInput[currentQuestionIndex].isL2DAReverted = true;
      if (questionsForInput[currentQuestionIndex].isL2Approved) {
        questionsForInput[currentQuestionIndex].isL2Approved = false;
      }
    }
    const updatedComments: any = {
      comments: value,
      commented_by: user.role,
      commented_date: formatDate(new Date()),
    };
    const updatedQuestions = questionsForInput.map((question) => {
      if (question_id === question.question_id) {
        return {
          ...question,
          comment: updatedComments,
        };
      } else {
        return question;
      }
    });
    setQuestionsForInput(updatedQuestions);
  };

  useEffect(() => {
    const lastIndex =
      questionsForInput.length === 1
        ? true
        : findlasIndex
          ? questionsForInput.length - 1 === findlasIndex
          : false;
    if (questionsForInput.length === 1) {
      setEnableBtn(true);
    } else {
      setEnableBtn(lastIndex);
    }
  }, [findlasIndex, questionsForInput]);

  const [checkReviwed, setCheckReviewed] = useState<any[]>([]);

  const removeDuplicates = (arr: any) => {
    const uniqueArr = arr.filter(
      (item: any, index: any) => arr.indexOf(item) === index
    );
    return uniqueArr.length + 1;
  };

  const dispatch = useDispatch();
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const ModalOpen = useSelector(
    (state: any) => state.ReportComplianceModal.isOpen
  );
  const NextRoute = useSelector(
    (state: any) => state.ReportComplianceModal.nextRoute
  );

  const handleSaveAsDraft = async (
    submissionAnswers: { [x: string]: any },
    assessment_sts: any,
    update: string,
    navigateOption: boolean
  ) => {
    try {
      var updatedQnA = submissionAnswers.map(function (obj: any) {
        let newObj: any = { ...obj };

        if (newObj?.comment?.comments !== '') {
          newObj.comments = [...newObj.comments, newObj.comment];
          newObj.isModified = revisionArr?.includes(assessment_sts?.status)
            ? true
            : false;
        } else if (approvalArr?.includes(assessment_sts?.status)) {
          newObj.isModified = false;
        }

        delete newObj.comment;
        delete newObj.isModifyVal;
        delete newObj.isModify;

        return newObj;
      });

      const submissionData: any = {
        categoryName: title || '',
        qna: {
          questions: update ? updatedQnA : updatedQnA || [],
        },
        assessment_status: assessment_sts,
        entity_Id: user.entity_Id,
        category_id: categoryId,
        sub_category_id: selectedSubCategory?.sub_category_id,
        subcategoryName: selectedSubCategory?.['sub_category'],
        draft_status: true,
      };

      await post(`/report/save_subcategory_assessments/`, submissionData)
        .then((res: any) => {
          setQuestionsForInput([]);
          message.success('Data drafted successfully');
          setAnswer('');
          setAnswerReset(false);
          getQuestion(
            title,
            selectedSubCategory?.['sub_category'],
            selectedSubCategory?.sub_category_id
          );
          setSavedSubCategory(!savedSubCategory);
          setFilterValue('All');
        })
        .catch((err) => {
          // Handle error here
        })
        .finally(() => {
          navigateOption === true
            ? navigate('/reporting-compliance/questionnaire')
            : navigate(NextRoute);
          dispatch(setAssessmentComplete(assessmentType));
        });
    } catch (error) {
      // Handle error here
    }
  };

  const cancelNavigation = () => {
    dispatch(
      setReportModal({
        isOpen: false,
        nextRoute: '',
      })
    );
    navigate(NextRoute);
  };

  const confirmNavigation = async () => {
    try {
      dispatch(
        setReportModal({
          isOpen: false,
          nextRoute: '',
        })
      );
      handleSaveAndNext('SaveDraft', '');
    } catch (err) {
      console.error(err);
    }
  };

  const onHandleComment = (value: any, index: any) => {
    const questionId = questionsForInput?.[currentQuestionIndex]?.question_id;
    const entityId = user?.entity_Id;
    const role = user?.role;
    const commentValue = value;

    if (!categoryId || !entityId || !questionId || !role || !commentValue) {
      return;
    }

    const updatedCommentObject = {
      comments: commentValue,
      commented_by: role,
      commented_date: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1),
    };

    post(`/report/add_comments_to_questions/`, {
      role: role,
      question_id: questionId,
      sub_cat_id: query.get('sub_category_id'),
      cat_id: categoryId,
      entity_id: entityId,
      comments: updatedCommentObject,
    })
      .then((res: any) => {
        if (res) {
          const updatedCommentIndex = {
            ...updatedCommentObject,
          };
          setCommentsArray(
            commentsArray.map((item: any, index: any) =>
              index === currentQuestionIndex
                ? { ...item, comments: [...item.comments, updatedCommentIndex] }
                : item
            )
          );
          setComment('');
          message.success(res.message);
        }
      })
      .catch((err) => {
        console.log('Error while posting comments', err);
      });
  };

  const handleSaveAndNext = (submission: string | undefined, index?: any) => {
    if (index !== undefined) {
      setCheckReviewed((prev) =>
        Array.isArray(prev) ? [...prev, index] : [index]
      );

      if (index >= 0) {
        setFindLastIndex(index + 1);
      } else {
        setFindLastIndex(index);
      }
    }

    const currentQuestion = questionsForInput[currentQuestionIndex];
    const currentAnswers = answers[selectedSubCategory?.sub_category] || [];
    const updatedAnswers = [...currentAnswers];
    // this is to handle the update status for DP/DR/DA
    const assessment_sts: any = {
      status: 'For L1 Review',
      isEditable:
        user.role === 'DATA_PROVIDER' || user.role === 'DATA_REVIEWER'
          ? true
          : false,
      isAppliedReview: true,
      isComplete: true,
      isReview: false,
      reviewStatus: 'Not Applied',
      isApproved: false,
      approvalStatus: 'Not Applied',
    };

    let updateSts = { ...assessment_sts };
    if (user.role === 'DATA_PROVIDER') {
      if (accessQuestionairesData === 'For DP Revision') {
        questionsForInput[currentQuestionIndex].isL1Reviewed = false;
        if (questionsForInput[currentQuestionIndex].isL1DRReverted === true) {
          questionsForInput[currentQuestionIndex].isL1DRReverted = true;
        } else {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
        }
      } else if (
        questionsForInput[currentQuestionIndex].isL1DRReverted === true &&
        questionsForInput[currentQuestionIndex].isL1Reviewed === false
      ) {
        questionsForInput[currentQuestionIndex].isL1Reviewed = true;
      }
    } else if (submission === 'approveReviewer') {
      if (user.role === 'L1_DATA_REVIEWER') {
        updateSts['status'] =
          maxDrLevel === 'L2_DATA_REVIEWER' || maxDrLevel === 'L3_DATA_REVIEWER'
            ? 'For L2 Review'
            : 'For L1 Approval';
        if (accessQuestionairesData === 'For L1 DR Revision') {
          questionsForInput[currentQuestionIndex].isL2Reviewed = false;
          if (questionsForInput[currentQuestionIndex].isL2DRReverted === true) {
            questionsForInput[currentQuestionIndex].isL2DRReverted = true;
          } else {
            questionsForInput[currentQuestionIndex].isL2DRReverted = false;
          }
        } else if (
          questionsForInput[currentQuestionIndex].comment.comments !== '' &&
          questionsForInput[currentQuestionIndex].isL1DRReverted === true
        ) {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
          questionsForInput[currentQuestionIndex].isL1Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DRReverted &&
          questionsForInput[currentQuestionIndex].isL1Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
          questionsForInput[currentQuestionIndex].isL1Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1Reviewed === true
        ) {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else {
          questionsForInput[currentQuestionIndex].isL1Reviewed = true;
        }
      }
      if (user.role === 'L2_DATA_REVIEWER') {
        updateSts['status'] =
          maxDrLevel === 'L3_DATA_REVIEWER'
            ? 'For L3 Review'
            : 'For L1 Approval';
        if (accessQuestionairesData === 'For L2 DR Revision') {
          questionsForInput[currentQuestionIndex].isL3Reviewed = false;
          if (questionsForInput[currentQuestionIndex].isL3DRReverted === true) {
            questionsForInput[currentQuestionIndex].isL3DRReverted = true;
          } else {
            questionsForInput[currentQuestionIndex].isL3DRReverted = false;
          }
        } else if (
          questionsForInput[currentQuestionIndex].comment.comments !== '' &&
          questionsForInput[currentQuestionIndex].isL2DRReverted === true
        ) {
          questionsForInput[currentQuestionIndex].isL2DRReverted = false;
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL2DRReverted = false;
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL2Reviewed === true
        ) {
          questionsForInput[currentQuestionIndex].isL2DRReverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === true
        ) {
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else {
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        }
      }
      if (user.role === 'L3_DATA_REVIEWER') {
        updateSts['status'] = 'For L1 Approval';
        if (accessQuestionairesData === 'For L3 DR Revision') {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
          if (questionsForInput[currentQuestionIndex].isL1DAReverted === true) {
            questionsForInput[currentQuestionIndex].isL1DAReverted = true;
          } else {
            questionsForInput[currentQuestionIndex].isL1DAReverted = false;
          }
        } else if (
          questionsForInput[currentQuestionIndex].comment.comments !== '' &&
          questionsForInput[currentQuestionIndex].isL3DRReverted === true
        ) {
          questionsForInput[currentQuestionIndex].isL3DRReverted = false;
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL3DRReverted = false;
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL3Reviewed === true
        ) {
          questionsForInput[currentQuestionIndex].isL3DRReverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else {
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        }
      }
    } else if (submission === 'approveandNext') {
      if (user.role === 'L1_DATA_APPROVER') {
        questionsForInput[index].isL1Approved = true;
        if (questionsForInput[currentQuestionIndex]?.comment?.comments !== '') {
          questionsForInput[index].isL1Approved = false;
          questionsForInput[index].isL1DAReverted = true;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === false
        ) {
          questionsForInput[index].isL1DAReverted = false;
          questionsForInput[index].isL1Approved = true;
        } else if (
          questionsForInput[index].isL1DAReverted === true &&
          questionsForInput[index].isL1Approved === true
        ) {
          questionsForInput[index].isL1DAReverted = false;
        } else if (
          questionsForInput[index].isL2DAReverted &&
          questionsForInput[index].isL2Approved === false
        ) {
          questionsForInput[index].isL2Approved = true;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === true
        ) {
          questionsForInput[index].isL1DAReverted = false;
        } else if (
          !questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === false
        ) {
          questionsForInput[index].isL1Approved = true;
        }
      } else if (user.role === 'L2_DATA_APPROVER') {
        if (questionsForInput[currentQuestionIndex]?.comment?.comments !== '') {
          questionsForInput[index].isL2Approved = false;
          questionsForInput[index].isL2DAReverted = true;
        } else if (
          questionsForInput[index].isL2DAReverted &&
          questionsForInput[index].isL2Approved === false
        ) {
          questionsForInput[index].isL2DAReverted = false;
          questionsForInput[index].isL2Approved = true;
        } else if (
          questionsForInput[index].isL2DAReverted === true &&
          questionsForInput[index].isL2Approved === true
        ) {
          questionsForInput[index].isL2DAReverted = false;
        } else if (
          questionsForInput[index].isL2DAReverted &&
          questionsForInput[index].isL2Approved === true
        ) {
          questionsForInput[index].isL2DAReverted = false;
        } else if (
          !questionsForInput[index].isL2DAReverted &&
          questionsForInput[index].isL2Approved === false
        ) {
          questionsForInput[index].isL2Approved = true;
        }
      }
    } else if (submission === 'reviewandNext') {
      if (user.role === 'L1_DATA_REVIEWER') {
        if (questionsForInput[currentQuestionIndex]?.comment?.comments !== '') {
          questionsForInput[index].isL1Reviewed = false;
          questionsForInput[index].isL1DRReverted = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments === '' &&
          !questionsForInput[index].isL1DRReverted &&
          questionsForInput[index].isL1Reviewed === false
        ) {
          questionsForInput[index].isL1Reviewed = true;
          questionsForInput[index].isL1DRReverted = false;
        } else if (
          questionsForInput[index].isL1DRReverted &&
          questionsForInput[index].isL1Reviewed === false
        ) {
          questionsForInput[index].isL1DRReverted = false;
          questionsForInput[index].isL1Reviewed = true;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === false
        ) {
          questionsForInput[index].isL1DAReverted = true;
          questionsForInput[index].isL1Approved = true;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === true
        ) {
          questionsForInput[index].isL1DAReverted = false;
          questionsForInput[index].isL1Approved = true;
        } else if (
          questionsForInput[index].isL1DRReverted === true &&
          questionsForInput[index].isL1Reviewed === true
        ) {
          questionsForInput[index].isL1DRReverted = false;
        } else if (
          questionsForInput[index].isL2DRReverted &&
          questionsForInput[index].isL2Reviewed === false
        ) {
          questionsForInput[index].isL2Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else {
          questionsForInput[index].isL1Reviewed = true;
        }
      } else if (user.role === 'L2_DATA_REVIEWER') {
        if (questionsForInput[currentQuestionIndex]?.comment?.comments !== '') {
          questionsForInput[index].isL2Reviewed = false;
          questionsForInput[index].isL2DRReverted = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments === '' &&
          !questionsForInput[index].isL2DRReverted &&
          questionsForInput[index].isL2Reviewed === false
        ) {
          questionsForInput[index].isL2Reviewed = true;
          questionsForInput[index].isL2DRReverted = false;
        } else if (
          questionsForInput[index].isL2DRReverted &&
          questionsForInput[index].isL2Reviewed === false
        ) {
          questionsForInput[index].isL2DRReverted = false;
          questionsForInput[index].isL2Reviewed = true;
        } else if (
          questionsForInput[index].isL2DRReverted === true &&
          questionsForInput[index].isL2Reviewed === true
        ) {
          questionsForInput[index].isL2DRReverted = false;
        } else if (
          questionsForInput[index].isL2DAReverted &&
          questionsForInput[index].isL2Approved === true
        ) {
          questionsForInput[index].isL2DAReverted = false;
          questionsForInput[index].isL2Approved = true;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === false
        ) {
          questionsForInput[index].isL1DAReverted = true;
          questionsForInput[index].isL1Approved = true;
        } else if (
          questionsForInput[index].isL3DRReverted &&
          questionsForInput[index].isL3Reviewed === false
        ) {
          questionsForInput[index].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        }
      } else if (user.role === 'L3_DATA_REVIEWER') {
        if (questionsForInput[currentQuestionIndex]?.comment?.comments !== '') {
          questionsForInput[index].isL3Reviewed = false;
          questionsForInput[index].isL3DRReverted = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments === '' &&
          !questionsForInput[index].isL3DRReverted &&
          questionsForInput[index].isL3Reviewed === false
        ) {
          questionsForInput[index].isL3Reviewed = true;
          questionsForInput[index].isL3DRReverted = false;
        } else if (
          questionsForInput[index].isL3DRReverted &&
          questionsForInput[index].isL3Reviewed === false
        ) {
          questionsForInput[index].isL3DRReverted = false;
          questionsForInput[index].isL3Reviewed = true;
        } else if (
          questionsForInput[index].isL3DAReverted &&
          questionsForInput[index].isL3Approved === true
        ) {
          questionsForInput[index].isL3DAReverted = false;
          questionsForInput[index].isL3Approved = true;
        } else if (
          questionsForInput[index].isL3DRReverted === true &&
          questionsForInput[index].isL3Reviewed === true
        ) {
          questionsForInput[index].isL3DRReverted = false;
        } else if (
          questionsForInput[index].isL1DAReverted &&
          questionsForInput[index].isL1Approved === false
        ) {
          questionsForInput[index].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        }
      }
    } else if (submission === 'reviewerRevert') {
      if (user.role === 'L1_DATA_REVIEWER') {
        updateSts['status'] = 'For DP Revision';
        if (questionsForInput[currentQuestionIndex]?.comment?.comments === '') {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
          questionsForInput[currentQuestionIndex].isL1Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments !== '' &&
          !questionsForInput[currentQuestionIndex].isL1DRReverted &&
          questionsForInput[currentQuestionIndex].isL1Reviewed === false
        ) {
          if (questionsForInput[currentQuestionIndex].dependent_questions) {
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL1DRReverted = true;
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL1Reviewed = false;
          }
          questionsForInput[currentQuestionIndex].isL1DRReverted = true;
          questionsForInput[currentQuestionIndex].isL1Reviewed = false;
        } else if (
          !questionsForInput[currentQuestionIndex].isL1DRReverted &&
          questionsForInput[currentQuestionIndex].isL1Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL1DRReverted = false;
          questionsForInput[currentQuestionIndex].isL1Reviewed = true;
        }
      }
      if (user.role === 'L2_DATA_REVIEWER') {
        updateSts['status'] = 'For L1 DR Revision';
        if (questionsForInput[currentQuestionIndex]?.comment?.comments === '') {
          questionsForInput[currentQuestionIndex].isL2DRReverted = false;
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments !== '' &&
          !questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === false
        ) {
          if (questionsForInput[currentQuestionIndex].dependent_questions) {
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL2DRReverted = true;
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL2Reviewed = false;
          }
          questionsForInput[currentQuestionIndex].isL2DRReverted = true;
          questionsForInput[currentQuestionIndex].isL2Reviewed = false;
        } else if (
          !questionsForInput[currentQuestionIndex].isL2DRReverted &&
          questionsForInput[currentQuestionIndex].isL2Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL2DRReverted = false;
          questionsForInput[currentQuestionIndex].isL2Reviewed = true;
        }
      }
      if (user.role === 'L3_DATA_REVIEWER') {
        updateSts['status'] = 'For L2 DR Revision';
        if (questionsForInput[currentQuestionIndex]?.comment?.comments === '') {
          questionsForInput[currentQuestionIndex].isL3DRReverted = false;
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments !== '' &&
          !questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          if (questionsForInput[currentQuestionIndex].dependent_questions) {
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL3DRReverted = true;
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL3Reviewed = false;
          }
          questionsForInput[currentQuestionIndex].isL3DRReverted = true;
          questionsForInput[currentQuestionIndex].isL3Reviewed = false;
        } else if (
          !questionsForInput[currentQuestionIndex].isL3DRReverted &&
          questionsForInput[currentQuestionIndex].isL3Reviewed === false
        ) {
          questionsForInput[currentQuestionIndex].isL3DRReverted = false;
          questionsForInput[currentQuestionIndex].isL3Reviewed = true;
        }
      }
    } else if (submission === 'approveApprover') {
      if (user.role === 'L1_DATA_APPROVER') {
        updateSts['status'] =
          maxDaLevel === 'L2_DATA_APPROVER' ? 'For L2 Approval' : 'Approved';
        if (accessQuestionairesData === 'For L1 DA Re-approval') {
          questionsForInput[currentQuestionIndex].isL2Approved = false;
          if (questionsForInput[currentQuestionIndex].isL2DAReverted === true) {
            questionsForInput[currentQuestionIndex].isL2DAReverted = true;
          } else {
            questionsForInput[currentQuestionIndex].isL2DAReverted = false;
          }
        } else if (
          questionsForInput[currentQuestionIndex].comment.comments !== '' &&
          questionsForInput[currentQuestionIndex].isL1DAReverted === true
        ) {
          questionsForInput[currentQuestionIndex].isL1DAReverted = false;
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1DAReverted = false;
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL1DAReverted === true &&
          questionsForInput[currentQuestionIndex].isL1Approved === true
        ) {
          questionsForInput[currentQuestionIndex].isL1DAReverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DAReverted &&
          questionsForInput[currentQuestionIndex].isL2Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        }
      }
      if (user.role === 'L2_DATA_APPROVER') {
        updateSts['status'] = 'Approved';
        if (
          questionsForInput[currentQuestionIndex].comment.comments !== '' &&
          questionsForInput[currentQuestionIndex].isL2DAReverted === true
        ) {
          questionsForInput[currentQuestionIndex].isL2DAReverted = false;
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        }
        if (questionsForInput[currentQuestionIndex].isL2Approved === true) {
          questionsForInput[currentQuestionIndex].isL2DAReverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL2Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        } else if (
          questionsForInput[index].isL2DAReverted === true &&
          questionsForInput[index].isL2Approved === true
        ) {
          questionsForInput[index].isL1D2Reverted = false;
        } else if (
          questionsForInput[currentQuestionIndex].isL2DAReverted &&
          questionsForInput[currentQuestionIndex].isL2Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL2DAReverted = false;
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        }
      }
    } else if (submission === 'approverRevert') {
      if (user.role === 'L1_DATA_APPROVER') {
        updateSts['status'] =
          maxDrLevel === 'L3_DATA_REVIEWER'
            ? 'For L3 DR Revision'
            : maxDrLevel === 'L2_DATA_REVIEWER'
              ? 'For L2 DR Revision'
              : 'For L1 DR Revision';
        if (questionsForInput[currentQuestionIndex]?.comment?.comments === '') {
          questionsForInput[currentQuestionIndex].isL1DAReverted = false;
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments !== ''
        ) {
          if (questionsForInput[currentQuestionIndex].dependent_questions) {
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL1DAReverted = true;
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL1Approved = false;
          }
          questionsForInput[currentQuestionIndex].isL1DAReverted = true;
          questionsForInput[currentQuestionIndex].isL1Approved = false;
        } else if (
          !questionsForInput[currentQuestionIndex].isL1DAReverted &&
          questionsForInput[currentQuestionIndex].isL1Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL1Approved = true;
        }
      }
      if (user.role === 'L2_DATA_APPROVER') {
        updateSts['status'] = 'For L1 DA Re-approval';
        if (questionsForInput[currentQuestionIndex]?.comment?.comments === '') {
          questionsForInput[currentQuestionIndex].isL2DAReverted = false;
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        } else if (
          questionsForInput[currentQuestionIndex]?.comment?.comments !== ''
        ) {
          if (questionsForInput[currentQuestionIndex].dependent_questions) {
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL2DAReverted = true;
            questionsForInput[
              currentQuestionIndex
            ].dependent_questions[0].isL2Approved = false;
          }
          questionsForInput[currentQuestionIndex].isL2DAReverted = true;
          questionsForInput[currentQuestionIndex].isL2Approved = false;
        } else if (
          !questionsForInput[currentQuestionIndex].isL2DAReverted &&
          questionsForInput[currentQuestionIndex].isL2Approved === false
        ) {
          questionsForInput[currentQuestionIndex].isL2Approved = true;
        }
      }
    }
    updatedAnswers[currentQuestionIndex] = {
      ...currentQuestion,
      question_id: currentQuestion?.question_id,
      question: currentQuestion.question,
      answer: questionsForInput[currentQuestionIndex].answer,
      isAnswered:
        questionsForInput[currentQuestionIndex].answer !== '' &&
        questionsForInput[currentQuestionIndex].answer !== undefined
          ? true
          : false,
    };
    const newAnswers = {
      ...answers,
      [selectedSubCategory?.sub_category]: updatedAnswers,
    };
    const updatedAnsNullRemoved = updatedAnswers.filter(
      (item) => item !== null
    );
    const updatedQuestions = questionsForInput.map((question) => {
      const updatedValue = updatedAnsNullRemoved?.find(
        (item) => item?.question_id === question?.question_id
      );
      if (updatedValue) {
        return {
          ...question,
          answer: updatedValue.answer,
          isAnswered: true,
          // isModified: Object.keys(commentsDataValue).length > 0 ? true : false,
          // comments: [...question.comments, ...[commentsDataValue]],
        };
      }
      return question;
    });
    setQuestionsForInput(updatedQuestions);
    setAnswers(newAnswers);
    if (
      updateSts?.status === 'For L1 Review' &&
      isEmpty(maxDrLevel) &&
      currentQuestionIndex === questionsForInput.length - 1 &&
      submission !== 'SaveDraft'
    ) {
      message.error(
        'Reviewer for this Material Topic has not been assigned. Kindly check with Admin for more details.'
      );
    } else if (
      updateSts?.status === 'For L1 Approval' &&
      isEmpty(maxDaLevel) &&
      currentQuestionIndex === questionsForInput.length - 1 &&
      submission !== 'SaveDraft'
    ) {
      message.error(
        'Approver for this Material Topic has not been assigned. Kindly check with Admin for more details'
      );
    } else {
      if (submission === 'SaveDraft') {
        handleSaveAsDraft(questionsForInput, updateSts, '', true);
      } else if (currentQuestionIndex === questionsForInput.length - 1) {
        handleSubmission(questionsForInput, updateSts, '');
      } else if (
        submission !== '' &&
        submission !== undefined &&
        submission !== 'approveandNext' &&
        submission !== 'reviewandNext'
      ) {
        handleSubmission(questionsForInput, updateSts, 'update');
      } else {
        setCurrentQuestionIndex((prevIndex) =>
          prevIndex + 1 < questionsForInput.length ? prevIndex + 1 : 0
        );
        setAnswer('');
        setIsChanged(false);
      }
    }
  };

  const handleSubmission = async (
    submissionAnswers: { [x: string]: any },
    assessment_sts: any,
    update: string
  ) => {
    var updatedQnA = submissionAnswers.map(function (obj: any) {
      let newObj: any = { ...obj };
      if (newObj?.comment?.comments !== '') {
        newObj.comments = [...newObj.comments, newObj.comment];
        newObj.isModified = revisionArr?.includes(assessment_sts?.status)
          ? true
          : false;
      } else if (approvalArr?.includes(assessment_sts?.status)) {
        newObj.isModified = false;
      }
      delete newObj.comment;
      delete newObj.isModifyVal;
      delete newObj.isModify;
      return newObj;
    });
    const submissionData: any = {
      categoryName: title || '',
      qna: {
        questions: update ? updatedQnA : updatedQnA || [],
      },
      assessment_status: assessment_sts,
      entity_Id: user.entity_Id,
      category_id: categoryId,
      sub_category_id: selectedSubCategory?.sub_category_id,
      subcategoryName: selectedSubCategory?.['sub_category'],
    };
    post(`/report/save_subcategory_assessments/`, submissionData)
      .then((res: any) => {
        setQuestionsForInput([]);
        message.success(res?.message);
        setAnswer('');
        setAnswerReset(false);
        getQuestion(
          title,
          selectedSubCategory?.['sub_category'],
          selectedSubCategory?.sub_category_id
        );
        setSavedSubCategory(!savedSubCategory);
        setFilterValue('All');
        navigate('/reporting-compliance/questionnaire');
      })
      .catch((err) => console.log(err));
  };

  const handlePageChange = (page: number, index: number, data?: any) => {
    const lastIndex = index && questionsForInput.length - 1 === index;

    if (lastIndex) {
      setEnableBtn(
        questionsForInput.length === 1 ? true : lastIndex ? true : false
      );
      setFindLastIndex(index);
    } else {
      setFindLastIndex(index);
    }

    setCurrentQuestionIndex(page - 1);
    const currentAnswers = answers[selectedSubCategory?.sub_category] || [];
    setAnswer(currentAnswers[page - 1]?.answer || '');
    setIsChanged(false);
  };

  const avatarImages = [
    'https://www.w3schools.com/howto/img_avatar.png',
    'https://www.w3schools.com/w3images/avatar2.png',
    'https://www.w3schools.com/w3images/avatar3.png',
    'https://www.w3schools.com/w3images/avatar4.png',
  ];

  const handleCopy = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    text: string
  ) => {
    e.stopPropagation();
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    try {
      document.execCommand('copy');
      message.success('Reference Answer copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy text to clipboard.');
    } finally {
      document.body.removeChild(tempElement);
    }
  };

  const extractQuestionId = (questionToBeConverted: string) => {
    const parts =
      questionToBeConverted !== undefined
        ? questionToBeConverted?.split('-')
        : [];
    const result = parts[parts.length - 1];
    return result?.toUpperCase();
  };

  const handleModify = (data: any) => {
    var newArray = questionsForInput.map(function (obj) {
      return { ...obj, isModifyVal: true };
    });
    setisModifyVal(true);
    setQuestionsForInput(newArray);
  };

  const formatDate = (date: any) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    // Format minutes to have leading zero if less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${month} ${year} ${hours}:${minutes} ${period}`;
  };

  const commentsLogoConverter = (commentedBy: string) => {
    const data = commentedBy?.charAt(0) ? commentedBy?.charAt(0) : ' - ';
    return data;
  };

  const checkAllQstnsAnswered = (questionsForInput: any) => {
    const allAnswered = questionsForInput.every((question: any) => {
      const isAnswered = checkQstnAnswered(question);
      return isAnswered;
    });

    return allAnswered;
  };

  const isNonEmpty = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  };

  const checkAnswer = (
    answer: any,
    type: 'Text' | 'Numeric' | 'List' | 'Male or Female'
  ): boolean => {
    if (type === 'Numeric') {
      // Check if the answer is a valid number or a string that represents a number
      return !isNaN(answer) && answer !== ''; // Ensure it's a valid number or string number
    }

    if (type === 'Text') {
      return isNonEmpty(answer);
    }
    if (type === 'List') {
      return Array.isArray(answer) && answer.every(isNonEmpty);
    }
    if (type === 'Male or Female') {
      return answer === 'Male' || answer === 'Female';
    }
    return false;
  };

  const checkQstnAnswered = (currentQuestionData: any): boolean => {
    if (!currentQuestionData) {
      return false; // Return false if data is not available
    }

    const { question_type, answer, dependent_questions, sub_questions } =
      currentQuestionData;

    switch (question_type.trim()) {
      case 'Text':
      case 'Numeric':
        return isNonEmpty(answer);
      case 'List':
        return checkAnswer(answer, 'List');
      case 'MultiChoice':
        return answer.length > 0;
      case 'Bool':
        if (
          (answer === 'No' &&
            (!dependent_questions.length || dependent_questions.length == 1)) ||
          (answer === 'Yes' && !dependent_questions.length)
        ) {
          return true;
        }
        if (
          (answer === 'Yes' && dependent_questions.length > 0) ||
          (answer === 'No' && dependent_questions.length > 1)
        ) {
          return dependent_questions.some((item: any) => {
            if (item.question_type === 'Bool') {
              return true;
            }

            return checkAnswer(item.answer, item.question_type);
          });
        }

        return false;
      case 'Multiresponse':
        return sub_questions
          ? sub_questions.every((item: any) =>
              checkAnswer(item.answer, item.question_type)
            )
          : false;

      case 'MultiList':
        return sub_questions
          ? sub_questions.every((item: any, index: any) => {
              return checkAnswer(item.answer, item.question_type);
            })
          : false;

      default:
        return false;
    }
  };

  const shouldDisableField = (question: any, accessQuestionnairesData: any) => {
    return (
      (user.role !== 'DATA_PROVIDER' &&
        (!reviewerCondition() || isEmpty(question?.isModifyVal))) ||
      (user.role === 'DATA_PROVIDER' &&
        (isEmpty(accessQuestionnairesData) ||
          (accessQuestionnairesData !== 'For DP Submission' &&
            accessQuestionnairesData !== 'For DP Revision')))
    );
  };

  const currentQstn = questionsForInput[currentQuestionIndex];

  // text field question inputbox
  const textQuestion = (qstnType?: string, subQ?: any) => {
    return (
      <TextArea
        rows={4}
        className={Styles?.textAreaStyle}
        value={
          qstnType !== undefined &&
          (qstnType === 'dpdtQstn' || qstnType === 'subQstn')
            ? subQ?.answer
            : questionsForInput[currentQuestionIndex].answer
        }
        onChange={(e) => {
          const newValue = e.target.value;
          if (qstnType !== undefined && qstnType === 'dpdtQstn') {
            handleSubQuestionAnswerChange(
              newValue,
              questionsForInput[currentQuestionIndex]?.question_id,
              currentQstn.question_type === 'MultiList'
                ? subQ.question_key
                : subQ.question,
              'dpdtQstn'
            );
          } else if (qstnType !== undefined && qstnType === 'subQstn') {
            handleSubQuestionAnswerChange(
              newValue,
              questionsForInput[currentQuestionIndex]?.question_id,
              currentQstn.question_type === 'MultiList'
                ? subQ.question_key
                : subQ.question,
              'subQstn'
            );
          } else {
            handleAnswerChange(
              newValue,
              questionsForInput[currentQuestionIndex]?.answer
            );
          }
        }}
        placeholder="Type your answer here..."
        disabled={shouldDisableField(
          currentQstn,
          accessQuestionairesData?.trim()
        )}
      />
    );
  };
  // numeric field question inputbox
  const numericQuestion = (qstnType?: string, subQ?: any) => {
    return (
      <InputComponent
        type="number"
        onKeyDown={(e: any) => {
          if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
          }
        }}
        value={
          qstnType !== undefined &&
          (qstnType === 'dpdtQstn' || qstnType === 'subQstn')
            ? subQ?.answer
            : questionsForInput[currentQuestionIndex].answer
        }
        placeHolder="Enter number"
        onChange={(e: any) => {
          const newValue = e.target.value;
          if (/^\d*\.?\d*$/.test(newValue)) {
            if (qstnType !== undefined && qstnType === 'dpdtQstn') {
              handleSubQuestionAnswerChange(
                newValue,
                questionsForInput[currentQuestionIndex]?.question_id,
                currentQstn.question_type === 'MultiList'
                  ? subQ.question_key
                  : subQ.question,
                'dpdtQstn'
              );
            } else if (qstnType !== undefined && qstnType === 'subQstn') {
              handleSubQuestionAnswerChange(
                newValue,
                questionsForInput[currentQuestionIndex]?.question_id,
                currentQstn.question_type === 'MultiList'
                  ? subQ.question_key
                  : subQ.question,
                'subQstn'
              );
            } else {
              handleAnswerChange(
                newValue,
                questionsForInput[currentQuestionIndex]?.answer
              );
            }
          }
        }}
        disabled={shouldDisableField(
          currentQstn,
          accessQuestionairesData?.trim()
        )}
      />
    );
  };

  // Bool field question inputbox
  const boolQuestion = () => {
    return (
      <Radio.Group
        className={`${Styles.radioGrp}`}
        onChange={(e) =>
          handleAnswerChange(e.target.value, currentQstn?.answer)
        }
        value={answerReset || answer ? answer : currentQstn.answer}
        disabled={shouldDisableField(
          currentQstn,
          accessQuestionairesData?.trim()
        )}
      >
        <Radio value={'Yes'}>Yes</Radio>
        <Radio value={'No'}>No</Radio>
      </Radio.Group>
    );
  };

  const MultiChoiceCheckbox = () => {
    const options = currentQstn.sub_questions.map((item: any) => {
      return {
        key: item,
        value: item,
      };
    });
    // If the last item is "All of the above", set its value to all items

    return (
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(selectedValues: any) => {
          if (selectedValues.includes('All of the above')) {
            selectedValues = options.map((item: any) => item.key);
          }
          handleAnswerChange(selectedValues, currentQstn?.answer);
        }}
        value={answerReset || answer ? answer : currentQstn.answer}
        disabled={shouldDisableField(
          currentQstn,
          accessQuestionairesData?.trim()
        )}
      >
        <Row>
          {options.map((item: any) => {
            return (
              <Col span={24} className="mt-2">
                <Checkbox value={item.value} style={{ fontSize: '18px' }}>
                  {item.key}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    );
  };

  const MaleOrFemaleQuestion = (qstnType: any, subQ: any) => {
    return (
      <Radio.Group
        className={`${Styles.radioGrp}`}
        onChange={(e) => {
          handleSubQuestionAnswerChange(
            e.target.value,
            questionsForInput[currentQuestionIndex]?.question_id,
            currentQstn.question_type === 'MultiList'
              ? subQ.question_key
              : subQ.question,
            'subQstn'
          );
        }}
        value={
          qstnType !== undefined &&
          (qstnType === 'dpdtQstn' || qstnType === 'subQstn')
            ? subQ?.answer
            : questionsForInput[currentQuestionIndex].answer
        }
        disabled={shouldDisableField(
          currentQstn,
          accessQuestionairesData?.trim()
        )}
      >
        <Radio value={'Male'}>Male</Radio>
        <Radio value={'Female'}>Female</Radio>
      </Radio.Group>
    );
  };

  const handleListInputChange = (value: string, index: number) => {
    setQuestionsForInput((prevQuestions) =>
      prevQuestions.map((question) =>
        question.question_id ===
        questionsForInput[currentQuestionIndex]?.question_id
          ? {
              ...question,
              answer: [
                ...question.answer.slice(0, index),
                value,
                ...question.answer.slice(index + 1),
              ],
              isAnswered: true,
            }
          : question
      )
    );
  };

  const handleSubListInputChange = (
    value: string,
    index: number,
    questionId?: any,
    subQuestion?: any
  ) => {
    const qstnAttr = 'sub_questions';
    const updatedQuestions = questionsForInput.map((question) => {
      if (questionId === question?.question_id) {
        const updatedSubQuestions = question[qstnAttr]?.map((subQ: any) => {
          if (subQ.question === subQuestion?.question) {
            return {
              ...subQ,
              isAnswered: true,
              answer: [
                ...subQ.answer.slice(0, index),
                value,
                ...subQ.answer.slice(index + 1),
              ],
            };
          }
          return subQ;
        });
        return {
          ...question,
          [qstnAttr]: updatedSubQuestions,
        };
      }
      return question;
    });
    setQuestionsForInput(updatedQuestions);
  };

  const updateInput = (action: 'add' | 'remove', index?: number) => {
    setQuestionsForInput((prevQuestions) =>
      prevQuestions.map((question) =>
        question.question_id ===
        questionsForInput[currentQuestionIndex]?.question_id
          ? {
              ...question,
              answer:
                action === 'add'
                  ? [...(question.answer || []), '']
                  : question.answer.filter((_: any, i: any) => i !== index),
              isAnswered: true,
            }
          : question
      )
    );
  };

  const updateSubQuestions = (
    action: 'add' | 'remove',
    index?: number,
    questionId?: any,
    subQuestion?: any
  ) => {
    const qstnAttr = 'sub_questions';

    const updatedQuestions = questionsForInput.map((question) => {
      if (questionId === question?.question_id) {
        const updatedSubQuestions = question[qstnAttr]?.map((subQ: any) => {
          if (subQ.question === subQuestion?.question) {
            const updatedSubQuestions =
              action === 'add'
                ? [...(subQ.answer || []), '']
                : subQ.answer?.filter((_: any, i: any) => i !== index) || [];
            return { ...subQ, isAnswered: true, answer: updatedSubQuestions };
          }
          return subQ;
        });
        return {
          ...question,
          [qstnAttr]: updatedSubQuestions,
        };
      }

      return question;
    });

    setQuestionsForInput(updatedQuestions);
  };

  // list field question inputbox
  const listQuestion = (qstnType?: string, subQ?: any, question?: string) => {
    const mapQstn =
      qstnType !== undefined && qstnType === 'subQstn' ? subQ : currentQstn;
    return (
      <>
        {Array.isArray(mapQstn?.answer) &&
          mapQstn?.answer?.map((answer: any, index: any) => (
            <Row gutter={[4, 4]} className={Styles?.listQstnMargin}>
              <Col
                span={
                  qstnType !== undefined && qstnType === 'subQstn'
                    ? index === 0
                      ? 24
                      : 21
                    : 12
                }
              >
                <InputComponent
                  onChange={(e: any) => {
                    if (qstnType === 'subQstn') {
                      handleSubListInputChange(
                        e.target.value,
                        index,
                        question,
                        subQ
                      );
                    } else {
                      handleListInputChange(e.target.value, index);
                    }
                  }}
                  value={answer}
                  placeHolder=""
                  disabled={shouldDisableField(
                    currentQstn,
                    accessQuestionairesData?.trim()
                  )}
                />
              </Col>
              {!shouldDisableField(
                currentQstn,
                accessQuestionairesData?.trim()
              ) &&
                index !== 0 && (
                  <Col
                    span={
                      qstnType !== undefined && qstnType === 'subQstn'
                        ? index === 0
                          ? ''
                          : 3
                        : ''
                    }
                    className={Styles?.listQstnStyle}
                  >
                    <ButtonComponent
                      hierarchy="secondary-gray"
                      onClick={() =>
                        qstnType === 'subQstn'
                          ? updateSubQuestions('remove', index, question, subQ)
                          : updateInput('remove', index)
                      }
                    >
                      <MinusIcon />
                    </ButtonComponent>
                  </Col>
                )}
            </Row>
          ))}
        {!shouldDisableField(currentQstn, accessQuestionairesData?.trim()) && (
          <Row>
            <ButtonComponent
              onClick={() =>
                qstnType === 'subQstn'
                  ? updateSubQuestions('add', undefined, question, subQ)
                  : updateInput('add')
              }
            >
              <AddIcon />
            </ButtonComponent>
          </Row>
        )}
      </>
    );
  };

  const getRoleOnLegend = (value: string) => {
    if (
      (user.role === 'L1_DATA_REVIEWER' ||
        user.role === 'L2_DATA_REVIEWER' ||
        user.role === 'L3_DATA_REVIEWER') &&
      value === 'legendA'
    ) {
      return 'Reviewed';
    } else if (
      (user.role === 'L1_DATA_REVIEWER' ||
        user.role === 'L2_DATA_REVIEWER' ||
        user.role === 'L3_DATA_REVIEWER') &&
      value === 'legendB'
    ) {
      return 'Not Reviewed';
    } else if (user.role === 'DATA_PROVIDER' && value === 'legendA') {
      return 'Attempted';
    } else if (user.role === 'DATA_PROVIDER' && value === 'legendB') {
      return 'Not Attempted';
    } else if (
      (user.role === 'L1_DATA_APPROVER' ||
        user.role === 'L2_DATA_APPROVER' ||
        user.role === 'L3_DATA_APPROVER') &&
      value === 'legendA'
    ) {
      return 'Approved';
    } else if (
      (user.role === 'L1_DATA_APPROVER' ||
        user.role === 'L2_DATA_APPROVER' ||
        user.role === 'L3_DATA_APPROVER') &&
      value === 'legendB'
    ) {
      return 'Not Approved';
    }
  };

  const renderDependentQuestions = () => {
    const currentQuestion = questionsForInput[currentQuestionIndex];
    if (
      currentQuestion?.question_type !== 'Bool' ||
      currentQuestion?.answer == '' ||
      !currentQuestion?.dependent_questions?.length
    ) {
      return null;
    }

    const dependentQuestionsToRender =
      currentQuestion?.answer === 'Yes'
        ? [currentQuestion.dependent_questions[0]]
        : (currentQuestion.dependent_questions.length >= 2 && [
            currentQuestion.dependent_questions[1],
          ]) ||
          [];

    if (!dependentQuestionsToRender.length) {
      return null;
    }
    return dependentQuestionsToRender.map((subQ: any, index: any) => {
      const { question, question_type } = subQ;

      const renderQuestionComponent = () => {
        switch (question_type) {
          case 'Text':
            return <Col span={24}>{textQuestion('dpdtQstn', subQ)}</Col>;
          case 'Numeric':
            return <Col span={12}>{numericQuestion('dpdtQstn', subQ)}</Col>;
          default:
            return null;
        }
      };

      return (
        <React.Fragment key={index}>
          <Row className={Styles?.renderQstnStyle}>{question}</Row>
          <Row>{renderQuestionComponent()}</Row>
        </React.Fragment>
      );
    });
  };

  const [subQuestions, setSubQuestions] = useState<any>([]);

  useEffect(() => {
    if (
      currentQstn &&
      currentQstn?.sub_questions.length &&
      currentQstn?.sub_questions
    ) {
      setSubQuestions(currentQstn?.sub_questions);
    }
  }, [currentQstn]);

  const currentQuestion = questionsForInput[currentQuestionIndex];

  const [initialSubQuestionsLength, setInitialSubQuestionsLength] = useState(0);

  const [initialdata, setInitialdata] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (currentQuestion && !isChanged) {
      setInitialSubQuestionsLength(currentQuestion?.sub_questions.length);
      setIsChanged(true);
    }
  }, [currentQuestion, isChanged, currentQuestionIndex]);

  const handleAddMultipleQstns: any = (incomingQuestion: any) => {
    const updatedQuestionsForInput = questionsForInput.map((q) => {
      // Deep cloning the question
      const newQ = { ...q };

      if (incomingQuestion.question_id === q.question_id) {
        const uniqueQstn = getUniqueQuestions(incomingQuestion?.sub_questions);
        // Duplicating sub questions
        newQ.sub_questions = [...q?.sub_questions];

        for (let i = 0; i < initialSubQuestionsLength; ++i) {
          const subQuestionToBeAdded = { ...uniqueQstn[i] };

          if (Object.keys(subQuestionToBeAdded).length > 0) {
            // Only add the 'answer' key if it's not an empty object
            subQuestionToBeAdded.answer = '';
            // Push the non-empty object to newQ.sub_questions
            newQ.sub_questions.push(subQuestionToBeAdded);
          }
        }

        // Injecting question_key (unique) into sub_questions
        const newSub_questions = newQ.sub_questions.map(
          (item: any, index: number) => {
            const newItem = { ...item };
            newItem['question_key'] = item.question + '_' + index;
            return newItem;
          }
        );

        newQ.sub_questions = newSub_questions;
      }
      return newQ;
    });

    setQuestionsForInput(updatedQuestionsForInput);
  };

  // Handle Remove
  const handleRemoveMultipleQstns: any = (incomingQuestion: any) => {
    const updatedQuestionsForInput = questionsForInput.map((q) => {
      // Deep cloning the question
      const newQ = { ...q };

      if (incomingQuestion.question_id === q.question_id) {
        // Duplicating sub questions
        // If the index is 0, don't remove anything

        // Duplicating sub questions, but only if index is not 0
        newQ.sub_questions.splice(
          newQ.sub_questions.length - initialSubQuestionsLength,
          initialSubQuestionsLength
        );
      }

      return newQ;
    });

    setQuestionsForInput(updatedQuestionsForInput);
  };

  const renderSubQuestions = () => {
    if (
      !currentQuestion ||
      (!currentQuestion?.sub_questions?.length &&
        currentQuestion?.question_type !== 'MultiChoice')
    ) {
      return null;
    }

    if (currentQuestion.question_type === 'MultiList') {
      const newSubQuestions = currentQuestion?.sub_questions.map(
        (item: any, index: any) => {
          const newItem = { ...item };
          newItem['question_key'] = item.question + '_' + index;
          return newItem;
        }
      );

      currentQuestion.sub_questions = newSubQuestions;
    }

    return currentQuestion?.sub_questions.map((subQ: any, index: any) => {
      const { question, question_type } = subQ;

      const renderQuestionComponent = () => {
        switch (question_type?.trim()) {
          case 'Text':
            return textQuestion('subQstn', subQ);
          case 'Numeric':
            return numericQuestion('subQstn', subQ);
          case 'List':
            return listQuestion('subQstn', subQ, currentQuestion?.question_id);
          case 'Male or Female':
            return MaleOrFemaleQuestion('subQstn', subQ);
          default:
            return null;
        }
      };

      return (
        <>
          <Col span={12} key={index}>
            <>
              <div style={{ width: '100%' }}>{question}</div>
              {renderQuestionComponent()}

              {currentQuestion.question_type === 'MultiList' &&
                index === currentQuestion?.sub_questions.length - 1 && (
                  <>
                    <ButtonComponent
                      className="mt-3"
                      onClick={() => handleAddMultipleQstns(currentQuestion)}
                      disabled={// Disable the button if all sub-question answer is empty
                      currentQuestion?.sub_questions.every(
                        (subQ: any) => !isNonEmpty(subQ.answer)
                      )}
                    >
                      +
                    </ButtonComponent>

                    {/* Remove Button */}
                    <ButtonComponent
                      hierarchy="secondary-gray"
                      className="mt-3 mx-2"
                      onClick={() => handleRemoveMultipleQstns(currentQuestion)}
                      disabled={
                        currentQuestion?.sub_questions.length ===
                        initialSubQuestionsLength
                      }
                    >
                      -
                    </ButtonComponent>
                  </>
                )}
            </>
          </Col>

          {(index + 1) % currentQuestion.numberOfSubQ === 0 && (
            <Col span={24}>
              {/* This can be an empty row or any other content you want to add after every numberOfSubQ items */}
            </Col>
          )}
        </>
      );
    });
  };

  const convertTextToHtml = (text: any) => {
    const htmlEscaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const htmlWithLineBreaks = htmlEscaped.replace(/\n/g, '<br>');
    return htmlWithLineBreaks;
  };

  const reviewerCondition = () => {
    return (
      (user.role === 'L1_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L1 Review') ||
      (user.role === 'L2_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L2 Review') ||
      (user.role === 'L3_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L3 Review') ||
      (user.role === 'L1_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L1 DR Revision') ||
      (user.role === 'L2_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L2 DR Revision') ||
      (user.role === 'L3_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L3 DR Revision')
    );
  };

  const approverCondition = () => {
    return (
      (user.role === 'L1_DATA_APPROVER' &&
        accessQuestionairesData?.trim() === 'For L1 Approval') ||
      (user.role === 'L2_DATA_APPROVER' &&
        accessQuestionairesData?.trim() === 'For L2 Approval') ||
      (user.role === 'L1_DATA_APPROVER' &&
        accessQuestionairesData?.trim() === 'For L1 DA Re-approval')
    );
  };

  const revisionArr: any = [
    'For DP Revision',
    'For L1 DR Revision',
    'For L2 DR Revision',
    'For L3 DR Revision',
    'For L1 DA Re-approval',
  ];

  const reviewerRevision = () => {
    if (user.role === 'DATA_PROVIDER') {
      return [
        'For L1 DR Revision',
        'For L2 DR Revision',
        'For L3 DR Revision',
        'For L1 Review',
        'For L2 Review',
        'For L3 Review',
        'For L1 Approval',
        'For L2 Approval',
        'For DP Revision',
        'Approved',
      ];
    } else if (user.role === 'L1_DATA_REVIEWER') {
      return [
        'For L2 DR Revision',
        'For L3 DR Revision',
        'For L2 Review',
        'For L3 Review',
        'For L1 Approval',
        'For L2 Approval',
        'Approved',
      ];
    } else if (user.role === 'L2_DATA_REVIEWER') {
      return [
        'For L3 DR Revision',
        'For L3 Review',
        'For L1 Approval',
        'For L2 Approval',
        'Approved',
      ];
    } else if (user.role === 'L3_DATA_REVIEWER') {
      return ['For L1 Approval', 'For L2 Approval', 'Approved'];
    } else if (user.role === 'L1_DATA_APPROVER') {
      return ['For L2 Approval', 'Approved'];
    } else if (user.role === 'L2_DATA_APPROVER') {
      return ['Approved'];
    } else {
      return [];
    }
  };

  const actionAfterRevision = () => {
    if (user.role === 'L1_DATA_REVIEWER') {
      return ['For L1 Review'];
    } else if (user.role === 'L2_DATA_REVIEWER') {
      return ['For L2 Review'];
    } else if (user.role === 'L3_DATA_REVIEWER') {
      return ['For L3 Review'];
    } else if (user.role === 'L1_DATA_APPROVER') {
      return ['For L1 Approval'];
    } else if (user.role === 'L2_DATA_APPROVER') {
      return ['For L2 Approval'];
    } else {
      return [];
    }
  };

  const approvalArr: any = [
    'For L1 Review',
    'For L2 Review',
    'For L3 Review',
    'For L1 Approval',
    'For L2 Approval',
    'Approved',
  ];

  const reviewerApproverBtn = () => {
    if (
      accessQuestionairesData?.trim() === 'For L1 Review' ||
      accessQuestionairesData?.trim() === 'For L1 DR Revision'
    ) {
      switch (maxDrLevel) {
        case 'L1_DATA_REVIEWER':
          return maxDaLevel === 'L1_DATA_APPROVER'
            ? 'Submit for Approval'
            : 'Submit for L1 Approval';
        case 'L2_DATA_REVIEWER':
        case 'L3_DATA_REVIEWER':
          return 'Submit for L2 Review';
        default:
          return 'Invalid Reviewer Level';
      }
    }

    if (
      accessQuestionairesData?.trim() === 'For L2 Review' ||
      accessQuestionairesData?.trim() === 'For L2 DR Revision'
    ) {
      switch (maxDrLevel) {
        case 'L2_DATA_REVIEWER':
          return maxDaLevel === 'L1_DATA_APPROVER'
            ? 'Submit for Approval'
            : 'Submit for L1 Approval';
        case 'L3_DATA_REVIEWER':
          return 'Submit for L3 Review';
        default:
          return 'Invalid Reviewer Level';
      }
    }

    if (
      accessQuestionairesData?.trim() === 'For L3 Review' ||
      accessQuestionairesData?.trim() === 'For L3 DR Revision'
    ) {
      return maxDaLevel === 'L1_DATA_APPROVER'
        ? 'Submit for Approval'
        : 'Submit for L1 Approval';
    }

    if (
      accessQuestionairesData?.trim() === 'For L1 Approval' ||
      accessQuestionairesData?.trim() === 'For L1 DA Re-approval'
    ) {
      switch (maxDaLevel) {
        case 'L1_DATA_APPROVER':
          return 'Approve';
        case 'L2_DATA_APPROVER':
          return 'Submit for L2 Approval';
        default:
          return 'Invalid Approver Level';
      }
    }

    if (
      accessQuestionairesData?.trim() === 'For L2 Approval' ||
      accessQuestionairesData?.trim() === 'For L2 Re-approval'
    ) {
      return 'Approve';
    }

    return 'Invalid State';
  };

  // const topBarBtn = ['Status', 'Guidance', 'Sample'];
  useEffect(() => {
    getLengthList();
  }, [subCategories]);

  useEffect(() => {
    setCommentsArray(questionsForInput);
  }, [questionsForInput]);

  const getStatusColor = (data: any) => {
    if (user.role === 'DATA_PROVIDER') {
      if (data?.isL1DRReverted && data?.isL1Reviewed) {
        return false;
      } else if (data?.isL1DRReverted && !data?.isL1Reviewed) {
        return true;
      }
    } else if (user.role === 'L1_DATA_REVIEWER') {
      if (data?.isL1DRReverted) {
        return true;
      } else if (data.isL1Reviewed === false && data?.isL1DRReverted === true) {
        return true;
      } else if (
        data.isL1Reviewed === true &&
        data?.isL2DRReverted === false &&
        data?.isL1DAReverted === false
      ) {
        return false;
      } else if (
        data.isL1Reviewed === true &&
        data?.isL2DRReverted === true &&
        data.isL2Reviewed === false
      ) {
        return true;
      } else if (
        data.isL1Reviewed === true &&
        data?.isL1DAReverted === true &&
        data.isL1Approved === false
      ) {
        return true;
      } else if (
        data.isL1Reviewed === true &&
        data?.isL1DAReverted === true &&
        data.isL1Approved === true
      ) {
        return false;
      } else if (data?.isL1DRReverted === true) {
        return true;
      }
    } else if (user.role === 'L2_DATA_REVIEWER') {
      if (data?.isL2DRReverted) {
        return true;
      } else if (data.isL2Reviewed === false && data?.isL2DRReverted === true) {
        return true;
      } else if (data.isL2Reviewed === true && data?.isL3DRReverted === false) {
        return false;
      } else if (
        data.isL2Reviewed === true &&
        data?.isL3DRReverted === true &&
        data?.isL3Reviewed === false
      ) {
        return true;
      } else if (
        data.isL2Reviewed === true &&
        data?.isL1DAReverted === true &&
        data?.isL1Approved === false
      ) {
        return false;
      } else if (
        data.isL1Reviewed === true &&
        data?.isL1DAReverted === true &&
        data.isL1Approved === true
      ) {
        return false;
      } else if (data?.isL2DRReverted === true) {
        return true;
      }
    } else if (user.role === 'L3_DATA_REVIEWER') {
      if (data?.isL3DRReverted) {
        return true;
      } else if (data.isL3Reviewed === false && data?.isL1DAReverted === true) {
        return true;
      } else if (data.isL3Reviewed === true && data?.isL1DAReverted === false) {
        return false;
      } else if (
        data.isL3Reviewed === true &&
        data?.isL1DAReverted === true &&
        data?.isL1Approved === false
      ) {
        return true;
      } else if (
        data.isL3Reviewed === true &&
        data?.isL1DAReverted === true &&
        data?.isL1Approved === true
      ) {
        return false;
      } else if (data?.isL3DRReverted === true) {
        return true;
      }
    } else if (user.role === 'L1_DATA_APPROVER') {
      if (data?.isL1DAReverted === true) {
        return true;
      } else if (
        data.isL1Approved === true &&
        data?.isL2DAReverted === true &&
        data?.isL2Approved === true
      ) {
        return false;
      } else if (data.isL1Approved === true && data?.isL2DAReverted === false) {
        return false;
      } else if (
        data.isL1Approved === true &&
        data?.isL2DAReverted === true &&
        data?.isL2Approved === false
      ) {
        return true;
      }
    } else if (user.role === 'L2_DATA_APPROVER') {
      if (data?.isL2DAReverted) {
        return true;
      } else if (data?.isL2DAReverted === false && data?.isL2Approved) {
        return false;
      }
    }
  };

  const onActionUser = (val: any) => {
    if (
      user.role === 'DATA_PROVIDER' &&
      (accessQuestionairesData?.trim() === null ||
        accessQuestionairesData?.trim() === 'For DP Submission' ||
        accessQuestionairesData?.trim() === 'For DP Revision')
    ) {
      return true;
    } else if (
      user.role === 'L1_DATA_REVIEWER' &&
      (accessQuestionairesData?.trim() === 'For L1 Review' ||
        accessQuestionairesData?.trim() === 'For L1 DR Revision')
    ) {
      return true;
    } else if (
      (user.role === 'L2_DATA_REVIEWER' &&
        accessQuestionairesData?.trim() === 'For L2 Review') ||
      accessQuestionairesData?.trim() === 'For L2 DR Revision'
    ) {
      return true;
    } else if (
      user.role === 'L3_DATA_REVIEWER' &&
      (accessQuestionairesData?.trim() === 'For L3 Review' ||
        accessQuestionairesData?.trim() === 'For L3 DR Revision')
    ) {
      return true;
    } else if (
      user.role === 'L2_DATA_APPROVER' &&
      accessQuestionairesData?.trim() === 'For L2 Approval'
    ) {
      return true;
    } else if (
      user.role === 'L1_DATA_APPROVER' &&
      (accessQuestionairesData?.trim() === 'For L1 Approval' ||
        accessQuestionairesData?.trim() === 'For L1 DA Re-approval')
    ) {
      return true;
    }
  };

  const onApproveCommented = (val: any) => {
    if (
      user.role === 'DATA_PROVIDER' &&
      accessQuestionairesData?.trim() === 'For DP Revision' &&
      val?.isL1DRReverted
    ) {
      return true;
    } else if (
      user.role === 'L1_DATA_REVIEWER' &&
      (((accessQuestionairesData?.trim() === 'For L1 DR Revision' ||
        accessQuestionairesData?.trim() === 'For DP Revision' ||
        accessQuestionairesData?.trim() === 'For L1 Review') &&
        val?.isL1DRReverted) ||
        val?.isL2DRReverted ||
        val?.isL1DAReverted)
    ) {
      return true;
    } else if (
      user.role === 'L2_DATA_REVIEWER' &&
      (((accessQuestionairesData?.trim() === 'For L2 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L1 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L2 Review') &&
        val?.isL2DRReverted) ||
        val?.isL3DRReverted)
    ) {
      return true;
    } else if (
      user.role === 'L3_DATA_REVIEWER' &&
      (((accessQuestionairesData?.trim() === 'For L3 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L2 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L3 Review') &&
        val?.isL3DRReverted) ||
        val?.isL1DAReverted)
    ) {
      return true;
    } else if (
      user.role === 'L2_DATA_APPROVER' &&
      (accessQuestionairesData?.trim() === 'For L1 DA Re-approval' ||
        accessQuestionairesData?.trim() === 'For L2 Approval') &&
      val?.isL2DAReverted
    ) {
      return true;
    } else if (
      user.role === 'L1_DATA_APPROVER' &&
      (((accessQuestionairesData?.trim() === 'For L3 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L1 DA Re-approval' ||
        accessQuestionairesData?.trim() === 'For L1 DR Revision' ||
        accessQuestionairesData?.trim() === 'For L1 Approval') &&
        val?.isL1DAReverted) ||
        val?.isL2DAReverted)
    ) {
      return true;
    }
    return false;
  };

  const getOnlyCommented = (val: any, index: any) => {
    if (
      user.role === 'DATA_PROVIDER' &&
      val?.isL1DRReverted !== false &&
      val?.isL1Reviewed === false
    ) {
      return false;
    }
    if (
      user.role === 'L1_DATA_REVIEWER' &&
      val?.isL2DRReverted !== false &&
      val?.isL2Reviewed === false
    ) {
      return false;
    }
    if (
      user.role === 'L1_DATA_REVIEWER' &&
      val?.isL1DAReverted !== false &&
      val?.isL1Approved === false
    ) {
      return false;
    }
    if (
      user.role === 'L1_DATA_REVIEWER' &&
      val?.isL1DRReverted !== true &&
      val?.isL1Reviewed === true
    ) {
      return true;
    }
    if (
      user.role === 'L2_DATA_REVIEWER' &&
      val?.isL3DRReverted !== false &&
      val?.isL3Reviewed === false
    ) {
      return false;
    }
    if (
      user.role === 'L2_DATA_REVIEWER' &&
      val?.isL2DRReverted !== true &&
      val?.isL2Reviewed === true
    ) {
      return true;
    }
    if (
      user.role === 'L3_DATA_REVIEWER' &&
      val?.isL1DAReverted !== false &&
      val?.isL1Approved === false
    ) {
      return false;
    }
    if (
      user.role === 'L3_DATA_REVIEWER' &&
      val?.isL3DRReverted !== true &&
      val?.isL3Reviewed === true
    ) {
      return true;
    }
    if (
      user.role === 'L1_DATA_APPROVER' &&
      val?.isL2DAReverted !== false &&
      val?.isL2Approved === false
    ) {
      return false;
    }
    if (
      user.role === 'L1_DATA_APPROVER' &&
      val?.isL1DAReverted !== true &&
      val?.isL1Approved === true
    ) {
      return true;
    }
    return false;
  };

  const topBarBtn = ['Status', 'Comments', 'Guidance', 'Sample'];

  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [activeTab, setActiveTab] = useState(topBarBtn[0]);
  const [activeBtn, setActiveBtn] = useState(topBarBtn[0]);

  const tabTitles = useMemo(() => {
    return topBarBtn.map((val) => ({
      tab: val,
      key: val,
    }));
  }, []);

  return (
    <>
      <div>
        <Row
          gutter={24}
          style={{ marginLeft: '1%', zIndex: '3' }}
          className={`${Styles.container} ${Styles.pageCardStyle} ${Styles.pageCardCol} bg-white p-3 rounded-3 mb-3`}
        >
          <Col span={15}>
            {
              <Row
                className={`${Styles.mb10}d-flex justify-content-between mb20`}
              >
                <Col>
                  <div className={Styles.generalDisclosure}>
                    {selectedSubCategory?.['sub_category_id']}{' '}
                    {selectedSubCategory?.['sub_category']}
                  </div>
                </Col>
                <Col>
                  <div className={Styles.generalDisclosure}>
                    {questionsForInput?.length > 0
                      ? `${currentQuestionIndex + 1} / ${questionsForInput?.length}`
                      : `0 / 0`}
                  </div>
                </Col>
              </Row>
            }
            {
              <Row className={`${Styles.mt10Minus}`}>
                <Progress
                  percent={
                    questionsForInput?.length > 0
                      ? ((currentQuestionIndex + 1) /
                          questionsForInput?.length) *
                        100
                      : 0
                  }
                  showInfo={false}
                  strokeColor={'#0D304A'}
                  style={{ marginBottom: 0 }}
                />
              </Row>
            }
            <Row className="w-100">
              {' '}
              <Col className="w-100 d-flex justify-content-between">
                <Col span={24}>
                  <div className={`${Styles.questionContainer}`}>
                    {questionsForInput?.length > 0 ? (
                      <>
                        <div className={Styles.questionHeader}>
                          {`${extractQuestionId(questionsForInput[currentQuestionIndex]?.question_id)}. ${
                            questionsForInput[currentQuestionIndex]?.question
                          }`}
                        </div>
                        {questionsForInput[currentQuestionIndex]
                          ?.question_type === 'Text' && textQuestion()}

                        {questionsForInput[currentQuestionIndex]
                          ?.question_type === 'Numeric' && numericQuestion()}

                        {questionsForInput[currentQuestionIndex]
                          ?.question_type === 'Bool' && boolQuestion()}

                        {questionsForInput[
                          currentQuestionIndex
                        ]?.question_type.trim() === 'List' && listQuestion()}

                        {questionsForInput[
                          currentQuestionIndex
                        ]?.question_type.trim() === 'MultiChoice' &&
                          MultiChoiceCheckbox()}

                        {renderDependentQuestions()}

                        <Row gutter={[50, 24]} style={{ marginRight: '-20px' }}>
                          {renderSubQuestions()}
                        </Row>
                      </>
                    ) : (
                      <div className={Styles.noQuestions}>
                        No questions available for the selected category.
                      </div>
                    )}
                    <div>
                      <Row
                        gutter={6}
                        align="middle"
                        justify="end"
                        className={`${Styles.mt30}`}
                      >
                        {user.role === 'DATA_PROVIDER' &&
                          (accessQuestionairesData?.trim() ===
                            'For DP Submission' ||
                            accessQuestionairesData?.trim() ===
                              'For DP Revision') && (
                            <React.Fragment>
                              <Col>
                                {user.role === 'DATA_PROVIDER' && (
                                  <ButtonComponent
                                    hierarchy="tertiary"
                                    size="lg"
                                    // disabled={true}
                                    onClick={(e: any) =>
                                      dispatch(
                                        setReportModal({
                                          isOpen: true,
                                          nextRoute: '',
                                        })
                                      )
                                    }
                                  >
                                    Save as Draft
                                  </ButtonComponent>
                                )}
                              </Col>
                              <Col>
                                <ButtonComponent
                                  hierarchy="primary"
                                  size="lg"
                                  disabled={
                                    questionsForInput.every(
                                      (val: any, index: any) =>
                                        getOnlyCommented(val, index)
                                    )
                                      ? false
                                      : questionsForInput.length !==
                                            removeDuplicates(checkReviwed) &&
                                          currentQuestionIndex ===
                                            questionsForInput.length - 1
                                        ? isEmpty(maxDrLevel) &&
                                          checkAllQstnsAnswered(
                                            questionsForInput
                                          )
                                          ? false
                                          : true
                                        : questionsForInput[
                                              currentQuestionIndex
                                            ] ===
                                            questionsForInput[
                                              questionsForInput?.length - 1
                                            ]
                                          ? !checkAllQstnsAnswered(
                                              questionsForInput
                                            )
                                          : !checkQstnAnswered(
                                              questionsForInput[
                                                currentQuestionIndex
                                              ]
                                            )
                                  }
                                  onClick={() =>
                                    handleSaveAndNext(
                                      '',
                                      findlasIndex === 0 ? 0 : findlasIndex
                                    )
                                  }
                                >
                                  {currentQuestionIndex ===
                                  questionsForInput.length - 1
                                    ? maxDrLevel === 'L1_DATA_REVIEWER'
                                      ? 'Submit for Review'
                                      : 'Submit for L1 Review'
                                    : 'Save & Next'}
                                </ButtonComponent>
                              </Col>
                            </React.Fragment>
                          )}
                      </Row>
                      <Row
                        gutter={6}
                        style={{ paddingInline: '4px', paddingBlock: '10px' }}
                        justify="end"
                      >
                        {reviewerCondition() && (
                          <React.Fragment>
                            <Col>
                              <ButtonComponent
                                size="lg"
                                hierarchy="tertiary"
                                className={'form_submit_btn'}
                                onClick={() =>
                                  handleModify(currentQuestionIndex)
                                }
                              >
                                Modify
                              </ButtonComponent>
                            </Col>
                            {enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="tertiary"
                                  className="form_submit_btn"
                                  onClick={() =>
                                    handleSaveAndNext('reviewerRevert')
                                  }
                                >
                                  Revert
                                </ButtonComponent>
                              </Col>
                            )}
                            {enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="primary"
                                  onClick={() =>
                                    handleSaveAndNext('approveReviewer')
                                  }
                                  disabled={
                                    questionsForInput.every(
                                      (val: any, index: any) =>
                                        getOnlyCommented(val, index)
                                    )
                                      ? false
                                      : questionsForInput.length !==
                                            removeDuplicates(checkReviwed) &&
                                          currentQuestionIndex ===
                                            questionsForInput.length - 1
                                        ? true
                                        : !checkAllQstnsAnswered(
                                            questionsForInput
                                          )
                                  }
                                >
                                  {reviewerApproverBtn()}
                                </ButtonComponent>
                              </Col>
                            )}
                            {!enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="primary"
                                  onClick={() =>
                                    handleSaveAndNext(
                                      'reviewandNext',
                                      findlasIndex === 0 ? 0 : findlasIndex
                                    )
                                  }
                                  disabled={
                                    questionsForInput.length > 1 &&
                                    currentQuestionIndex ===
                                      questionsForInput.length - 1
                                  }
                                >
                                  {user.role === 'L1_DATA_REVIEWER' ||
                                  user.role === 'L2_DATA_REVIEWER' ||
                                  user.role === 'L3_DATA_REVIEWER'
                                    ? 'Review & Next'
                                    : 'Next'}
                                </ButtonComponent>
                              </Col>
                            )}
                          </React.Fragment>
                        )}
                        {approverCondition() && (
                          <Row gutter={6}>
                            {enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="tertiary"
                                  className="form_submit_btn"
                                  onClick={() =>
                                    handleSaveAndNext('approverRevert')
                                  }
                                >
                                  Revert
                                </ButtonComponent>
                              </Col>
                            )}
                            {enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="primary"
                                  onClick={() =>
                                    handleSaveAndNext('approveApprover')
                                  }
                                  disabled={
                                    questionsForInput.every(
                                      (val: any, index: any) =>
                                        getOnlyCommented(val, index)
                                    )
                                      ? false
                                      : !checkAllQstnsAnswered(
                                          questionsForInput
                                        )
                                  }
                                >
                                  {reviewerApproverBtn()}
                                </ButtonComponent>
                              </Col>
                            )}
                            {!enableBtn && (
                              <Col>
                                <ButtonComponent
                                  size="lg"
                                  hierarchy="primary"
                                  className="form_submit_btn"
                                  onClick={() =>
                                    handleSaveAndNext(
                                      'approveandNext',
                                      findlasIndex === 0 ? 0 : findlasIndex
                                    )
                                  }
                                  disabled={
                                    currentQuestionIndex ===
                                    questionsForInput.length - 1
                                  }
                                >
                                  Approve & Next
                                </ButtonComponent>
                              </Col>
                            )}
                          </Row>
                        )}
                      </Row>
                    </div>
                  </div>
                </Col>
              </Col>
            </Row>
          </Col>
          <Col span={1}>
            <div
              style={{ borderRight: '1px solid #d9d9d9', height: '100%' }}
            ></div>
          </Col>
          <Col
            className={`mb-3 d-flex flex-column justify-content-between`}
            span={8}
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
                        <div
                          style={{ height: '100%' }}
                          className={` d-flex flex-column justify-content-between`}
                        >
                          <div
                            className={Styles.commentBoxTitle}
                            style={{ marginBottom: '20px' }}
                          >
                            Assessment Status
                          </div>

                          {/* Question buttons */}
                          <div className={Styles.cardContent}>
                            <Row gutter={[5, 10]} className="mb-2">
                              {questionsForInput?.map(
                                (data: any, index: number) => (
                                  <Col
                                    xl={8}
                                    lg={12}
                                    md={24}
                                    sm={24}
                                    xs={24}
                                    key={index}
                                    className="d-flex justify-content-center"
                                  >
                                    <a
                                      onClick={() => {
                                        handlePageChange(
                                          index + 1,
                                          index,
                                          data
                                        );
                                        if (
                                          currentQuestion.type ===
                                            'Multilist' &&
                                          currentQuestion?.sub_questions.some(
                                            (subQ: any) =>
                                              !isNonEmpty(subQ.answer)
                                          )
                                        ) {
                                          handleRemoveMultipleQstns(
                                            currentQuestion
                                          );
                                        }
                                      }}
                                    >
                                      <p
                                        className={`${index === currentQuestionIndex ? Styles.outer_style : ''}`}
                                      >
                                        <p
                                          style={{
                                            background:
                                              getStatusColor(data) &&
                                              onApproveCommented(data)
                                                ? '#7A0202'
                                                : data.comment.comments !==
                                                      '' &&
                                                    onApproveCommented(data)
                                                  ? '#7A0202'
                                                  : !getStatusColor(data) &&
                                                      ((user.role ===
                                                        'L1_DATA_REVIEWER' &&
                                                        data.isL1Reviewed) ||
                                                        (user.role ===
                                                          'L2_DATA_REVIEWER' &&
                                                          data.isL2Reviewed) ||
                                                        (user.role ===
                                                          'L3_DATA_REVIEWER' &&
                                                          data.isL3Reviewed) ||
                                                        (user.role ===
                                                          'L1_DATA_APPROVER' &&
                                                          data.isL1Approved) ||
                                                        (user.role ===
                                                          'L2_DATA_APPROVER' &&
                                                          data.isL2Approved) ||
                                                        (user.role ===
                                                          'DATA_PROVIDER' &&
                                                          checkReviwed?.some(
                                                            (val) =>
                                                              val === index
                                                          )))
                                                    ? '#4B785A'
                                                    : reviewerRevision().includes(
                                                          accessQuestionairesData?.trim()
                                                        ) &&
                                                        questionsForInput.some(
                                                          (q) =>
                                                            q.isL1DRReverted ||
                                                            q.isL2DRReverted ||
                                                            q.isL3DRReverted ||
                                                            q.isL1DAReverted ||
                                                            q.isL2DAReverted
                                                        ) &&
                                                        onActionUser(data)
                                                      ? '#F48F56'
                                                      : reviewerRevision().includes(
                                                            accessQuestionairesData?.trim()
                                                          ) &&
                                                          ![
                                                            'For DP Revision',
                                                            'For L1 DR Revision',
                                                            'For L2 DR Revision',
                                                            'For L3 DR Revision',
                                                            'For L1 DA Re-approval',
                                                            'For L2 DA Re-approval',
                                                          ].includes(
                                                            accessQuestionairesData
                                                          )
                                                        ? '#4B785A'
                                                        : onActionUser(data)
                                                          ? '#F48F56'
                                                          : 'grey',
                                          }}
                                          className={`
                          ${
                            Styles[
                              index === currentQuestionIndex
                                ? 'question_no_style'
                                : data?.isModified && data.comments.length > 0
                                  ? 'question_pending'
                                  : checkReviwed?.some((val) => val === index)
                                    ? 'attemptedQstn'
                                    : 'unAttemptedQstn'
                            ]
                          }
                        `}
                                        >
                                          {extractQuestionId(data?.question_id)}
                                        </p>
                                      </p>
                                    </a>
                                  </Col>
                                )
                              )}
                            </Row>
                          </div>

                          {/* Legend */}
                          <Row align="middle" justify="space-between">
                            <Col>
                              <Row className={`${Styles.mt15}`}>
                                <div
                                  className={`${Styles.circleStyle} circle`}
                                  style={{
                                    border: '1px solid #4B785A',
                                    background: '#4B785A',
                                  }}
                                ></div>
                                <span className={Styles.circleSuffix}>
                                  {getRoleOnLegend('legendA')}
                                </span>
                              </Row>
                              <Row className={`${Styles.mt15}`}>
                                <div
                                  className={`${Styles.circleStyle} circle`}
                                  style={{
                                    border: '1px solid #A1A1A1',
                                    background: '#A1A1A1',
                                  }}
                                ></div>
                                <span className={Styles.circleSuffix}>
                                  No Action Required
                                </span>
                              </Row>
                            </Col>
                            <Col>
                              <Row className={`${Styles.mt15}`}>
                                <div
                                  className={`${Styles.circleStyle} circle`}
                                  style={{
                                    border: '1px solid #F48F56',
                                    background: '#F48F56',
                                  }}
                                ></div>
                                <span className={Styles.circleSuffix}>
                                  Action Required
                                </span>
                              </Row>
                              <Row className={`${Styles.mt15}`}>
                                <div
                                  className={`${Styles.circleStyle} circle`}
                                  style={{
                                    border: '1px solid #B16104',
                                    background: '#B16104',
                                  }}
                                ></div>
                                <span className={Styles.circleSuffix}>
                                  Commented
                                </span>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      ),
                    },
                    {
                      label: 'Comments',
                      key: 'Comments',
                      children: (
                        <div
                          style={{ height: '100%' }}
                          className={` d-flex flex-column justify-content-between`}
                        >
                          <div className={Styles.cardContent}>
                            <Row>
                              <Row className={Styles.commentRow}>
                                {' '}
                                <div className={Styles.commentBoxTitle}>
                                  {' '}
                                  Comment Box
                                </div>
                              </Row>
                            </Row>
                            <Row
                              className={Styles.commentHistoryContainer}
                              align="middle"
                            >
                              {questionsForInput[currentQuestionIndex]
                                ?.comments !== undefined ? (
                                (commentsArray.length > 0
                                  ? commentsArray[currentQuestionIndex]
                                      ?.comments
                                  : questionsForInput[currentQuestionIndex]
                                      ?.comments
                                )?.map((comment: any, index: number) => (
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
                                          comment?.commented_by
                                        )}
                                      </div>
                                    </Col>
                                    <Col span={12}>
                                      <Row className={Styles.commentedBy}>
                                        {comment?.commented_by}
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
                                ))
                              ) : (
                                <Row
                                  className="d-flex justify-content-center"
                                  style={{ width: '100%' }}
                                >
                                  <Col>No Comments found</Col>
                                </Row>
                              )}
                            </Row>
                          </div>
                          {((questionsForInput[currentQuestionIndex]
                            ?.isModified &&
                            accessQuestionairesData?.trim() ===
                              'For DP Revision') ||
                            reviewerCondition() ||
                            user.role === 'L1_DATA_APPROVER' ||
                            user.role === 'L2_DATA_APPROVER' ||
                            (user.role === 'DATA_PROVIDER' &&
                              accessQuestionairesData?.trim() ===
                                'For DP Submission') ||
                            (user.role === 'DATA_PROVIDER' &&
                              accessQuestionairesData?.trim() ===
                                'For DP Revision')) && (
                            <div className="w-100 position-relative d-inline-block">
                              <TextArea
                                placeholder="Post your comments"
                                rows={2}
                                className={`${Styles.textArea}`}
                                value={comment}
                                onChange={(e) =>
                                  handleComments(
                                    e.target.value,
                                    questionsForInput[currentQuestionIndex]
                                      ?.question_id
                                  )
                                }
                              />
                              <button
                                className={`${Styles.sendIcon}`}
                                onClick={(e: any) => {
                                  onHandleComment(
                                    comment,
                                    currentQuestionIndex
                                  );
                                }}
                              >
                                <SendOutlined />
                              </button>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      label: 'Guidance',
                      key: 'Guidance',
                      children: (
                        <div
                          style={{ height: '100%' }}
                          className={` d-flex flex-column justify-content-between`}
                        >
                          <div className={Styles.commentBoxTitle}>Guidance</div>
                          <div
                            style={{ marginTop: '20px' }}
                            className={Styles.disclosureContainer}
                          >
                            <Typography.Text className={Styles.text}>
                              {questionsForInput &&
                              questionsForInput?.length > 0 &&
                              !isEmpty(
                                questionsForInput[currentQuestionIndex]
                              ) &&
                              !isEmpty(
                                questionsForInput[currentQuestionIndex]
                                  ?.guidance
                              ) ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: convertTextToHtml(
                                      questionsForInput[currentQuestionIndex]
                                        ?.guidance
                                    ),
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </Typography.Text>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: 'Sample',
                      key: 'Sample',
                      children: (
                        <div
                          style={{ height: '100%' }}
                          className={` d-flex flex-column justify-content-between`}
                        >
                          <Row className="d-flex justify-content-between">
                            {' '}
                            <div className={Styles.commentBoxTitle}>
                              Reference Answer{' '}
                            </div>
                            <Image
                              className="cursor-pointer"
                              loading="lazy"
                              src={CopyIcon}
                              preview={false}
                              onClick={(e: any) =>
                                handleCopy(
                                  e,
                                  questionsForInput[currentQuestionIndex]
                                    ?.reference_answer
                                )
                              }
                            />
                          </Row>

                          <div className={Styles.disclosureContainer}>
                            <Text className={Styles.text}>
                              {questionsForInput &&
                              questionsForInput?.length > 0 &&
                              !isEmpty(
                                questionsForInput[currentQuestionIndex]
                              ) &&
                              !isEmpty(
                                questionsForInput[currentQuestionIndex]
                                  ?.reference_answer
                              ) ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: convertTextToHtml(
                                      questionsForInput[currentQuestionIndex]
                                        ?.reference_answer
                                    ),
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </Text>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </>
            </Col>
          </Col>
        </Row>
      </div>
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
};

export default ReportCompliance;
