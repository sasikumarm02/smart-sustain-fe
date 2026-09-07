import Styles from './Assessement.module.scss';
import { Card, Row, Col, Select } from 'antd';
import icon1 from '../../assets/Svg/environment.png';
import icon2 from '../../assets/Svg/social.png';
import icon3 from '../../assets/Svg/goverance.png';
import image from '../../assets/Svg/Assessment/esg.png';
import { isEmpty } from '../../Utils/isEmpty';
export default function MaturityStart() {
  const cardData = [
    {
      src: icon1,
      alt: 'environment',
      heading: 'Environment Questions',
      number: 12,
    },
    {
      src: icon2,
      alt: 'society',
      heading: 'Society Questions',
      number: 20,
    },
    {
      src: icon3,
      alt: 'governance',
      heading: 'Governance Questions',
      number: 15,
    },
  ];
  const rowData = [
    {
      heading: 'Worst Performing Category',
      assessment: 'Data Protection and Privacy',
      scoreColor: '#F56464',
      score: '1.4',
      target: '3.50',
    },
    {
      heading: 'Best Performing Category',
      assessment: 'Human Rights',
      scoreColor: '#098E7E',
      score: '4.79',
      target: '4.50',
    },
  ];
  return (
    <div>
      <h4 className={Styles.title}>ESG Maturity Assessment</h4>
      <Card className="maturity-main-card">
        <Row className={Styles.background} align="middle">
          <Col span={12}>
            <div>
              <p className={Styles.backgroundHeading}>
                Welcome to the
                <br />
                <span className={Styles.headingBreak}>
                  ESG maturity assesment{' '}
                </span>{' '}
              </p>
              <p className={Styles.backgroundText}>
                {' '}
                This assessment will help you determine your organisation's
                current stage of ESG maturity. Answering a series of questions
                here will help you identify your organisation's current stage of
                ESG maturity
              </p>
            </div>
          </Col>
          <Col span={12}>
            <img
              src={image}
              alt="esg"
              style={{ width: '550px', height: '400px', marginTop: '30px' }}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className={Styles.numberOfCompanies}>0</div>
            </div>
          ))}
        </div>
        <p className={`${Styles.heading1} mb-4`}>
          Companies are Taking Assessment now.
        </p>
        <p className={Styles.heading2}>
          "500 companies are currently in level 2. To discover your level,
          please take the assessment."
        </p>
        <Row align="middle" justify="space-between">
          <Col span={2}></Col>
          {cardData.map((card, index) => (
            <Col span={6} key={index}>
              <Card className={`${Styles.assesmentCard}`}>
                <div className="text-center">
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="img-fluid"
                    style={{ height: '50px' }}
                  />
                </div>
                <p className={Styles.cardHeadings}>{card.heading}</p>
                <p className={`${Styles['card-numbers']} mt-5`}>
                  {card.number}
                </p>
              </Card>
            </Col>
          ))}
          <Col span={2}></Col>
        </Row>
        <div style={{ padding: '30px' }}>
          <p
            className={`${Styles.heading1} mb-4 mt-5 ml-4`}
            style={{ textAlign: 'left', margin: '20px' }}
          >
            Assessment Overview
          </p>
          <Row>
            <Col>
              <Card className={Styles.assesmentOverview}>
                <p className={Styles.heading1} style={{ textAlign: 'left' }}>
                  Scope Level Performance
                </p>
                <p className={Styles.assesmentText}>
                  View how various scopes are scoring across all ESG Metrics.
                </p>
                <Select
                  className="select-bar"
                  placeholder="Supplier Scope 1"
                ></Select>
                <Row style={{ borderBottom: '1px solid #C0C0C0' }}>
                  <Col span={16} className="p-2">
                    <p className={Styles.supplier}>Supplier Scope 1</p>
                    <p className={Styles.supplierPercent}>39.4%</p>
                    <p
                      className={Styles.scoreTargettext}
                      style={{ textAlign: 'left' }}
                    >
                      Total Spent in 2023
                    </p>
                  </Col>
                  <Col span={8}>
                    <div className={Styles.average}>
                      <p className={Styles.averageText}>Average Score</p>
                      <p className={Styles.score}>1.4</p>
                    </div>
                  </Col>
                </Row>
                {!isEmpty(rowData) &&
                  rowData.map((item, index) => (
                    <Row
                      key={index}
                      style={{
                        borderBottom:
                          index === 0 ? '1px solid #C0C0C0' : 'none',
                        alignItems: 'center',
                      }}
                      gutter={10}
                    >
                      <Col span={16} className="p-2">
                        <div>
                          <p
                            className={Styles.heading1}
                            style={{ textAlign: 'left' }}
                          >
                            {item?.heading}
                          </p>
                          <p className={Styles.assessmentText}>
                            {item?.assessment}
                          </p>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '20px',
                          }}
                        >
                          <div>
                            <p className={Styles.scoreTargettext}>Score</p>
                            <p
                              className={Styles.score}
                              style={{ color: item?.scoreColor }}
                            >
                              {item?.score}
                            </p>
                          </div>
                          <div>
                            <div
                              className="border-bottom mb-2"
                              style={{ borderBottomColor: '#C0C0C0' }}
                            ></div>
                            <p className={Styles.scoreTargettext}>Target</p>
                            <p className={Styles.score}>{item?.target}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ))}
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}
