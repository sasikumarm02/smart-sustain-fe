import { Button, Card, Col, message, Row } from 'antd';
import Styles from './Assessement.module.scss';
import StylesB from './AssessmentStart.module.scss';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/groupIcon';
import BankIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/bankIcon';
import PlantIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/plantIcon';
import esgEnvironment from '../../assets/Svg/esg-environment.png';
import { setAssessmentType } from '../../Redux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import GlobeImage from '../../assets/Svg/MaturityAssessment/completeAssessment/globe';
import { isEmpty } from '../../Utils/isEmpty';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { number } from 'yup';
import { formatNumberUS } from '../../Utils/Strings';
import Maturityimg1 from '../../assets/Svg/MaturityAssessment/matStart1.svg';
import Maturityimg2 from '../../assets/Svg/MaturityAssessment/matStart2.svg';
import Flower1 from '../../assets/Svg/MaturityAssessment/MatVector1.svg';
import Flower2 from '../../assets/Svg/MaturityAssessment/MatVector2.svg';
import Footer from '../Footer';

export default function AssessmentStart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const [clickedCards, setClickedCards] = useState<string[]>([]);
  const { user } = useAuth();

  const assesmentLevel = useSelector((state: any) => state.assessmentLevel);
  const [questionCount, setQuesCount] = useState<any>({});
  const [answerStatus, setAnswerStatus] = useState<any>({});
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const hanldeGetQuesCount = async () => {
    const url = `/maturityAssessment/get_question_count/?entity_Id=${user?.entity_Id}`;
    const result: any = await get(url);
    if (
      !isEmpty(result?.response?.question_count) &&
      !isEmpty(result?.response?.answered_status)
    ) {
      const answered_status = result?.response?.answered_status;
      setQuesCount(result?.response?.question_count);
      setAnswerStatus(answered_status);
      if (
        answered_status?.Environment === true &&
        answered_status?.Social === true &&
        answered_status?.Governance === true
      ) {
        setDisableButton(true);
      }
    }
  };

  useEffect(() => {
    hanldeGetQuesCount();
  }, []);

  const cardData = [
    {
      icon: (
        <PlantIcon
          className={`${clickedCards.includes('Environment') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Environment',
      heading: 'Environment Goals',
      number: questionCount?.Environment,
      attempted: answerStatus?.Environment,
    },
    {
      icon: (
        <GroupIcon
          className={`${clickedCards.includes('Social') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Social',
      heading: 'Social Goals',
      number: questionCount?.Social,
      attempted: answerStatus?.Social,
    },
    {
      icon: (
        <BankIcon
          className={`${clickedCards.includes('Governance') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Governance',
      heading: 'Governance Goals',
      number: questionCount?.Governance,
      attempted: answerStatus?.Governance,
    },
  ];

  // useEffect(() => {
  //   setClickedCards(assesmentLevel);
  // }, []);

  const handleQuestionClick = (goals: any) => {
    if (answerStatus?.[goals] !== true) {
      dispatch(setAssessmentType(goals));
      const index = clickedCards.indexOf(goals);
      if (index === -1) {
        // If not clicked, add it to the array
        if (!isEmpty(goals)) {
          setClickedCards([goals]);
        }
      } else if (!isEmpty(clickedCards)) {
        setClickedCards(
          clickedCards && clickedCards.length > 0
            ? clickedCards.filter((card) => card !== goals)
            : []
        );
      }
    } else {
      message.warning(
        `Assessment of ${goals} for this Reporting Period is already submitted .`
      );
    }
  };

  const checkVisibilty = (idx: any) => {
    if (idx == 0) {
      if (answerStatus?.Environment === true) {
        return 'visible';
      } else {
        return 'hidden';
      }
    } else if (idx == 1) {
      if (answerStatus?.Social === true) {
        return 'visible';
      } else {
        return 'hidden';
      }
    } else if (idx == 2) {
      if (answerStatus?.Governance === true) {
        return 'visible';
      } else {
        return 'hidden';
      }
    }
  };

  const [data, setData] = useState<any[]>([]);

  const getConfigData = async () => {
    try {
      const res = await get(
        `/framework/get_ESGframework/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response?.data)) {
        const responseData = res.response.data;
        setData(responseData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching ESG configuration data:', error);
    }
  };

  useEffect(() => {
    getConfigData();
  }, []);

  const handleStartAssessment = () => {
    if (!isEmpty(data)) {
      navigate('/assesment', { state: clickedCards });
    } else {
      message.warning(
        'Set ESG Configuration Before Starting Maturity Assessment'
      );
    }
  };

  const levels = [
    { level: 'L0', label: 'Absent' },
    { level: 'L1', label: 'Aware' },
    { level: 'L2', label: 'Advance' },
    { level: 'L3', label: 'Adept' },
    { level: 'L4', label: 'Adaptive' },
  ];

  const smeData = [
    { range: '>5Mn', value: '4,000' },
    { range: '1-5Mn', value: '5,000' },
    { range: '<1Mn', value: '8,000' },
  ];

  return (
    <>
      <div className="mt-2">
        <Row gutter={24} className={` mb-4 d-flex`}>
          <Col span={24} className={`bg-white  ${StylesB.customPageLayout}`}>
            <Row justify="center" className={StylesB.padding20}>
              <Col span={11}>
                <div>
                  <h6
                    style={{ marginBottom: '10px' }}
                    className={` ${StylesB.customfontsize21} ${StylesB.lineHeight28} fw-normal`}
                  >
                    Welcome to the
                  </h6>
                  <h4
                    className={`${StylesB.fontSize49} ${StylesB.lineHeight55} ${StylesB.primeColor}`}
                  >
                    ESG Maturity
                  </h4>
                  <h4
                    className={`${StylesB.fontSize49} ${StylesB.lineHeight55} ${StylesB.primeColor}`}
                  >
                    Assessment
                  </h4>
                </div>
                <div>
                  <p
                    className={`${StylesB.customfontsize17} ${StylesB.lineHeight28} ${StylesB.customTextColorGrey} fw-normal`}
                  >
                    The ESG Maturity Assessment will provide a clear picture of
                    your organization's current ESG performance. This module
                    will analyze your recent internal ESG activities and
                    identify areas for improvement. Benchmarking your
                    performance against industry peers and understanding
                    emerging trends will help you develop a strategic roadmap to
                    meet stakeholder expectations and achieve compliance with
                    ESG regulations. This assessment goes beyond basic metrics,
                    evaluating how well ESG considerations are integrated into
                    your company's strategy and goals.
                  </p>
                </div>
              </Col>

              <Col
                span={13}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Row gutter={30}>
                  {' '}
                  {/* Apply gutter here for spacing */}
                  <Col span={12}>
                    <div className={StylesB.flowerImg}>
                      <img src={Flower1} alt="Flower One" />
                    </div>
                    <div className="mb-3">
                      <img src={Maturityimg1} alt="Maturity Image" />
                    </div>
                  </Col>
                  <Col span={12} style={{ paddingTop: '70px' }}>
                    <div className={StylesB.cardOneMat}>
                      <h4 style={{ color: 'white', marginBottom: '20px' }}>
                        Levels
                      </h4>
                      {levels.map(({ level, label }) => (
                        <div className={StylesB.levelText} key={level}>
                          <span>{level}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className={`mx-0 px-0 ${StylesB.customMargin25}`}>
              <div className={`${StylesB.selectHeading} fw-bold`}>
                Please select a pillar for Assessment
              </div>
            </Row>

            <Row className="mx-0 px-0 d-flex w-100 justify-content-between">
              {!isEmpty(cardData) &&
                cardData.map((card, index) => (
                  <Col
                    className={`${StylesB.customBorderRadius15} ${StylesB.customBorderLine} ${StylesB.w30} ${StylesB.cursorPointer} ${StylesB.padding20} ${StylesB.positionRelative} ${clickedCards.includes(card.alt) ? StylesB.cardIconBgActive : StylesB.cardHover}`}
                    key={index}
                    style={{
                      height: '140px',
                    }}
                    onClick={() => handleQuestionClick(card.alt)}
                  >
                    <CheckCircleOutlined
                      style={{
                        fontSize: '24px',
                        color: 'green',
                        visibility: checkVisibilty(index),
                        position: 'absolute',
                        right: '5px',
                        top: '5px',
                      }}
                    />
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                      <div
                        className={`${StylesB.padding5} ${StylesB.borderRadius5} ${clickedCards.includes(card.alt) ? StylesB.cardIconBgInnerActive : StylesB.cardIconBgInner}`}
                      >
                        {card.icon}
                      </div>
                      <div className="mt-2">
                        <h5
                          className={`${StylesB.font26} ${clickedCards.includes(card.alt) ? StylesB.cardIconFontActive : StylesB.cardIconFont} fw-bold text-center`}
                        >
                          {card.number}
                        </h5>
                      </div>
                      <div
                        className={`${StylesB.customFontSize15} ${clickedCards.includes(card.alt) ? StylesB.cardIconFontActive : StylesB.cardIconFont} text-center`}
                      >
                        {card.heading}
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>

            <Row
              className={`${StylesB.customMargin60} d-flex justify-content-center w-100`}
            >
              <Button
                className={`${StylesB.startBtnAss} ${StylesB.height50}`}
                onClick={handleStartAssessment}
                disabled={clickedCards.length === 0 || disableButton === true}
              >
                Start Assessment
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
