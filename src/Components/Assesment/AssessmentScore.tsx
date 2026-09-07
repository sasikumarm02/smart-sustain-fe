import React, { useEffect, useState } from 'react';
import Styles from './Assessement.module.scss';
import { Card, Col, Row, Spin } from 'antd';
import nodata from '../../assets/Svg/Assessment/nodata.png';
import { useNavigate } from 'react-router-dom';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { PageCardComponent } from '../../DesignLibrary';
import MatScore1 from '../../assets/Svg/MaturityAssessment/MatScore1.svg';
import MatScore2 from '../../assets/Svg/MaturityAssessment/MatScore2.svg';
import MatScore3 from '../../assets/Svg/MaturityAssessment/MatScore3.svg';
import MatScore4 from '../../assets/Svg/MaturityAssessment/MatScore4.svg';
import MatScore5 from '../../assets/Svg/MaturityAssessment/MatScore5.svg';
import MatScore6 from '../../assets/Svg/MaturityAssessment/MatScore6.svg';

// Custom Progress component (unchanged)
const CustomProgress: React.FC<{ percent: number }> = ({ percent }) => {
  const steps = 5;
  const sizes = [
    [10, 2],
    [10, 4],
    [10, 6],
    [10, 8],
    [10, 10],
  ];
  const colors = ['#4B785A', '#4B785A', '#4B785A', '#4B785A', '#4B785A'];
  const completedSteps = Math.round((percent / 100) * steps);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'flex-end', marginRight: '8px' }}
      >
        {[...Array(steps)].map((_, index) => {
          const [width, height] = sizes[index];
          const isCompleted = index < completedSteps;
          return (
            <div
              key={index}
              style={{
                width: width,
                height: height,
                backgroundColor: isCompleted ? colors[index] : '#e0e0e0',
                marginRight: index < steps - 1 ? 4 : 0,
                transition: 'background-color 0.3s',
              }}
            />
          );
        })}
      </div>
      <div className={Styles.percentage}>{percent}%</div>
    </div>
  );
};

interface Scorecard {
  title: string;
  img: any;
  status: string;
  value: number;
}

function getValuesByKey(key: any, data: any) {
  if (data && data.hasOwnProperty(key)) {
    return data[key];
  } else {
    return [];
  }
}

export default function AssessmentScore() {
  const [loading, setLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { user } = useAuth();
  const [scores, setScores] = useState<Scorecard[]>([]);

  const maturityMap: any = {
    'L0-Absent': 'L0',
    'L1-Aware': 'L1',
    'L2-Advance': 'L2',
    'L3-Adept': 'L3',
    'L4-Adaptive': 'L4',
  };

  const titleMapping: any = {
    Sustainability_Strategy_and_Policies:
      'Sustainability Strategy and Policies',
    Implementation_Monitoring_and_Reporting:
      'Implementation, Monitoring and Reporting',
    Risk_and_Opportunity_Management: 'Risk and Opportunity Management',
    Governance_and_Ethical_Practices: 'Governance and Ethical Practices',
    Human_Capital: 'Human Capital',
    Community_Engagement_and_Customer_Relations:
      'Community Engagement and Customer Relations',
  };

  const handleTopicwiseScoreGetApi = () => {
    setLoading(true);
    const path = `maturityAssessment/get_topic_wise_score/`;
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        if (!isEmpty(res?.response?.topic_scores)) {
          const apiData = res?.response?.topic_scores;
          const mappedScores = [
            {
              title: 'Community_Engagement_and_Customer_Relations',
              img: (
                <img
                  src={MatScore1}
                  alt="Community Engagement and Customer Relations"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Community_Engagement_and_Customer_Relations']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Community_Engagement_and_Customer_Relations']
              ),
            },
            {
              title: 'Governance_and_Ethical_Practices',
              img: (
                <img
                  src={MatScore2}
                  alt="Governance and Ethical Practices"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Governance_and_Ethical_Practices']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Governance_and_Ethical_Practices']
              ),
            },
            {
              title: 'Human_Capital',
              img: (
                <img
                  src={MatScore3}
                  alt="Human Capital"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Human_Capital']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Human_Capital']
              ),
            },
            {
              title: 'Implementation_Monitoring_and_Reporting',
              img: (
                <img
                  src={MatScore4}
                  alt="Implementation, Monitoring and Reporting"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Implementation_Monitoring_and_Reporting']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Implementation_Monitoring_and_Reporting']
              ),
            },
            {
              title: 'Risk_and_Opportunity_Management',
              img: (
                <img
                  src={MatScore5}
                  alt="Risk and Opportunity Management"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Risk_and_Opportunity_Management']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Risk_and_Opportunity_Management']
              ),
            },
            {
              title: 'Sustainability_Strategy_and_Policies',
              img: (
                <img
                  src={MatScore6}
                  alt="Sustainability Strategy and Policies"
                  style={{ width: '100%' }}
                />
              ),
              status: getValuesByKey(
                'maturity_rating',
                apiData['Sustainability_Strategy_and_Policies']
              ),
              value: getValuesByKey(
                'topic_percentage',
                apiData['Sustainability_Strategy_and_Policies']
              ),
            },
          ];
          setScores(mappedScores);
        }
      })
      .catch(() => {
        // Handle error if needed
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleTopicwiseScoreGetApi();
  }, []);

  const navigate = useNavigate();

  // Increment imagesLoaded count on each image load
  const onImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  // Attach onLoad to each image dynamically
  const mappedScoresWithLoadHandler = scores.map((data) => ({
    ...data,
    img: React.cloneElement(data.img, {
      onLoad: onImageLoad,
    }),
  }));

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Spin spinning={loading || imagesLoaded < 6}>
          {/* your content here */}
          <Row>
            <p className={Styles.assessmentTitle}>Topics</p>
          </Row>
          <Row justify="space-evenly" gutter={[20, 20]}>
            {!isEmpty(scores) ? (
              mappedScoresWithLoadHandler.map(
                (data: Scorecard, index: number) => (
                  <Col lg={8} key={index} className={Styles.assessCol}>
                    <Card
                      className={Styles.cardBox}
                      onClick={() =>
                        navigate('/assessment-subtopics', {
                          state: {
                            title: titleMapping[data?.title],
                            level: data?.status,
                          },
                        })
                      }
                    >
                      <div className={Styles.cardImageWrapper}>
                        {data.img}
                        <div className={Styles.cardTitleOverlay}>
                          {titleMapping[data.title].replace(/_/g, ' & ')}
                        </div>
                      </div>
                      <div className={Styles.cardBottom}>
                        <div className={Styles.cardLevel}>{data.status}</div>
                        <div className={Styles.cardProgress}>
                          <CustomProgress percent={data.value} />
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              )
            ) : (
              <div className={Styles.centerContent}>
                <img src={nodata} alt="No data" />
                <p>
                  Please complete the assessment for all pillars to obtain
                  topic-wise scores.
                </p>
              </div>
            )}
          </Row>
        </Spin>
      </PageCardComponent>
    </>
  );
}
