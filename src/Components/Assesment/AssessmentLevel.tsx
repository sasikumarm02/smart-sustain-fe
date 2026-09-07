import { Button, Card, Col, Image, Row, Space, Typography } from 'antd';
import Styles from './Assessement.module.scss';
import StylesB from './AssessmentStart.module.scss';
import { useNavigate } from 'react-router-dom';
import SocialIcon from '../../assets/Svg/social.png';
import GovernanceIcon from '../../assets/Svg/goverance.png';
import { useSelector } from 'react-redux';
import { setAssessmentType } from '../../Redux/Actions';
import { useDispatch } from 'react-redux';
import EnvironmentImg from '../../assets/Svg/Assessment/EnvironmentLevel.png';
import SocialImg from '../../assets/Svg/Assessment/SocialLevel.png';
import GovernanceImg from '../../assets/Svg/Assessment/GovernanceLevel.png';
import AssessmentLevelImg from '../../assets/Svg/Assessment/AssessmentLevel.png';
import { isEmpty } from '../../Utils/isEmpty';
import { PageCardComponent } from '../../DesignLibrary';
import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import GroupIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/groupIcon';
import BankIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/bankIcon';
import PlantIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/plantIcon';
import Footer from '../Footer';
interface LevelWithImage {
  level: string;
  imageSrc: string;
  num: string;
}

export default function AssessmentLevel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const assesmentLevel = useSelector((state: any) => state.assessmentLevel);
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const [answerStatus, setAnswerStatus] = useState<any>({});
  const levelsToDisplay = (assesmentLevel: any): LevelWithImage[] => {
    if (!Array.isArray(assesmentLevel)) {
      return [];
    }

    const listedLevels: LevelWithImage[] = [
      { level: 'Environment', imageSrc: SocialIcon, num: '13' },
      { level: 'Social', imageSrc: SocialIcon, num: '10' },
      { level: 'Governance', imageSrc: GovernanceIcon, num: '13' },
    ];
    return listedLevels?.filter(({ level }) => !assesmentLevel.includes(level));
  };

  const hanldeGetQuesCount = async () => {
    const url = `/maturityAssessment/get_question_count/?entity_Id=${user?.entity_Id}`;
    const result: any = await get(url);
    if (!isEmpty(result?.response?.answered_status)) {
      const answered_status = result?.response?.answered_status;
      setAnswerStatus(answered_status);
    }
  };

  useEffect(() => {
    hanldeGetQuesCount();
  }, []);

  const bannerContent = {
    Governance: `Congratulations! You've completed the Social section of the ESG Maturity Assessment. Ensure you have completed all sections of the ESG Maturity Assessment to gain a comprehensive understanding of your environmental, social, and governance performance.
    `,
    Social: `Congratulations! You've completed the Social section of the ESG Maturity Assessment. Ensure you have completed all sections of the ESG Maturity Assessment to gain a comprehensive understanding of your environmental, social, and governance performance.
    `,
    Environment: `Congratulations! You've completed the Environment section of the ESG Maturity Assessment. Ensure you have completed all sections of the ESG Maturity Assessment to gain a comprehensive understanding of your environmental, social, and governance performance.`,
  };

  const levelToDisplay = levelsToDisplay(assesmentLevel);

  const leveImage =
    assessmentType === 'Environment'
      ? EnvironmentImg
      : assessmentType === 'Social'
        ? SocialImg
        : GovernanceImg;
  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row
          justify={'center'}
          style={{ background: '#fff', borderRadius: '12px' }}
        >
          <Col span={24}>
            <Row>
              {!isEmpty(levelToDisplay) &&
              Array.isArray(levelToDisplay) &&
              levelToDisplay.length > 0 ? (
                <>
                  <Col span={12} className={Styles.leftContainer}>
                    <div style={{ width: '90%' }}>
                      <h4 className={Styles.MaturityTextLarge}>
                        "{assessmentType}"
                      </h4>
                      <p className={Styles.AssessmentLevelBgText}>
                        {
                          bannerContent[
                            assessmentType as keyof typeof bannerContent
                          ]
                        }
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <img
                      src={AssessmentLevelImg}
                      alt="esgs"
                      style={{ width: '100%' }}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col span={12}>
                    <div style={{ width: '90%' }}>
                      <p className={Styles.AssessmentLevelBgText}>
                        Well done!!! Your organisation is in the initial phases
                        of adopting sustainability practices. Your company may
                        have started exploring the concept of ESG
                        (Environmental, Social, and Governance), however, there
                        is a need to have yet to fully integrate sustainability
                        into your operations.
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <img src={leveImage} alt="esg" style={{ width: '100%' }} />
                  </Col>
                </>
              )}
            </Row>
          </Col>
          <Col span={24} className="pt-5">
            <h4
              className={Styles.MaturityTitle}
              style={{ textAlign: 'center' }}
            >
              {!isEmpty(levelToDisplay) &&
              Array.isArray(levelToDisplay) &&
              levelToDisplay.length > 0 ? (
                <p className={Styles.restCategoryBlack}>
                  Do you wish to take assessment for the rest of the categories?
                </p>
              ) : (
                <>
                  <p className={Styles.restCategoryHead}>
                    Click here to get the overall Assessment report of your
                    Environmental Score in ESG{' '}
                  </p>
                  <Button
                    className={`${Styles.startBtn} mt-4`}
                    onClick={() => navigate('/assessment-report')}
                    style={{
                      width: '30%',
                      minWidth: '100px',
                      fontFamily: 'Poppins, sans-serif !important',
                      marginLeft: '20vw',
                    }}
                  >
                    View Report
                  </Button>
                </>
              )}
            </h4>
            <Row
              justify="center"
              gutter={[32, 4]}
              className="pt-4 pb-5"
              style={{ width: '90%', margin: '0 auto', gap: '50px' }}
            >
              {!isEmpty(levelToDisplay) &&
                Array.isArray(levelToDisplay) &&
                levelToDisplay.map(
                  (level: LevelWithImage) =>
                    answerStatus[level.level] === false && (
                      <Col
                        className={`${StylesB.MaturityButton} ${StylesB.customBorderRadius15} ${StylesB.customBorderLine} ${StylesB.w30} ${StylesB.cursorPointer} ${StylesB.padding20} ${StylesB.positionRelative} ${StylesB.cardHover}`}
                        key={level.level}
                        style={{
                          height: '140px',
                        }}
                        onClick={() => {
                          navigate('/assesment', { state: level.level });
                          dispatch(setAssessmentType(level.level));
                        }}
                      >
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                          <div
                            className={`${StylesB.padding5} ${StylesB.borderRadius5} ${StylesB.cardIconBgInner}`}
                          >
                            {/* Conditional Icons */}
                            {level.level === 'Environment' && (
                              <PlantIcon
                                className={`${StylesB.cardIconFont}`}
                              />
                            )}
                            {level.level === 'Social' && (
                              <GroupIcon
                                className={`${StylesB.cardIconFont}`}
                              />
                            )}
                            {level.level === 'Governance' && (
                              <BankIcon className={`${StylesB.cardIconFont}`} />
                            )}
                          </div>
                          <div className="mt-2">
                            <h5
                              className={`${StylesB.font26} ${StylesB.cardIconFont} fw-bold text-center`}
                            >
                              {level.num}
                            </h5>
                          </div>
                          <div
                            className={`${StylesB.cardFontSize} ${StylesB.cardIconFont} fw-normal text-center`}
                          >
                            {level.level}
                          </div>
                        </div>
                      </Col>
                    )
                )}
            </Row>
          </Col>
        </Row>
      </PageCardComponent>
      <Footer />
    </>
  );
}
