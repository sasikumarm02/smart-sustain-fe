import React, { useEffect, useState } from 'react';
import { Radio, Button, Row, Col, Space, message, Spin } from 'antd';
import { PageCardComponent } from '../../../DesignLibrary';
import { useNavigate, useLocation } from 'react-router-dom';
import StylesB from '../CompleteISSB/AssessmentStart.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setAssessmentType } from '../../../Redux/Actions';
import { get } from '../../../Services';
import { isEmpty } from '../../../Utils/isEmpty';
import { useAuth } from '../../../Hooks/useAuth';
import { CheckOutlined, ExclamationOutlined } from '@ant-design/icons';
import {
  getDotStyle,
  getStatusStyle,
  handleStatus,
  shouldHideButton,
  statusColorMapping,
} from '../../../Components/Emissions/Scope3/Helpers';
const ISSBCoreContent: React.FC = () => {
  const [coreContent, setCoreContent] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [questionCount, setQuesCount] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const hanldeGetQuesCount = async () => {
    const url = `/issb/get_topics_count/?entity_Id=${user?.entity_Id}`;
    const result: any = await get(url);
    if (!isEmpty(result?.response?.core_count)) {
      setQuesCount(result?.response?.core_count);
    }
  };

  useEffect(() => {
    hanldeGetQuesCount();
    if (location.state) {
      const { coreContent: savedCoreContent } = location.state;
      setCoreContent(savedCoreContent);
    }
  }, [location.state]);

  const handleCoreChange = (e: any) => {
    dispatch(setAssessmentType(e.target.value));
    setCoreContent(e.target.value);
  };

  const handleStartAssessment = () => {
    const selectedValues = {
      coreContent: 'Core Content',
      fixedValue: coreContent || '',
    };
    if (coreContent) {
      navigate('/ISSBQuestionsPage', { state: selectedValues });
    } else {
      message.warning('Please select topic');
    }
  };

  const coreContentItems = [
    {
      value: 'Core Content',
      label: 'Core Content',
      total: questionCount?.Core_Content?.total,
      status: questionCount?.Core_Content?.status,
    },
    {
      value: 'Governance',
      label: 'Governance',
      total: questionCount?.Governance?.total,
      status: questionCount?.Governance?.status,
    },
    {
      value: 'Risk Management',
      label: 'Risk Management',
      total: questionCount?.Risk_Management?.total,
      status: questionCount?.Risk_Management?.status,
    },
  ];

  const metricsAndTargetsItems = [
    {
      value: 'Climate-related Metrics',
      label: 'Climate-Related Metrics',
      total: questionCount?.Climate_related_metrics?.total,
      status: questionCount?.Climate_related_metrics?.status,
    },
    {
      value: 'Climate-related Targets',
      label: 'Climate-Related Targets',
      total: questionCount?.Climate_related_targets?.total,
      status: questionCount?.Climate_related_targets?.status,
    },
    {
      value: 'Metrics and Targets',
      label: 'Metrics & Targets',
      total: questionCount?.Metrics_and_Targets?.total,
      status: questionCount?.Metrics_and_Targets?.status,
    },
  ];

  const strategyItems = [
    {
      value: 'Business Model and Value Chain',
      label: 'Business Model and Value Chain',
      total: questionCount?.Business_model_and_value_chain?.total,
      status: questionCount?.Business_model_and_value_chain?.status,
    },
    {
      value: 'Climate Resilience',
      label: 'Climate Resilience',
      total: questionCount?.Climate_resilience?.total,
      status: questionCount?.Climate_resilience?.status,
    },
    {
      value: 'Climate-related Risks and Opportunities',
      label: 'Climate-related Risks and Opportunities',
      total: questionCount?.Climate_related_risks_and_opportunities?.total,
      status: questionCount?.Climate_related_risks_and_opportunities?.status,
    },
    {
      value: 'Financial Position, Financial Performance and Cash Flows',
      label: 'Financial Position, Financial Performance and Cash Flows',
      total:
        questionCount?.Financial_position_financial_performance_and_cash_flows
          ?.total,
      status:
        questionCount?.Financial_position_financial_performance_and_cash_flows
          ?.status,
    },
    {
      value: 'Resilience',
      label: 'Resilience',
      total: questionCount?.Resilience?.total,
      status: questionCount?.Resilience?.status,
    },
    {
      value: 'Strategy',
      label: 'Strategy',
      total: questionCount?.Strategy?.total,
      status: questionCount?.Strategy?.status,
    },
    {
      value: 'Strategy and Decision Making',
      label: 'Strategy and Decision Making',
      total: questionCount?.Strategy_and_decision_making?.total,
      status: questionCount?.Strategy_and_decision_making?.status,
    },
    {
      value: 'Sustainability-related Risks and Opportunities',
      label: 'Sustainability-Related Risks and Opportunities',
      total:
        questionCount?.Sustainability_related_risks_and_opportunities?.total,
      status:
        questionCount?.Sustainability_related_risks_and_opportunities?.status,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <PageCardComponent
      className={`bg-white p-0 ${StylesB.customBorderRadius15} ${StylesB.customBoxShadow}`}
    >
      <Spin spinning={loading} style={{ background: 'white' }}>
        <Row>
          <div className={StylesB.subPageHeading}>Core Content (164)</div>
        </Row>
        <Row gutter={10}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Radio.Group onChange={handleCoreChange} value={coreContent}>
              {coreContentItems.map((item) => (
                <>
                  <Row gutter={[24, 10]} align="middle">
                    <Col span={14} className="py-2">
                      {shouldHideButton(user.role, item?.status) ? (
                        // Render icon with label when disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              backgroundColor: '#97AD9D', // Green circle
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 8,
                            }}
                          >
                            <CheckOutlined
                              style={{ color: '#FFFFFF', fontSize: 14 }}
                            />{' '}
                            {/* White tick */}
                          </div>

                          <span style={{ color: '#928E8D', fontSize: 16 }}>
                            {item.label} (
                            {item.total.toString().padStart(2, '0')})
                          </span>
                        </div>
                      ) : (
                        // Normal radio button when not disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Radio
                            value={item.value}
                            key={item.value}
                            className="custom-radio"
                          >
                            <span className={StylesB.RadioTextSty}>
                              {item.label}{' '}
                              <span className={StylesB.RadioTextNumerSty}>
                                ({item.total})
                              </span>
                            </span>
                          </Radio>
                        </div>
                      )}
                    </Col>
                    <Col span={10}>
                      <div
                        className={StylesB.statusBadge}
                        style={getStatusStyle(item.status?.trim(), user.role)}
                      >
                        <span
                          style={getDotStyle(item.status?.trim(), user.role)}
                          className={`${StylesB.dot}`}
                        >
                          {}
                        </span>
                        {handleStatus(item.status?.trim())}
                      </div>
                    </Col>
                  </Row>
                </>
              ))}
              {/* <h3 className={`${StylesB.RadioBtnHeader} pt-4 pb-3`}>
                Metrics & Targets (
                {questionCount.Metrics_and_Targets?.total +
                  questionCount.Climate_related_targets?.total +
                  questionCount.Climate_related_metrics?.total}
                )
              </h3> */}
              {metricsAndTargetsItems.map((item) => (
                <>
                  <Row gutter={[24, 10]} align="middle">
                    <Col span={14} className="py-2">
                      {shouldHideButton(user.role, item?.status) ? (
                        // Render icon with label when disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              backgroundColor: '#97AD9D', // Green circle
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 8,
                            }}
                          >
                            <CheckOutlined
                              style={{ color: '#FFFFFF', fontSize: 14 }}
                            />{' '}
                            {/* White tick */}
                          </div>

                          <span style={{ color: '#928E8D', fontSize: 16 }}>
                            {item.label} (
                            {item.total.toString().padStart(2, '0')})
                          </span>
                        </div>
                      ) : (
                        // Normal radio button when not disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Radio
                            value={item.value}
                            key={item.value}
                            className="custom-radio"
                          >
                            <span className={StylesB.RadioTextSty}>
                              {item.label}{' '}
                              <span className={StylesB.RadioTextNumerSty}>
                                ({item.total})
                              </span>
                            </span>
                          </Radio>
                        </div>
                      )}
                    </Col>
                    <Col span={10}>
                      <div
                        className={StylesB.statusBadge}
                        style={getStatusStyle(item.status?.trim(), user.role)}
                      >
                        <span
                          style={getDotStyle(item.status?.trim(), user.role)}
                          className={`${StylesB.dot}`}
                        >
                          {}
                        </span>
                        {item.status}
                      </div>
                    </Col>
                  </Row>
                </>
              ))}
            </Radio.Group>
          </Col>

          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Radio.Group
              onChange={handleCoreChange}
              value={coreContent}
              style={{ width: '100%' }}
            >
              {strategyItems.map((item) => (
                <>
                  <Row gutter={[24, 10]} align="middle">
                    <Col span={12} className="py-2">
                      {shouldHideButton(user.role, item?.status) ? (
                        // Render icon with label when disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              backgroundColor: '#97AD9D', // Green circle
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 8,
                            }}
                          >
                            <CheckOutlined
                              style={{ color: '#FFFFFF', fontSize: 14 }}
                            />{' '}
                            {/* White tick */}
                          </div>

                          <span style={{ color: '#928E8D', fontSize: 16 }}>
                            {item.label} (
                            {item.total.toString().padStart(2, '0')})
                          </span>
                        </div>
                      ) : (
                        // Normal radio button when not disabled
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Radio
                            value={item.value}
                            key={item.value}
                            className="custom-radio"
                          >
                            <span className={StylesB.RadioTextSty}>
                              {item.label}{' '}
                              <span className={StylesB.RadioTextNumerSty}>
                                ({item.total})
                              </span>
                            </span>
                          </Radio>
                        </div>
                      )}
                    </Col>
                    <Col span={12}>
                      <div style={{ display: 'flex' }}>
                        {/* <div>
                          <span style={{ color: 'red',  }}>
                            {shouldHideButton(user.role, item?.status) ? (
                              <ExclamationOutlined
                                style={{ visibility: 'hidden' }}
                                className={`${StylesB.excalmationB}`}
                              />
                            ) : (
                              <ExclamationOutlined
                                className={`${StylesB.excalmationB}`}
                              />
                            )}
                          </span>
                        </div> */}

                        <div
                          className={StylesB.statusBadge}
                          style={getStatusStyle(item.status?.trim(), user.role)}
                        >
                          <span
                            style={getDotStyle(item.status?.trim(), user.role)}
                            className={`${StylesB.dot}`}
                          >
                            {}
                          </span>

                          {handleStatus(item?.status?.trim())}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              ))}
            </Radio.Group>
          </Col>
        </Row>
        <div
          className={`${StylesB.customMargin60} d-flex justify-content-center w-100`}
        >
          <Button
            className={`${StylesB.startBtnAss} ${StylesB.height50}`}
            onClick={handleStartAssessment}
          >
            Start Assessment
          </Button>
        </div>
      </Spin>
    </PageCardComponent>
  );
};

export default ISSBCoreContent;
