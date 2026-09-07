import React, { useState, useEffect } from 'react';
import { Radio, Button, Row, Col, Space, message, Spin } from 'antd';
import { PageCardComponent } from '../../../DesignLibrary';
import { useNavigate, useLocation } from 'react-router-dom';
import StylesB from '../CompleteISSB/AssessmentStart.module.scss';
import { useDispatch } from 'react-redux';
import { setAssessmentType } from '../../../Redux/Actions';
import { isEmpty } from '../../../Utils/isEmpty';
import { get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { ExclamationOutlined } from '@ant-design/icons';
import { CheckOutlined } from '@ant-design/icons';
import {
  getDotStyle,
  getStatusStyle,
  handleStatus,
  shouldHideButton,
  statusColorMapping,
} from '../../../Components/Emissions/Scope3/Helpers';
import { use } from 'echarts';

const ISSBApplicationGuidance: React.FC = () => {
  const [coreContent, setCoreContent] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [questionCount, setQuesCount] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    hanldeGetQuesCount();
    if (location.state) {
      const { coreContent: savedCoreContent } = location.state;
      setCoreContent(savedCoreContent);
    }
  }, [location.state]);
  const hanldeGetQuesCount = async () => {
    const url = `/issb/get_topics_count/?entity_Id=${user?.entity_Id}`;
    const result: any = await get(url);
    if (!isEmpty(result?.response?.application_count)) {
      setQuesCount(result?.response?.application_count);
    }
  };
  const handleCoreChange = (e: any) => {
    dispatch(setAssessmentType(e.target.value));
    setCoreContent(e.target.value);
  };

  const handleStartAssessment = () => {
    const selectedValues = {
      coreContent: 'Application Guidance',
      fixedValue: coreContent || '',
    };

    if (coreContent) {
      navigate('/ISSBQuestionsPage', { state: selectedValues });
    } else {
      message.warning('Please select topic');
    }
  };

  const GuidancsList = [
    {
      value: 'Climate Resilience',
      label: 'Climate Resilience',
      total: questionCount.Climate_resilience?.total,
      status: questionCount.Climate_resilience?.status,
    },
    {
      value: 'Climate-related Targets',
      label: 'Climate-Related Targets',
      total: questionCount.Climate_related_targets?.total,
      status: questionCount.Climate_related_targets?.status,
    },
    {
      value: 'Comparative Information',
      label: 'Comparative Information',
      total: questionCount.Comparative_Information?.total,
      status: questionCount.Comparative_Information?.status,
    },
    {
      value: 'Connected Information',
      label: 'Connected Information',
      total: questionCount.Connected_information?.total,
      status: questionCount.Connected_information?.status,
    },
    {
      value: 'Cross-industry Metric Categories',
      label: 'Cross-Industry Metric Categories',
      total: questionCount.Cross_industry_metric_categories?.total,
      status: questionCount.Cross_industry_metric_categories?.status,
    },
    {
      value:
        'Enhancing Qualitative Characteristics of Useful-sustainability-related Financial Information',
      label:
        'Enhancing Qualitative Characteristics of Useful-Sustainability-Related Financial Information',
      total:
        questionCount
          .Enhancing_qualitative_characteristics_of_useful_sustainability_related_financial_information
          ?.total,
      status:
        questionCount
          .Enhancing_qualitative_characteristics_of_useful_sustainability_related_financial_information
          ?.status,
    },
    {
      value:
        'Fundamental Qualitative Characteristics of Useful Sustainability-related Financial Information',
      label:
        'Fundamental Qualitative Characteristics of Useful Sustainability-Related Financial Information',
      total:
        questionCount
          .Fundamental_qualitative_characteristics_of_useful_sustainability_related_financial_information
          ?.total,
      status:
        questionCount
          .Fundamental_qualitative_characteristics_of_useful_sustainability_related_financial_information
          ?.status,
    },

    {
      value: 'Greenhouse Gases',
      label: 'Greenhouse Gases',
      total: questionCount?.Greenhouse_gases?.total,
      status: questionCount?.Greenhouse_gases?.status,
    },
    {
      value: 'Information Included by Cross-reference',
      label: 'Information Included By Cross-Reference',
      total: questionCount?.Information_included_by_cross_reference?.total,
      status: questionCount?.Information_included_by_cross_reference?.status,
    },
    {
      value: 'Interim Reporting',
      label: 'Interim Reporting',
      total: questionCount?.Interim_reporting?.total,
      status: questionCount?.Interim_reporting?.status,
    },
    {
      value: 'Introduction',
      label: 'Introduction',
      total: questionCount?.Introduction?.total,
      status: questionCount?.Introduction?.status,
    },
    {
      value: 'Materiality',
      label: 'Materiality',
      total: questionCount?.Materiality?.total,
      status: questionCount?.Materiality?.status,
    },
    {
      value: 'Reporting Entity',
      label: 'Reporting Entity',
      total: questionCount?.Reporting_entity?.total,
      status: questionCount?.Reporting_entity?.status,
    },
    {
      value: 'Sources of Guidance',
      label: 'Sources Of Guidance',
      total: questionCount?.Sources_of_Guidance?.total,
      status: questionCount?.Sources_of_Guidance?.status,
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

  // Split the array into two halves (or more, based on your needs)
  const half = Math.ceil(GuidancsList.length / 2); // Divide the array roughly in half
  const firstHalf = GuidancsList.slice(0, half);
  const secondHalf = GuidancsList.slice(half);

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
          <div className={StylesB.subPageHeading}>
            Application Guidance (170)
          </div>
        </Row>
        <Row gutter={10}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Radio.Group onChange={handleCoreChange} value={coreContent}>
              {firstHalf.map((item) => (
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <div>
                          <span style={{ color: 'red',  }}>
                            {shouldHideButton(user.role, item?.status)
                              ? ''
                              : '!'}
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

          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Radio.Group
              onChange={handleCoreChange}
              value={coreContent}
              style={{ width: '100%' }}
            >
              {secondHalf.map((item) => (
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
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

        {/* Start Assessment Button */}
        <div
          className={`${StylesB.customMargin60} d-flex justify-content-center w-100 `}
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

export default ISSBApplicationGuidance;
